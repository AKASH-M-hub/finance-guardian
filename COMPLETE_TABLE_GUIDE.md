# Complete Data Storage Guide - All Tables Explained

## 📚 Database Schema Overview

This guide explains what data is stored in each Supabase table and how to access it.

---

## 1️⃣ PROFILES TABLE

**Purpose**: Store complete user financial profile and preferences

### What's Stored
```javascript
{
  id: "user-uuid",                    // User's auth ID (Primary Key)
  monthly_income_range: "50k_1L",     // Income bracket
  income_type: "salary",              // salary | student | freelance | business
  country: "India",                   // Country
  commitments: ["Home Rent", "EMI"],  // Fixed expense names
  total_fixed_amount: 25000,          // Total fixed monthly expenses
  spending_style: "mostly_planned",   // mostly_planned | mixed | mostly_impulsive
  overspend_trigger: "stress_days",   // Trigger for impulse spending
  top_impulse_category: "shopping",   // food_delivery | shopping | travel | etc
  money_feeling: "comfortable",       // confident | comfortable | slightly_worried | etc
  reach_zero_frequency: "rarely",     // never | rarely | sometimes | often | always
  emergency_readiness: "will_struggle", // fully_covered | can_handle | etc
  life_situation: "none",             // job_change | new_city | wedding_planned | etc
  planned_purchase: "none",           // vehicle | home | education | wedding | gadget | none
  ai_help_level: "only_insights",     // only_insights | insights_suggestions | auto_guardrails
  is_onboarded: true,                 // Onboarding complete flag
  created_at: "2026-01-19T...",       // Created timestamp
  updated_at: "2026-01-19T..."        // Updated timestamp
}
```

### How to Access
```typescript
import { getProfile, updateProfile } from '@/integrations/supabase';

// Get user profile
const { data: profile } = await getProfile(userId);

// Update profile
await updateProfile(userId, {
  spending_style: 'mostly_planned',
  money_feeling: 'confident'
});
```

### When It's Used
- ✓ During user onboarding
- ✓ In dashboard calculations
- ✓ For AI coach context
- ✓ In financial analysis

---

## 2️⃣ FINANCIAL ANALYSIS TABLE

**Purpose**: Store computed financial health metrics and scores

### What's Stored
```javascript
{
  id: "analysis-uuid",                // Primary Key
  user_id: "user-uuid",              // Reference to profiles(id)
  stress_score: 65,                  // 0-100: Financial stress level
  risk_level: "caution",             // safe | caution | warning | crisis
  silent_burden_index: 45,           // Percentage of income locked in fixed expenses
  survival_days: 30,                 // Days of living expenses available
  debt_risk: 25,                     // 0-100: Risk of going into debt
  health_score: 70,                  // 0-100: Overall financial health
  emergency_fund_target: 100000,     // Amount needed for emergency fund
  weekly_budget: 7000,               // Recommended weekly budget
  daily_budget: 1000,                // Recommended daily budget
  recovery_days: 90,                 // Days to recover from crisis
  is_current: true,                  // Most recent analysis flag
  analyzed_at: "2026-01-19T...",    // When analysis was computed
  created_at: "2026-01-19T...",     // Created timestamp
  updated_at: "2026-01-19T..."      // Updated timestamp
}
```

### How to Access
```typescript
import { getCurrentAnalysis, getAnalysisHistory } from '@/integrations/supabase';

// Get current analysis
const { data: analysis } = await getCurrentAnalysis(userId);

// Get history of analyses
const { data: history } = await getAnalysisHistory(userId, 10);
```

### When It's Created
- ✓ After profile completion during onboarding
- ✓ When profile is updated
- ✓ Manually triggered in settings

### Used In
- ✓ Dashboard stress gauge
- ✓ Budget recommendations
- ✓ AI coach context
- ✓ Alert generation

---

## 3️⃣ ACTIVE SIGNALS TABLE

**Purpose**: Store financial alerts and warning signals

### What's Stored
```javascript
{
  id: "signal-uuid",                  // Primary Key
  analysis_id: "analysis-uuid",      // Reference to financial_analysis(id)
  user_id: "user-uuid",              // Reference to profiles(id)
  signal_id: "high_burden",          // Unique signal identifier
  signal_type: "commitment_overload", // Type of signal
  severity: "high",                  // low | medium | high | critical
  title: "High Fixed Expense Burden", // Signal title
  description: "57% of income locked in fixed expenses", // Details
  actionable: "Review and negotiate bills",  // Action suggestion
  is_acknowledged: false,            // User acknowledged flag
  is_resolved: false,                // User resolved flag
  acknowledged_at: null,             // When acknowledged
  resolved_at: null,                 // When resolved
  created_at: "2026-01-19T...",     // Created timestamp
  updated_at: "2026-01-19T..."      // Updated timestamp
}
```

### How to Access
```typescript
import { getActiveSignals, resolveSignal } from '@/integrations/supabase';

// Get unresolved signals
const { data: signals } = await getActiveSignals(userId);

// Mark signal as resolved
await resolveSignal(signalId);
```

### Signals Tracked
- ✓ High fixed expense burden
- ✓ Impulse spending risk
- ✓ Emergency fund deficiency
- ✓ Debt risk elevation
- ✓ Stress indicators
- ✓ Spending pattern anomalies

### Used In
- ✓ Stress signals section
- ✓ Dashboard alerts
- ✓ AI coach warnings

---

## 4️⃣ RECOMMENDATIONS TABLE

**Purpose**: Store AI-generated actionable recommendations

### What's Stored
```javascript
{
  id: "rec-uuid",                     // Primary Key
  analysis_id: "analysis-uuid",      // Reference to financial_analysis(id)
  user_id: "user-uuid",              // Reference to profiles(id)
  recommendation_id: "build_emergency", // Unique recommendation ID
  priority: "high",                  // low | medium | high | critical
  title: "Build Emergency Fund",      // Recommendation title
  description: "Having 3-6 months...", // Full description
  action: "Start with ₹500/week",    // Specific actionable step
  category: "emergency",             // savings | spending | emergency | etc
  is_accepted: false,                // User acceptance flag
  is_completed: false,               // Completion flag
  accepted_at: null,                 // When accepted
  completed_at: null,                // When completed
  created_at: "2026-01-19T...",     // Created timestamp
  updated_at: "2026-01-19T..."      // Updated timestamp
}
```

### How to Access
```typescript
import { getRecommendations, acceptRecommendation } from '@/integrations/supabase';

// Get pending recommendations
const { data: recs } = await getRecommendations(userId);

// Mark as accepted
await acceptRecommendation(recommendationId);
```

### Recommendation Types
- ✓ Emergency fund building
- ✓ Burden reduction
- ✓ Impulse control
- ✓ Savings habits
- ✓ Debt payoff strategies

---

## 5️⃣ CHAT CONVERSATIONS TABLE

**Purpose**: Store chat session metadata

### What's Stored
```javascript
{
  id: "conversation-uuid",           // Primary Key (session ID)
  user_id: "user-uuid",              // Reference to profiles(id)
  title: "Budget Planning Chat",     // Conversation title
  created_at: "2026-01-19T...",     // Creation timestamp
  last_updated: "2026-01-19T..."    // Last activity timestamp
}
```

### How to Access
```typescript
import { getConversations, createConversation } from '@/integrations/supabase';

// Get all conversations
const { data: conversations } = await getConversations(userId);

// Create new conversation
const { data: conv } = await createConversation(userId, "New Chat");
```

### Sync Method
- ✓ Auto-created when first message sent
- ✓ Updated timestamp on each message
- ✓ Title auto-generated from first message

---

## 6️⃣ CHAT MESSAGES TABLE

**Purpose**: Store individual chat messages

### What's Stored
```javascript
{
  id: "message-uuid",                // Primary Key
  conversation_id: "conversation-uuid", // Reference to chat_conversations(id)
  user_id: "user-uuid",              // Reference to profiles(id)
  role: "user",                      // user | assistant | system
  content: "How can I reduce my expenses?", // Message content
  message_index: 5,                  // Order in conversation
  created_at: "2026-01-19T..."      // Message timestamp
}
```

### How to Access
```typescript
import { getMessages, addMessage } from '@/integrations/supabase';

// Get conversation messages
const { data: messages } = await getMessages(conversationId);

// Add new message
await addMessage({
  conversation_id: convId,
  user_id: userId,
  role: 'user',
  content: 'My question',
  message_index: 10
});
```

### Features
- ✓ Debounced sync (3-second delay)
- ✓ Automatic deduplication
- ✓ Ordered by message_index
- ✓ Role tracking (user/assistant)

---

## 7️⃣ CHECK_INS TABLE

**Purpose**: Store daily mood and spending check-ins

### What's Stored
```javascript
{
  id: "checkin-uuid",                // Primary Key
  user_id: "user-uuid",              // Reference to profiles(id)
  check_in_date: "2026-01-19",      // Date (YYYY-MM-DD format)
  mood: "good",                      // great | good | okay | stressed | anxious
  spent_today: 2500,                 // Amount spent in rupees
  stayed_under_budget: true,         // Budget adherence flag
  notes: "Managed to cook at home",  // Optional user notes
  created_at: "2026-01-19T...",     // Created timestamp
  updated_at: "2026-01-19T..."      // Updated timestamp
}
```

### How to Access
```typescript
import { getTodayCheckIn, getRecentCheckIns, syncTodayCheckIn } from '@/integrations/supabase';

// Get today's check-in
const { data: today } = await getTodayCheckIn(userId);

// Get recent check-ins (last 30 days)
const { data: recent } = await getRecentCheckIns(userId, 30);

// Create/update check-in
await syncTodayCheckIn(userId, {
  mood: 'good',
  spent_today: 2500,
  stayed_under_budget: true,
  notes: 'Stayed within budget'
});
```

### Features
- ✓ One per user per day (UNIQUE constraint)
- ✓ Update if exists, create if not
- ✓ Mood tracking
- ✓ Spending tracking
- ✓ Budget adherence scoring

### Used In
- ✓ Daily mood tracking
- ✓ Spending patterns
- ✓ Streak tracking
- ✓ Reports generation

---

## 8️⃣ GOALS TABLE

**Purpose**: Store user financial goals and progress

### What's Stored
```javascript
{
  id: "goal-uuid",                   // Primary Key
  user_id: "user-uuid",              // Reference to profiles(id)
  goal_type: "emergency_fund",       // emergency_fund | debt_payoff | savings | etc
  title: "Emergency Fund",           // Goal title
  description: "3-6 months expenses", // Goal description
  target_amount: 150000,             // Target amount in rupees
  current_amount: 45000,             // Current progress
  target_date: "2026-12-31",        // Goal deadline
  started_at: "2026-01-19T...",     // When started
  status: "active",                  // active | paused | completed | cancelled
  progress_percentage: 30,           // Auto-calculated: (current/target)*100
  completed_at: null,                // When completed
  created_at: "2026-01-19T...",     // Created timestamp
  updated_at: "2026-01-19T..."      // Updated timestamp
}
```

### How to Access
```typescript
import { getActiveGoals, getAllGoals, createGoal, updateGoal, syncGoals } from '@/integrations/supabase';

// Get active goals
const { data: active } = await getActiveGoals(userId);

// Get all goals (including completed)
const { data: all } = await getAllGoals(userId);

// Create new goal
const { data: goal } = await createGoal({
  user_id: userId,
  goal_type: 'emergency_fund',
  title: 'Emergency Fund',
  target_amount: 150000
});

// Sync multiple goals
await syncGoals(userId, [{
  goal_type: 'emergency_fund',
  title: 'Emergency Fund',
  target_amount: 150000
}]);

// Update goal
await updateGoal(goalId, {
  status: 'completed',
  completed_at: new Date().toISOString()
});
```

### Goal Types
- ✓ emergency_fund - Emergency fund building
- ✓ debt_payoff - Debt elimination
- ✓ savings - General savings
- ✓ investment - Investment goals
- ✓ purchase - Purchase planning
- ✓ custom - Custom goals

### Used In
- ✓ Goals dashboard
- ✓ Progress tracking
- ✓ AI recommendations
- ✓ Motivation display

---

## 9️⃣ GOAL_TRANSACTIONS TABLE

**Purpose**: Track contributions and withdrawals to goals

### What's Stored
```javascript
{
  id: "transaction-uuid",            // Primary Key
  goal_id: "goal-uuid",              // Reference to goals(id)
  user_id: "user-uuid",              // Reference to profiles(id)
  amount: 5000,                      // Transaction amount
  transaction_type: "contribution",  // contribution | withdrawal
  notes: "Weekly savings",           // Optional notes
  created_at: "2026-01-19T..."      // Transaction timestamp
}
```

### How to Access
```typescript
import { addGoalTransaction, getGoalTransactions, syncGoalTransaction } from '@/integrations/supabase';

// Add transaction
const { data: trans } = await addGoalTransaction({
  goal_id: goalId,
  user_id: userId,
  amount: 5000,
  transaction_type: 'contribution',
  notes: 'Weekly savings'
});

// Get goal transactions
const { data: transactions } = await getGoalTransactions(goalId);

// Sync transaction
await syncGoalTransaction(userId, goalId, {
  amount: 5000,
  transaction_type: 'contribution',
  notes: 'Manual contribution'
});
```

### Features
- ✓ Contribution tracking
- ✓ Withdrawal tracking
- ✓ Auto-updates goal current_amount via trigger
- ✓ Transaction history
- ✓ Timestamped records

### Auto-Updates
When a transaction is inserted, trigger automatically:
- Updates `goals.current_amount` ↑ for contributions
- Updates `goals.current_amount` ↓ for withdrawals
- Updates `goals.progress_percentage` calculation

---

## 📊 Data Relationships

```
User (Supabase Auth)
  │
  ├─→ profiles (one-to-one)
  │    └─→ financial_analysis (one-to-many)
  │         ├─→ active_signals (one-to-many)
  │         └─→ recommendations (one-to-many)
  │
  ├─→ chat_conversations (one-to-many)
  │    └─→ chat_messages (one-to-many)
  │
  ├─→ check_ins (one-to-many, unique per day)
  │
  └─→ goals (one-to-many)
       └─→ goal_transactions (one-to-many)
```

---

## 🔒 Security - RLS Policies

All tables have Row Level Security:
```sql
-- Example policy
CREATE POLICY "Users can view own profile" 
  ON public.profiles FOR SELECT 
  USING (auth.uid() = id);
```

**Result**: Users can ONLY access their own data. No cross-user data leaks.

---

## ⚙️ Database Triggers

### Auto-update Timestamps
All tables have triggers that auto-update `updated_at` on changes:
```sql
UPDATE profiles SET updated_at = NOW() WHERE id = NEW.id;
UPDATE goals SET updated_at = NOW() WHERE id = NEW.id;
-- etc for all tables
```

### Goal Amount Calculation
When transaction inserted:
```sql
UPDATE goals SET current_amount = current_amount + NEW.amount 
WHERE id = NEW.goal_id AND NEW.transaction_type = 'contribution';
```

### Conversation Updates
When message inserted:
```sql
UPDATE chat_conversations SET last_updated = NOW() 
WHERE id = NEW.conversation_id;
```

---

## 🧪 Example: Complete Flow

### 1. User Onboards
```
→ Creates profile (profiles table)
→ Financial analysis computed (financial_analysis table)
→ Signals generated (active_signals table)
→ Recommendations created (recommendations table)
```

### 2. User Chats
```
→ First message → Creates conversation (chat_conversations table)
→ Message sent → Stored in chat_messages table
→ Debounced sync → All saved to Supabase
```

### 3. User Creates Goal
```
→ Goal created → Synced to goals table
→ First contribution → Added to goal_transactions table
→ Trigger fires → goal.current_amount updated
→ progress_percentage auto-calculated
```

### 4. User Daily Check-in
```
→ Mood + spending submitted
→ Synced to check_ins table
→ Next day, new entry created (not updated)
→ Unique constraint prevents duplicates
```

---

## 📝 Notes

- All IDs are UUIDs generated by Supabase
- All timestamps are in ISO 8601 format
- RLS ensures complete data isolation
- Triggers automate calculations and updates
- Debouncing reduces database load
- Deduplication prevents data corruption

---

## ✅ Verification Checklist

- [x] All 9 tables exist in Supabase
- [x] RLS policies enabled on all tables
- [x] Foreign keys properly configured
- [x] Triggers working for auto-updates
- [x] Indexes created for performance
- [x] Sample data can be queried
- [x] UNIQUE constraints active
- [x] Timestamps properly managed

All data is now properly stored and retrievable! 🎉
