# 📊 Database Schema Visual Guide

## 🗂️ Table Relationships

```
┌─────────────────────────────────────────────────────────────────┐
│                        auth.users                                │
│                     (Supabase Auth)                              │
│  - id (UUID)                                                     │
│  - email                                                         │
│  - created_at                                                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       │ (1:1)
                       ▼
┌──────────────────────────────────────────────────────────────────┐
│                          profiles                                 │
│  PK: id (references auth.users.id)                               │
│  - monthly_income_range                                          │
│  - income_type                                                   │
│  - spending_style                                                │
│  - is_onboarded                                                  │
│  - ... (15+ fields)                                              │
└────┬──────────────┬────────────┬────────────┬────────────┬──────┘
     │              │            │            │            │
     │ (1:many)     │ (1:many)   │ (1:many)   │ (1:many)   │ (1:many)
     │              │            │            │            │
     ▼              ▼            ▼            ▼            ▼
┌─────────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ ┌────────┐
│  financial  │ │   chat   │ │  check   │ │  goals  │ │ active │
│  _analysis  │ │  _conver │ │  _ins    │ │         │ │ signals│
│             │ │  sations │ │          │ │         │ │ (via   │
│ - stress_   │ │          │ │ - date   │ │ - title │ │ analy- │
│   score     │ │ - title  │ │ - mood   │ │ - target│ │ sis)   │
│ - risk_     │ │ - last_  │ │ - spent_ │ │ - status│ │        │
│   level     │ │   updated│ │   today  │ │         │ │        │
└──┬──────────┘ └──┬───────┘ └──────────┘ └────┬────┘ └────────┘
   │               │                            │
   │ (1:many)      │ (1:many)                   │ (1:many)
   │               │                            │
   ▼               ▼                            ▼
┌──────────────┐ ┌──────────────┐      ┌────────────────┐
│ active_      │ │ chat_        │      │ goal_          │
│ signals      │ │ messages     │      │ transactions   │
│              │ │              │      │                │
│ - signal_id  │ │ - role       │      │ - amount       │
│ - severity   │ │ - content    │      │ - type         │
│ - title      │ │ - message_   │      │   (contribu-   │
│              │ │   index      │      │    tion/       │
└──────────────┘ └──────────────┘      │    withdrawal) │
                                        └────────────────┘
┌──────────────────────────────────────────────────────────┐
│ recommendations                                          │
│ (also linked to financial_analysis)                      │
│                                                          │
│ - recommendation_id                                      │
│ - priority                                               │
│ - category                                               │
└──────────────────────────────────────────────────────────┘
```

## 🔗 Key Relationships

### User → Profile (1:1)
- Every authenticated user has ONE profile
- Profile ID = User ID (from Supabase Auth)

### Profile → Financial Analysis (1:Many)
- Users can have multiple analyses (history)
- One analysis marked as "current" (`is_current = true`)

### Analysis → Signals/Recommendations (1:Many)
- Each analysis generates multiple signals
- Each analysis generates multiple recommendations

### Profile → Conversations (1:Many)
- Users can have multiple chat conversations
- Each conversation has a title

### Conversation → Messages (1:Many)
- Messages are ordered by `message_index`
- Roles: 'user', 'assistant', 'system'

### Profile → Check-ins (1:Many)
- One check-in per day per user
- Unique constraint on (user_id, check_in_date)

### Profile → Goals (1:Many)
- Users can have multiple active goals
- Status: 'active', 'paused', 'completed', 'cancelled'

### Goal → Transactions (1:Many)
- Track all contributions and withdrawals
- Automatically updates goal.current_amount

## 📋 Data Flow Examples

### 1. New User Onboarding
```
1. User signs up (Supabase Auth creates auth.users record)
2. Create profile record (profiles table)
3. Run financial analysis
4. Insert analysis (financial_analysis table)
5. Generate signals (active_signals table)
6. Generate recommendations (recommendations table)
```

### 2. Daily Check-in
```
1. User opens app
2. Check for today's check-in (check_ins table)
3. If doesn't exist, prompt user
4. Save check-in with mood & spending
```

### 3. Chat with AI Coach
```
1. Create/load conversation (chat_conversations)
2. User types message
3. Save user message (chat_messages, role='user')
4. Call AI coach API
5. Save AI response (chat_messages, role='assistant')
6. Update conversation.last_updated (automatic trigger)
```

### 4. Goal Contribution
```
1. User adds money to goal
2. Insert transaction (goal_transactions)
3. Trigger automatically updates goal.current_amount
4. Trigger recalculates goal.progress_percentage
```

## 🔐 Security Model

```
┌───────────────────────────────────────────────┐
│           Row Level Security (RLS)            │
├───────────────────────────────────────────────┤
│                                               │
│  Every table checks: auth.uid() = user_id    │
│                                               │
│  ✓ SELECT - User can read own data           │
│  ✓ INSERT - User can create own data         │
│  ✓ UPDATE - User can modify own data         │
│  ✓ DELETE - User can delete own data         │
│                                               │
│  ✗ Users CANNOT access other users' data     │
│                                               │
└───────────────────────────────────────────────┘
```

## 📊 Table Sizes & Indexes

### Small Tables (< 100 rows per user)
- `profiles` - 1 row per user
- `financial_analysis` - ~10-50 rows per user (history)
- `goals` - ~5-20 rows per user

### Medium Tables (100-1000 rows per user)
- `check_ins` - 1 per day (~365 per year)
- `active_signals` - 5-50 active at a time
- `recommendations` - 5-20 active at a time

### Large Tables (1000+ rows per user)
- `chat_messages` - Grows with usage
- `goal_transactions` - One per contribution/withdrawal

### Indexes for Performance
```sql
-- Profile lookups (primary key)
profiles(id)

-- Analysis queries
financial_analysis(user_id)
financial_analysis(user_id, is_current)  -- For current analysis

-- Signals & Recommendations
active_signals(user_id)
active_signals(analysis_id)
recommendations(user_id)
recommendations(analysis_id)

-- Chat
chat_conversations(user_id)
chat_messages(conversation_id)
chat_messages(user_id)

-- Check-ins
check_ins(user_id)
check_ins(user_id, check_in_date DESC)  -- Recent check-ins

-- Goals
goals(user_id)
goals(user_id, status)  -- Active goals
goal_transactions(goal_id)
goal_transactions(user_id)
```

## 🚀 Query Patterns

### Get Complete Dashboard
```typescript
const dashboard = await getUserDashboardData(userId);
// Returns: profile, analysis, signals, recommendations, goals
```

### Get User's Financial Status
```sql
SELECT 
  p.*,
  fa.stress_score,
  fa.risk_level,
  COUNT(DISTINCT s.id) as active_signals,
  COUNT(DISTINCT r.id) as pending_recommendations
FROM profiles p
LEFT JOIN financial_analysis fa ON fa.user_id = p.id AND fa.is_current = true
LEFT JOIN active_signals s ON s.user_id = p.id AND s.is_resolved = false
LEFT JOIN recommendations r ON r.user_id = p.id AND r.is_completed = false
WHERE p.id = $1
GROUP BY p.id, fa.id;
```

### Get Recent Activity
```sql
SELECT 'check-in' as type, check_in_date as date, mood as data
FROM check_ins WHERE user_id = $1
UNION ALL
SELECT 'transaction' as type, created_at as date, amount as data
FROM goal_transactions WHERE user_id = $1
ORDER BY date DESC LIMIT 20;
```

## 🎯 Computed Fields

### Goals: progress_percentage
```sql
-- Automatically calculated:
progress_percentage = (current_amount / target_amount * 100)
-- Max: 100%
```

### Conversations: last_updated
```sql
-- Automatically updated when:
-- - New message added
-- - Message edited
-- Via trigger: update_conversation_last_updated()
```

## 🔄 Triggers & Automation

### 1. Timestamp Updates
```sql
-- All tables with updated_at
TRIGGER: update_updated_at_column()
FIRES: BEFORE UPDATE
ACTION: Sets updated_at = NOW()
```

### 2. Conversation Updates
```sql
TRIGGER: update_conversation_on_message
FIRES: AFTER INSERT on chat_messages
ACTION: Updates conversation.last_updated
```

### 3. Goal Balance Updates
```sql
TRIGGER: update_goal_on_transaction
FIRES: AFTER INSERT on goal_transactions
ACTION: Updates goal.current_amount
```

## 💡 Best Practices

### 1. Use Helper Functions
```typescript
// ✅ Good - Type-safe, clean
const { data } = await getProfile(userId);

// ❌ Avoid - Verbose, error-prone
const { data } = await supabase
  .from('profiles')
  .select('*')
  .eq('id', userId)
  .single();
```

### 2. Batch Related Queries
```typescript
// ✅ Good - One function call
const dashboard = await getUserDashboardData(userId);

// ❌ Avoid - Multiple calls
const profile = await getProfile(userId);
const analysis = await getCurrentAnalysis(userId);
const signals = await getActiveSignals(userId);
// ...
```

### 3. Use Joins for Related Data
```typescript
// ✅ Good - Single query with joins
const { data } = await supabase
  .from('financial_analysis')
  .select(`*, active_signals(*), recommendations(*)`)
  .eq('user_id', userId)
  .single();

// ❌ Avoid - Multiple queries
```

---

**Visual Guide Version**: 1.0  
**Last Updated**: January 19, 2026  
**Project**: Future Your Finance (FYF)
