# 🚀 Quick Start Commands

Copy and paste these commands to get started quickly!

## Step 1: Install Supabase CLI (if needed)

```bash
npm install -g supabase
```

## Step 2: Login to Supabase

```bash
supabase login
```

## Step 3: Navigate to Project Directory

```bash
cd d:/projects/FYF/sweet-connection/finance-guardian
```

## Step 4: Deploy Database (Choose One)

### Windows (PowerShell)
```powershell
.\supabase\deploy.ps1
```

### Linux/Mac (Bash)
```bash
chmod +x supabase/deploy.sh
./supabase/deploy.sh
```

### Manual (Alternative)
```bash
# Link to project
supabase link --project-ref vtocrplsbciduitbkmko

# Push migrations
supabase db push
```

## Step 5: Regenerate TypeScript Types

```bash
supabase gen types typescript --project-id vtocrplsbciduitbkmko > src/integrations/supabase/types.ts
```

## Step 6: Setup Environment Variables

```bash
# Copy example file
cp .env.example .env.local

# Edit .env.local and add your keys
# Get keys from: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/settings/api
```

## Step 7: Start Development Server

```bash
npm run dev
```

## 🧪 Test Database Connection

Open browser console and run:

```javascript
import { supabase } from './src/integrations/supabase/client';

const { data, error } = await supabase.from('profiles').select('count');
console.log('Database connected:', !error);
```

## 📋 Useful Commands

### Check Migration Status
```bash
supabase db diff
```

### View Database Tables
```bash
supabase db ls
```

### Reset Database (DANGEROUS - Deletes all data!)
```bash
supabase db reset
```

### Create New Migration
```bash
supabase migration new my_new_migration
```

### View Logs
```bash
supabase functions logs
```

## 🔗 Quick Links

- **Dashboard**: https://vtocrplsbciduitbkmko.supabase.co
- **API Settings**: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/settings/api
- **SQL Editor**: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/sql
- **Table Editor**: https://vtocrplsbciduitbkmko.supabase.co/project/vtocrplsbciduitbkmko/editor

## 📚 Documentation Quick Links

- [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) - Full deployment guide
- [DATABASE_GUIDE.md](DATABASE_GUIDE.md) - Code examples
- [DATABASE_SCHEMA_VISUAL.md](DATABASE_SCHEMA_VISUAL.md) - Visual guide
- [DB_SETUP_COMPLETE.md](DB_SETUP_COMPLETE.md) - Complete summary

---

**Need Help?** Check [TYPESCRIPT_ERRORS.md](TYPESCRIPT_ERRORS.md) if you see type errors!
