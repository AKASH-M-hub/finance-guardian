import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Moon, 
  Sun, 
  Clock, 
  Brain, 
  Zap, 
  TrendingUp,
  Calendar,
  CloudRain,
  Thermometer,
  Heart,
  BedDouble,
  Activity,
  Check
} from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import { addToCalendar } from '@/lib/modalUtils';

const CircadianCashFlowSection = () => {
  const [activeTab, setActiveTab] = useState('clock');
  const [calendarSuccess, setCalendarSuccess] = useState<string | null>(null);

  const currentHour = new Date().getHours();

  // Mock biological clock data

  const biologicalClock = {
    currentHour,
    energyLevel: 72,
    cognitiveCapacity: 85,
    emotionalStability: 68,
    optimalForDecisions: currentHour >= 9 && currentHour <= 11,
    hourlyData: Array.from({ length: 24 }, (_, hour) => ({
      hour,
      energy: Math.sin((hour - 6) * Math.PI / 12) * 40 + 50 + Math.random() * 10,
      cognitive: Math.sin((hour - 8) * Math.PI / 12) * 45 + 50 + Math.random() * 10,
      emotional: Math.sin((hour - 10) * Math.PI / 12) * 35 + 55 + Math.random() * 10,
      recommended: hour >= 9 && hour <= 11 ? 'optimal' : 
                   hour >= 14 && hour <= 16 ? 'spend' :
                   hour >= 22 || hour <= 5 ? 'avoid' : 'save'
    }))
  };

  const emotionalChronotype = {
    chronotype: 'morning-lark' as const,
    peakDecisionHours: [9, 10, 11],
    vulnerabilityWindows: [
      { startHour: 22, endHour: 2, riskLevel: 'high' as const, typicalTriggers: ['Late-night shopping', 'Emotional purchases'] },
      { startHour: 17, endHour: 19, riskLevel: 'medium' as const, typicalTriggers: ['Post-work stress spending', 'Convenience purchases'] },
      { startHour: 13, endHour: 14, riskLevel: 'low' as const, typicalTriggers: ['Lunch impulse buys'] },
    ]
  };

  const sleepCorrelations = [
    { date: new Date('2024-01-18'), sleepHours: 7.5, sleepQuality: 85, nextDaySpending: 450, impulseDecisions: 1 },
    { date: new Date('2024-01-17'), sleepHours: 5.5, sleepQuality: 45, nextDaySpending: 2200, impulseDecisions: 5 },
    { date: new Date('2024-01-16'), sleepHours: 8.0, sleepQuality: 92, nextDaySpending: 280, impulseDecisions: 0 },
    { date: new Date('2024-01-15'), sleepHours: 6.0, sleepQuality: 55, nextDaySpending: 1500, impulseDecisions: 3 },
  ];

  const circadianPlans = [
    { id: '1', taskType: 'bill-payment' as const, optimalTimeSlot: { dayOfWeek: 'Sunday', hour: 10 }, reason: 'Highest cognitive capacity, lowest stress', successProbability: 92 },
    { id: '2', taskType: 'investment' as const, optimalTimeSlot: { dayOfWeek: 'Tuesday', hour: 11 }, reason: 'Peak analytical thinking period', successProbability: 88 },
    { id: '3', taskType: 'major-purchase' as const, optimalTimeSlot: { dayOfWeek: 'Saturday', hour: 10 }, reason: 'Well-rested, no work stress', successProbability: 85 },
  ];

  const seasonalAdjustment = {
    currentSeason: 'Winter',
    weatherImpact: 15,
    moodCorrelation: 72,
    suggestedBudgetAdjustment: 8,
    affectedCategories: [
      { category: 'Comfort Food', adjustment: 25, reason: 'Seasonal cravings increase' },
      { category: 'Entertainment', adjustment: 18, reason: 'Indoor activities preferred' },
      { category: 'Fitness', adjustment: -12, reason: 'Gym attendance drops' },
    ]
  };

  const getRecommendedColor = (rec: string) => {
    switch (rec) {
      case 'optimal': return 'bg-emerald-500';
      case 'spend': return 'bg-blue-500';
      case 'save': return 'bg-amber-500';
      case 'avoid': return 'bg-destructive';
      default: return 'bg-muted';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'bg-emerald-500/20 text-emerald-400';
      case 'medium': return 'bg-amber-500/20 text-amber-400';
      case 'high': return 'bg-destructive/20 text-destructive';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/20 to-purple-500/20">
          <Clock className="h-8 w-8 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Circadian Cash Flow Optimizer</h1>
          <p className="text-muted-foreground">Align spending with your biological & emotional rhythms</p>
        </div>
      </div>

      {/* Current Status */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/20">
              <Zap className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Energy Level</p>
              <p className="text-2xl font-bold">{biologicalClock.energyLevel}%</p>
            </div>
          </div>
        </InteractiveCard>

        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/20">
              <Brain className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Cognitive</p>
              <p className="text-2xl font-bold">{biologicalClock.cognitiveCapacity}%</p>
            </div>
          </div>
        </InteractiveCard>

        <InteractiveCard className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-pink-500/20">
              <Heart className="h-5 w-5 text-pink-400" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Emotional</p>
              <p className="text-2xl font-bold">{biologicalClock.emotionalStability}%</p>
            </div>
          </div>
        </InteractiveCard>

        <InteractiveCard className={`p-4 ${biologicalClock.optimalForDecisions ? 'border-emerald-500/50' : 'border-amber-500/50'}`}>
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${biologicalClock.optimalForDecisions ? 'bg-emerald-500/20' : 'bg-amber-500/20'}`}>
              {biologicalClock.optimalForDecisions ? 
                <Sun className="h-5 w-5 text-emerald-400" /> : 
                <Moon className="h-5 w-5 text-amber-400" />
              }
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Decision Mode</p>
              <p className={`text-lg font-bold ${biologicalClock.optimalForDecisions ? 'text-emerald-400' : 'text-amber-400'}`}>
                {biologicalClock.optimalForDecisions ? 'Optimal' : 'Caution'}
              </p>
            </div>
          </div>
        </InteractiveCard>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-4 w-full max-w-2xl">
          <TabsTrigger value="clock">Bio Clock</TabsTrigger>
          <TabsTrigger value="sleep">Sleep-Spend</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="seasonal">Seasonal</TabsTrigger>
        </TabsList>

        <TabsContent value="clock" className="space-y-6 mt-6">
          {/* Biological Financial Clock */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                Your Biological Financial Clock
              </CardTitle>
              <CardDescription>24-hour visualization of optimal decision times</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-12 gap-1 mb-4">
                {biologicalClock.hourlyData.map((hour) => (
                  <div 
                    key={hour.hour} 
                    className={`h-16 rounded-sm flex flex-col items-center justify-end p-1 ${getRecommendedColor(hour.recommended as string)} opacity-${Math.round(hour.energy / 10) * 10}`}
                    title={`${hour.hour}:00 - ${hour.recommended}`}
                  >
                    <span className="text-[10px] text-white font-medium">{hour.hour}</span>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-emerald-500" />
                  <span>Optimal for decisions</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-blue-500" />
                  <span>Good for spending</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-500" />
                  <span>Save mode</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-destructive" />
                  <span>Avoid purchases</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vulnerability Windows */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-amber-400" />
                Emotional Spending Chronotypes
              </CardTitle>
              <CardDescription>Your personal vulnerability windows</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {emotionalChronotype.chronotype === 'morning-lark' ? '🌅' : '🦉'} 
                  {emotionalChronotype.chronotype.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </Badge>
                <p className="text-sm text-muted-foreground mt-2">
                  Peak decision hours: {emotionalChronotype.peakDecisionHours.map(h => `${h}:00`).join(', ')}
                </p>
              </div>
              
              <div className="space-y-4">
                {emotionalChronotype.vulnerabilityWindows.map((window, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium">
                        {window.startHour}:00 - {window.endHour}:00
                      </span>
                      <Badge className={getRiskColor(window.riskLevel)}>
                        {window.riskLevel.toUpperCase()} RISK
                      </Badge>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {window.typicalTriggers.map((trigger, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{trigger}</Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sleep" className="space-y-6 mt-6">
          {/* Sleep-Spending Correlation */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BedDouble className="h-5 w-5 text-purple-400" />
                Sleep-Spending Correlation
              </CardTitle>
              <CardDescription>How your sleep affects next-day spending</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sleepCorrelations.map((day, index) => (
                  <div key={index} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">
                        {day.date.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      <Badge variant={day.sleepQuality >= 70 ? 'default' : 'destructive'}>
                        {day.sleepQuality >= 70 ? 'Good Sleep' : 'Poor Sleep'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Sleep Hours</p>
                        <p className="font-medium flex items-center gap-1">
                          <Moon className="h-4 w-4" />
                          {day.sleepHours}h
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Quality</p>
                        <Progress value={day.sleepQuality} className="h-2 mt-1" />
                      </div>
                      <div>
                        <p className="text-muted-foreground">Spending</p>
                        <p className={`font-medium ${day.nextDaySpending > 1000 ? 'text-destructive' : 'text-emerald-400'}`}>
                          ₹{day.nextDaySpending.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Impulse</p>
                        <p className={`font-medium ${day.impulseDecisions > 2 ? 'text-destructive' : 'text-emerald-400'}`}>
                          {day.impulseDecisions} decisions
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 rounded-lg bg-purple-500/10 border border-purple-500/30">
                <p className="font-medium text-purple-400">💡 Insight</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Your spending increases by an average of <strong>₹1,750</strong> on days following poor sleep (less than 6 hours).
                  Prioritizing sleep could save you <strong>₹7,000+</strong> per month.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6 mt-6">
          {/* Circadian Financial Planning */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Circadian Financial Planning
              </CardTitle>
              <CardDescription>Optimal scheduling for important money decisions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {circadianPlans.map((plan) => (
                  <div key={plan.id} className="p-4 rounded-lg border border-primary/30 bg-primary/5">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="capitalize">
                          {plan.taskType.replace('-', ' ')}
                        </Badge>
                      </div>
                      <div className="text-right">
                        <ProgressRing 
                          progress={plan.successProbability} 
                          size={50} 
                          strokeWidth={4}
                          color="success"
                        >
                          <span className="text-xs font-bold">{plan.successProbability}%</span>
                        </ProgressRing>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-lg font-medium">
                        {plan.optimalTimeSlot.dayOfWeek} at {plan.optimalTimeSlot.hour}:00
                      </p>
                      <p className="text-sm text-muted-foreground">{plan.reason}</p>
                    </div>
                    
                    <Button 
                      className="w-full mt-4" 
                      variant="outline"
                      onClick={() => {
                        const success = addToCalendar({
                          title: `Schedule: ${plan.reason}`,
                          description: `Optimal time for financial decision: ${plan.reason}`,
                          date: new Date(),
                          time: `${String(plan.optimalTimeSlot.hour).padStart(2, '0')}:00`,
                          duration: 60,
                        });
                        if (success) {
                          setCalendarSuccess(plan.id);
                          setTimeout(() => setCalendarSuccess(null), 2000);
                        }
                      }}
                    >
                      {calendarSuccess === plan.id ? (
                        <><Check className="h-4 w-4 mr-2" /> Added!</>
                      ) : (
                        <><Calendar className="h-4 w-4 mr-2" /> Add to Calendar</>
                      )}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="seasonal" className="space-y-6 mt-6">
          {/* Seasonal Affective Spending Adjuster */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-blue-400" />
                Seasonal Affective Spending Adjuster
              </CardTitle>
              <CardDescription>Weather and seasonal mood impact on your budget</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="p-4 rounded-lg bg-blue-500/10 text-center">
                  <Thermometer className="h-8 w-8 mx-auto text-blue-400 mb-2" />
                  <p className="text-2xl font-bold">{seasonalAdjustment.currentSeason}</p>
                  <p className="text-sm text-muted-foreground">Current Season</p>
                </div>
                <div className="p-4 rounded-lg bg-muted text-center">
                  <TrendingUp className="h-8 w-8 mx-auto text-amber-400 mb-2" />
                  <p className="text-2xl font-bold">+{seasonalAdjustment.weatherImpact}%</p>
                  <p className="text-sm text-muted-foreground">Weather Impact</p>
                </div>
                <div className="p-4 rounded-lg bg-primary/10 text-center">
                  <Activity className="h-8 w-8 mx-auto text-primary mb-2" />
                  <p className="text-2xl font-bold">{seasonalAdjustment.moodCorrelation}%</p>
                  <p className="text-sm text-muted-foreground">Mood Correlation</p>
                </div>
              </div>
              
              <div className="p-4 rounded-lg bg-amber-500/10 border border-amber-500/30 mb-6">
                <p className="font-medium text-amber-400 mb-2">
                  💡 Suggested Budget Adjustment: +{seasonalAdjustment.suggestedBudgetAdjustment}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on historical patterns, consider adjusting your budget to accommodate seasonal spending changes.
                </p>
              </div>
              
              <h4 className="font-medium mb-4">Affected Categories</h4>
              <div className="space-y-3">
                {seasonalAdjustment.affectedCategories.map((cat, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                    <span>{cat.category}</span>
                    <div className="text-right">
                      <Badge variant={cat.adjustment > 0 ? 'destructive' : 'default'}>
                        {cat.adjustment > 0 ? '+' : ''}{cat.adjustment}%
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{cat.reason}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CircadianCashFlowSection;
