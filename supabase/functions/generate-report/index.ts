import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ReportData {
  type: 'monthly' | 'analysis' | 'stress' | 'budget';
  userProfile: any;
  dateRange?: {
    start: string;
    end: string;
  };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, userProfile, dateRange }: ReportData = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log(`Generating ${type} report`);

    const currentDate = new Date().toISOString().split('T')[0];
    const startDate = dateRange?.start || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const endDate = dateRange?.end || currentDate;

    // Build report prompt based on type
    let reportPrompt = '';
    
    switch (type) {
      case 'monthly':
        reportPrompt = `Generate a comprehensive Monthly Financial Summary report in Markdown format.

USER PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || '₹30,000-50,000'}
- Income Type: ${userProfile?.incomeType || 'Salaried'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'Rent, Utilities'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '15,000'}
- Spending Style: ${userProfile?.spendingStyle || 'Balanced'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Executive Summary
2. Income Overview (estimated based on profile)
3. Expense Breakdown by Category
4. Savings Analysis
5. Key Financial Metrics
6. Month-over-Month Comparison
7. Recommendations for Next Month

Use ₹ for currency. Format with proper headers, tables, and bullet points.`;
        break;

      case 'analysis':
        reportPrompt = `Generate a detailed Spending Analysis Report in Markdown format.

USER PROFILE:
- Spending Style: ${userProfile?.spendingStyle || 'Balanced'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Stress/Boredom'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Anxious'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Spending Overview
2. Category-wise Breakdown (with percentages)
3. Spending Trends (daily, weekly patterns)
4. Top Spending Categories
5. Unusual Spending Patterns Detected
6. Comparison with Recommended Budgets
7. Areas for Improvement
8. Actionable Recommendations

Use ₹ for currency. Include visual indicators like 🔴🟡🟢 for status.`;
        break;

      case 'stress':
        reportPrompt = `Generate a Financial Stress Detection Report in Markdown format.

USER PROFILE:
- Emergency Readiness: ${userProfile?.emergencyReadiness || 'Less than 1 month'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Anxious'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Stress/Boredom'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Current Stress Score Analysis (0-100)
2. Active Stress Signals Detected
3. Stress Pattern Analysis
4. Root Causes Identified
5. Impact on Financial Health
6. Coping Strategies Observed
7. Recovery Recommendations
8. 30-Day Action Plan

Use empathetic language. Focus on solutions, not problems.`;
        break;

      case 'budget':
        reportPrompt = `Generate a Budget Performance Report in Markdown format.

USER PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || '₹30,000-50,000'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'Rent, Utilities'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '15,000'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Budget Overview
2. Category Performance (actual vs budget)
3. Budget Adherence Score
4. Over-budget Categories
5. Under-budget Categories
6. Savings Goal Progress
7. Budget Efficiency Metrics
8. Next Month Budget Recommendations

Use ₹ for currency. Include progress bars with emojis.`;
        break;

      default:
        throw new Error(`Unknown report type: ${type}`);
    }

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { 
            role: "system", 
            content: "You are a professional financial analyst generating detailed, actionable financial reports. Use clear formatting, include specific numbers, and provide practical recommendations." 
          },
          { role: "user", content: reportPrompt },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    const reportContent = data.choices?.[0]?.message?.content;

    if (!reportContent) {
      throw new Error("No report content generated");
    }

    // Generate report metadata
    const reportMetadata = {
      id: crypto.randomUUID(),
      type,
      generatedAt: new Date().toISOString(),
      period: { start: startDate, end: endDate },
      title: getReportTitle(type),
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        report: {
          ...reportMetadata,
          content: reportContent,
        }
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("Report generation error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function getReportTitle(type: string): string {
  switch (type) {
    case 'monthly': return 'Monthly Financial Summary';
    case 'analysis': return 'Spending Analysis Report';
    case 'stress': return 'Stress Detection Report';
    case 'budget': return 'Budget Performance Report';
    default: return 'Financial Report';
  }
}
