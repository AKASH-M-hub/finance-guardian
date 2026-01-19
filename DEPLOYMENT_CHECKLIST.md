# 🎯 Database Deployment Checklist

## ✅ Pre-Deployment

- [x] Database schema created (`20260119000000_initial_schema.sql`)
- [x] RLS policies created (`20260119000001_rls_policies.sql`)
- [x] TypeScript types updated (`src/integrations/supabase/types.ts`)
- [x] Helper functions created (`src/integrations/supabase/helpers.ts`)
- [x] Import utility created (`src/integrations/supabase/import.ts`)
- [x] Deployment scripts created (`deploy.ps1` and `deploy.sh`)

## 📋 Next Steps (YOU NEED TO DO THESE)

### 1. Get Supabase API Keys
- [ ] Go to: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/settings/api
- [ ] Copy the `anon` / `public` key
- [ ] Copy the `service_role` key (keep this SECRET!)

### 2. Update Environment Variables
- [ ] Copy `.env.example` to `.env.local`
- [ ] Add your Supabase anon key to `VITE_SUPABASE_ANON_KEY`
- [ ] Keep `VITE_SUPABASE_URL=https://vtocrplsbciduitbkmko.supabase.co`

### 3. Install Supabase CLI (if not installed)
```bash
npm install -g supabase
```

### 4. Login to Supabase
```bash
supabase login
```

### 5. Deploy Database
**Option A: Using PowerShell (Windows)**
```powershell
cd d:\projects\FYF\sweet-connection\finance-guardian
.\supabase\deploy.ps1
```

**Option B: Using Bash (Linux/Mac)**
```bash
cd d:/projects/FYF/sweet-connection/finance-guardian
chmod +x supabase/deploy.sh
./supabase/deploy.sh
```

**Option C: Manual (Supabase Dashboard)**
1. Go to: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql
2. Open: `supabase/migrations/20260119000000_initial_schema.sql`
3. Copy and paste into SQL Editor, click "Run"
4. Open: `supabase/migrations/20260119000001_rls_policies.sql`
5. Copy and paste into SQL Editor, click "Run"

### 6. Verify Deployment
- [ ] Check tables exist in Supabase dashboard
- [ ] Verify RLS policies are enabled
- [ ] Test authentication flow

### 7. Import Existing Data (Optional)
If you want to import your existing data from the JSON export:

```typescript
import { importFromFile } from '@/integrations/supabase/import';
import { supabase } from '@/integrations/supabase/client';

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Load your export file
const response = await fetch('/path/to/fyf-data-export-2026-01-19.json');
const jsonData = await response.text();

// Import data
await importFromFile(user.id, jsonData);
```

## 🧪 Testing

### Test Database Connection
```typescript
import { supabase } from '@/integrations/supabase/client';

const { data, error } = await supabase
  .from('profiles')
  .select('count');

console.log('Connected:', !error);
```

### Test Profile Operations
```typescript
import { createProfile, getProfile } from '@/integrations/supabase/helpers';

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Create profile
await createProfile({
  id: user.id,
  monthly_income_range: 'below_25k',
  income_type: 'salary',
  country: 'India'
});

// Get profile
const { data: profile } = await getProfile(user.id);
console.log('Profile:', profile);
```

## 📊 Database Tables Created

1. ✅ **profiles** - User financial profiles
2. ✅ **financial_analysis** - Financial health metrics
3. ✅ **active_signals** - Financial alerts
4. ✅ **recommendations** - AI recommendations
5. ✅ **chat_conversations** - Chat threads
6. ✅ **chat_messages** - Chat messages
7. ✅ **check_ins** - Daily check-ins
8. ✅ **goals** - Financial goals
9. ✅ **goal_transactions** - Goal contributions

## 🔐 Security Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Users can only access their own data
- ✅ Policies for all CRUD operations
- ✅ Helper functions with SECURITY DEFINER

## 📚 Documentation Created

- ✅ `supabase/README.md` - Complete setup guide
- ✅ `DATABASE_GUIDE.md` - Quick reference with examples
- ✅ `.env.example` - Environment variables template

## 🚀 Ready to Start

Once deployment is complete, you can:

1. **Run your app**: `npm run dev`
2. **Test authentication**: Sign up a new user
3. **Create profile**: Use onboarding flow
4. **Generate analysis**: Run financial analysis
5. **Chat with AI**: Test AI coach integration

## 🆘 Need Help?

- Review: `DATABASE_GUIDE.md` for code examples
- Check: `supabase/README.md` for setup details
- Visit: https://vtocrplsbciduitbkmko.supabase.co for dashboard access

---

**Status**: ✅ Database schema ready for deployment  
**Date**: January 19, 2026  
**Project**: Future Your Finance (FYF)
