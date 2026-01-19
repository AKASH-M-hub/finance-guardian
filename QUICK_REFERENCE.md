# ⚡ QUICK REFERENCE - COMMANDS & SETUP

## 🔧 SETUP COMMANDS

```powershell
# Navigate to project
cd d:\projects\FYF\finance-guardian

# Install dependencies (if needed)
npm install

# Deploy backend function
npx supabase functions deploy ai-coach

# Build frontend
npm run build

# Start development server
npm run dev

# View in browser
# Then open: http://localhost:5173/
```

---

## 🌐 IMPORTANT URLS

| Purpose | URL |
|---------|-----|
| App | http://localhost:5173/ |
| Supabase Dashboard | https://supabase.com/dashboard |
| Supabase Project | https://supabase.com/dashboard/project/vtocrplsbciduitbkmko |
| OpenRouter Account | https://openrouter.ai/account/usage |
| OpenRouter Status | https://status.openrouter.ai/ |

---

## 🔑 API CREDENTIALS

### OpenRouter API Key
```
OPENROUTER_API_KEY = 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
```

### Storage Location
```
Supabase Dashboard
  → Project Settings (gear icon)
  → Secrets tab
  → Add as: OPENROUTER_API_KEY
```

---

## 🎯 DEPLOYMENT CHECKLIST

```
STEP 1: Add API Key
  [ ] Open Supabase Dashboard
  [ ] Go to Settings → Secrets
  [ ] Add OPENROUTER_API_KEY
  [ ] Verify it appears in list

STEP 2: Deploy Function
  [ ] Run: npx supabase functions deploy ai-coach
  [ ] See success message
  [ ] Check no errors

STEP 3: Build App
  [ ] Run: npm run build
  [ ] See "✓ built in X.Xs"
  [ ] No TypeScript errors

STEP 4: Start Server
  [ ] Run: npm run dev
  [ ] See "ready in XXms"
  [ ] Server listening on 5173

STEP 5: Test
  [ ] Open http://localhost:5173/
  [ ] Click chatbot
  [ ] Send message
  [ ] Get response in <2s
  [ ] Check database
```

---

## 🧪 TESTING COMMANDS

```powershell
# Check if function deployed
curl https://[supabase-url]/functions/v1/ai-coach

# Check logs (in Supabase Dashboard)
# → Edge Functions → ai-coach → Logs

# Test database query (in Supabase SQL Editor)
SELECT * FROM chat_conversations LIMIT 5;
SELECT * FROM chat_messages LIMIT 5;
```

---

## 📊 DATABASE QUERIES

### Check Conversations
```sql
SELECT 
  id,
  user_id,
  title,
  created_at,
  last_updated
FROM chat_conversations
LIMIT 10;
```

### Check Messages
```sql
SELECT 
  id,
  conversation_id,
  user_id,
  role,
  content,
  created_at
FROM chat_messages
LIMIT 10;
```

### Count Messages by Role
```sql
SELECT 
  role,
  COUNT(*) as count
FROM chat_messages
GROUP BY role;
```

### Check User's Conversations
```sql
SELECT * FROM chat_conversations
WHERE user_id = 'your-user-id'
ORDER BY last_updated DESC;
```

---

## 🔍 TROUBLESHOOTING COMMANDS

```powershell
# Clear cache and rebuild
rm -r node_modules
npm install
npm run build

# Check Node version
node --version

# Check npm version
npm --version

# Kill process on port 5173 (if stuck)
# macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Windows PowerShell:
netstat -ano | findstr :5173
taskkill /PID [PID] /F

# View Supabase function logs
# In Supabase Dashboard:
# Edge Functions → ai-coach → Logs tab
```

---

## 📝 FILE LOCATIONS

```
Project Root: d:\projects\FYF\finance-guardian

Backend Function: 
  supabase/functions/ai-coach/index.ts

Frontend Component:
  src/components/chat/AIChatbot.tsx

Database Helpers:
  src/integrations/supabase/helpers.ts

Environment:
  Supabase Secrets (not local .env)

Build Output:
  dist/ (after npm run build)
```

---

## 🚨 ERROR SOLUTIONS

### Build Fails
```powershell
npm install
npm run build
```

### Function Deploy Fails
```powershell
supabase login
npx supabase functions deploy ai-coach
```

### Port Already in Use
```powershell
# Windows - Kill process on 5173
Get-Process -Id (Get-NetTCPConnection -LocalPort 5173 -ErrorAction Ignore).OwningProcess -ErrorAction Ignore | Stop-Process -Force
npm run dev
```

### API Key Not Found
1. Go to Supabase → Settings → Secrets
2. Verify name: `OPENROUTER_API_KEY`
3. Check value starts: `sk-or-v1-`
4. Redeploy: `npx supabase functions deploy ai-coach`

### Messages Not Saving
1. Wait 3+ seconds (debounce delay)
2. Check user logged in
3. Check browser console (F12)
4. Check RLS policies in Supabase

---

## 📈 MONITORING

### Check OpenRouter Usage
```
Visit: https://openrouter.ai/account/usage
```

### View Supabase Function Logs
```
Supabase Dashboard
  → Edge Functions (left sidebar)
  → ai-coach
  → Logs tab
```

### Check Database Storage
```
Supabase Dashboard
  → Table Editor
  → Click chat_conversations
  → Click chat_messages
```

---

## 🔄 COMMON WORKFLOWS

### Deploy New Changes
```powershell
# Code changes
code supabase/functions/ai-coach/index.ts

# Test locally
npm run build
npm run dev

# Deploy
npx supabase functions deploy ai-coach
```

### Debug Chat Issue
```powershell
# 1. Check browser console (F12)
# 2. Check Supabase logs
# 3. Check database (Table Editor)
# 4. Check API key in secrets
# 5. Restart server: npm run dev
```

### Monitor Costs
```
1. Visit: https://openrouter.ai/account/usage
2. Check: $ spent this month
3. Set alert if needed
4. Review token usage
```

---

## 💡 QUICK TIPS

- **Dev Server Hot Reload:** Changes auto-reload (save file)
- **Database Changes:** Refresh table editor to see updates
- **API Testing:** Use browser DevTools (F12) → Network tab
- **Error Tracking:** Check both browser console AND Supabase logs
- **Performance:** First request is slow (cold start), then fast

---

## 📞 QUICK HELP

### Chatbot Not Responding?
1. Check API key in Supabase
2. Check function deployed
3. Check browser console (F12)
4. Restart server

### Messages Not Storing?
1. Wait 3+ seconds
2. Check user logged in
3. Check table in Supabase
4. Check console errors

### Build Error?
1. npm install
2. npm run build
3. Check TypeScript

---

## 🎯 IMPORTANT REMEMBER

- **API Key:** Stored in Supabase Secrets, NOT in code
- **Debounce:** Messages sync after 3 seconds
- **Database:** Automatic creation, no manual setup needed
- **Persistence:** Messages stay even after refresh
- **Cost:** Monitor OpenRouter usage monthly

---

## ✅ FINAL VERIFICATION

After deployment, verify these work:

```
☐ npx supabase functions deploy ai-coach → Success
☐ npm run build → No errors
☐ npm run dev → Server running
☐ http://localhost:5173 → App loads
☐ Chatbot responds to message
☐ Messages appear in database
☐ F12 console → No red errors
```

---

## 📚 DOCUMENTATION MAP

```
START HERE:
└── FINAL_DEPLOYMENT_CHECKLIST.md

THEN READ:
├── ACTION_PLAN.md
├── CHATBOT_MIGRATION_GUIDE.md
├── DEPLOYMENT_READY.md
└── VISUAL_SUMMARY_CHATBOT.md

REFERENCE:
├── QUICK_REFERENCE.md (this file)
├── MIGRATION_COMPLETE.md
└── README_CHATBOT_MIGRATION.md
```

---

**All set! Follow the deployment checklist to get started.** 🚀
