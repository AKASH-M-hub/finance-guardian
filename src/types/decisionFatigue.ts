// Module 15: Financial Decision Fatigue Engine Types

export interface DecisionCountTracker {
  daily: number;
  weekly: number;
  monthly: number;
  averageDaily: number;
  peakDay: string;
  optimalRange: { min: number; max: number };
}

export interface LateNightActivity {
  id: string;
  timestamp: Date;
  decisionType: string;
  amount: number;
  focusScore: number; // 0-100
  wasReversed: boolean;
  hourOfDay: number;
}

export interface CartEditPattern {
  id: string;
  sessionId: string;
  addRemoveCycles: number;
  totalTimeSpent: number; // minutes
  finalDecision: 'purchased' | 'abandoned' | 'saved';
  indecisionScore: number; // 0-100
}

export interface PlanSwitchingSignal {
  id: string;
  planType: 'budget' | 'savings' | 'investment' | 'subscription';
  switchCount: number;
  periodDays: number;
  stability: 'stable' | 'moderate' | 'volatile';
  lastSwitch: Date;
}

export interface BrowsingWithoutBuying {
  id: string;
  category: string;
  sessionsCount: number;
  totalTimeSpent: number; // minutes
  itemsViewed: number;
  conversionRate: number;
  mentalLoadScore: number; // 0-100
}

export interface HighStakesDecision {
  id: string;
  category: 'emi' | 'gadget' | 'travel' | 'investment' | 'insurance' | 'property';
  amount: number;
  importance: 'critical' | 'high' | 'medium';
  deadline?: Date;
  researchTime: number; // hours
  confidenceLevel: number; // 0-100
}

export interface DecisionDensity {
  timeWindow: 'hour' | 'day' | 'week';
  decisionCount: number;
  density: 'low' | 'moderate' | 'high' | 'overwhelming';
  clusterPeriods: { start: Date; end: Date; count: number }[];
}

export interface FatigueThreshold {
  current: number; // 0-100
  threshold: number; // point where quality drops
  predictedDropTime: Date;
  recoveryNeeded: number; // hours
  riskLevel: 'safe' | 'approaching' | 'exceeded';
}

export interface ImpulseRiskFlag {
  id: string;
  timestamp: Date;
  fatigueLevel: number;
  spendingIntent: number;
  riskScore: number; // 0-100
  warningMessage: string;
  suggestedAction: string;
}

export interface CoolDownMode {
  isActive: boolean;
  startedAt?: Date;
  duration: number; // hours
  delayedDecisions: {
    id: string;
    description: string;
    amount: number;
    scheduledReview: Date;
  }[];
  urgentExceptions: string[];
}

export interface DecisionFatigueProfile {
  countTracker: DecisionCountTracker;
  lateNightActivities: LateNightActivity[];
  cartPatterns: CartEditPattern[];
  planSwitching: PlanSwitchingSignal[];
  browsingPatterns: BrowsingWithoutBuying[];
  highStakesQueue: HighStakesDecision[];
  densityAnalysis: DecisionDensity;
  fatigueThreshold: FatigueThreshold;
  impulseFlags: ImpulseRiskFlag[];
  coolDownMode: CoolDownMode;
  overallFatigueScore: number; // 0-100
}
