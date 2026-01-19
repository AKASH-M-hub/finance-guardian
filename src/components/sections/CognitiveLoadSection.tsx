import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Brain, 
  Battery, 
  BatteryLow, 
  BatteryMedium, 
  BatteryFull,
  Clock,
  AlertTriangle,
  Zap,
  Coffee,
  Moon,
  Sun,
  TrendingDown,
  TrendingUp,
  Pause,
  ShoppingCart,
  Timer,
  Lightbulb
} from 'lucide-react';
import GlowCard from '@/components/reactbits/GlowCard';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import RippleButton from '@/components/reactbits/RippleButton';
import ProgressRing from '@/components/reactbits/ProgressRing';
import GradientText from '@/components/reactbits/GradientText';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import { useUserProfile } from '@/contexts/UserProfileContext';
import type { 
  DecisionFatigueData, 
  ParalysisPoint, 
  MentalBandwidth, 
  AutopilotSpending,
  ProcrastinationScore,
  CognitiveBudget,
  FocusRecoverySuggestion
} from '@/types/cognitive';

const CognitiveLoadSection = () => {
  const { analysis } = useUserProfile();
  const [currentHour] = useState(new Date().getHours());

  const [cognitiveBudget, setCognitiveBudget] = useState<CognitiveBudget>({
    dailyTotal: 100,
    spent: 45,
    reserved: 20,
    reservedFor: ['Monthly budget review', 'Investment decision'],
    recoveryTips: [
      'Take a 15-minute walk',
      'Practice deep breathing',
      'Postpone non-urgent decisions to tomorrow'
    ]
  });

  const [decisionFatigue] = useState<DecisionFatigueData[]>([
    { date: new Date(), decisionsCount: 12, timeSpentComparing: 45, qualityScore: 75, optionsCompared: 8 },
    { date: new Date(Date.now() - 86400000), decisionsCount: 18, timeSpentComparing: 90, qualityScore: 55, optionsCompared: 15 },
    { date: new Date(Date.now() - 172800000), decisionsCount: 8, timeSpentComparing: 25, qualityScore: 88, optionsCompared: 4 },
  ]);

  const [paralysisPoints] = useState<ParalysisPoint[]>([
    { id: '1', timestamp: new Date(Date.now() - 3600000), appName: 'Shopping App', duration: 12, actionTaken: false, category: 'Electronics' },
    { id: '2', timestamp: new Date(Date.now() - 7200000), appName: 'Finance App', duration: 8, actionTaken: true, category: 'Investment' },
    { id: '3', timestamp: new Date(Date.now() - 10800000), appName: 'Food Delivery', duration: 15, actionTaken: false, category: 'Food' },
  ]);

  const [mentalBandwidth] = useState<MentalBandwidth>({
    current: 65,
    max: 100,
    recoveryRate: 5,
    peakHours: [9, 10, 11, 14, 15],
    lowHours: [13, 17, 18, 21, 22]
  });

  const [autopilotSpending] = useState<AutopilotSpending[]>([
    { id: '1', timestamp: new Date(Date.now() - 14400000), amount: 450, category: 'Food', duringWorkHours: true, distractionLevel: 'high' },
    { id: '2', timestamp: new Date(Date.now() - 28800000), amount: 1200, category: 'Shopping', duringWorkHours: true, distractionLevel: 'medium' },
    { id: '3', timestamp: new Date(Date.now() - 43200000), amount: 200, category: 'Entertainment', duringWorkHours: false, distractionLevel: 'low' },
  ]);

  const [procrastinationScore] = useState<ProcrastinationScore>({
    overall: 42,
    byCategory: [
      { category: 'Electronics', score: 65, avgDelayHours: 72 },
      { category: 'Subscriptions', score: 35, avgDelayHours: 24 },
      { category: 'Groceries', score: 15, avgDelayHours: 2 },
    ],
    trend: 'improving'
  });

  const [focusSuggestions] = useState<FocusRecoverySuggestion[]>([
    { id: '1', message: "You've compared 12 headphones today. Research shows decision quality drops after 7 options.", action: 'Take a 20-minute break before deciding', impact: 'high' },
    { id: '2', message: "Peak mental energy detected. Good time for important financial decisions.", action: 'Review pending investment options now', impact: 'medium' },
    { id: '3', message: "3 purchases made during distracted hours today.", action: 'Set up a "no-buy" mode for work hours', impact: 'high' },
  ]);

  const getBatteryIcon = (level: number) => {
    if (level >= 70) return <BatteryFull className="h-6 w-6 text-green-500" />;
    if (level >= 40) return <BatteryMedium className="h-6 w-6 text-yellow-500" />;
    return <BatteryLow className="h-6 w-6 text-destructive" />;
  };

  const isCurrentlyPeak = mentalBandwidth.peakHours.includes(currentHour);
  const isCurrentlyLow = mentalBandwidth.lowHours.includes(currentHour);

  const spendDecisionPoint = () => {
    setCognitiveBudget(prev => ({
      ...prev,
      spent: Math.min(prev.spent + 5, prev.dailyTotal)
    }));
  };

  const reserveDecisionPoints = (amount: number) => {
    setCognitiveBudget(prev => ({
      ...prev,
      reserved: Math.min(prev.reserved + amount, prev.dailyTotal - prev.spent)
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">
            <GradientText>Cognitive Load Decoder</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track mental energy spent on financial decisions
          </p>
        </div>
        <div className="flex items-center gap-2">
          {isCurrentlyPeak && (
            <Badge className="gap-1 bg-green-500/20 text-green-500">
              <Sun className="h-3 w-3" />
              Peak Hours
            </Badge>
          )}
          {isCurrentlyLow && (
            <Badge variant="destructive" className="gap-1">
              <Moon className="h-3 w-3" />
              Low Energy
            </Badge>
          )}
        </div>
      </div>

      {/* Cognitive Budget Overview */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Cognitive Budget ⭐
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Treat mental energy like money - spend wisely
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div className="flex flex-col items-center p-4 rounded-lg bg-muted/30">
              {getBatteryIcon(cognitiveBudget.dailyTotal - cognitiveBudget.spent)}
              <p className="text-3xl font-bold mt-2">
                <CountUpNumber end={cognitiveBudget.dailyTotal - cognitiveBudget.spent} duration={1000} />
              </p>
              <p className="text-sm text-muted-foreground">Points Available</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-destructive/10">
              <Zap className="h-6 w-6 text-destructive" />
              <p className="text-3xl font-bold mt-2">{cognitiveBudget.spent}</p>
              <p className="text-sm text-muted-foreground">Points Spent</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-primary/10">
              <Timer className="h-6 w-6 text-primary" />
              <p className="text-3xl font-bold mt-2">{cognitiveBudget.reserved}</p>
              <p className="text-sm text-muted-foreground">Reserved</p>
            </div>

            <div className="flex flex-col items-center p-4 rounded-lg bg-green-500/10">
              <Coffee className="h-6 w-6 text-green-500" />
              <p className="text-3xl font-bold mt-2">+{mentalBandwidth.recoveryRate}/hr</p>
              <p className="text-sm text-muted-foreground">Recovery Rate</p>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">Daily Cognitive Budget</span>
              <span className="text-sm text-muted-foreground">
                {cognitiveBudget.spent + cognitiveBudget.reserved}/{cognitiveBudget.dailyTotal}
              </span>
            </div>
            <div className="flex h-3 rounded-full overflow-hidden bg-muted">
              <div 
                className="bg-destructive transition-all" 
                style={{ width: `${(cognitiveBudget.spent / cognitiveBudget.dailyTotal) * 100}%` }}
              />
              <div 
                className="bg-primary transition-all" 
                style={{ width: `${(cognitiveBudget.reserved / cognitiveBudget.dailyTotal) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Spent</span>
              <span>Reserved</span>
              <span>Available</span>
            </div>
          </div>

          {cognitiveBudget.reservedFor.length > 0 && (
            <div className="mt-4 p-3 rounded-lg bg-primary/10">
              <p className="text-sm font-medium mb-2">Reserved For:</p>
              <div className="flex flex-wrap gap-2">
                {cognitiveBudget.reservedFor.map((item, idx) => (
                  <Badge key={idx} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </GlowCard>

      <Tabs defaultValue="fatigue" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="fatigue">Decision Fatigue</TabsTrigger>
          <TabsTrigger value="paralysis">Paralysis Points</TabsTrigger>
          <TabsTrigger value="autopilot">Autopilot Spending</TabsTrigger>
          <TabsTrigger value="recovery">Focus Recovery</TabsTrigger>
        </TabsList>

        {/* Decision Fatigue Tab */}
        <TabsContent value="fatigue" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Battery className="h-5 w-5" />
                Decision Fatigue Sensor
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Tracks time spent comparing prices and options
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {decisionFatigue.map((data, idx) => (
                <InteractiveCard key={idx} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-medium">{data.date.toLocaleDateString()}</p>
                      <p className="text-sm text-muted-foreground">
                        {data.decisionsCount} decisions made
                      </p>
                    </div>
                    <ProgressRing 
                      progress={data.qualityScore} 
                      size={50} 
                      strokeWidth={4}
                      color={data.qualityScore >= 70 ? 'hsl(var(--success))' : data.qualityScore >= 50 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold">{data.timeSpentComparing}</p>
                      <p className="text-xs text-muted-foreground">Minutes Comparing</p>
                    </div>
                    <div className="p-2 rounded bg-muted/50">
                      <p className="text-lg font-bold">{data.optionsCompared}</p>
                      <p className="text-xs text-muted-foreground">Options Compared</p>
                    </div>
                    <div className={`p-2 rounded ${data.qualityScore >= 70 ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                      <p className="text-lg font-bold">{data.qualityScore}%</p>
                      <p className="text-xs text-muted-foreground">Quality Score</p>
                    </div>
                  </div>

                  {data.optionsCompared > 7 && (
                    <div className="mt-3 p-2 rounded bg-destructive/10 flex items-center gap-2 text-sm text-destructive">
                      <AlertTriangle className="h-4 w-4" />
                      Too many options compared - decision quality likely affected
                    </div>
                  )}
                </InteractiveCard>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Paralysis Points Tab */}
        <TabsContent value="paralysis" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Pause className="h-5 w-5" />
                Paralysis Point Detection
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                When you open/close apps without taking action
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {paralysisPoints.map((point) => (
                <InteractiveCard key={point.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${point.actionTaken ? 'bg-green-500/10' : 'bg-destructive/10'}`}>
                        {point.actionTaken ? (
                          <Zap className="h-5 w-5 text-green-500" />
                        ) : (
                          <Pause className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{point.appName}</p>
                        <p className="text-sm text-muted-foreground">{point.category}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{point.duration} min</p>
                      <Badge variant={point.actionTaken ? "default" : "destructive"}>
                        {point.actionTaken ? 'Action Taken' : 'No Action'}
                      </Badge>
                    </div>
                  </div>
                </InteractiveCard>
              ))}

              <div className="p-4 rounded-lg bg-primary/10">
                <p className="text-sm font-medium">Analysis:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  {paralysisPoints.filter(p => !p.actionTaken).length} instances of decision paralysis detected today.
                  Consider limiting options or setting decision deadlines.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Autopilot Spending Tab */}
        <TabsContent value="autopilot" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Autopilot Spending Alert
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Purchases made during work/study hours (cognitive distraction)
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              {autopilotSpending.map((spending) => (
                <InteractiveCard key={spending.id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-full ${
                        spending.distractionLevel === 'high' ? 'bg-destructive/10' :
                        spending.distractionLevel === 'medium' ? 'bg-yellow-500/10' : 'bg-green-500/10'
                      }`}>
                        <ShoppingCart className={`h-5 w-5 ${
                          spending.distractionLevel === 'high' ? 'text-destructive' :
                          spending.distractionLevel === 'medium' ? 'text-yellow-500' : 'text-green-500'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{spending.category}</p>
                        <p className="text-sm text-muted-foreground">
                          {spending.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">₹{spending.amount.toLocaleString()}</p>
                      <div className="flex gap-1">
                        {spending.duringWorkHours && (
                          <Badge variant="destructive" className="text-xs">Work Hours</Badge>
                        )}
                        <Badge 
                          variant="outline"
                          className={`text-xs ${
                            spending.distractionLevel === 'high' ? 'border-destructive text-destructive' :
                            spending.distractionLevel === 'medium' ? 'border-yellow-500 text-yellow-500' : ''
                          }`}
                        >
                          {spending.distractionLevel} distraction
                        </Badge>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              ))}

              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 bg-destructive/10">
                  <p className="text-sm font-medium">Total Autopilot Spending</p>
                  <p className="text-2xl font-bold text-destructive">
                    ₹{autopilotSpending.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </p>
                </Card>
                <Card className="p-4">
                  <p className="text-sm font-medium">High Distraction Purchases</p>
                  <p className="text-2xl font-bold">
                    {autopilotSpending.filter(s => s.distractionLevel === 'high').length}
                  </p>
                </Card>
              </div>
            </CardContent>
          </Card>

          {/* Procrastination Score */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Financial Procrastination Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-3xl font-bold">{procrastinationScore.overall}/100</p>
                  <div className="flex items-center gap-1 text-sm">
                    {procrastinationScore.trend === 'improving' ? (
                      <>
                        <TrendingDown className="h-4 w-4 text-green-500" />
                        <span className="text-green-500">Improving</span>
                      </>
                    ) : (
                      <>
                        <TrendingUp className="h-4 w-4 text-destructive" />
                        <span className="text-destructive">Worsening</span>
                      </>
                    )}
                  </div>
                </div>
                <ProgressRing 
                  progress={100 - procrastinationScore.overall} 
                  size={80} 
                  strokeWidth={6}
                  color={procrastinationScore.overall < 30 ? 'hsl(var(--success))' : procrastinationScore.overall < 60 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                />
              </div>

              <div className="space-y-2">
                {procrastinationScore.byCategory.map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-muted/30">
                    <span className="text-sm">{cat.category}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        Avg {cat.avgDelayHours}h delay
                      </span>
                      <Badge variant={cat.score < 30 ? "default" : cat.score < 60 ? "secondary" : "destructive"}>
                        {cat.score}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Focus Recovery Tab */}
        <TabsContent value="recovery" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lightbulb className="h-5 w-5" />
                Focus Recovery Suggestions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {focusSuggestions.map((suggestion) => (
                <GlowCard key={suggestion.id} className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-full ${
                      suggestion.impact === 'high' ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                      <Lightbulb className={`h-5 w-5 ${
                        suggestion.impact === 'high' ? 'text-primary' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{suggestion.message}</p>
                      <div className="mt-2 p-2 rounded bg-muted/50">
                        <p className="text-sm font-medium">Suggested Action:</p>
                        <p className="text-sm text-muted-foreground">{suggestion.action}</p>
                      </div>
                      <Badge className="mt-2" variant={suggestion.impact === 'high' ? 'default' : 'secondary'}>
                        {suggestion.impact} impact
                      </Badge>
                    </div>
                  </div>
                </GlowCard>
              ))}

              <div className="p-4 rounded-lg bg-green-500/10">
                <p className="text-sm font-medium mb-2">Recovery Tips:</p>
                <ul className="space-y-1">
                  {cognitiveBudget.recoveryTips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <Coffee className="h-3 w-3 text-green-500" />
                      {tip}
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Mental Bandwidth Hours */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Mental Bandwidth Throughout Day
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1">
                {Array.from({ length: 24 }, (_, hour) => {
                  const isPeak = mentalBandwidth.peakHours.includes(hour);
                  const isLow = mentalBandwidth.lowHours.includes(hour);
                  const isCurrent = hour === currentHour;
                  
                  return (
                    <div 
                      key={hour}
                      className={`h-8 rounded flex items-center justify-center text-xs transition-all ${
                        isCurrent ? 'ring-2 ring-primary' : ''
                      } ${
                        isPeak ? 'bg-green-500/30 text-green-500' :
                        isLow ? 'bg-destructive/30 text-destructive' : 'bg-muted/50'
                      }`}
                      title={`${hour}:00 - ${isPeak ? 'Peak' : isLow ? 'Low' : 'Normal'}`}
                    >
                      {hour}
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-4 mt-4 text-sm">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-green-500/30" />
                  <span>Peak Hours</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-destructive/30" />
                  <span>Low Energy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded bg-muted/50" />
                  <span>Normal</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CognitiveLoadSection;
