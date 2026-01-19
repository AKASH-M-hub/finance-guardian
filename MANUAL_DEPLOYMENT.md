# 🚀 Manual Database Deployment Guide

Since CLI has permission issues, follow these simple steps:

## Step 1: Open Supabase SQL Editor

Click this link: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql

## Step 2: Run First Migration (Initial Schema)

1. Click "New Query" in SQL Editor
2. Copy ALL content from: `supabase/migrations/20260119000000_initial_schema.sql`
3. Paste into SQL Editor
4. Click "Run" (or press Ctrl+Enter)
5. Wait for "Success" message

## Step 3: Run Second Migration (RLS Policies)

1. Click "New Query" again
2. Copy ALL content from: `supabase/migrations/20260119000001_rls_policies.sql`
3. Paste into SQL Editor
4. Click "Run"
5. Wait for "Success" message

## Step 4: Verify Tables Created

Visit Table Editor: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/editor

You should see these 9 tables:
- ✅ profiles
- ✅ financial_analysis
- ✅ active_signals
- ✅ recommendations
- ✅ chat_conversations
- ✅ chat_messages
- ✅ check_ins
- ✅ goals
- ✅ goal_transactions

## Step 5: Regenerate TypeScript Types

Run this command in your terminal:

```bash
npx supabase gen types typescript --project-id vtocrplsbciduitbkmko --schema public > src/integrations/supabase/types.ts
```

## Step 6: Test Connection

Run this in your terminal:

```bash
npm run dev
```

Then test in browser console:

```javascript
import { supabase } from './src/integrations/supabase/client';
const { data, error } = await supabase.from('profiles').select('count');
console.log('Connected:', !error);
```

---

## Need Help?

If you see any errors:
1. Copy the error message
2. Check the SQL line number
3. Make sure you copied the ENTIRE file content

The migrations are in:
- `d:\projects\FYF\sweet-connection\finance-guardian\supabase\migrations\20260119000000_initial_schema.sql`
- `d:\projects\FYF\sweet-connection\finance-guardian\supabase\migrations\20260119000001_rls_policies.sql`
