# Database Setup Guide - FYF (Future Your Finance)

## Overview
This directory contains the complete database schema for the FYF application using Supabase (PostgreSQL).

## Database Structure

### Tables Created:
1. **profiles** - User financial profiles and preferences
2. **financial_analysis** - Financial health analysis with metrics
3. **active_signals** - Financial alerts and warnings
4. **recommendations** - AI-generated recommendations
5. **chat_conversations** - Chat threads with AI coach
6. **chat_messages** - Individual chat messages
7. **check_ins** - Daily financial check-ins
8. **goals** - User financial goals
9. **goal_transactions** - Goal contribution/withdrawal history

### Security:
- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Policies for SELECT, INSERT, UPDATE, DELETE operations

## Setup Instructions

### Prerequisites
1. Supabase CLI installed: `npm install -g supabase`
2. Supabase account and project created
3. Project URL: `https://vtocrplsbciduitbkmko.supabase.co`

### Method 1: Using Supabase CLI (Recommended)

```bash
# 1. Navigate to project directory
cd d:/projects/FYF/sweet-connection/finance-guardian

# 2. Link to your Supabase project
supabase link --project-ref vtocrplsbciduitbkmko

# 3. Push migrations to Supabase
supabase db push

# 4. Verify migrations
supabase db diff
```

### Method 2: Using Supabase Dashboard

1. Go to: https://vtocrplsbciduitbkmko.supabase.co
2. Navigate to SQL Editor
3. Run migrations in order:
   - First: `20260119000000_initial_schema.sql`
   - Second: `20260119000001_rls_policies.sql`

### Method 3: Manual SQL Execution

```bash
# Run each migration file manually
psql "postgresql://[CONNECTION_STRING]" -f supabase/migrations/20260119000000_initial_schema.sql
psql "postgresql://[CONNECTION_STRING]" -f supabase/migrations/20260119000001_rls_policies.sql
```

## Environment Variables

Update your `.env` or `.env.local` file:

```env
VITE_SUPABASE_URL=https://vtocrplsbciduitbkmko.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
```

## TypeScript Integration

The database types are automatically generated in:
- `src/integrations/supabase/types.ts` - Database type definitions
- `src/integrations/supabase/helpers.ts` - Helper functions for database operations

### Usage Example:

```typescript
import { getProfile, updateProfile, createAnalysis } from '@/integrations/supabase/helpers';

// Get user profile
const { data: profile, error } = await getProfile(userId);

// Update profile
await updateProfile(userId, {
  spending_style: 'mixed',
  is_onboarded: true
});

// Create new analysis
await createAnalysis({
  user_id: userId,
  stress_score: 77,
  risk_level: 'crisis',
  survival_days: 30
});
```

## Database Functions

### Helper Functions Available:

1. **get_current_analysis(p_user_id)** - Get user's most recent analysis
2. **get_active_signals_count(p_user_id)** - Count unresolved signals

Example usage:
```sql
SELECT * FROM get_current_analysis('user-uuid-here');
SELECT get_active_signals_count('user-uuid-here');
```

## Migration Details

### 20260119000000_initial_schema.sql
- Creates all database tables
- Sets up foreign key relationships
- Adds indexes for performance
- Creates triggers for auto-updating timestamps
- Adds computed columns (e.g., goal progress_percentage)

### 20260119000001_rls_policies.sql
- Enables Row Level Security on all tables
- Creates policies for user data isolation
- Adds helper functions for common queries

## Data Relationships

```
auth.users (Supabase Auth)
    ↓
profiles (1:1)
    ↓
    ├── financial_analysis (1:many)
    │       ├── active_signals (1:many)
    │       └── recommendations (1:many)
    │
    ├── chat_conversations (1:many)
    │       └── chat_messages (1:many)
    │
    ├── check_ins (1:many)
    │
    └── goals (1:many)
            └── goal_transactions (1:many)
```

## Key Features

### Automatic Timestamps
All tables have `created_at` and `updated_at` columns that are automatically managed.

### Goal Progress Tracking
Goals have a computed `progress_percentage` column that automatically calculates progress.

### Conversation Updates
When a new message is added, the conversation's `last_updated` timestamp is automatically updated.

### Current Analysis Tracking
The `financial_analysis` table supports historical tracking with an `is_current` flag.

## Testing Your Setup

After running migrations, test with these queries:

```sql
-- Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check RLS policies
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verify indexes
SELECT tablename, indexname 
FROM pg_indexes 
WHERE schemaname = 'public';
```

## Troubleshooting

### Issue: Migration fails
- Ensure you have the correct project reference
- Check if you have admin permissions
- Verify PostgreSQL version compatibility (requires PostgreSQL 13+)

### Issue: RLS blocking queries
- Make sure you're authenticated with Supabase Auth
- Check if the user's auth.uid() matches the user_id in tables
- Verify RLS policies are correctly applied

### Issue: Type errors in TypeScript
- Regenerate types: `supabase gen types typescript --project-id vtocrplsbciduitbkmko > src/integrations/supabase/types.ts`
- Restart your TypeScript server
- Clear build cache and rebuild

## Maintenance

### Backing Up Data
```bash
# Export current schema
supabase db dump -f backup.sql

# Export specific table
supabase db dump --table=profiles -f profiles_backup.sql
```

### Creating New Migrations
```bash
# Create a new migration file
supabase migration new add_new_feature

# After editing, push to remote
supabase db push
```

## Security Best Practices

1. **Never expose service role key** in client-side code
2. **Always use anon key** for client operations
3. **Test RLS policies** before deploying to production
4. **Regularly review** access logs in Supabase dashboard
5. **Enable MFA** on your Supabase account

## Support

- Supabase Documentation: https://supabase.com/docs
- Project Dashboard: https://vtocrplsbciduitbkmko.supabase.co
- SQL Editor: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql

---

**Created:** January 19, 2026  
**Version:** 1.0.0  
**Database:** PostgreSQL 14+ via Supabase
