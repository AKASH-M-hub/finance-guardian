import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown, 
  AlertTriangle, 
  MessageCircle,
  Target,
  GitFork,
  Calendar,
  Lightbulb,
  Heart
} from 'lucide-react';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import GlowCard from '@/components/reactbits/GlowCard';

// Mock data for demonstration
const mockData = {
  habitContinuations: [
    { id: '1', habitName: 'Daily Coffee Shop', currentMonthlyAmount: 3000, projectedMonthlyAmount: 3500, yearsProjected: 5, totalLifetimeCost: 210000, alternativeOutcome: 'Could fund a vacation' },
    { id: '2', habitName: 'Food Delivery', currentMonthlyAmount: 5000, projectedMonthlyAmount: 6000, yearsProjected: 5, totalLifetimeCost: 360000, alternativeOutcome: 'Down payment for bike' },
    { id: '3', habitName: 'Streaming Services', currentMonthlyAmount: 1500, projectedMonthlyAmount: 2000, yearsProjected: 5, totalLifetimeCost: 108000, alternativeOutcome: 'Emergency fund boost' },
  ],
  timeImpactView: {
    threeMonthImpact: -15000,
    sixMonthImpact: -32000,
    twelveMonthImpact: -68000,
    projectedSavings: 25000,
    projectedDebt: 45000,
  },
  opportunityLosses: [
    { id: '1', dailyAmount: 200, weeklyAmount: 1400, monthlyAmount: 6000, yearlyAmount: 72000, investedValue: 95000, lostOpportunityDescription: 'Could have grown to ₹95K if invested at 8%' },
  ],
  alternativeHabits: [
    { id: '1', currentHabit: 'Daily café coffee', alternativeHabit: 'Home-brewed specialty coffee', monthlySavings: 2500, yearlyImpact: 30000, difficultyLevel: 'easy' as const, successRate: 78 },
    { id: '2', currentHabit: 'Weekly shopping spree', alternativeHabit: '30-day wishlist rule', monthlySavings: 4000, yearlyImpact: 48000, difficultyLevel: 'medium' as const, successRate: 65 },
    { id: '3', currentHabit: 'Impulse food ordering', alternativeHabit: 'Meal prep Sundays', monthlySavings: 3500, yearlyImpact: 42000, difficultyLevel: 'medium' as const, successRate: 70 },
  ],
  forkView: {
    savingsPath: { balance: 150000, monthlyGrowth: 8000, yearlyGrowth: 96000, fiveYearProjection: 650000 },
    spendingPath: { balance: 50000, monthlyDecrease: 3000, yearlyDecrease: 36000, fiveYearProjection: -130000 },
    difference: 780000,
  },
  stressProjection: {
    currentStressScore: 65,
    threeMonthProjection: 72,
    sixMonthProjection: 78,
    yearProjection: 85,
    trend: 'worsening' as const,
  },
  goalDelays: [
    { goalName: 'Emergency Fund (6 months)', originalTimeframe: 12, projectedTimeframe: 24, delayMonths: 12, delayReason: 'Lifestyle inflation eating savings' },
    { goalName: 'Vacation Fund', originalTimeframe: 8, projectedTimeframe: 14, delayMonths: 6, delayReason: 'Impulse spending patterns' },
  ],
  regretRisks: [
    { id: '1', habitName: 'Late-night shopping', riskScore: 82, regretProbability: 75, category: 'Impulse', warningMessage: 'High regret probability - consider 24h wait rule' },
    { id: '2', habitName: 'Subscription creep', riskScore: 68, regretProbability: 60, category: 'Recurring', warningMessage: 'Slowly draining funds - audit recommended' },
  ],
  futureYouMessage: {
    message: "Hey, it's you from 6 months ahead. That phone upgrade you're eyeing? Still using the old one and it works fine. The money went toward that trip with friends instead - no regrets at all.",
    tone: 'encouraging' as const,
    daysAhead: 180,
    keyInsight: 'Experiences over things have a higher satisfaction rate for you.',
  },
};

const RegretPreventionSection = () => {
  const [selectedTab, setSelectedTab] = useState('simulator');

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving': return 'success';
      case 'stable': return 'warning';
      case 'worsening': return 'danger';
      default: return 'primary';
    }
  };

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case 'easy': return 'bg-green-500/20 text-green-400';
      case 'medium': return 'bg-yellow-500/20 text-yellow-400';
      case 'hard': return 'bg-red-500/20 text-red-400';
      default: return 'bg-muted';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Clock className="h-6 w-6 text-primary" />
            Regret Prevention Simulator
          </h1>
          <p className="text-muted-foreground mt-1">
            See future consequences of current habits in simple, human terms
          </p>
        </div>
      </div>

      {/* Future You Message */}
      <GlowCard className="border-primary/30 bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5 text-primary" />
            <CardTitle className="text-lg">Message from Future You</CardTitle>
            <Badge variant="outline">{mockData.futureYouMessage.daysAhead} days ahead</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <blockquote className="italic text-lg border-l-4 border-primary pl-4 mb-4">
            "{mockData.futureYouMessage.message}"
          </blockquote>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Lightbulb className="h-4 w-4 text-yellow-500" />
            <span>Key insight: {mockData.futureYouMessage.keyInsight}</span>
          </div>
        </CardContent>
      </GlowCard>

      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-4">
          <TabsTrigger value="simulator">Simulator</TabsTrigger>
          <TabsTrigger value="fork">Fork View</TabsTrigger>
          <TabsTrigger value="alternatives">Alternatives</TabsTrigger>
          <TabsTrigger value="risks">Risk Radar</TabsTrigger>
        </TabsList>

        {/* Habit Continuation Simulator */}
        <TabsContent value="simulator" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Time Impact Cards */}
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">3-Month Impact</p>
                <div className={`text-2xl font-bold ${mockData.timeImpactView.threeMonthImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹<CountUpNumber value={Math.abs(mockData.timeImpactView.threeMonthImpact)} />
                </div>
                <TrendingDown className="h-4 w-4 mx-auto mt-1 text-red-500" />
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">6-Month Impact</p>
                <div className={`text-2xl font-bold ${mockData.timeImpactView.sixMonthImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹<CountUpNumber value={Math.abs(mockData.timeImpactView.sixMonthImpact)} />
                </div>
                <TrendingDown className="h-4 w-4 mx-auto mt-1 text-red-500" />
              </CardContent>
            </Card>
            <Card className="border-border/50">
              <CardContent className="p-4 text-center">
                <p className="text-sm text-muted-foreground mb-1">12-Month Impact</p>
                <div className={`text-2xl font-bold ${mockData.timeImpactView.twelveMonthImpact < 0 ? 'text-red-500' : 'text-green-500'}`}>
                  ₹<CountUpNumber value={Math.abs(mockData.timeImpactView.twelveMonthImpact)} />
                </div>
                <TrendingDown className="h-4 w-4 mx-auto mt-1 text-red-500" />
              </CardContent>
            </Card>
          </div>

          {/* Habit Projections */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Habit Continuation Projections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.habitContinuations.map((habit) => (
                <div key={habit.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{habit.habitName}</h4>
                    <Badge variant="destructive">
                      ₹{habit.totalLifetimeCost.toLocaleString()} in {habit.yearsProjected} years
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Current Monthly:</span>
                      <span className="ml-2 font-medium">₹{habit.currentMonthlyAmount.toLocaleString()}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Projected Monthly:</span>
                      <span className="ml-2 font-medium text-red-500">₹{habit.projectedMonthlyAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="text-sm text-primary flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    Alternative: {habit.alternativeOutcome}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Goal Delays */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="h-5 w-5" />
                Goal Delay Estimator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockData.goalDelays.map((goal, idx) => (
                <div key={idx} className="p-4 rounded-lg bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold">{goal.goalName}</h4>
                    <Badge variant="outline" className="text-yellow-500 border-yellow-500/50">
                      +{goal.delayMonths} months delayed
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Original: {goal.originalTimeframe}mo</span>
                    <span>→</span>
                    <span className="text-red-500">Now: {goal.projectedTimeframe}mo</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">{goal.delayReason}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Fork View */}
        <TabsContent value="fork" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Savings Path */}
            <Card className="border-green-500/30 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-green-500">
                  <TrendingUp className="h-5 w-5" />
                  Savings Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">5-Year Projection</p>
                  <p className="text-3xl font-bold text-green-500">
                    ₹<CountUpNumber value={mockData.forkView.savingsPath.fiveYearProjection} />
                  </p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance</span>
                    <span>₹{mockData.forkView.savingsPath.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Growth</span>
                    <span className="text-green-500">+₹{mockData.forkView.savingsPath.monthlyGrowth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yearly Growth</span>
                    <span className="text-green-500">+₹{mockData.forkView.savingsPath.yearlyGrowth.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Spending Path */}
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2 text-red-500">
                  <TrendingDown className="h-5 w-5" />
                  Spending Path
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">5-Year Projection</p>
                  <p className="text-3xl font-bold text-red-500">
                    ₹<CountUpNumber value={Math.abs(mockData.forkView.spendingPath.fiveYearProjection)} />
                  </p>
                  <span className="text-xs text-red-400">(in debt)</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Current Balance</span>
                    <span>₹{mockData.forkView.spendingPath.balance.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monthly Decrease</span>
                    <span className="text-red-500">-₹{mockData.forkView.spendingPath.monthlyDecrease.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Yearly Decrease</span>
                    <span className="text-red-500">-₹{mockData.forkView.spendingPath.yearlyDecrease.toLocaleString()}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Difference Highlight */}
          <Card className="border-primary/30 bg-gradient-to-r from-green-500/10 via-transparent to-red-500/10">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GitFork className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">The Fork Difference</p>
                    <p className="text-3xl font-bold text-primary">
                      ₹<CountUpNumber value={mockData.forkView.difference} />
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground max-w-xs text-right">
                  The gap between your best and worst financial futures over 5 years
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Stress Projection */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg">Long-Term Stress Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center gap-8">
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">Current</p>
                  <ProgressRing progress={mockData.stressProjection.currentStressScore} size={80} color="warning" />
                  <p className="mt-2 font-semibold">{mockData.stressProjection.currentStressScore}</p>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">3 months</p>
                  <ProgressRing progress={mockData.stressProjection.threeMonthProjection} size={80} color="warning" />
                  <p className="mt-2 font-semibold">{mockData.stressProjection.threeMonthProjection}</p>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">6 months</p>
                  <ProgressRing progress={mockData.stressProjection.sixMonthProjection} size={80} color="danger" />
                  <p className="mt-2 font-semibold">{mockData.stressProjection.sixMonthProjection}</p>
                </div>
                <span className="text-2xl">→</span>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground mb-2">1 year</p>
                  <ProgressRing progress={mockData.stressProjection.yearProjection} size={80} color="danger" />
                  <p className="mt-2 font-semibold">{mockData.stressProjection.yearProjection}</p>
                </div>
              </div>
              <div className="mt-4 text-center">
                <Badge variant={mockData.stressProjection.trend === 'worsening' ? 'destructive' : 'default'}>
                  Trend: {mockData.stressProjection.trend}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Alternative Habits */}
        <TabsContent value="alternatives" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Alternative Habit Simulator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.alternativeHabits.map((alt) => (
                <div key={alt.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(alt.difficultyLevel)}>
                        {alt.difficultyLevel}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{alt.successRate}% success rate</span>
                    </div>
                    <Badge variant="outline" className="text-green-500 border-green-500/50">
                      Save ₹{alt.yearlyImpact.toLocaleString()}/year
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-3 rounded bg-red-500/10 border border-red-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Current Habit</p>
                      <p className="font-medium">{alt.currentHabit}</p>
                    </div>
                    <div className="p-3 rounded bg-green-500/10 border border-green-500/20">
                      <p className="text-xs text-muted-foreground mb-1">Alternative</p>
                      <p className="font-medium">{alt.alternativeHabit}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" className="w-full">
                    Try This Alternative
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Opportunity Loss */}
          <Card className="border-yellow-500/30 bg-yellow-500/5">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-yellow-500" />
                Opportunity Loss Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              {mockData.opportunityLosses.map((opp) => (
                <div key={opp.id} className="space-y-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Daily</p>
                      <p className="text-lg font-bold">₹{opp.dailyAmount}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Weekly</p>
                      <p className="text-lg font-bold">₹{opp.weeklyAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Monthly</p>
                      <p className="text-lg font-bold">₹{opp.monthlyAmount.toLocaleString()}</p>
                    </div>
                    <div className="text-center p-3 rounded bg-muted/30">
                      <p className="text-xs text-muted-foreground">Yearly</p>
                      <p className="text-lg font-bold">₹{opp.yearlyAmount.toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="p-4 rounded bg-primary/10 border border-primary/20 text-center">
                    <p className="text-sm text-muted-foreground mb-1">If Invested Instead</p>
                    <p className="text-2xl font-bold text-primary">₹{opp.investedValue.toLocaleString()}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opp.lostOpportunityDescription}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Risk Radar */}
        <TabsContent value="risks" className="space-y-4">
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Regret Risk Indicator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockData.regretRisks.map((risk) => (
                <div key={risk.id} className="p-4 rounded-lg bg-muted/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <h4 className="font-semibold">{risk.habitName}</h4>
                      <Badge variant="outline">{risk.category}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <ProgressRing 
                        progress={risk.riskScore} 
                        size={50} 
                        color={risk.riskScore > 70 ? 'danger' : risk.riskScore > 40 ? 'warning' : 'success'} 
                      />
                      <span className="font-bold">{risk.riskScore}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Regret Probability</span>
                    <span className={risk.regretProbability > 70 ? 'text-red-500' : 'text-yellow-500'}>
                      {risk.regretProbability}%
                    </span>
                  </div>
                  <div className="p-3 rounded bg-yellow-500/10 border border-yellow-500/20 text-sm">
                    <Heart className="h-4 w-4 inline mr-2 text-yellow-500" />
                    {risk.warningMessage}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default RegretPreventionSection;
