import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import GradientText from '@/components/reactbits/GradientText';
import InteractiveCard from '@/components/reactbits/InteractiveCard';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import AnimatedCounter from '@/components/reactbits/AnimatedCounter';
import HoverCard3D from '@/components/reactbits/HoverCard3D';
import { 
  TimeTravelingBalance,
  RegretAnalysis,
  ParallelUniverse,
  FutureBillShadow,
  ReverseCompoundCalculation,
  calculateRegretScore,
  calculateMemoryDecay
} from '@/types/futureProjection';
import { incomeRangeToNumber } from '@/types/userProfile';
import { 
  Clock, 
  TrendingUp, 
  TrendingDown,
  Zap,
  Calendar,
  AlertTriangle,
  Target,
  Brain,
  Sparkles,
  DollarSign,
  ArrowRight,
  GitBranch,
  Eye,
  PiggyBank,
  Wallet,
  RotateCcw,
  Timer
} from 'lucide-react';

const FutureSelfProjectionSection: React.FC = () => {
  const { profile, analysis } = useUserProfile();
  const [projectionDays, setProjectionDays] = useState(30);
  const [purchaseAmount, setPurchaseAmount] = useState(5000);
  const [purchaseItem, setPurchaseItem] = useState('');
  const [dailySpend, setDailySpend] = useState(500);

  if (!profile || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access Future Self Projection</p>
      </div>
    );
  }

  const income = incomeRangeToNumber(profile.monthlyIncomeRange);
  const monthlyExpenses = profile.totalFixedAmount + (income.avg * 0.3);
  const dailyBudget = analysis.dailyBudget;
  const currentBalance = income.avg - monthlyExpenses;

  // Time-Traveling Balance calculation
  const timeTravelingBalance: TimeTravelingBalance = useMemo(() => {
    const dailyNet = dailyBudget - (profile.spendingStyle === 'mostly_impulsive' ? dailyBudget * 1.2 : dailyBudget * 0.9);
    const projected = currentBalance + (dailyNet * projectionDays);
    
    return {
      currentBalance,
      projectedBalance: Math.max(0, projected),
      daysAhead: projectionDays,
      assumptions: [
        profile.spendingStyle === 'mostly_impulsive' ? 'Based on impulse spending pattern' : 'Based on planned spending',
        `Daily budget: ₹${dailyBudget}`,
        `Fixed expenses: ₹${profile.totalFixedAmount.toLocaleString()}`,
      ],
      confidence: profile.spendingStyle === 'mostly_planned' ? 'high' : 
                  profile.spendingStyle === 'mixed' ? 'medium' : 'low',
    };
  }, [currentBalance, projectionDays, dailyBudget, profile]);

  // Regret Analysis
  const regretAnalysis: RegretAnalysis | null = useMemo(() => {
    if (!purchaseItem || !purchaseAmount) return null;
    
    const isPractical = ['laptop', 'phone', 'education', 'health'].some(
      p => purchaseItem.toLowerCase().includes(p)
    );
    const regretScore = calculateRegretScore(purchaseAmount, 'shopping', isPractical);
    
    return {
      purchaseAmount,
      purchaseItem,
      regretScore,
      futureFeeling: regretScore > 60 ? 'regretful' : regretScore > 30 ? 'neutral' : 'satisfied',
      alternativeUse: purchaseAmount > 5000 
        ? `Could cover ${Math.floor(purchaseAmount / dailyBudget)} days of expenses`
        : `Could add ₹${purchaseAmount} to your emergency fund`,
      weeksAhead: 2,
    };
  }, [purchaseAmount, purchaseItem, dailyBudget]);

  // Parallel Universe scenarios
  const parallelUniverses: ParallelUniverse[] = useMemo(() => [
    {
      id: '1',
      scenarioName: 'The Saver',
      description: 'What if you saved 20% of impulse purchases?',
      decisions: [
        { date: 'Last month', description: 'Food delivery', actualChoice: 'Ordered out', alternativeChoice: 'Cooked at home', financialImpact: -3000 },
        { date: 'Last week', description: 'Online shopping', actualChoice: 'Bought on impulse', alternativeChoice: 'Waited 48 hours', financialImpact: -2000 },
      ],
      projectedOutcome: currentBalance + 5000,
      actualOutcome: currentBalance,
      difference: 5000,
      insight: 'Small changes could have added ₹5,000 to your savings this month.',
    },
    {
      id: '2',
      scenarioName: 'The Investor',
      description: 'What if you invested your savings?',
      decisions: [
        { date: '1 year ago', description: 'Idle savings', actualChoice: 'Kept in savings account', alternativeChoice: 'Invested in index fund', financialImpact: -8000 },
      ],
      projectedOutcome: currentBalance + 8000,
      actualOutcome: currentBalance,
      difference: 8000,
      insight: 'Long-term investing could grow your wealth significantly.',
    },
  ], [currentBalance]);

  // Future Bill Shadows
  const futureBillShadows: FutureBillShadow[] = useMemo(() => {
    const shadows: FutureBillShadow[] = [];
    
    if (profile.commitments.includes('rent')) {
      shadows.push({
        id: '1',
        billName: 'Rent',
        amount: profile.totalFixedAmount * 0.4,
        dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilDue: 15,
        impactOnBalance: profile.totalFixedAmount * 0.4,
        currentBalancePercentage: Math.round((profile.totalFixedAmount * 0.4 / currentBalance) * 100),
        severity: 'high',
      });
    }
    
    if (profile.commitments.some(c => c.includes('emi'))) {
      shadows.push({
        id: '2',
        billName: 'EMI Payment',
        amount: profile.totalFixedAmount * 0.3,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilDue: 7,
        impactOnBalance: profile.totalFixedAmount * 0.3,
        currentBalancePercentage: Math.round((profile.totalFixedAmount * 0.3 / currentBalance) * 100),
        severity: 'high',
      });
    }
    
    if (profile.commitments.includes('subscriptions')) {
      shadows.push({
        id: '3',
        billName: 'Subscriptions',
        amount: 2000,
        dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        daysUntilDue: 3,
        impactOnBalance: 2000,
        currentBalancePercentage: Math.round((2000 / currentBalance) * 100),
        severity: 'low',
      });
    }
    
    return shadows;
  }, [profile, currentBalance]);

  // Reverse Compound Interest
  const reverseCompound: ReverseCompoundCalculation = useMemo(() => {
    const weekly = dailySpend * 7;
    const monthly = dailySpend * 30;
    const yearly = dailySpend * 365;
    const fiveYear = yearly * 5;
    
    // If invested at 12% return
    const investedGrowth = yearly * Math.pow(1.12, 5);
    
    return {
      dailyAmount: dailySpend,
      weeklyTotal: weekly,
      monthlyTotal: monthly,
      yearlyTotal: yearly,
      fiveYearTotal: fiveYear,
      investedAlternative: Math.round(investedGrowth),
      lostOpportunity: `If invested, ₹${dailySpend}/day could become ₹${Math.round(investedGrowth).toLocaleString()} in 5 years`,
    };
  }, [dailySpend]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Clock className="h-7 w-7 text-primary" />
          <GradientText>Future Self Projection</GradientText>
        </h1>
        <p className="text-muted-foreground mt-1">See how today's choices affect tomorrow's you</p>
      </div>

      <Tabs defaultValue="timetravel" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="timetravel">Time Travel</TabsTrigger>
          <TabsTrigger value="regret">Regret AI</TabsTrigger>
          <TabsTrigger value="parallel">Parallel Lives</TabsTrigger>
          <TabsTrigger value="shadows">Bill Shadows</TabsTrigger>
          <TabsTrigger value="compound">Lost Money</TabsTrigger>
        </TabsList>

        {/* Time-Traveling Balance */}
        <TabsContent value="timetravel" className="space-y-4">
          <GlowCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-5 w-5 text-primary" />
                Time-Traveling Balance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Your balance in {projectionDays} days:</p>
                <p className={`text-4xl font-bold ${timeTravelingBalance.projectedBalance > currentBalance ? 'text-emerald-500' : 'text-destructive'}`}>
                  ₹<CountUpNumber value={timeTravelingBalance.projectedBalance} />
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Current: ₹{currentBalance.toLocaleString()}
                </p>
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">
                  Project {projectionDays} days ahead
                </label>
                <Slider
                  value={[projectionDays]}
                  onValueChange={([v]) => setProjectionDays(v)}
                  min={7}
                  max={90}
                  step={7}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {timeTravelingBalance.assumptions.map((assumption, i) => (
                  <div key={i} className="p-3 rounded-lg bg-muted/50 text-sm">
                    {assumption}
                  </div>
                ))}
              </div>
              
              <Badge variant={
                timeTravelingBalance.confidence === 'high' ? 'default' : 
                timeTravelingBalance.confidence === 'medium' ? 'secondary' : 'destructive'
              }>
                Confidence: {timeTravelingBalance.confidence}
              </Badge>
            </CardContent>
          </GlowCard>
        </TabsContent>

        {/* Regret Minimization AI */}
        <TabsContent value="regret" className="space-y-4">
          <GlowCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5 text-primary" />
                Regret Minimization AI
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter a purchase you're considering, and I'll predict how Future-You will feel about it.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  placeholder="What do you want to buy? (e.g., new headphones)"
                  value={purchaseItem}
                  onChange={(e) => setPurchaseItem(e.target.value)}
                />
                <div>
                  <label className="text-sm text-muted-foreground">
                    Amount: ₹{purchaseAmount.toLocaleString()}
                  </label>
                  <Slider
                    value={[purchaseAmount]}
                    onValueChange={([v]) => setPurchaseAmount(v)}
                    min={500}
                    max={50000}
                    step={500}
                    className="mt-2"
                  />
                </div>
              </div>
              
              {regretAnalysis && (
                <Alert className={
                  regretAnalysis.futureFeeling === 'regretful' ? 'border-destructive bg-destructive/5' :
                  regretAnalysis.futureFeeling === 'neutral' ? 'border-amber-500 bg-amber-500/5' :
                  'border-emerald-500 bg-emerald-500/5'
                }>
                  <Brain className="h-4 w-4" />
                  <AlertTitle>
                    In 2 weeks, Future-You will likely feel: 
                    <span className={
                      regretAnalysis.futureFeeling === 'regretful' ? ' text-destructive' :
                      regretAnalysis.futureFeeling === 'neutral' ? ' text-amber-500' : ' text-emerald-500'
                    }>
                      {' '}{regretAnalysis.futureFeeling.toUpperCase()}
                    </span>
                  </AlertTitle>
                  <AlertDescription className="mt-2">
                    <p>Regret Score: {regretAnalysis.regretScore}/100</p>
                    <p className="mt-1">Alternative use: {regretAnalysis.alternativeUse}</p>
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </GlowCard>
        </TabsContent>

        {/* Parallel Universe Simulator */}
        <TabsContent value="parallel" className="space-y-4">
          <div className="space-y-4">
            {parallelUniverses.map((universe) => (
              <HoverCard3D key={universe.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <GitBranch className="h-5 w-5 text-primary" />
                        <h3 className="font-semibold text-lg">{universe.scenarioName}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{universe.description}</p>
                    </div>
                    <Badge variant="outline" className="text-lg">
                      +₹<CountUpNumber value={universe.difference} />
                    </Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {universe.decisions.map((decision, i) => (
                      <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-muted/50">
                        <div className="w-20 text-xs text-muted-foreground">{decision.date}</div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">{decision.description}</p>
                          <div className="flex items-center gap-2 text-xs mt-1">
                            <span className="text-destructive">{decision.actualChoice}</span>
                            <ArrowRight className="h-3 w-3" />
                            <span className="text-emerald-500">{decision.alternativeChoice}</span>
                          </div>
                        </div>
                        <span className="text-sm font-medium text-destructive">
                          ₹{Math.abs(decision.financialImpact).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <Alert className="mt-4 bg-primary/5 border-primary/20">
                    <Sparkles className="h-4 w-4" />
                    <AlertDescription>{universe.insight}</AlertDescription>
                  </Alert>
                </CardContent>
              </HoverCard3D>
            ))}
          </div>
        </TabsContent>

        {/* Future Bill Shadows */}
        <TabsContent value="shadows" className="space-y-4">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertTitle>Bill Shadows on Your Balance</AlertTitle>
            <AlertDescription>
              See upcoming bills as "shadows" on your current balance
            </AlertDescription>
          </Alert>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {futureBillShadows.map((shadow) => (
              <InteractiveCard key={shadow.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{shadow.billName}</span>
                    <Badge variant={
                      shadow.severity === 'high' ? 'destructive' : 
                      shadow.severity === 'medium' ? 'secondary' : 'outline'
                    }>
                      {shadow.daysUntilDue} days
                    </Badge>
                  </div>
                  
                  <p className="text-2xl font-bold">₹{shadow.amount.toLocaleString()}</p>
                  
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Impact on balance</span>
                      <span>{shadow.currentBalancePercentage}%</span>
                    </div>
                    <Progress value={shadow.currentBalancePercentage} className="h-2" />
                  </div>
                  
                  <p className="text-xs text-muted-foreground">
                    Due: {new Date(shadow.dueDate).toLocaleDateString()}
                  </p>
                </div>
              </InteractiveCard>
            ))}
          </div>
        </TabsContent>

        {/* Reverse Compound Interest */}
        <TabsContent value="compound" className="space-y-4">
          <GlowCard>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <RotateCcw className="h-5 w-5 text-primary" />
                Reverse Compound Interest
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm text-muted-foreground">
                See how small daily spends accumulate to yearly "lost opportunities"
              </p>
              
              <div>
                <label className="text-sm text-muted-foreground">
                  Daily discretionary spend: ₹{dailySpend}
                </label>
                <Slider
                  value={[dailySpend]}
                  onValueChange={([v]) => setDailySpend(v)}
                  min={100}
                  max={2000}
                  step={50}
                  className="mt-2"
                />
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <InteractiveCard className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Weekly</p>
                  <p className="text-xl font-bold">₹<AnimatedCounter value={reverseCompound.weeklyTotal} /></p>
                </InteractiveCard>
                <InteractiveCard className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Monthly</p>
                  <p className="text-xl font-bold">₹<AnimatedCounter value={reverseCompound.monthlyTotal} /></p>
                </InteractiveCard>
                <InteractiveCard className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">Yearly</p>
                  <p className="text-xl font-bold text-amber-500">₹<AnimatedCounter value={reverseCompound.yearlyTotal} /></p>
                </InteractiveCard>
                <InteractiveCard className="p-4 text-center">
                  <p className="text-xs text-muted-foreground">5 Years</p>
                  <p className="text-xl font-bold text-destructive">₹<AnimatedCounter value={reverseCompound.fiveYearTotal} /></p>
                </InteractiveCard>
              </div>
              
              <Alert className="bg-emerald-500/5 border-emerald-500/30">
                <PiggyBank className="h-4 w-4 text-emerald-500" />
                <AlertTitle className="text-emerald-700 dark:text-emerald-400">What if you invested instead?</AlertTitle>
                <AlertDescription>
                  {reverseCompound.lostOpportunity}
                </AlertDescription>
              </Alert>
            </CardContent>
          </GlowCard>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FutureSelfProjectionSection;
