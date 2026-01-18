import StressScoreGauge from '@/components/dashboard/StressScoreGauge';
import SilentBurdenCard from '@/components/dashboard/SilentBurdenCard';
import SurvivalMeter from '@/components/dashboard/SurvivalMeter';
import StressSignalCard from '@/components/dashboard/StressSignalCard';
import BudgetGuardrailCard from '@/components/dashboard/BudgetGuardrailCard';
import SpendingChart from '@/components/dashboard/SpendingChart';
import TransactionList from '@/components/dashboard/TransactionList';
import QuickActions from '@/components/dashboard/QuickActions';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockTransactions, mockStressSignals, mockBudgetGuardrails, mockFinancialSummary } from '@/data/mockData';
import { ArrowDown, ArrowUp, Wallet, PiggyBank, TrendingDown, TrendingUp } from 'lucide-react';

const DashboardSection = () => {
  const { totalIncome, totalExpenses, savings, stressScore, silentBurdenIndex, survivalDays } = mockFinancialSummary;

  return (
    <div className="space-y-6">
      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Income</p>
                <p className="text-2xl font-bold">₹{totalIncome.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <ArrowUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
                <p className="text-2xl font-bold">₹{totalExpenses.toLocaleString()}</p>
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
                <p className="text-2xl font-bold text-emerald-600">₹{savings.toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <PiggyBank className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Savings Rate</p>
                <p className="text-2xl font-bold">{Math.round((savings / totalIncome) * 100)}%</p>
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
      <div>
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <TrendingDown className="h-5 w-5 text-primary" />
          Active Stress Signals
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockStressSignals.map((signal) => (
            <StressSignalCard key={signal.id} signal={signal} />
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <BudgetGuardrailCard guardrails={mockBudgetGuardrails} />
        <TransactionList transactions={mockTransactions} limit={8} />
      </div>
    </div>
  );
};

export default DashboardSection;
