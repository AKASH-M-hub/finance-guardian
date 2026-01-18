// Future Self Projection Engine Types - Module 8

export interface TimeTravelingBalance {
  currentBalance: number;
  projectedBalance: number;
  daysAhead: number;
  assumptions: string[];
  confidence: 'high' | 'medium' | 'low';
}

export interface RegretAnalysis {
  purchaseAmount: number;
  purchaseItem: string;
  regretScore: number; // 0-100
  futureFeeling: 'satisfied' | 'neutral' | 'regretful';
  alternativeUse: string;
  weeksAhead: number;
}

export interface ParallelUniverse {
  id: string;
  scenarioName: string;
  description: string;
  decisions: UniverseDecision[];
  projectedOutcome: number;
  actualOutcome?: number;
  difference: number;
  insight: string;
}

export interface UniverseDecision {
  date: string;
  description: string;
  actualChoice: string;
  alternativeChoice: string;
  financialImpact: number;
}

export interface MemoryWeightedPurchase {
  id: string;
  item: string;
  amount: number;
  date: string;
  category: string;
  memoryScore: number; // 0-100 how well you remember it
  wasWorthIt: boolean;
  daysSincePurchase: number;
}

export interface FutureBillShadow {
  id: string;
  billName: string;
  amount: number;
  dueDate: string;
  daysUntilDue: number;
  impactOnBalance: number;
  currentBalancePercentage: number;
  severity: 'low' | 'medium' | 'high';
}

export interface ReverseCompoundCalculation {
  dailyAmount: number;
  weeklyTotal: number;
  monthlyTotal: number;
  yearlyTotal: number;
  fiveYearTotal: number;
  investedAlternative: number; // what it could grow to if invested
  lostOpportunity: string;
}

export interface FutureProjection {
  daysAhead: number;
  projectedBalance: number;
  projectedStressScore: number;
  projectedSurvivalDays: number;
  keyFactors: string[];
  riskEvents: {
    description: string;
    probability: number;
    impact: number;
  }[];
}

// Helper functions
export const calculateRegretScore = (
  amount: number,
  category: string,
  isPractical: boolean
): number => {
  let baseScore = 30;
  
  // Higher amounts = higher regret potential
  if (amount > 5000) baseScore += 20;
  else if (amount > 2000) baseScore += 10;
  
  // Impulse categories = higher regret
  if (['entertainment', 'shopping', 'food'].includes(category)) baseScore += 20;
  
  // Practical purchases = lower regret
  if (isPractical) baseScore -= 25;
  
  return Math.min(100, Math.max(0, baseScore));
};

export const calculateMemoryDecay = (daysSincePurchase: number): number => {
  // Memory fades over time - logarithmic decay
  const decayRate = 0.1;
  return Math.max(0, 100 - Math.log(1 + daysSincePurchase * decayRate) * 30);
};

export const projectionConfidenceLabels = {
  high: 'Based on consistent patterns',
  medium: 'Some uncertainty in projections',
  low: 'Highly variable - rough estimate',
};
