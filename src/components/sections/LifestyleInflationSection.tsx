import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, CreditCard, Home, Coffee, ArrowUpRight, ArrowDownRight, Minus, Shield, Activity } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import GlowCard from '@/components/reactbits/GlowCard';
import ProgressRing from '@/components/reactbits/ProgressRing';
import CountUpNumber from '@/components/reactbits/CountUpNumber';
import RippleButton from '@/components/reactbits/RippleButton';
import type { 
  LifestyleIncomeGap, 
  SilentUpgrade, 
  SubscriptionCreep, 
  ComfortSpend, 
  StabilityMargin, 
  LifestyleDriftMeter 
} from '@/types/lifestyleInflation';

const mockLifestyleGap: LifestyleIncomeGap = {
  incomeGrowthRate: 8,
  lifestyleGrowthRate: 15,
  gapPercentage: 7,
  riskLevel: 'moderate',
  projectedImpact: 'At this rate, savings will decrease by 12% in 6 months'
};

const mockSilentUpgrades: SilentUpgrade[] = [
  { id: '1', category: 'Food Delivery', previousChoice: 'Home cooking', currentChoice: 'Premium delivery', costDifference: 3500, detectedDate: new Date(), frequency: 'recurring' },
  { id: '2', category: 'Streaming', previousChoice: 'Basic plan', currentChoice: 'Premium family', costDifference: 400, detectedDate: new Date(), frequency: 'recurring' },
  { id: '3', category: 'Transport', previousChoice: 'Public transit', currentChoice: 'Ride-sharing', costDifference: 2000, detectedDate: new Date(), frequency: 'recurring' }
];

const mockSubscriptionCreep: SubscriptionCreep = {
  totalSubscriptions: 12,
  previousMonthTotal: 2800,
  currentMonthTotal: 3400,
  newSubscriptions: ['Fitness App Pro', 'Cloud Storage Plus'],
  upgradedSubscriptions: ['Music Streaming'],
  creepRate: 21
};

const mockComfortSpends: ComfortSpend[] = [
  { id: '1', description: 'Morning coffee runs', amount: 150, frequency: 'daily', convenienceFactor: 8, alternative: 'Brew at home', potentialSavings: 3000 },
  { id: '2', description: 'Express delivery fees', amount: 200, frequency: 'weekly', convenienceFactor: 7, alternative: 'Standard delivery', potentialSavings: 600 },
  { id: '3', description: 'Parking convenience', amount: 500, frequency: 'monthly', convenienceFactor: 6, alternative: 'Walk 5 min more', potentialSavings: 300 }
];

const mockStabilityMargin: StabilityMargin = {
  totalIncome: 85000,
  essentialExpenses: 45000,
  lifestyleExpenses: 28000,
  marginAmount: 12000,
  marginPercentage: 14,
  healthStatus: 'tight'
};

const mockDriftMeter: LifestyleDriftMeter = {
  driftScore: 68,
  driftDirection: 'ahead',
  keyContributors: ['Food & Dining', 'Subscriptions', 'Transport'],
  recommendation: 'Consider freezing subscription upgrades for 3 months',
  historicalTrend: [
    { month: 'Jul', score: 45 },
    { month: 'Aug', score: 52 },
    { month: 'Sep', score: 58 },
    { month: 'Oct', score: 63 },
    { month: 'Nov', score: 68 }
  ]
};

const LifestyleInflationSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'success';
      case 'moderate': return 'warning';
      case 'high': return 'danger';
      case 'critical': return 'danger';
      default: return 'primary';
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
      case 'tight': return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
      case 'critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-amber-400" />
            Lifestyle Inflation Early-Warning System
          </h2>
          <p className="text-muted-foreground mt-1">Detect silent lifestyle upgrades before they impact your finances</p>
        </div>
        <Badge className={getHealthColor(mockStabilityMargin.healthStatus)}>
          Margin: {mockStabilityMargin.healthStatus.toUpperCase()}
        </Badge>
      </div>

      {/* Lifestyle Drift Meter - Hero Card */}
      <GlowCard className="p-6" glowColor="rgba(251, 191, 36, 0.3)">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Activity className="h-5 w-5 text-amber-400" />
            Lifestyle Drift Meter
          </h3>
          <Badge variant={mockDriftMeter.driftDirection === 'ahead' ? 'destructive' : 'secondary'}>
            {mockDriftMeter.driftDirection === 'ahead' ? 'Drifting Ahead' : 'Aligned'}
          </Badge>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col items-center">
            <ProgressRing 
              progress={mockDriftMeter.driftScore} 
              size={140} 
              strokeWidth={12}
              color={mockDriftMeter.driftScore > 60 ? 'warning' : 'success'}
            >
              <div className="text-center">
                <CountUpNumber value={mockDriftMeter.driftScore} className="text-3xl font-bold text-foreground" />
                <p className="text-xs text-muted-foreground">Drift Score</p>
              </div>
            </ProgressRing>
          </div>
          <div className="md:col-span-2">
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">{mockDriftMeter.recommendation}</p>
              <div>
                <p className="text-xs text-muted-foreground mb-2">Key Contributors:</p>
                <div className="flex flex-wrap gap-2">
                  {mockDriftMeter.keyContributors.map((contributor, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">
                      {contributor}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 mt-4">
                {mockDriftMeter.historicalTrend.map((point, idx) => (
                  <div key={idx} className="flex-1 text-center">
                    <div 
                      className="bg-amber-500/30 rounded-t mx-auto transition-all"
                      style={{ 
                        height: `${point.score * 0.6}px`, 
                        width: '100%',
                        maxWidth: '40px'
                      }}
                    />
                    <p className="text-xs text-muted-foreground mt-1">{point.month}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </GlowCard>

      {/* Income vs Lifestyle Gap */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <ArrowUpRight className="h-4 w-4 text-emerald-400" />
              Lifestyle-Income Gap Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Income Growth</span>
                <span className="text-emerald-400 font-medium">+{mockLifestyleGap.incomeGrowthRate}%</span>
              </div>
              <Progress value={mockLifestyleGap.incomeGrowthRate * 5} className="h-2" />
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Lifestyle Growth</span>
                <span className="text-amber-400 font-medium">+{mockLifestyleGap.lifestyleGrowthRate}%</span>
              </div>
              <Progress value={mockLifestyleGap.lifestyleGrowthRate * 5} className="h-2 bg-amber-500/20" />
              
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Gap</span>
                  <Badge className={`${getRiskColor(mockLifestyleGap.riskLevel) === 'warning' ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                    {mockLifestyleGap.gapPercentage}% - {mockLifestyleGap.riskLevel}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{mockLifestyleGap.projectedImpact}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stability Margin */}
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-400" />
              Stability Margin Calculator
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Total Income</span>
                <span className="font-medium">₹{mockStabilityMargin.totalIncome.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Essential Expenses</span>
                <span className="text-red-400">-₹{mockStabilityMargin.essentialExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Lifestyle Expenses</span>
                <span className="text-amber-400">-₹{mockStabilityMargin.lifestyleExpenses.toLocaleString()}</span>
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Safety Margin</span>
                  <span className="text-emerald-400 font-bold">₹{mockStabilityMargin.marginAmount.toLocaleString()}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {mockStabilityMargin.marginPercentage}% of income remains as buffer
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Silent Upgrades Detected */}
      <Card className="bg-card/50 border-border/50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-amber-400" />
            Silent Upgrades Detected
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockSilentUpgrades.map((upgrade) => (
              <div 
                key={upgrade.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer"
                onClick={() => setSelectedCategory(upgrade.category)}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-amber-500/20">
                    <ArrowUpRight className="h-4 w-4 text-amber-400" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{upgrade.category}</p>
                    <p className="text-xs text-muted-foreground">
                      {upgrade.previousChoice} → {upgrade.currentChoice}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-medium">+₹{upgrade.costDifference.toLocaleString()}/mo</p>
                  <Badge variant="outline" className="text-xs">{upgrade.frequency}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Creep & Comfort Spends */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CreditCard className="h-4 w-4 text-purple-400" />
              Subscription Creep Monitor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center mb-4">
              <CountUpNumber value={mockSubscriptionCreep.creepRate} className="text-4xl font-bold text-purple-400" suffix="%" />
              <p className="text-sm text-muted-foreground">Monthly Creep Rate</p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Total Subscriptions</span>
                <span>{mockSubscriptionCreep.totalSubscriptions}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Previous Month</span>
                <span>₹{mockSubscriptionCreep.previousMonthTotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Current Month</span>
                <span className="text-purple-400">₹{mockSubscriptionCreep.currentMonthTotal.toLocaleString()}</span>
              </div>
              <div className="pt-2">
                <p className="text-xs text-muted-foreground mb-1">New Subscriptions:</p>
                <div className="flex flex-wrap gap-1">
                  {mockSubscriptionCreep.newSubscriptions.map((sub, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs">{sub}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card/50 border-border/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Coffee className="h-4 w-4 text-orange-400" />
              Comfort Spend Identifier
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockComfortSpends.map((spend) => (
                <div key={spend.id} className="p-2 rounded-lg bg-muted/30">
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-medium">{spend.description}</p>
                    <span className="text-orange-400 text-sm">₹{spend.amount}/{spend.frequency === 'daily' ? 'day' : spend.frequency === 'weekly' ? 'wk' : 'mo'}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    💡 {spend.alternative} • Save ₹{spend.potentialSavings.toLocaleString()}/mo
                  </p>
                </div>
              ))}
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Total Potential Savings</span>
                  <span className="text-emerald-400 font-bold">
                    ₹{mockComfortSpends.reduce((sum, s) => sum + s.potentialSavings, 0).toLocaleString()}/mo
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 justify-center">
        <RippleButton variant="primary">
          Generate Inflation Report
        </RippleButton>
        <RippleButton variant="secondary">
          Set Lifestyle Alerts
        </RippleButton>
      </div>
    </div>
  );
};

export default LifestyleInflationSection;
