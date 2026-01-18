import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar } from 'lucide-react';
import { toast } from 'sonner';

const ReportsSection = () => {
  const reports = [
    {
      title: 'Monthly Financial Summary',
      description: 'Complete overview of income, expenses, and savings for the month',
      type: 'monthly',
      lastGenerated: '15 Jan 2024'
    },
    {
      title: 'Spending Analysis Report',
      description: 'Detailed breakdown of spending by category with trends',
      type: 'analysis',
      lastGenerated: '15 Jan 2024'
    },
    {
      title: 'Stress Detection Report',
      description: 'Summary of financial stress signals and recommendations',
      type: 'stress',
      lastGenerated: '15 Jan 2024'
    },
    {
      title: 'Budget Performance',
      description: 'How well you stayed within your budget guardrails',
      type: 'budget',
      lastGenerated: '15 Jan 2024'
    }
  ];

  const handleDownload = (title: string) => {
    toast.success(`Generating ${title}... Download will start shortly.`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FileText className="h-6 w-6 text-primary" />
          Financial Reports
        </h1>
        <p className="text-muted-foreground mt-1">
          Generate and download detailed financial reports
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => (
          <Card key={report.type} className="border-border/50 shadow-md">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{report.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                {report.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  Last: {report.lastGenerated}
                </span>
                <Button 
                  size="sm" 
                  onClick={() => handleDownload(report.title)}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Generate
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Coming Soon */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6 text-center">
          <h3 className="font-semibold mb-2">🚀 More Reports Coming Soon</h3>
          <p className="text-sm text-muted-foreground">
            We're working on tax summaries, investment tracking, and custom date range reports.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsSection;
