# 🔧 Fix: Add Email Storage to Supabase Database

## Problem
The migration file exists locally but hasn't been run on your Supabase database. The `user_registrations` table and email column don't exist yet.

## ✅ Solution: Run SQL Directly in Supabase

### Step 1: Open Supabase SQL Editor
1. Go to your Supabase Dashboard: https://supabase.com/dashboard
2. Select your project: `vtocrplsbciduitbkmko`
3. Click **SQL Editor** in the left sidebar

### Step 2: Run the SQL Script
1. Click **"New query"**
2. Copy ALL the SQL from file: `RUN_IN_SUPABASE.sql`
3. Paste into the SQL Editor
4. Click **"Run"** button (or press Ctrl+Enter)

### Step 3: Verify Tables Created
1. Go to **Table Editor** in left sidebar
2. You should now see:
   - ✅ `profiles` table - with new `email` column
   - ✅ `user_registrations` table - NEW table

### Step 4: Check Data
```sql
-- Run this to verify:
SELECT * FROM profiles LIMIT 5;
-- Should show email column now

SELECT * FROM user_registrations;
-- New table should exist (empty for now)
```

---

## 🎯 What the SQL Does

### 1. Adds Email Column
```sql
ALTER TABLE profiles ADD COLUMN email TEXT;
```
- Adds email to existing profiles table
- Populates from auth.users for existing users

### 2. Creates user_registrations Table
- Stores: email, registration date, source, IP, user agent
- RLS policies enabled for security
- Indexes for performance

### 3. Auto-Population Trigger
- Automatically fills email when new profile created
- Gets email from Supabase Auth

---

## 🧪 Test After Running SQL

### Test 1: Check Profiles Table
In Supabase Table Editor:
1. Click `profiles` table
2. Scroll right - you should see `email` column
3. Existing users should have emails populated

### Test 2: Check New Table
In Supabase Table Editor:
1. Look for `user_registrations` in table list
2. Click it - should exist (empty initially)

### Test 3: Test New User Registration
1. Create a new test user in your app
2. Check `profiles` table - should have email
3. Check `user_registrations` - should have entry

---

## 🔴 If SQL Fails

### Error: "relation already exists"
**Solution:** Table already created, skip that step

### Error: "column already exists"
**Solution:** Email column already added, skip that step

### Error: "permission denied"
**Solution:** Make sure you're logged in as project owner

### Error: "syntax error"
**Solution:** Copy the ENTIRE SQL file contents, don't modify

---

## ✅ Success Indicators

After running SQL, you should see:
- ✅ `Setup Complete!` message
- ✅ Count of profiles with emails
- ✅ No error messages

---

## 📊 Quick Verification Queries

```sql
-- Check email column exists
SELECT email FROM profiles LIMIT 1;

-- Check user_registrations table exists
SELECT * FROM user_registrations LIMIT 1;

-- Count users with emails
SELECT COUNT(*) FROM profiles WHERE email IS NOT NULL;
```

---

## 🚀 After SQL Runs Successfully

Your app will now:
1. ✅ Auto-capture emails on new user signup
2. ✅ Store in profiles table
3. ✅ Record in user_registrations table
4. ✅ No code changes needed in app

---

## 📝 File to Run

**File:** `RUN_IN_SUPABASE.sql` (in your project root)

**Contains:** 11 steps to set up email storage

**Time to run:** ~5 seconds

---

## ⚠️ Important

- Must run SQL in Supabase Dashboard (not locally)
- Must have project owner/admin access
- Cannot run via app - must use SQL Editor
- Safe to run multiple times (uses IF NOT EXISTS)

---

## 🆘 Need Help?

If SQL doesn't work:
1. Screenshot the error message
2. Check you're in correct project
3. Verify you have admin access
4. Try running steps one by one

---

## ✅ Summary

**What to do:** 
1. Open Supabase SQL Editor
2. Run `RUN_IN_SUPABASE.sql`
3. Verify tables appear

**Result:**
- Email column added to profiles
- user_registrations table created
- Emails will be captured automatically

**Status:** Ready to fix! 🔧
