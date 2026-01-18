import StressSignalCard from '@/components/dashboard/StressSignalCard';
import StressScoreGauge from '@/components/dashboard/StressScoreGauge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { mockStressSignals, mockFinancialSummary } from '@/data/mockData';
import { AlertTriangle, TrendingUp, TrendingDown, Activity, Zap } from 'lucide-react';

const StressSignalsSection = () => {
  const allSignals = [
    ...mockStressSignals,
    {
      id: '4',
      type: 'savings_drop' as const,
      severity: 'medium' as const,
      title: 'Savings Rate Declining',
      description: 'Your savings rate dropped from 45% to 38% over the last 3 months.',
      actionable: 'Set up auto-transfer of ₹5,000 to savings at month start.'
    },
    {
      id: '5',
      type: 'stress_merchant' as const,
      severity: 'low' as const,
      title: 'Comfort Spending Detected',
      description: 'Late-night food orders increased by 60% this week. This might indicate stress eating.',
      actionable: 'Consider healthier stress relief activities like exercise or meditation.'
    },
    {
      id: '6',
      type: 'emergency_withdrawal' as const,
      severity: 'medium' as const,
      title: 'Unusual ATM Activity',
      description: 'You withdrew ₹15,000 in cash this week, 3x your usual amount.',
      actionable: 'Large cash withdrawals often indicate unplanned expenses. Track where this went.'
    }
  ];

  const signalsByType = {
    high: allSignals.filter(s => s.severity === 'high'),
    medium: allSignals.filter(s => s.severity === 'medium'),
    low: allSignals.filter(s => s.severity === 'low'),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            Stress Signal Detection
          </h1>
          <p className="text-muted-foreground mt-1">
            Early warning system for financial stress patterns
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="destructive" className="gap-1">
            <Zap className="h-3 w-3" /> {signalsByType.high.length} Critical
          </Badge>
          <Badge className="bg-amber-500 text-primary-foreground gap-1">
            <Activity className="h-3 w-3" /> {signalsByType.medium.length} Warning
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <TrendingUp className="h-3 w-3" /> {signalsByType.low.length} Info
          </Badge>
        </div>
      </div>

      {/* Score & Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">Overall Stress Level</CardTitle>
          </CardHeader>
          <CardContent>
            <StressScoreGauge score={mockFinancialSummary.stressScore} />
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-md lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">How We Detect Stress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Micro-Spend Analysis</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  We track sudden increases in small, frequent purchases that often indicate emotional spending.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Savings Pattern</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Continuous drops in savings rate or emergency fund signal growing financial pressure.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Category Drift</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unusual changes in spending categories reveal behavioral shifts before problems arise.
                </p>
              </div>
              
              <div className="p-4 rounded-lg bg-accent/50">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="h-4 w-4 text-primary" />
                  <span className="font-medium text-sm">Merchant Patterns</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Stress-linked merchants like late-night food delivery or online shopping indicate coping behaviors.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Signals */}
      {signalsByType.high.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-destructive flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Critical Alerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signalsByType.high.map((signal) => (
              <StressSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Warning Signals */}
      {signalsByType.medium.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-amber-600 flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Warnings to Watch
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signalsByType.medium.map((signal) => (
              <StressSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Info Signals */}
      {signalsByType.low.length > 0 && (
        <div>
          <h2 className="text-lg font-semibold mb-4 text-primary flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Informational
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signalsByType.low.map((signal) => (
              <StressSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Supportive Message */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <span className="text-2xl">💚</span>
            </div>
            <div>
              <h3 className="font-semibold mb-1">No Shame Mode Active</h3>
              <p className="text-sm text-muted-foreground">
                Financial stress is common and temporary. These signals are here to help you, not judge you. 
                Every small step toward better habits matters. We believe in your ability to improve your financial wellness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StressSignalsSection;
