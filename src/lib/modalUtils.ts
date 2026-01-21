/**
 * Utility functions for common modal and action operations
 */

/**
 * Add event to calendar (iCal format)
 */
export const addToCalendar = (eventData: {
  title: string;
  description?: string;
  date: Date;
  time?: string;
  duration?: number; // in minutes
}) => {
  const { title, description, date, time = '10:00', duration = 60 } = eventData;
  
  try {
    // Create iCal event
    const [hours, minutes] = time.split(':').map(Number);
    const startDate = new Date(date);
    startDate.setHours(hours, minutes, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + duration);

    const calendarEvent = {
      title,
      description: description || '',
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    };

    // For web, we can try to open calendar apps or show download options
    const icalContent = generateIcalString(calendarEvent);
    downloadIcalFile(icalContent, title);
    
    return true;
  } catch (error) {
    console.error('Failed to add calendar event:', error);
    return false;
  }
};

const generateIcalString = (event: any) => {
  return `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//FYF Financial//EN
BEGIN:VEVENT
UID:${Date.now()}@fyf.com
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+/, '')}Z
DTSTART:${event.startDate.replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z')}
DTEND:${event.endDate.replace(/[-:]/g, '').replace(/\.\d+Z/, 'Z')}
SUMMARY:${event.title}
DESCRIPTION:${event.description}
END:VEVENT
END:VCALENDAR`;
};

const downloadIcalFile = (content: string, title: string) => {
  const element = document.createElement('a');
  element.setAttribute('href', 'data:text/calendar;charset=utf-8,' + encodeURIComponent(content));
  element.setAttribute('download', `${title.replace(/\s+/g, '_')}.ics`);
  element.style.display = 'none';
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

/**
 * Generate and download reports
 */
export const downloadReport = (reportData: {
  title: string;
  content: string;
  format?: 'csv' | 'json' | 'pdf';
}) => {
  const { title, content, format = 'json' } = reportData;
  
  try {
    if (format === 'pdf') {
      // Generate PDF using HTML print
      generatePDFReport(title, content);
      return true;
    }
    
    let data, mimeType, extension;
    
    if (format === 'json') {
      data = JSON.stringify(typeof content === 'string' ? JSON.parse(content) : content, null, 2);
      mimeType = 'application/json';
      extension = 'json';
    } else if (format === 'csv') {
      data = typeof content === 'string' ? content : JSON.stringify(content);
      mimeType = 'text/csv';
      extension = 'csv';
    }

    const element = document.createElement('a');
    element.setAttribute('href', `data:${mimeType};charset=utf-8,${encodeURIComponent(data)}`);
    element.setAttribute('download', `${title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.${extension}`);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    
    return true;
  } catch (error) {
    console.error('Failed to download report:', error);
    return false;
  }
};

/**
 * Set alert/notification preferences
 */
export const setAlertPreferences = (alertData: {
  name: string;
  channels: Array<'email' | 'push' | 'in-app'>;
  frequency: 'daily' | 'weekly' | 'monthly';
  threshold?: number;
}) => {
  try {
    // Store in localStorage
    const alerts = JSON.parse(localStorage.getItem('fyf_alerts') || '{}');
    alerts[alertData.name] = {
      ...alertData,
      enabled: true,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('fyf_alerts', JSON.stringify(alerts));
    
    return true;
  } catch (error) {
    console.error('Failed to set alert preferences:', error);
    return false;
  }
};

/**
 * Schedule app blocking
 */
export const scheduleAppBlock = (blockData: {
  appName: string;
  startTime: string; // HH:MM format
  endTime: string;   // HH:MM format
  days: string[];    // e.g., ['Monday', 'Tuesday']
}) => {
  try {
    const blocks = JSON.parse(localStorage.getItem('fyf_app_blocks') || '[]');
    blocks.push({
      ...blockData,
      id: Date.now(),
      enabled: true,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem('fyf_app_blocks', JSON.stringify(blocks));
    
    return true;
  } catch (error) {
    console.error('Failed to schedule app block:', error);
    return false;
  }
};

/**
 * Create recovery plan with action items
 */
export const createRecoveryPlan = (planData: {
  type: 'financial_recovery' | 'debt_recovery' | 'spending_recovery';
  duration: number; // days
  milestones: Array<{
    day: number;
    goal: string;
    target: number;
  }>;
  actionItems: string[];
}) => {
  try {
    const plan = {
      ...planData,
      id: Date.now(),
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + planData.duration * 24 * 60 * 60 * 1000).toISOString(),
    };
    
    // Store in localStorage
    const plans = JSON.parse(localStorage.getItem('fyf_recovery_plans') || '[]');
    plans.push(plan);
    localStorage.setItem('fyf_recovery_plans', JSON.stringify(plans));
    
    return plan;
  } catch (error) {
    console.error('Failed to create recovery plan:', error);
    return null;
  }
};

/**
 * Navigate to AI Coach
 */
export const navigateToAICoach = () => {
  // This assumes you have a routing system in place
  const event = new CustomEvent('navigate-to-section', {
    detail: { section: 'ai-coach' }
  });
  window.dispatchEvent(event);
};

/**
 * Deactivate/Activate features
 */
export const toggleFeature = (featureName: string, enabled: boolean) => {
  try {
    const features = JSON.parse(localStorage.getItem('fyf_feature_toggles') || '{}');
    features[featureName] = enabled;
    localStorage.setItem('fyf_feature_toggles', JSON.stringify(features));
    return true;
  } catch (error) {
    console.error('Failed to toggle feature:', error);
    return false;
  }
};

/**
 * Check if feature is enabled
 */
export const isFeatureEnabled = (featureName: string): boolean => {
  try {
    const features = JSON.parse(localStorage.getItem('fyf_feature_toggles') || '{}');
    return features[featureName] ?? true; // default to enabled
  } catch {
    return true;
  }
};

/**
 * Generate PDF Report using HTML print
 */
const generatePDFReport = (title: string, content: string) => {
  try {
    const data = typeof content === 'string' ? JSON.parse(content) : content;
    
    // Create a new window with the report content
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      alert('Please allow pop-ups to download the PDF report');
      return;
    }

    // Generate styled HTML content
    const htmlContent = generateReportHTML(title, data);
    
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Trigger print dialog after a short delay to ensure content is loaded
    setTimeout(() => {
      printWindow.print();
      // Close after printing or if user cancels
      setTimeout(() => {
        printWindow.close();
      }, 500);
    }, 500);
  } catch (error) {
    console.error('Failed to generate PDF report:', error);
  }
};

/**
 * Generate HTML for PDF report
 */
const generateReportHTML = (title: string, data: any): string => {
  const today = new Date().toLocaleDateString('en-IN', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${title}</title>
      <style>
        @media print {
          @page {
            margin: 1.5cm;
            size: A4;
          }
          body {
            margin: 0;
            padding: 0;
          }
        }
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background: white;
          padding: 20px;
          max-width: 210mm;
          margin: 0 auto;
        }
        
        .header {
          border-bottom: 3px solid #2563eb;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        
        .header h1 {
          color: #2563eb;
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
        }
        
        .header .subtitle {
          color: #64748b;
          font-size: 14px;
        }
        
        .header .date {
          color: #64748b;
          font-size: 12px;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .section {
          margin-bottom: 30px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 18px;
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 2px solid #e2e8f0;
        }
        
        .card {
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 12px;
        }
        
        .card-header {
          font-weight: 600;
          color: #1e293b;
          margin-bottom: 8px;
          font-size: 14px;
        }
        
        .card-content {
          color: #475569;
          font-size: 13px;
          line-height: 1.5;
        }
        
        .metric {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 10px 0;
          border-bottom: 1px solid #e2e8f0;
        }
        
        .metric:last-child {
          border-bottom: none;
        }
        
        .metric-label {
          color: #64748b;
          font-size: 13px;
        }
        
        .metric-value {
          font-weight: 600;
          color: #1e293b;
          font-size: 14px;
        }
        
        .metric-value.danger {
          color: #dc2626;
        }
        
        .metric-value.success {
          color: #16a34a;
        }
        
        .metric-value.warning {
          color: #ea580c;
        }
        
        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-top: 12px;
        }
        
        .grid-item {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          padding: 12px;
        }
        
        .grid-item-label {
          font-size: 11px;
          color: #64748b;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .grid-item-value {
          font-size: 18px;
          font-weight: 700;
          color: #1e293b;
        }
        
        .list {
          list-style: none;
          padding: 0;
        }
        
        .list-item {
          padding: 10px;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          margin-bottom: 8px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .list-item-title {
          font-weight: 500;
          color: #1e293b;
          font-size: 13px;
        }
        
        .list-item-detail {
          color: #64748b;
          font-size: 12px;
        }
        
        .list-item-value {
          font-weight: 600;
          color: #2563eb;
          font-size: 14px;
        }
        
        .badge {
          display: inline-block;
          padding: 4px 10px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge.danger {
          background: #fee2e2;
          color: #dc2626;
        }
        
        .badge.warning {
          background: #ffedd5;
          color: #ea580c;
        }
        
        .badge.success {
          background: #dcfce7;
          color: #16a34a;
        }
        
        .footer {
          margin-top: 40px;
          padding-top: 20px;
          border-top: 2px solid #e2e8f0;
          text-align: center;
          color: #64748b;
          font-size: 11px;
        }
        
        .footer-note {
          margin-top: 8px;
          font-style: italic;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <div class="subtitle">Financial Analysis Report</div>
        <div class="date">
          📅 Generated on ${today}
        </div>
      </div>
      
      ${generateSections(data)}
      
      <div class="footer">
        <div>FYF - Friend Your Finance</div>
        <div class="footer-note">This report is confidential and for personal use only.</div>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate sections based on report data
 */
const generateSections = (data: any): string => {
  let html = '';

  // Lifestyle Gap Section
  if (data.lifestyleGap) {
    const gap = data.lifestyleGap;
    const riskBadge = gap.riskLevel === 'high' ? 'danger' : gap.riskLevel === 'moderate' ? 'warning' : 'success';
    
    html += `
      <div class="section">
        <h2 class="section-title">📈 Income vs Lifestyle Growth</h2>
        <div class="card">
          <div class="metric">
            <span class="metric-label">Income Growth Rate</span>
            <span class="metric-value success">${gap.incomeGrowthRate}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Lifestyle Growth Rate</span>
            <span class="metric-value danger">${gap.lifestyleGrowthRate}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Gap</span>
            <span class="metric-value ${riskBadge}">${gap.gapPercentage}%</span>
          </div>
          <div class="metric">
            <span class="metric-label">Risk Level</span>
            <span class="badge ${riskBadge}">${gap.riskLevel}</span>
          </div>
        </div>
        <div class="card">
          <div class="card-header">⚠️ Projected Impact</div>
          <div class="card-content">${gap.projectedImpact}</div>
        </div>
      </div>
    `;
  }

  // Silent Upgrades Section
  if (data.silentUpgrades && data.silentUpgrades.length > 0) {
    html += `
      <div class="section">
        <h2 class="section-title">🔍 Silent Lifestyle Upgrades Detected</h2>
        <ul class="list">
    `;
    
    data.silentUpgrades.forEach((upgrade: any) => {
      html += `
        <li class="list-item">
          <div>
            <div class="list-item-title">${upgrade.category}</div>
            <div class="list-item-detail">${upgrade.previousChoice} → ${upgrade.currentChoice}</div>
          </div>
          <div class="list-item-value">+₹${upgrade.costDifference.toLocaleString()}/mo</div>
        </li>
      `;
    });
    
    const totalIncrease = data.silentUpgrades.reduce((sum: number, u: any) => sum + u.costDifference, 0);
    html += `
        </ul>
        <div class="card">
          <div class="metric">
            <span class="metric-label">Total Monthly Increase</span>
            <span class="metric-value danger">₹${totalIncrease.toLocaleString()}</span>
          </div>
          <div class="metric">
            <span class="metric-label">Annual Impact</span>
            <span class="metric-value danger">₹${(totalIncrease * 12).toLocaleString()}</span>
          </div>
        </div>
      </div>
    `;
  }

  // Subscription Creep Section
  if (data.subscriptionCreep) {
    const sub = data.subscriptionCreep;
    html += `
      <div class="section">
        <h2 class="section-title">💳 Subscription Analysis</h2>
        <div class="grid">
          <div class="grid-item">
            <div class="grid-item-label">Total Subscriptions</div>
            <div class="grid-item-value">${sub.totalSubscriptions}</div>
          </div>
          <div class="grid-item">
            <div class="grid-item-label">Creep Rate</div>
            <div class="grid-item-value" style="color: #dc2626;">${sub.creepRate}%</div>
          </div>
          <div class="grid-item">
            <div class="grid-item-label">Previous Month</div>
            <div class="grid-item-value">₹${sub.previousMonthTotal.toLocaleString()}</div>
          </div>
          <div class="grid-item">
            <div class="grid-item-label">Current Month</div>
            <div class="grid-item-value" style="color: #dc2626;">₹${sub.currentMonthTotal.toLocaleString()}</div>
          </div>
        </div>
        
        ${sub.newSubscriptions && sub.newSubscriptions.length > 0 ? `
        <div class="card" style="margin-top: 12px;">
          <div class="card-header">🆕 New Subscriptions</div>
          <div class="card-content">${sub.newSubscriptions.join(', ')}</div>
        </div>
        ` : ''}
        
        ${sub.upgradedSubscriptions && sub.upgradedSubscriptions.length > 0 ? `
        <div class="card">
          <div class="card-header">⬆️ Upgraded Subscriptions</div>
          <div class="card-content">${sub.upgradedSubscriptions.join(', ')}</div>
        </div>
        ` : ''}
      </div>
    `;
  }

  // Recommendations Section
  html += `
    <div class="section">
      <h2 class="section-title">💡 Recommendations</h2>
      <div class="card">
        <div class="card-header">Immediate Actions</div>
        <div class="card-content">
          • Review and cancel unused subscriptions<br>
          • Identify non-essential lifestyle upgrades to pause<br>
          • Set monthly budget alerts for lifestyle spending<br>
          • Track spending patterns for next 30 days
        </div>
      </div>
      <div class="card">
        <div class="card-header">Long-term Strategy</div>
        <div class="card-content">
          • Maintain lifestyle growth below income growth<br>
          • Implement the 50-30-20 budgeting rule<br>
          • Build emergency fund to 6 months of expenses<br>
          • Review lifestyle choices quarterly
        </div>
      </div>
    </div>
  `;

  return html;

};
