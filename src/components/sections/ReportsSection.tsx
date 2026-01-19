import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Calendar, Loader2, Eye, X, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useUserProfile } from '@/contexts/UserProfileContext';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

interface GeneratedReport {
  id: string;
  type: string;
  title: string;
  content: string;
  generatedAt: string;
  period: { start: string; end: string };
}

const ReportsSection = () => {
  const { profile } = useUserProfile();
  const [loading, setLoading] = useState<string | null>(null);
  const [generatedReports, setGeneratedReports] = useState<GeneratedReport[]>([]);
  const [viewingReport, setViewingReport] = useState<GeneratedReport | null>(null);

  const reports = [
    {
      title: 'Monthly Financial Summary',
      description: 'Complete overview of income, expenses, and savings for the month',
      type: 'monthly',
      lastGenerated: generatedReports.find(r => r.type === 'monthly')?.generatedAt 
        ? new Date(generatedReports.find(r => r.type === 'monthly')!.generatedAt).toLocaleDateString()
        : 'Not generated yet'
    },
    {
      title: 'Spending Analysis Report',
      description: 'Detailed breakdown of spending by category with trends',
      type: 'analysis',
      lastGenerated: generatedReports.find(r => r.type === 'analysis')?.generatedAt
        ? new Date(generatedReports.find(r => r.type === 'analysis')!.generatedAt).toLocaleDateString()
        : 'Not generated yet'
    },
    {
      title: 'Stress Detection Report',
      description: 'Summary of financial stress signals and recommendations',
      type: 'stress',
      lastGenerated: generatedReports.find(r => r.type === 'stress')?.generatedAt
        ? new Date(generatedReports.find(r => r.type === 'stress')!.generatedAt).toLocaleDateString()
        : 'Not generated yet'
    },
    {
      title: 'Budget Performance',
      description: 'How well you stayed within your budget guardrails',
      type: 'budget',
      lastGenerated: generatedReports.find(r => r.type === 'budget')?.generatedAt
        ? new Date(generatedReports.find(r => r.type === 'budget')!.generatedAt).toLocaleDateString()
        : 'Not generated yet'
    }
  ];

  const handleGenerate = async (type: string, title: string) => {
    setLoading(type);
    toast.info(`Generating ${title}...`);

    try {
      const { data, error } = await supabase.functions.invoke('generate-report', {
        body: {
          type,
          userProfile: profile,
          dateRange: {
            start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            end: new Date().toISOString().split('T')[0],
          },
        },
      });

      if (error) throw error;

      if (data?.success && data?.report) {
        const report = data.report as GeneratedReport;
        
        // Update or add to generated reports
        setGeneratedReports(prev => {
          const existing = prev.findIndex(r => r.type === type);
          if (existing >= 0) {
            const updated = [...prev];
            updated[existing] = report;
            return updated;
          }
          return [...prev, report];
        });

        toast.success(`${title} generated successfully!`);
        setViewingReport(report);
      } else {
        throw new Error(data?.error || 'Failed to generate report');
      }
    } catch (error) {
      console.error('Report generation error:', error);
      toast.error(`Failed to generate report: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(null);
    }
  };

  const handleDownload = (report: GeneratedReport) => {
    // Create a blob with the markdown content
    const blob = new Blob([report.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.type}-report-${report.generatedAt.split('T')[0]}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success('Report downloaded!');
  };

  const handleViewReport = (type: string) => {
    const report = generatedReports.find(r => r.type === type);
    if (report) {
      setViewingReport(report);
    }
  };

  // Simple markdown to HTML converter for display
  const renderMarkdown = (content: string) => {
    return content
      .split('\n')
      .map((line, idx) => {
        if (line.startsWith('# ')) {
          return <h1 key={idx} className="text-2xl font-bold mt-6 mb-3">{line.slice(2)}</h1>;
        }
        if (line.startsWith('## ')) {
          return <h2 key={idx} className="text-xl font-semibold mt-5 mb-2">{line.slice(3)}</h2>;
        }
        if (line.startsWith('### ')) {
          return <h3 key={idx} className="text-lg font-medium mt-4 mb-2">{line.slice(4)}</h3>;
        }
        if (line.startsWith('- ')) {
          return <li key={idx} className="ml-4 mb-1">{line.slice(2)}</li>;
        }
        if (line.startsWith('* ')) {
          return <li key={idx} className="ml-4 mb-1">{line.slice(2)}</li>;
        }
        if (line.match(/^\d+\./)) {
          return <li key={idx} className="ml-4 mb-1 list-decimal">{line.replace(/^\d+\.\s*/, '')}</li>;
        }
        if (line.startsWith('|')) {
          return <p key={idx} className="font-mono text-sm bg-muted/50 px-2 py-1">{line}</p>;
        }
        if (line.startsWith('**') && line.endsWith('**')) {
          return <p key={idx} className="font-bold my-2">{line.slice(2, -2)}</p>;
        }
        if (line.trim() === '') {
          return <br key={idx} />;
        }
        return <p key={idx} className="mb-2">{line}</p>;
      });
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
          Generate and download detailed financial reports powered by AI
        </p>
      </div>

      {/* Reports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((report) => {
          const existingReport = generatedReports.find(r => r.type === report.type);
          const isLoading = loading === report.type;
          
          return (
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
                  <div className="flex gap-2">
                    {existingReport && (
                      <>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewReport(report.type)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleDownload(existingReport)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      onClick={() => handleGenerate(report.type, report.title)}
                      disabled={isLoading}
                      className="gap-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : existingReport ? (
                        <>
                          <RefreshCw className="h-4 w-4" />
                          Regenerate
                        </>
                      ) : (
                        'Generate'
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
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

      {/* Report Viewer Dialog */}
      <Dialog open={!!viewingReport} onOpenChange={(open) => !open && setViewingReport(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{viewingReport?.title}</span>
              <div className="flex gap-2">
                {viewingReport && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleDownload(viewingReport)}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>
          <ScrollArea className="h-[60vh] pr-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              {viewingReport && renderMarkdown(viewingReport.content)}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReportsSection;
