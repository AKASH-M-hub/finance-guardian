import React, { useState } from 'react';
import { Heart, Brain, Clock, ShoppingBag, AlertCircle, Smile, Frown, Meh, TrendingUp, Zap, Coffee, Bell, Check, Download } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import GlowCard from '@/components/reactbits/GlowCard';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import RippleButton from '@/components/reactbits/RippleButton';
import { downloadReport, setAlertPreferences } from '@/lib/modalUtils';
import type { 
  TimeEmotionCorrelation, 
  StressMerchantPattern, 
  BoredomSpendSignal, 
  RegretPrediction,
  EmotionFrequencySummary,
  EmotionMoneyExplanation 
} from '@/types/emotionalSpending';

const mockTimeEmotions: TimeEmotionCorrelation[] = [
  { timeSlot: 'Morning (6-10 AM)', emotionalState: 'neutral', spendingFrequency: 3, averageAmount: 150, confidence: 85 },
  { timeSlot: 'Midday (10-2 PM)', emotionalState: 'stressed', spendingFrequency: 8, averageAmount: 450, confidence: 78 },
  { timeSlot: 'Afternoon (2-6 PM)', emotionalState: 'tired', spendingFrequency: 5, averageAmount: 280, confidence: 82 },
  { timeSlot: 'Evening (6-10 PM)', emotionalState: 'bored', spendingFrequency: 12, averageAmount: 680, confidence: 91 },
  { timeSlot: 'Late Night (10 PM-2 AM)', emotionalState: 'anxious', spendingFrequency: 6, averageAmount: 890, confidence: 88 }
];

const mockStressMerchants: StressMerchantPattern[] = [
  { merchantName: 'Swiggy', category: 'Food Delivery', stressCorrelation: 82, visitFrequency: 15, averageSpend: 450, typicalTiming: 'Post-work hours' },
  { merchantName: 'Amazon', category: 'Online Shopping', stressCorrelation: 76, visitFrequency: 8, averageSpend: 1200, typicalTiming: 'Late nights' },
  { merchantName: 'Starbucks', category: 'Beverages', stressCorrelation: 68, visitFrequency: 12, averageSpend: 350, typicalTiming: 'Deadline days' }
];

const mockBoredomSignal: BoredomSpendSignal = {
  frequency: 'high',
  typicalCategories: ['Entertainment', 'Food Delivery', 'In-app purchases'],
  averageAmount: 420,
  peakTimes: ['Sundays 3-6 PM', 'Weekday evenings'],
  weekdayPattern: ['Mon', 'Wed', 'Sat', 'Sun']
};

const mockRegretPredictions: RegretPrediction[] = [
  { transactionId: '1', regretProbability: 78, factors: ['Late night purchase', 'Not in budget', 'Impulse category'], recommendation: 'Wait 24 hours before confirming', historicalAccuracy: 85 },
  { transactionId: '2', regretProbability: 45, factors: ['Planned purchase', 'Within budget'], recommendation: 'Low risk - proceed if needed', historicalAccuracy: 85 }
];

const mockEmotionSummary: EmotionFrequencySummary[] = [
  { emotion: 'Stress Relief', frequency: 24, totalSpent: 12500, averagePerOccurrence: 520, trend: 'increasing' },
  { emotion: 'Boredom Fill', frequency: 18, totalSpent: 7800, averagePerOccurrence: 433, trend: 'stable' },
  { emotion: 'Reward Self', frequency: 12, totalSpent: 8900, averagePerOccurrence: 742, trend: 'decreasing' },
  { emotion: 'Anxiety Cope', frequency: 8, totalSpent: 6200, averagePerOccurrence: 775, trend: 'increasing' }
];

const mockExplanations: EmotionMoneyExplanation[] = [
  { 
    pattern: 'Evening Comfort Ordering', 
    explanation: 'You tend to order food delivery between 7-9 PM on days with more than 8 work hours. This appears to be a stress-relief mechanism.',
    frequency: 15,
    financialImpact: 4500,
    suggestions: ['Meal prep on weekends', 'Keep healthy snacks', 'Set a food delivery budget']
  },
  { 
    pattern: 'Late Night Shopping Spree', 
    explanation: 'Shopping activity spikes after 11 PM, especially on weeknights. Decisions made during low-energy hours often lead to regret.',
    frequency: 8,
    financialImpact: 8200,
    suggestions: ['Add items to cart, review next morning', 'Enable purchase delays', 'Track sleep quality']
  },
  {
    pattern: 'Social Media Trigger',
    explanation: 'Purchases often follow 20+ minutes of social media browsing. FOMO and comparison may be influencing decisions.',
    frequency: 12,
    financialImpact: 6800,
    suggestions: ['Use screen time limits', 'Unfollow lifestyle accounts', 'Wait before clicking ads']
  }
];

const EmotionalSpendingSection: React.FC = () => {
  const [selectedEmotion, setSelectedEmotion] = useState<string | null>(null);
  const [reportDialogOpen, setReportDialogOpen] = useState(false);
  const [alertsDialogOpen, setAlertsDialogOpen] = useState(false);
  const [alertChannels, setAlertChannels] = useState<Array<'email' | 'push' | 'in-app'>>(['in-app']);
  const [alertFrequency, setAlertFrequency] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [reportSuccess, setReportSuccess] = useState(false);
  const [alertsSuccess, setAlertsSuccess] = useState(false);

  const getEmotionIcon = (emotion: string) => {
    switch (emotion) {
      case 'stressed': return <Frown className="h-4 w-4 text-red-400" />;
      case 'bored': return <Meh className="h-4 w-4 text-amber-400" />;
      case 'happy': return <Smile className="h-4 w-4 text-emerald-400" />;
      case 'anxious': return <AlertCircle className="h-4 w-4 text-purple-400" />;
      case 'tired': return <Coffee className="h-4 w-4 text-orange-400" />;
      default: return <Meh className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getEmotionColor = (emotion: string) => {
    switch (emotion) {
      case 'stressed': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'bored': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'happy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'anxious': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'tired': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'increasing': return <TrendingUp className="h-3 w-3 text-red-400" />;
      case 'decreasing': return <TrendingUp className="h-3 w-3 text-emerald-400 rotate-180" />;
      default: return <Meh className="h-3 w-3 text-muted-foreground" />;
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <Heart className="h-6 w-6 text-pink-400" />
            Emotional Spending Pattern Translator
          </h2>
          <p className="text-muted-foreground mt-1">Understand the emotions behind your spending without being asked</p>
        </div>
      </div>

      {/* Emotion-to-Money Explanation - Hero Card */}
      <GlowCard className="p-6" glowColor="rgba(236, 72, 153, 0.3)">
        <h3 className="text-lg font-semibold text-foreground flex items-center gap-2 mb-4">
          <Brain className="h-5 w-5 text-pink-400" />
          Emotion-to-Money Explanations
        </h3>
        <div className="space-y-4">
          {mockExplanations.map((explanation, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-foreground">{explanation.pattern}</h4>
                <Badge variant="outline" className="text-xs">
                  ₹{explanation.financialImpact.toLocaleString()}/mo impact
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground mb-3">{explanation.explanation}</p>
              <div className="flex flex-wrap gap-2">
                {explanation.suggestions.map((suggestion, sIdx) => (
                  <Badge key={sIdx} className="bg-pink-500/20 text-pink-400 border-pink-500/30 text-xs">
                    💡 {suggestion}
                  </Badge>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlowCard>

      {/* Time-Emotion Correlation */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-400" />
            Time-Emotion Correlation Engine
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockTimeEmotions.map((item, idx) => (
              <div 
                key={idx}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {getEmotionIcon(item.emotionalState)}
                  <div>
                    <p className="font-medium text-sm">{item.timeSlot}</p>
                    <Badge className={`${getEmotionColor(item.emotionalState)} text-xs mt-1`}>
                      {item.emotionalState}
                    </Badge>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">₹{item.averageAmount} avg</p>
                  <p className="text-xs text-muted-foreground">{item.spendingFrequency} transactions</p>
                </div>
                <div className="w-16">
                  <ProgressRing 
                    progress={item.confidence} 
                    size={48} 
                    strokeWidth={4}
                    color={item.confidence > 80 ? 'success' : 'warning'}
                  >
                    <span className="text-xs">{item.confidence}%</span>
                  </ProgressRing>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Stress Merchants & Boredom Signals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-red-400" />
              Stress Merchant Pattern Detector
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStressMerchants.map((merchant, idx) => (
                <div key={idx} className="p-3 rounded-lg bg-muted/30">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="font-medium">{merchant.merchantName}</p>
                      <p className="text-xs text-muted-foreground">{merchant.category}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-red-400 font-medium">{merchant.stressCorrelation}%</p>
                      <p className="text-xs text-muted-foreground">stress link</p>
                    </div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{merchant.visitFrequency} visits/mo</span>
                    <span>₹{merchant.averageSpend} avg</span>
                    <span>{merchant.typicalTiming}</span>
                  </div>
                  <Progress value={merchant.stressCorrelation} className="h-1 mt-2" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Meh className="h-4 w-4 text-amber-400" />
              Boredom Spend Signal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <Badge className={`${mockBoredomSignal.frequency === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'} text-lg px-4 py-2`}>
                {mockBoredomSignal.frequency.toUpperCase()} Frequency
              </Badge>
              <p className="text-2xl font-bold mt-2">₹{mockBoredomSignal.averageAmount}</p>
              <p className="text-sm text-muted-foreground">average boredom spend</p>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Typical Categories:</p>
                <div className="flex flex-wrap gap-1">
                  {mockBoredomSignal.typicalCategories.map((cat, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{cat}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Peak Times:</p>
                <div className="flex flex-wrap gap-1">
                  {mockBoredomSignal.peakTimes.map((time, idx) => (
                    <Badge key={idx} className="bg-amber-500/20 text-amber-400 text-xs">{time}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Emotion Frequency Summary */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-400" />
            Emotion Frequency Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mockEmotionSummary.map((item, idx) => (
              <div key={idx} className="p-4 rounded-lg bg-muted/30 text-center">
                <div className="flex items-center justify-center gap-1 mb-2">
                  <p className="font-medium text-sm">{item.emotion}</p>
                  {getTrendIcon(item.trend)}
                </div>
                <CountUpNumber value={item.frequency} className="text-2xl font-bold text-foreground" />
                <p className="text-xs text-muted-foreground">occurrences</p>
                <p className="text-sm text-primary mt-1">₹{item.totalSpent.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Regret Probability */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-purple-400" />
            Regret Probability Predictor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {mockRegretPredictions.map((prediction) => (
              <div 
                key={prediction.transactionId}
                className={`p-4 rounded-lg border ${prediction.regretProbability > 60 ? 'border-red-500/30 bg-red-500/10' : 'border-emerald-500/30 bg-emerald-500/10'}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium">Pending Transaction</span>
                  <ProgressRing 
                    progress={prediction.regretProbability} 
                    size={56} 
                    strokeWidth={5}
                    color={prediction.regretProbability > 60 ? 'danger' : 'success'}
                  >
                    <span className="text-xs font-bold">{prediction.regretProbability}%</span>
                  </ProgressRing>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-muted-foreground">Risk Factors:</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {prediction.factors.map((factor, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">{factor}</Badge>
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground">{prediction.recommendation}</p>
                  <p className="text-xs text-muted-foreground">Model accuracy: {prediction.historicalAccuracy}%</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center flex-wrap">
        <Dialog open={reportDialogOpen} onOpenChange={setReportDialogOpen}>
          <DialogTrigger asChild>
            <RippleButton variant="primary">
              <Download className="h-4 w-4 mr-2" />
              View Full Emotional Report
            </RippleButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Emotional Spending Report</DialogTitle>
              <DialogDescription>
                Download your complete emotional spending analysis
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium mb-3">Report Includes:</p>
                <ul className="space-y-1 text-sm">
                  <li>✓ Emotion-spending correlations</li>
                  <li>✓ Stress merchant patterns</li>
                  <li>✓ Boredom spending signals</li>
                  <li>✓ Time-emotion analysis</li>
                  <li>✓ Regret predictions</li>
                </ul>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  const reportData = {
                    title: 'Emotional Spending Report',
                    content: JSON.stringify({
                      generatedAt: new Date().toISOString(),
                      timeEmotions: mockTimeEmotions,
                      stressMerchants: mockStressMerchants,
                      boredomSignals: mockBoredomSignal,
                    }, null, 2),
                    format: 'pdf', // Changed from default JSON to PDF
                  };
                  const success = downloadReport(reportData);
                  if (success) {
                    setReportSuccess(true);
                    setTimeout(() => {
                      setReportDialogOpen(false);
                      setReportSuccess(false);
                    }, 1500);
                  }
                }}
              >
                {reportSuccess ? <><Check className="h-4 w-4 mr-2" /> PDF Generated!</> : 'Download PDF Report'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={alertsDialogOpen} onOpenChange={setAlertsDialogOpen}>
          <DialogTrigger asChild>
            <RippleButton variant="secondary">
              <Bell className="h-4 w-4 mr-2" />
              Set Emotion Alerts
            </RippleButton>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Set Emotional Spending Alerts</DialogTitle>
              <DialogDescription>
                Get notified when emotional spending patterns are detected
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label className="text-base font-medium mb-3 block">Alert Channels</Label>
                <div className="space-y-2">
                  {(['email', 'push', 'in-app'] as const).map((channel) => (
                    <div key={channel} className="flex items-center gap-2">
                      <Checkbox 
                        checked={alertChannels.includes(channel)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setAlertChannels([...alertChannels, channel]);
                          } else {
                            setAlertChannels(alertChannels.filter(c => c !== channel));
                          }
                        }}
                      />
                      <Label className="capitalize cursor-pointer">{channel}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <Label>Frequency</Label>
                <select 
                  value={alertFrequency}
                  onChange={(e) => setAlertFrequency(e.target.value as any)}
                  className="w-full p-2 rounded border bg-background mt-1"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>
              <Button 
                className="w-full"
                onClick={() => {
                  const success = setAlertPreferences({
                    name: 'emotional_spending_alerts',
                    channels: alertChannels,
                    frequency: alertFrequency,
                  });
                  if (success) {
                    setAlertsSuccess(true);
                    setTimeout(() => {
                      setAlertsDialogOpen(false);
                      setAlertsSuccess(false);
                    }, 1500);
                  }
                }}
              >
                {alertsSuccess ? <><Check className="h-4 w-4 mr-2" /> Set!</> : 'Set Alerts'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default EmotionalSpendingSection;
