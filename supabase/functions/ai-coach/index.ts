import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Finance-related keywords and topics
const financeKeywords = [
  'money', 'finance', 'budget', 'saving', 'expense', 'income', 'debt', 'loan', 'emi',
  'investment', 'stock', 'mutual fund', 'insurance', 'tax', 'salary', 'spending',
  'credit', 'debit', 'bank', 'account', 'transaction', 'payment', 'bill', 'rent',
  'mortgage', 'interest', 'compound', 'emergency fund', 'retirement', 'pension',
  'portfolio', 'asset', 'liability', 'net worth', 'cash flow', 'profit', 'loss',
  'inflation', 'recession', 'economy', 'financial', 'wealth', 'poor', 'rich',
  'afford', 'cost', 'price', 'expensive', 'cheap', 'rupee', 'rupees', '₹', 'rs',
  'dollar', 'euros', 'currency', 'exchange', 'crypto', 'bitcoin', 'trading',
  'stress', 'anxiety', 'worried', 'panic', 'fear', 'help', 'struggling',
  'goal', 'target', 'plan', 'strategy', 'advice', 'tip', 'suggestion',
  'subscription', 'cancel', 'refund', 'discount', 'offer', 'sale',
  'impulse', 'shopping', 'buy', 'purchase', 'spend', 'waste',
  'save', 'cut', 'reduce', 'increase', 'grow', 'multiply',
  'monthly', 'weekly', 'daily', 'annual', 'yearly', 'quarterly',
  'percentage', 'ratio', 'score', 'rate', 'apr', 'apy',
  'hi', 'hello', 'hey', 'good', 'morning', 'evening', 'thanks', 'thank'
];

function isFinanceRelated(message: string): boolean {
  const lowerMessage = message.toLowerCase();
  
  // Check for finance keywords
  const hasFinanceKeyword = financeKeywords.some(keyword => 
    lowerMessage.includes(keyword.toLowerCase())
  );
  
  // Also allow greetings and common conversational starters
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good evening', 'thanks', 'thank you', 'help'];
  const isGreeting = greetings.some(g => lowerMessage.startsWith(g) || lowerMessage === g);
  
  // Allow questions that might be finance-related
  const questionWords = ['how', 'what', 'why', 'when', 'where', 'can', 'should', 'would', 'is', 'are', 'do'];
  const isQuestion = questionWords.some(q => lowerMessage.startsWith(q));
  
  return hasFinanceKeyword || isGreeting || isQuestion;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile, analysis } = await req.json();
    const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");
    
    if (!OPENROUTER_API_KEY) {
      throw new Error("OPENROUTER_API_KEY is not configured");
    }

    // Get the last user message
    const lastUserMessage = messages.filter((m: any) => m.role === 'user').pop()?.content || '';
    
    // Check if the message is finance-related
    if (!isFinanceRelated(lastUserMessage)) {
      // Return a polite rejection for non-finance topics
      const rejectResponse = `I appreciate your question, but I'm specifically designed to help with **financial wellness and money management** topics. 

I can help you with:
💰 **Budget Planning** - Creating and managing your budget
📊 **Spending Analysis** - Understanding your spending patterns
🎯 **Financial Goals** - Setting and achieving savings targets
😰 **Financial Stress** - Managing money-related anxiety
💳 **Debt Management** - Strategies to reduce debt
🏦 **Emergency Funds** - Building financial safety nets
📈 **Investment Basics** - Understanding where to grow your money
🔄 **Subscription Management** - Optimizing recurring expenses

Please ask me something related to your finances, and I'll be happy to help! 🙂`;

      // Return as a streaming response format
      const encoder = new TextEncoder();
      const stream = new ReadableStream({
        start(controller) {
          const data = JSON.stringify({
            choices: [{
              delta: { content: rejectResponse },
              finish_reason: null
            }]
          });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        }
      });

      return new Response(stream, {
        headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
      });
    }

    const systemPrompt = `You are a supportive, empathetic AI financial wellness coach for "Future Your Finance" app. Your role is to help users understand their financial situation and provide actionable, non-judgmental advice.

**IMPORTANT RULES:**
1. ONLY discuss topics related to personal finance, money management, budgeting, saving, investing, and financial wellness
2. If a user asks about non-financial topics, politely redirect them to financial topics
3. Use "No Shame Mode" - NEVER judge users for their financial situation
4. Always be encouraging and supportive
5. Provide specific, actionable advice based on their profile
6. Use ₹ for currency (Indian Rupees)
7. Keep responses concise but warm and helpful
8. Include emojis to make responses friendly
9. When giving numbers, be specific based on their actual data
10. Structure responses clearly with bullet points or numbered lists when helpful

USER'S FINANCIAL PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || 'Not specified'}
- Income Type: ${userProfile?.incomeType || 'Not specified'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'None specified'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '0'}
- Spending Style: ${userProfile?.spendingStyle || 'Not specified'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Not specified'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Not specified'}
- Emergency Readiness: ${userProfile?.emergencyReadiness || 'Not specified'}
- Top Impulse Category: ${userProfile?.topImpulseCategory || 'Not specified'}
- Life Situation: ${userProfile?.lifeSituation || 'Stable'}

FINANCIAL ANALYSIS:
- Stress Score: ${analysis?.stressScore || 0}/100 (${analysis?.riskLevel || 'unknown'})
- Silent Burden Index: ${analysis?.silentBurdenIndex || 0}% of income goes to fixed expenses
- Survival Days: ${analysis?.survivalDays || 0} days at current spending rate
- Debt Risk: ${analysis?.debtRisk || 0}%
- Daily Budget: ₹${analysis?.dailyBudget?.toLocaleString() || '0'}
- Weekly Budget: ₹${analysis?.weeklyBudget?.toLocaleString() || '0'}
- Emergency Fund Target: ₹${analysis?.emergencyFundTarget?.toLocaleString() || '0'}
- Health Score: ${analysis?.healthScore || 0}/100

ACTIVE STRESS SIGNALS:
${analysis?.activeSignals?.map((s: any) => `- ${s.severity.toUpperCase()}: ${s.title} - ${s.description}`).join('\n') || 'None detected'}

TOP RECOMMENDATIONS:
${analysis?.recommendations?.map((r: any) => `- [${r.priority}] ${r.title}: ${r.action}`).join('\n') || 'None yet'}

RESPONSE GUIDELINES:
1. Acknowledge the user's feelings first
2. Provide context using their actual financial data
3. Give 2-3 specific, actionable steps
4. End with encouragement or a follow-up question
5. If they're in crisis mode (stress > 70), prioritize essential expense protection`;

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "mistralai/mistral-7b-instruct",
        messages: [
          { role: "system", content: systemPrompt },
          ...messages,
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "Usage limit reached. Please try again later." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI service temporarily unavailable" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("AI coach error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});