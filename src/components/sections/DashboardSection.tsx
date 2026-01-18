import StressScoreGauge from '@/components/dashboard/StressScoreGauge';
import SilentBurdenCard from '@/components/dashboard/SilentBurdenCard';
import SurvivalMeter from '@/components/dashboard/SurvivalMeter';
import StressSignalCard from '@/components/dashboard/StressSignalCard';
import BudgetGuardrailCard from '@/components/dashboard/BudgetGuardrailCard';
import SpendingChart from '@/components/dashboard/SpendingChart';
import QuickActions from '@/components/dashboard/QuickActions';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUserProfile } from '@/contexts/UserProfileContext';
import { incomeRangeToNumber } from '@/types/userProfile';
import AnimatedCounter from '@/components/reactbits/AnimatedCounter';
import GlowCard from '@/components/reactbits/GlowCard';
import GradientText from '@/components/reactbits/GradientText';
import { ArrowDown, ArrowUp, PiggyBank, TrendingUp, Sparkles } from 'lucide-react';

const DashboardSection = () => {
  const { profile, analysis, crisisStatus } = useUserProfile();

  // Use real data from user profile, fallback to defaults
  const income = profile ? incomeRangeToNumber(profile.monthlyIncomeRange) : { avg: 50000, min: 25000, max: 75000 };
  const totalIncome = income.avg;
  const totalExpenses = profile ? profile.totalFixedAmount + (income.avg * 0.3) : 35000;
  const savings = Math.max(0, totalIncome - totalExpenses);
  const savingsRate = totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;
  
  const stressScore = analysis?.stressScore ?? 45;
  const silentBurdenIndex = analysis?.silentBurdenIndex ?? 50;
  const survivalDays = analysis?.survivalDays ?? 15;

  // Generate stress signals from analysis - properly typed for StressSignal interface
  const stressSignals = analysis?.activeSignals?.map(signal => ({
    id: signal.id,
    type: 'micro_spike' as const,
    severity: signal.severity,
    title: signal.title,
    description: signal.description,
    actionable: signal.actionable,
  })) ?? [];

  // Generate budget guardrails from profile - properly typed for BudgetGuardrail
  const budgetGuardrails = profile ? [
    { category: 'food' as const, limit: Math.round(income.avg * 0.15), spent: Math.round(income.avg * 0.12) },
    { category: 'shopping' as const, limit: Math.round(income.avg * 0.1), spent: Math.round(income.avg * 0.08) },
    { category: 'entertainment' as const, limit: Math.round(income.avg * 0.05), spent: Math.round(income.avg * 0.04) },
    { category: 'travel' as const, limit: Math.round(income.avg * 0.1), spent: Math.round(income.avg * 0.07) },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="h-6 w-6 text-primary" />
            <GradientText>Financial Dashboard</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">
            {profile ? `Welcome back! Here's your financial overview.` : 'Complete onboarding to see personalized data.'}
          </p>
        </div>
        {crisisStatus?.isInCrisis && (
          <div className="px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/50 text-destructive text-sm font-medium animate-pulse">
            ⚠️ Crisis Mode Active
          </div>
        )}
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlowCard>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-2xl font-bold">₹<AnimatedCounter value={totalIncome} /></p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </GlowCard>
        
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">₹<AnimatedCounter value={totalExpenses} /></p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <ArrowDown className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Net Savings</p>
                <p className="text-2xl font-bold text-emerald-600">₹<AnimatedCounter value={savings} /></p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/50 shadow-md bg-primary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">AI Predicted Savings Rate</p>
                <p className="text-2xl font-bold text-primary"><AnimatedCounter value={savingsRate} />%</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stress Score & Signals */}
        <div className="space-y-6">
          <Card className="border-border/50 shadow-md">
            <CardHeader className="pb-0">
              <CardTitle className="text-lg">Financial Stress Score</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <StressScoreGauge score={stressScore} />
            </CardContent>
          </Card>
          
          <QuickActions />
        </div>

        {/* Middle Column - Charts & Transactions */}
        <div className="space-y-6">
          <SpendingChart />
          <CategoryBreakdown />
        </div>

        {/* Right Column - Metrics & Budget */}
        <div className="space-y-6">
          <SilentBurdenCard 
            burdenIndex={silentBurdenIndex}
            salary={totalIncome}
          />
          <SurvivalMeter 
            days={survivalDays}
            currentBalance={savings}
            dailySpendRate={Math.round(totalExpenses / 30)}
          />
        </div>
      </div>

      {/* Stress Signals Section */}
      {stressSignals.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Active Stress Signals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {stressSignals.map((signal) => (
              <StressSignalCard key={signal.id} signal={signal} />
            ))}
          </div>
        </div>
      )}

      {/* Bottom Section */}
      {budgetGuardrails.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <BudgetGuardrailCard guardrails={budgetGuardrails} />
        </div>
      )}
    </div>
  );
};

export default DashboardSection;
