# ✅ FINAL DEPLOYMENT CHECKLIST

## 📋 Before You Start

- [ ] You have Supabase project access
- [ ] You have OpenRouter API key: `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`
- [ ] Terminal open at: `d:\projects\FYF\finance-guardian`
- [ ] Node.js and npm installed
- [ ] Supabase CLI installed (`npm install -g supabase`)

---

## 🔧 SETUP STEPS

### Step 1: Add API Key to Supabase
**Time: 2 minutes**

```
CHECKLIST:
☐ Open https://supabase.com/dashboard
☐ Select project: vtocrplsbciduitbkmko
☐ Click Settings (gear icon, bottom left)
☐ Click Secrets tab
☐ Click "New Secret"
☐ Name: OPENROUTER_API_KEY
☐ Value: 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
☐ Click Save
☐ Verify secret appears in list
```

**VERIFY:**
```
Go to Settings → Secrets
Should see: OPENROUTER_API_KEY (with ••• for value)
```

---

### Step 2: Deploy Backend Function
**Time: 3 minutes**

```powershell
# In PowerShell/Terminal:
cd d:\projects\FYF\finance-guardian
npx supabase functions deploy ai-coach
```

**VERIFY:**
```
Expected output:
"✓ Successfully deployed function 'ai-coach'"

If error about authentication:
  - Run: supabase login
  - Then retry deploy
```

**CHECKLIST:**
```
☐ Command executed without errors
☐ See success message
☐ Function deployed
```

---

### Step 3: Build Frontend
**Time: 2 minutes**

```powershell
npm run build
```

**VERIFY:**
```
Expected output:
"✓ built in X.Xs"
No TypeScript errors

If errors:
  - Run: npm install
  - Then: npm run build
```

**CHECKLIST:**
```
☐ Build completes successfully
☐ No red error messages
☐ Output shows "✓ built in..."
```

---

### Step 4: Start Development Server
**Time: 1 minute**

```powershell
npm run dev
```

**VERIFY:**
```
Expected output shows:
"VITE v5.x.x ready in XXXms"
"➜  Local:   http://localhost:5173/"

Keep this terminal open!
```

**CHECKLIST:**
```
☐ Server started
☐ See "ready in" message
☐ Port 5173 showing
```

---

## 🧪 TESTING STEPS

### Test 1: Chatbot Responds
**Time: 2 minutes**

```
STEPS:
☐ Open browser: http://localhost:5173/
☐ Wait for app to load (see dashboard)
☐ Click chatbot icon 💬 (bottom right)
☐ Wait for chat window to open
☐ Type: "How can I save more money?"
☐ Click Send or press Enter
☐ Wait 2 seconds for response
```

**VERIFY:**
```
✅ Chat window opens
✅ Message sends successfully
✅ Bot responds within 2 seconds
✅ Response is financial advice (not generic)
✅ No red errors in console (F12)
```

**CHECKLIST:**
```
☐ Chatbot responds
☐ Response is relevant
☐ Response time <2 seconds
☐ No console errors
```

---

### Test 2: Database Storage - Conversations
**Time: 2 minutes**

```
STEPS:
☐ Open Supabase Dashboard in new tab
☐ Go to Table Editor
☐ Click table: "chat_conversations"
☐ Should see rows below
```

**VERIFY:**
```
Should see at least 1 row with:
- id: some UUID
- user_id: your user ID (should match login)
- title: "AI Coach Chat"
- created_at: recent time (within last minute)
- last_updated: recent time
```

**CHECKLIST:**
```
☐ Table not empty
☐ Has 1+ rows
☐ Title is "AI Coach Chat"
☐ Times are recent
☐ user_id present
```

---

### Test 3: Database Storage - Messages
**Time: 2 minutes**

```
STEPS:
☐ In Supabase Table Editor
☐ Click table: "chat_messages"
☐ Should see rows
```

**VERIFY:**
```
Should see 2 rows (your message + bot response):

Row 1:
- role: "user"
- content: "How can I save more money?"
- conversation_id: matches above

Row 2:
- role: "assistant"
- content: bot's response
- conversation_id: matches above
```

**CHECKLIST:**
```
☐ Table has 2+ rows
☐ One row with role="user"
☐ One row with role="assistant"
☐ Same conversation_id for both
☐ Content matches
☐ Timestamps present
```

---

### Test 4: Send Multiple Messages
**Time: 3 minutes**

```
STEPS:
☐ Go back to chatbot window
☐ Send: "What's an emergency fund?"
☐ Wait for response
☐ Send: "How much should I have?"
☐ Wait for response
☐ Go back to Supabase chat_messages table
☐ Refresh browser (F5)
```

**VERIFY:**
```
chat_messages should now have 6 rows:
- Row 1: user message 1
- Row 2: assistant response 1
- Row 3: user message 2
- Row 4: assistant response 2
- Row 5: user message 3
- Row 6: assistant response 3

All with same conversation_id
```

**CHECKLIST:**
```
☐ Multiple messages appear in table
☐ Message count increases
☐ All linked to same conversation
☐ All have timestamps
```

---

### Test 5: Persistence After Refresh
**Time: 2 minutes**

```
STEPS:
☐ In chatbot window, press F5 (refresh page)
☐ Wait for page to reload
☐ Wait 5 seconds
☐ Look at chatbot - messages still there?
```

**VERIFY:**
```
✅ Chat still open
✅ All previous messages visible
✅ Can continue conversation
✅ No "chat cleared" message
```

**CHECKLIST:**
```
☐ Messages persist after refresh
☐ Can see conversation history
☐ Can continue chatting
☐ Conversation ID same
```

---

## ✨ SUCCESS CRITERIA

You're done when ALL boxes are checked:

```
API SETUP
☐ API key added to Supabase secrets
☐ Named exactly: OPENROUTER_API_KEY

DEPLOYMENT
☐ Function deployed successfully
☐ App builds without errors
☐ Dev server running

CHATBOT
☐ Responds to messages
☐ Responds in <2 seconds
☐ Provides relevant financial advice
☐ No console errors (F12)

DATABASE
☐ chat_conversations table populated
☐ chat_messages table has data
☐ Messages show correct role (user/assistant)
☐ All messages link to same conversation
☐ Timestamps are recent

PERSISTENCE
☐ Messages remain after page refresh
☐ Can continue conversation
☐ Full chat history visible

QUALITY
☐ Response quality good
☐ Response speed fast (1-2 sec)
☐ No errors or crashes
☐ All features working
```

---

## 🆘 TROUBLESHOOTING

### Problem: "API key not found"
**Symptom:** Function returns error about OPENROUTER_API_KEY

**Fix:**
1. Go to Supabase → Settings → Secrets
2. Check secret name is EXACTLY: `OPENROUTER_API_KEY`
3. Check value starts with: `sk-or-v1-`
4. Run: `npx supabase functions deploy ai-coach`

---

### Problem: "Messages not storing"
**Symptom:** Chatbot works but database is empty

**Fix:**
1. Check user is logged in (see email top-right)
2. Wait 3+ seconds after sending (auto-sync delay)
3. Check browser console (F12) for errors
4. Refresh Supabase table view

---

### Problem: "Build failed"
**Symptom:** `npm run build` shows errors

**Fix:**
```powershell
npm install
npm run build
```

---

### Problem: "Dev server won't start"
**Symptom:** `npm run dev` shows errors

**Fix:**
```powershell
npm install
npm run dev
```

---

### Problem: "Response is slow"
**Symptom:** Chatbot takes 5+ seconds to respond

**Possible Causes:**
- OpenRouter is busy (temporary)
- Network latency
- First request (cold start)

**Fix:**
- Try again in 10 seconds
- Check internet connection
- Restart dev server

---

## 📊 AFTER DEPLOYMENT

Once all tests pass:

1. **Monitor API Usage**
   - Go to: https://openrouter.ai/account/usage
   - Track token usage and costs

2. **Monitor Database**
   - Check Supabase → Table Editor regularly
   - Verify data is being stored

3. **Test with Real Users**
   - Get feedback on response quality
   - Monitor error rates
   - Track response times

4. **Set Up Alerts** (Optional)
   - OpenRouter: Set spending limit
   - Supabase: Monitor storage growth

---

## 📝 FINAL VERIFICATION

Before declaring success, verify:

```
File Changes:
☐ supabase/functions/ai-coach/index.ts updated
☐ src/components/chat/AIChatbot.tsx updated

API Configuration:
☐ OPENROUTER_API_KEY in Supabase
☐ Model set to mistralai/mistral-7b-instruct
☐ Endpoint set to openrouter.ai/api/v1

Database:
☐ chat_conversations table working
☐ chat_messages table working
☐ Data persisting correctly

App:
☐ Builds successfully
☐ Dev server running
☐ Chatbot functional
☐ Responses appear
☐ Data stores in DB
☐ Persistence works
```

---

## 🎉 COMPLETION CHECKLIST

**Before final sign-off, complete all:**

- [ ] All setup steps completed
- [ ] All tests passed
- [ ] No outstanding errors
- [ ] Database working correctly
- [ ] Documentation reviewed
- [ ] Ready for production deployment

---

## 📞 QUICK REFERENCE

**Commands:**
```powershell
# Deploy function
npx supabase functions deploy ai-coach

# Build app
npm run build

# Start dev server
npm run dev

# Install dependencies
npm install
```

**URLs:**
```
App: http://localhost:5173/
Supabase: https://supabase.com/dashboard
OpenRouter: https://openrouter.ai/account/usage
```

**API Key:** `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`

---

**READY TO DEPLOY?** 🚀

Follow the steps above in order. Take 15 minutes total.

**Good luck!** ✨
