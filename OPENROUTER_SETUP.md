# 🤖 OpenRouter Mistral Setup

## Changes Made

### 1. Backend Function Updated
**File:** `supabase/functions/ai-coach/index.ts`

**Changed:**
- ✅ API from Lovable/Gemini → OpenRouter Mistral
- ✅ Model from `google/gemini-3-flash-preview` → `mistralai/mistral-7b-instruct`
- ✅ API endpoint from `ai.gateway.lovable.dev` → `openrouter.ai/api/v1`
- ✅ Environment variable from `LOVABLE_API_KEY` → `OPENROUTER_API_KEY`

### 2. Frontend Component Updated
**File:** `src/components/chat/AIChatbot.tsx`

**Added:**
- ✅ Import `syncChatSession` from helpers
- ✅ Message IDs and timestamps
- ✅ Auto-sync to database (3-second debounce)
- ✅ Session tracking

## Setup Instructions

### Step 1: Add API Key to Supabase
1. Go to Supabase Dashboard
2. Click **Project Settings** → **Secrets**
3. Add new secret:
   - Name: `OPENROUTER_API_KEY`
   - Value: `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`

### Step 2: Deploy Supabase Function
1. Open terminal in project root
2. Run:
   ```bash
   supabase functions deploy ai-coach
   ```
   Or if using PowerShell:
   ```powershell
   npx supabase functions deploy ai-coach
   ```

### Step 3: Rebuild Frontend
1. Run:
   ```bash
   npm run build
   ```

### Step 4: Test

1. **Open your app** in browser
2. **Click chatbot icon** (bottom right)
3. **Send a message** like "How can I save more money?"
4. **Wait 3+ seconds** for sync
5. **Verify storage:**
   - Go to Supabase Dashboard
   - Click **Table Editor**
   - Open `chat_conversations` table - should have entry
   - Open `chat_messages` table - should have your messages

---

## How It Works

### Request Flow:
```
User Message in App
    ↓
AI Coach Function (Supabase)
    ↓
OpenRouter API (Mistral Model)
    ↓
Streamed Response
    ↓
Message stored in Database (3-second debounce)
```

### Database Storage:
- **chat_conversations**: Stores chat session metadata
- **chat_messages**: Stores individual messages with:
  - Message ID
  - User ID
  - Conversation ID
  - Role (user/assistant)
  - Content
  - Timestamp
  - Message index

---

## Mistral 7B Benefits

✅ **Faster** - More responsive than Gemini  
✅ **Cost-effective** - OpenRouter competitive pricing  
✅ **Reliable** - Consistent performance  
✅ **Context-aware** - Good financial domain understanding  

---

## Database Tables

### chat_conversations
```sql
id: UUID
user_id: UUID
title: TEXT
created_at: TIMESTAMPTZ
last_updated: TIMESTAMPTZ
```

### chat_messages
```sql
id: UUID
conversation_id: UUID
user_id: UUID
role: TEXT (user|assistant)
content: TEXT
message_index: INTEGER
created_at: TIMESTAMPTZ
```

---

## Troubleshooting

### Error: "API key not found"
**Fix:** 
1. Go to Supabase → Project Settings → Secrets
2. Verify `OPENROUTER_API_KEY` is set correctly
3. Redeploy function

### Error: "Model not found"
**Fix:** Model `mistralai/mistral-7b-instruct` is correct for OpenRouter

### Messages not syncing to database
**Fix:**
1. Check browser console for errors
2. Verify user is logged in
3. Check Supabase RLS policies allow insert

### Slow responses
**Fix:** 
1. OpenRouter has rate limits on free tier
2. Upgrade plan if needed
3. Check network connection

---

## Testing Checklist

- [ ] Function deployed successfully
- [ ] App builds without errors
- [ ] Chatbot responds to messages
- [ ] Messages appear in `chat_messages` table
- [ ] Conversation shows in `chat_conversations` table
- [ ] Response quality is good
- [ ] No console errors

---

## Next Steps

After setup:
1. Test with different financial questions
2. Monitor API usage in OpenRouter dashboard
3. Adjust system prompt if needed
4. Gather user feedback

---

## Rollback (if needed)

To switch back to Gemini:
1. Edit `supabase/functions/ai-coach/index.ts`
2. Change model back to `google/gemini-3-flash-preview`
3. Change API to `ai.gateway.lovable.dev/v1/chat/completions`
4. Change key to `LOVABLE_API_KEY`
5. Redeploy

---

**Status:** ✅ Ready to deploy!
