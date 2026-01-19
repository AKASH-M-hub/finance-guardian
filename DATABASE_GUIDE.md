# Database Quick Reference Guide

## 🚀 Quick Start

### 1. Deploy Database
```bash
# Windows
.\supabase\deploy.ps1

# Linux/Mac
chmod +x supabase/deploy.sh
./supabase/deploy.sh
```

### 2. Get Your API Keys
1. Go to: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/settings/api
2. Copy the "anon/public" key
3. Update `.env.local` with your keys

### 3. Test Connection
```typescript
import { supabase } from '@/integrations/supabase/client';

// Test connection
const { data, error } = await supabase.from('profiles').select('count');
console.log('Connected:', !error);
```

## 📚 Common Operations

### User Profile

```typescript
import { getProfile, updateProfile, createProfile } from '@/integrations/supabase/helpers';

// Get profile
const { data: profile } = await getProfile(userId);

// Create profile (during signup/onboarding)
await createProfile({
  id: userId, // from auth.user.id
  monthly_income_range: 'below_25k',
  income_type: 'salary',
  country: 'India',
  is_onboarded: true
});

// Update profile
await updateProfile(userId, {
  spending_style: 'mixed',
  money_feeling: 'slightly_worried'
});
```

### Financial Analysis

```typescript
import { getCurrentAnalysis, createAnalysis } from '@/integrations/supabase/helpers';

// Get current analysis
const { data: analysis } = await getCurrentAnalysis(userId);

// Create new analysis
await createAnalysis({
  user_id: userId,
  stress_score: 77,
  risk_level: 'crisis',
  silent_burden_index: 57,
  survival_days: 30,
  debt_risk: 0,
  emergency_fund_target: 40000,
  weekly_budget: 1750,
  daily_budget: 250
});
```

### Signals & Recommendations

```typescript
import { 
  getActiveSignals, 
  createSignals, 
  resolveSignal,
  getRecommendations,
  acceptRecommendation 
} from '@/integrations/supabase/helpers';

// Get active signals
const { data: signals } = await getActiveSignals(userId);

// Create signals
await createSignals([{
  analysis_id: analysisId,
  user_id: userId,
  signal_id: 'burden_high',
  signal_type: 'commitment_overload',
  severity: 'medium',
  title: 'High Fixed Expense Burden',
  description: '57% of your income goes to fixed expenses'
}]);

// Resolve a signal
await resolveSignal(signalId);

// Get recommendations
const { data: recs } = await getRecommendations(userId);

// Accept recommendation
await acceptRecommendation(recId);
```

### Chat with AI Coach

```typescript
import { 
  getConversations, 
  createConversation, 
  addMessage,
  getMessages 
} from '@/integrations/supabase/helpers';

// Create new conversation
const { data: conversation } = await createConversation(userId, 'Financial Planning Chat');

// Add user message
await addMessage({
  conversation_id: conversation.id,
  user_id: userId,
  role: 'user',
  content: 'Why is my stress score high?',
  message_index: 0
});

// Add AI response
await addMessage({
  conversation_id: conversation.id,
  user_id: userId,
  role: 'assistant',
  content: 'Your stress score is high because...',
  message_index: 1
});

// Get all messages
const { data: messages } = await getMessages(conversation.id);
```

### Daily Check-ins

```typescript
import { getTodayCheckIn, createCheckIn } from '@/integrations/supabase/helpers';

// Check if user checked in today
const { data: todayCheckIn } = await getTodayCheckIn(userId);

if (!todayCheckIn) {
  // Create today's check-in
  await createCheckIn({
    user_id: userId,
    check_in_date: new Date().toISOString().split('T')[0],
    mood: 'good',
    spent_today: 450,
    stayed_under_budget: true,
    notes: 'Had lunch out but skipped coffee'
  });
}
```

### Goals Management

```typescript
import { 
  getActiveGoals, 
  createGoal, 
  addGoalTransaction,
  completeGoal 
} from '@/integrations/supabase/helpers';

// Get active goals
const { data: goals } = await getActiveGoals(userId);

// Create new goal
const { data: goal } = await createGoal({
  user_id: userId,
  goal_type: 'emergency_fund',
  title: 'Build Emergency Fund',
  target_amount: 40000,
  current_amount: 0,
  target_date: '2026-12-31'
});

// Add contribution
await addGoalTransaction({
  goal_id: goal.id,
  user_id: userId,
  amount: 500,
  transaction_type: 'contribution',
  notes: 'Weekly savings'
});

// Mark as complete
await completeGoal(goal.id);
```

### Load Complete Dashboard

```typescript
import { getUserDashboardData } from '@/integrations/supabase/helpers';

// Get all user data in one call
const dashboard = await getUserDashboardData(userId);

console.log(dashboard.profile);
console.log(dashboard.analysis);
console.log(dashboard.signals);
console.log(dashboard.recommendations);
console.log(dashboard.goals);
```

## 🔐 Authentication

### Sign Up
```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'secure_password'
});

// Create profile after signup
if (data.user) {
  await createProfile({
    id: data.user.id,
    monthly_income_range: 'below_25k',
    income_type: 'salary',
    country: 'India'
  });
}
```

### Sign In
```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'secure_password'
});
```

### Get Current User
```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Sign Out
```typescript
await supabase.auth.signOut();
```

## 📊 Database Functions

### Get Current Analysis (SQL Function)
```typescript
const { data } = await supabase.rpc('get_current_analysis', {
  p_user_id: userId
});
```

### Get Active Signals Count
```typescript
const { data: count } = await supabase.rpc('get_active_signals_count', {
  p_user_id: userId
});
```

## 🔄 Real-time Subscriptions

### Subscribe to Profile Changes
```typescript
const subscription = supabase
  .channel('profile_changes')
  .on('postgres_changes', 
    { 
      event: 'UPDATE', 
      schema: 'public', 
      table: 'profiles',
      filter: `id=eq.${userId}`
    },
    (payload) => {
      console.log('Profile updated:', payload.new);
    }
  )
  .subscribe();

// Cleanup
subscription.unsubscribe();
```

### Subscribe to New Messages
```typescript
const subscription = supabase
  .channel('new_messages')
  .on('postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'chat_messages',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('New message:', payload.new);
    }
  )
  .subscribe();
```

## 📤 Data Import/Export

### Import from JSON Export
```typescript
import { importFromFile } from '@/integrations/supabase/import';

// Load your JSON export
const jsonData = await fetch('/path/to/export.json').then(r => r.text());

// Import data
const result = await importFromFile(userId, jsonData);
console.log('Import result:', result);
```

### Export User Data
```typescript
import { exportUserData } from '@/integrations/supabase/import';

const exportData = await exportUserData(userId);

// Download as JSON
const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
const url = URL.createObjectURL(blob);
// ... create download link
```

## ⚡ Performance Tips

1. **Use Select Specific Columns**
```typescript
// ❌ Bad: Fetching all columns
const { data } = await supabase.from('profiles').select('*');

// ✅ Good: Only fetch what you need
const { data } = await supabase.from('profiles').select('monthly_income_range, country');
```

2. **Use Joins for Related Data**
```typescript
// Fetch analysis with signals and recommendations
const { data } = await supabase
  .from('financial_analysis')
  .select(`
    *,
    active_signals(*),
    recommendations(*)
  `)
  .eq('user_id', userId)
  .eq('is_current', true)
  .single();
```

3. **Use Pagination for Large Lists**
```typescript
const { data } = await supabase
  .from('check_ins')
  .select('*')
  .eq('user_id', userId)
  .range(0, 9) // First 10 items
  .order('check_in_date', { ascending: false });
```

## 🐛 Troubleshooting

### Check RLS Issues
```typescript
// If queries fail, check if user is authenticated
const { data: { user } } = await supabase.auth.getUser();
console.log('Authenticated:', !!user);

// Try with service role key (only for debugging, never in production)
import { createClient } from '@supabase/supabase-js';
const adminClient = createClient(url, SERVICE_ROLE_KEY);
```

### View Errors
```typescript
const { data, error } = await supabase.from('profiles').select();
if (error) {
  console.error('Error code:', error.code);
  console.error('Error message:', error.message);
  console.error('Error details:', error.details);
}
```

## 📞 Support Resources

- Supabase Dashboard: https://vtocrplsbciduitbkmko.supabase.co
- Supabase Docs: https://supabase.com/docs
- SQL Editor: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql
- Table Editor: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/editor

---

**Last Updated:** January 19, 2026
