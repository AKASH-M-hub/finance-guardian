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

// PDF generation using HTML to PDF conversion
function generatePDFContent(reportContent: string, title: string, period: { start: string; end: string }): string {
  // Convert markdown to structured HTML for PDF
  const htmlContent = markdownToHTML(reportContent);
  
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
  <style>
    @page {
      size: A4;
      margin: 2cm;
    }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #1a1a2e;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px;
      background: #ffffff;
    }
    .header {
      text-align: center;
      border-bottom: 3px solid #4f46e5;
      padding-bottom: 20px;
      margin-bottom: 30px;
    }
    .logo {
      font-size: 28px;
      font-weight: bold;
      color: #4f46e5;
      margin-bottom: 10px;
    }
    .report-title {
      font-size: 24px;
      color: #1a1a2e;
      margin: 10px 0;
    }
    .period {
      font-size: 14px;
      color: #6b7280;
      margin-top: 10px;
    }
    .generated-date {
      font-size: 12px;
      color: #9ca3af;
    }
    h1 {
      font-size: 22px;
      color: #4f46e5;
      border-bottom: 2px solid #e5e7eb;
      padding-bottom: 10px;
      margin-top: 30px;
    }
    h2 {
      font-size: 18px;
      color: #1a1a2e;
      margin-top: 25px;
      padding-left: 10px;
      border-left: 4px solid #4f46e5;
    }
    h3 {
      font-size: 16px;
      color: #374151;
      margin-top: 20px;
    }
    p {
      margin: 10px 0;
      text-align: justify;
    }
    ul, ol {
      margin: 15px 0;
      padding-left: 25px;
    }
    li {
      margin: 8px 0;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 20px 0;
      font-size: 14px;
    }
    th, td {
      border: 1px solid #e5e7eb;
      padding: 12px;
      text-align: left;
    }
    th {
      background: #f3f4f6;
      font-weight: 600;
      color: #374151;
    }
    tr:nth-child(even) {
      background: #f9fafb;
    }
    .status-safe { color: #10b981; font-weight: bold; }
    .status-warning { color: #f59e0b; font-weight: bold; }
    .status-danger { color: #ef4444; font-weight: bold; }
    .highlight-box {
      background: linear-gradient(135deg, #f0f9ff, #e0f2fe);
      border-left: 4px solid #4f46e5;
      padding: 15px;
      margin: 20px 0;
      border-radius: 0 8px 8px 0;
    }
    .metric-box {
      display: inline-block;
      background: #f3f4f6;
      padding: 15px 25px;
      margin: 10px;
      border-radius: 8px;
      text-align: center;
    }
    .metric-value {
      font-size: 28px;
      font-weight: bold;
      color: #4f46e5;
    }
    .metric-label {
      font-size: 12px;
      color: #6b7280;
      margin-top: 5px;
    }
    .footer {
      margin-top: 50px;
      padding-top: 20px;
      border-top: 2px solid #e5e7eb;
      text-align: center;
      font-size: 12px;
      color: #9ca3af;
    }
    .recommendation {
      background: #fef3c7;
      border-left: 4px solid #f59e0b;
      padding: 15px;
      margin: 15px 0;
      border-radius: 0 8px 8px 0;
    }
    .emoji { font-size: 18px; margin-right: 8px; }
    code {
      background: #f3f4f6;
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
    }
    strong { color: #1a1a2e; }
    .page-break { page-break-after: always; }
  </style>
</head>
<body>
  <div class="header">
    <div class="logo">💰 Future Your Finance</div>
    <div class="report-title">${title}</div>
    <div class="period">Report Period: ${period.start} to ${period.end}</div>
    <div class="generated-date">Generated: ${new Date().toLocaleDateString('en-IN', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}</div>
  </div>
  
  <div class="content">
    ${htmlContent}
  </div>
  
  <div class="footer">
    <p>© ${new Date().getFullYear()} Future Your Finance - AI-Powered Financial Wellness</p>
    <p>This report is generated based on your financial profile and is for personal use only.</p>
    <p>Disclaimer: This is not financial advice. Please consult a professional for financial decisions.</p>
  </div>
</body>
</html>`;
}

function markdownToHTML(markdown: string): string {
  let html = markdown;
  
  // Convert headers
  html = html.replace(/^### (.*$)/gim, '<h3>$1</h3>');
  html = html.replace(/^## (.*$)/gim, '<h2>$1</h2>');
  html = html.replace(/^# (.*$)/gim, '<h1>$1</h1>');
  
  // Convert bold
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  
  // Convert italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
  
  // Convert bullet points
  html = html.replace(/^\- (.*$)/gim, '<li>$1</li>');
  html = html.replace(/^\* (.*$)/gim, '<li>$1</li>');
  
  // Wrap consecutive li elements in ul
  html = html.replace(/(<li>.*<\/li>\n?)+/g, (match) => `<ul>${match}</ul>`);
  
  // Convert numbered lists
  html = html.replace(/^\d+\. (.*$)/gim, '<li>$1</li>');
  
  // Convert tables (basic)
  const tableRegex = /\|(.+)\|/gm;
  const tables = html.match(tableRegex);
  if (tables) {
    let tableHTML = '<table>';
    let isHeader = true;
    tables.forEach((row, index) => {
      if (row.includes('---')) {
        isHeader = false;
        return;
      }
      const cells = row.split('|').filter(cell => cell.trim());
      const tag = isHeader ? 'th' : 'td';
      tableHTML += '<tr>';
      cells.forEach(cell => {
        tableHTML += `<${tag}>${cell.trim()}</${tag}>`;
      });
      tableHTML += '</tr>';
      if (isHeader && index === 0) isHeader = false;
    });
    tableHTML += '</table>';
    html = html.replace(/(\|.+\|\n?)+/g, tableHTML);
  }
  
  // Convert line breaks
  html = html.replace(/\n\n/g, '</p><p>');
  html = html.replace(/\n/g, '<br>');
  
  // Wrap in paragraphs where needed
  html = '<p>' + html + '</p>';
  html = html.replace(/<p>(<h[123]>)/g, '$1');
  html = html.replace(/(<\/h[123]>)<\/p>/g, '$1');
  html = html.replace(/<p>(<ul>)/g, '$1');
  html = html.replace(/(<\/ul>)<\/p>/g, '$1');
  html = html.replace(/<p>(<table>)/g, '$1');
  html = html.replace(/(<\/table>)<\/p>/g, '$1');
  html = html.replace(/<p><\/p>/g, '');
  html = html.replace(/<p><br>/g, '<p>');
  
  // Handle emojis for status indicators
  html = html.replace(/🔴/g, '<span class="status-danger">●</span>');
  html = html.replace(/🟡/g, '<span class="status-warning">●</span>');
  html = html.replace(/🟢/g, '<span class="status-safe">●</span>');
  
  // Add highlight boxes for key sections
  html = html.replace(/<h2>Executive Summary<\/h2>/g, '<h2>Executive Summary</h2><div class="highlight-box">');
  html = html.replace(/<h2>Key Financial Metrics<\/h2>/g, '</div><h2>Key Financial Metrics</h2>');
  
  return html;
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
        reportPrompt = `Generate a comprehensive Monthly Financial Summary report.

USER PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || '₹30,000-50,000'}
- Income Type: ${userProfile?.incomeType || 'Salaried'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'Rent, Utilities'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '15,000'}
- Spending Style: ${userProfile?.spendingStyle || 'Balanced'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Executive Summary (brief overview with key metrics)
2. Income Overview (estimated based on profile)
3. Expense Breakdown by Category (with percentages)
4. Savings Analysis (actual vs target)
5. Key Financial Metrics (use tables for clarity)
6. Month-over-Month Comparison
7. Actionable Recommendations for Next Month

Use ₹ for currency. Use 🟢 for good, 🟡 for caution, 🔴 for alert status.
Format with proper headers and tables.`;
        break;

      case 'analysis':
        reportPrompt = `Generate a detailed Spending Analysis Report.

USER PROFILE:
- Spending Style: ${userProfile?.spendingStyle || 'Balanced'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Stress/Boredom'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Anxious'}
- Top Impulse Category: ${userProfile?.topImpulseCategory || 'Shopping'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Spending Overview (total spent with breakdown)
2. Category-wise Breakdown (with percentages, use table)
3. Spending Trends (daily, weekly patterns)
4. Top Spending Categories Analysis
5. Unusual Spending Patterns Detected
6. Comparison with Recommended Budgets
7. Areas for Improvement
8. Specific Actionable Recommendations

Use ₹ for currency. Include 🔴🟡🟢 for status indicators.`;
        break;

      case 'stress':
        reportPrompt = `Generate a Financial Stress Detection Report.

USER PROFILE:
- Emergency Readiness: ${userProfile?.emergencyReadiness || 'Less than 1 month'}
- Money Feeling: ${userProfile?.moneyFeeling || 'Anxious'}
- Overspend Trigger: ${userProfile?.overspendTrigger || 'Stress/Boredom'}
- Reach Zero Frequency: ${userProfile?.reachZeroFrequency || 'Sometimes'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Current Stress Score Analysis (0-100 with explanation)
2. Active Stress Signals Detected (list with severity)
3. Stress Pattern Analysis (triggers and timing)
4. Root Causes Identified
5. Impact on Financial Health
6. Coping Strategies Assessment
7. Recovery Recommendations (prioritized)
8. 30-Day Action Plan (specific steps)

Use empathetic, supportive language. Focus on solutions, not problems.`;
        break;

      case 'budget':
        reportPrompt = `Generate a Budget Performance Report.

USER PROFILE:
- Income Range: ${userProfile?.monthlyIncomeRange || '₹30,000-50,000'}
- Fixed Commitments: ${userProfile?.commitments?.join(', ') || 'Rent, Utilities'}
- Total Fixed Amount: ₹${userProfile?.totalFixedAmount?.toLocaleString() || '15,000'}
- Spending Style: ${userProfile?.spendingStyle || 'Balanced'}

REPORT PERIOD: ${startDate} to ${endDate}

Please include:
1. Budget Overview (allocated vs spent)
2. Category Performance Table (actual vs budget with variance)
3. Budget Adherence Score (percentage)
4. Over-budget Categories Analysis
5. Under-budget Categories (savings opportunities)
6. Savings Goal Progress
7. Budget Efficiency Metrics
8. Next Month Budget Recommendations

Use ₹ for currency. Use tables and progress indicators.`;
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
            content: "You are a professional financial analyst generating detailed, actionable financial reports. Use clear formatting with headers, tables, and bullet points. Include specific numbers and provide practical recommendations. Use emojis for visual indicators." 
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

    // Generate PDF HTML content
    const period = { start: startDate, end: endDate };
    const pdfHtml = generatePDFContent(reportContent, getReportTitle(type), period);

    // Generate report metadata
    const reportMetadata = {
      id: crypto.randomUUID(),
      type,
      generatedAt: new Date().toISOString(),
      period,
      title: getReportTitle(type),
    };

    return new Response(
      JSON.stringify({ 
        success: true, 
        report: {
          ...reportMetadata,
          content: reportContent,
          pdfHtml: pdfHtml, // HTML content for PDF generation
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