import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages, userProfile, analysis } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = `You are a supportive, empathetic AI financial wellness coach for "Future Your Finance" app. Your role is to help users understand their financial situation and provide actionable, non-judgmental advice.

USER'S FINANCIAL PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || 'Not specified'}
- Income Type: ${userProfile?.incomeType || 'Not specified'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'None specified'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '0'}
- Spending Style: ${userProfile?.spendingStyle || 'Not specified'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Not specified'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Not specified'}
- Emergency Readiness: ${userProfile?.emergencyReadiness || 'Not specified'}

FINANCIAL ANALYSIS:
- Stress Score: ${analysis?.stressScore || 0}/100 (${analysis?.riskLevel || 'unknown'})
- Silent Burden Index: ${analysis?.silentBurdenIndex || 0}% of income is fixed
- Survival Days: ${analysis?.survivalDays || 0} days at current rate
- Debt Risk: ${analysis?.debtRisk || 0}%
- Daily Budget: ₹${analysis?.dailyBudget?.toLocaleString() || '0'}
- Emergency Fund Target: ₹${analysis?.emergencyFundTarget?.toLocaleString() || '0'}

ACTIVE STRESS SIGNALS:
${analysis?.activeSignals?.map((s: any) => `- ${s.severity.toUpperCase()}: ${s.title} - ${s.description}`).join('\n') || 'None'}

GUIDELINES:
1. Use "No Shame Mode" - be supportive, never judgmental
2. Explain WHY things are happening in simple terms
3. Give specific, actionable advice based on their actual numbers
4. Break big goals into small, achievable steps
5. Acknowledge emotions around money
6. Use ₹ for currency
7. Keep responses concise but warm
8. If in crisis mode, prioritize essential expense protection
9. Celebrate small wins and progress`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
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
