export interface IncomeGrowth {
  period: string;
  previousIncome: number;
  currentIncome: number;
  growthRate: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface LifestyleCost {
  category: string;
  previousCost: number;
  currentCost: number;
  percentageChange: number;
  isRecurring: boolean;
}

export interface LifestyleIncomeGap {
  incomeGrowthRate: number;
  lifestyleGrowthRate: number;
  gapPercentage: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  projectedImpact: string;
}

export interface SilentUpgrade {
  id: string;
  category: string;
  previousChoice: string;
  currentChoice: string;
  costDifference: number;
  detectedDate: Date;
  frequency: 'one-time' | 'recurring';
}

export interface SubscriptionCreep {
  totalSubscriptions: number;
  previousMonthTotal: number;
  currentMonthTotal: number;
  newSubscriptions: string[];
  upgradedSubscriptions: string[];
  creepRate: number;
}

export interface ComfortSpend {
  id: string;
  description: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly';
  convenienceFactor: number;
  alternative: string;
  potentialSavings: number;
}

export interface RecurringUpgradePattern {
  category: string;
  upgradeHistory: Array<{
    date: Date;
    description: string;
    costIncrease: number;
  }>;
  predictedNextUpgrade: Date;
  annualImpact: number;
}

export interface FutureEMIRisk {
  currentEMILoad: number;
  projectedEMILoad: number;
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  timeToRisk: string;
  recommendation: string;
}

export interface StabilityMargin {
  totalIncome: number;
  essentialExpenses: number;
  lifestyleExpenses: number;
  marginAmount: number;
  marginPercentage: number;
  healthStatus: 'healthy' | 'tight' | 'critical';
}

export interface LifestyleDriftMeter {
  driftScore: number;
  driftDirection: 'ahead' | 'aligned' | 'behind';
  keyContributors: string[];
  recommendation: string;
  historicalTrend: Array<{
    month: string;
    score: number;
  }>;
}
