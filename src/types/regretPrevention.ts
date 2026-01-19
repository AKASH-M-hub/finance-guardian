// Long-Term Regret Prevention Simulator Types - Module 21

export interface HabitContinuation {
  id: string;
  habitName: string;
  currentMonthlyAmount: number;
  projectedMonthlyAmount: number;
  yearsProjected: number;
  totalLifetimeCost: number;
  alternativeOutcome: string;
}

export interface TimeImpactView {
  threeMonthImpact: number;
  sixMonthImpact: number;
  twelveMonthImpact: number;
  projectedSavings: number;
  projectedDebt: number;
}

export interface OpportunityLoss {
  id: string;
  dailyAmount: number;
  weeklyAmount: number;
  monthlyAmount: number;
  yearlyAmount: number;
  investedValue: number; // What it could become if invested
  lostOpportunityDescription: string;
}

export interface AlternativeHabit {
  id: string;
  currentHabit: string;
  alternativeHabit: string;
  monthlySavings: number;
  yearlyImpact: number;
  difficultyLevel: 'easy' | 'medium' | 'hard';
  successRate: number;
}

export interface ForkView {
  savingsPath: {
    balance: number;
    monthlyGrowth: number;
    yearlyGrowth: number;
    fiveYearProjection: number;
  };
  spendingPath: {
    balance: number;
    monthlyDecrease: number;
    yearlyDecrease: number;
    fiveYearProjection: number;
  };
  difference: number;
}

export interface StressProjection {
  currentStressScore: number;
  threeMonthProjection: number;
  sixMonthProjection: number;
  yearProjection: number;
  trend: 'improving' | 'stable' | 'worsening';
}

export interface GoalDelay {
  goalName: string;
  originalTimeframe: number; // months
  projectedTimeframe: number; // months
  delayMonths: number;
  delayReason: string;
}

export interface TimelineEvent {
  date: string;
  description: string;
  impact: 'positive' | 'negative' | 'neutral';
  amount: number;
}

export interface RegretRisk {
  id: string;
  habitName: string;
  riskScore: number; // 0-100
  regretProbability: number; // 0-100
  category: string;
  warningMessage: string;
}

export interface FutureYouMessage {
  message: string;
  tone: 'encouraging' | 'warning' | 'celebratory';
  daysAhead: number;
  keyInsight: string;
}

export interface RegretPreventionData {
  habitContinuations: HabitContinuation[];
  timeImpactView: TimeImpactView;
  opportunityLosses: OpportunityLoss[];
  alternativeHabits: AlternativeHabit[];
  forkView: ForkView;
  stressProjection: StressProjection;
  goalDelays: GoalDelay[];
  timeline: TimelineEvent[];
  regretRisks: RegretRisk[];
  futureYouMessage: FutureYouMessage;
}
