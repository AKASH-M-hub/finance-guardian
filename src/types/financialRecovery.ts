export interface StressRecoveryPath {
  id: string;
  currentStage: number;
  totalStages: number;
  stages: Array<{
    number: number;
    title: string;
    description: string;
    isCompleted: boolean;
    estimatedDays: number;
  }>;
  startDate: Date;
  estimatedEndDate: Date;
}

export interface StabilityTimeline {
  currentStatus: 'stressed' | 'recovering' | 'stable' | 'thriving';
  daysToStability: number;
  milestones: Array<{
    name: string;
    targetDate: Date;
    isAchieved: boolean;
  }>;
  confidenceLevel: number;
}

export interface LowPainCostReduction {
  id: string;
  category: string;
  currentSpend: number;
  suggestedReduction: number;
  painLevel: 'minimal' | 'low' | 'moderate';
  implementationTip: string;
  annualSavings: number;
}

export interface EssentialExpenseProtection {
  category: 'food' | 'rent' | 'transport' | 'healthcare' | 'utilities';
  monthlyAmount: number;
  isProtected: boolean;
  minimumRequired: number;
  currentAllocation: number;
}

export interface SmallWinSuggestion {
  id: string;
  title: string;
  description: string;
  difficulty: 'easy' | 'moderate';
  estimatedSavings: number;
  timeToComplete: string;
  confidenceBoost: number;
}

export interface ProgressVisualization {
  metricName: string;
  startValue: number;
  currentValue: number;
  targetValue: number;
  percentComplete: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface RelapseRisk {
  riskLevel: 'low' | 'moderate' | 'high';
  riskScore: number;
  triggerFactors: string[];
  preventionSuggestions: string[];
  lastAssessment: Date;
}

export interface AdaptiveRecoverySpeed {
  currentSpeed: 'slow' | 'normal' | 'fast';
  recommendedSpeed: 'slow' | 'normal' | 'fast';
  adjustmentReason: string;
  userBehaviorFactors: string[];
}

export interface PositiveReinforcement {
  id: string;
  message: string;
  achievement: string;
  timestamp: Date;
  impactScore: number;
}

export interface RecoveryConfidenceScore {
  score: number;
  previousScore: number;
  trend: 'improving' | 'stable' | 'declining';
  keyFactors: Array<{
    factor: string;
    contribution: number;
    status: 'positive' | 'neutral' | 'negative';
  }>;
  nextMilestone: string;
  distanceToStability: number;
}
