export interface SocialEventRisk {
  id: string;
  eventName: string;
  date: Date;
  expectedAttendees: number;
  historicalAvgSpend: number;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedSpend: number;
  category: string;
}

export interface StatusAnxietyTrigger {
  id: string;
  timestamp: Date;
  platform: string;
  browsingDuration: number;
  purchasesAfter: {
    amount: number;
    category: string;
    timeAfterBrowsing: number;
  }[];
  correlationStrength: number;
}

export interface KeepingUpMeter {
  yourSpendingTrend: number;
  peerGroupTrend: number;
  gapPercentage: number;
  topInfluencedCategories: {
    category: string;
    yourSpend: number;
    peerAverage: number;
    difference: number;
  }[];
}

export interface PurchaseTriggerMap {
  platform: string;
  usageHours: number;
  correlatedSpending: number;
  triggerCategories: string[];
  peakTriggerTimes: string[];
}

export interface DigitalDetoxSuggestion {
  id: string;
  app: string;
  suggestedBlockTime: string;
  reason: string;
  potentialSavings: number;
  vulnerabilityScore: number;
}

export interface AntiFOMOReward {
  id: string;
  eventResisted: string;
  amountSaved: number;
  rewardPoints: number;
  streakDays: number;
  badge?: string;
}

export interface SocialImmunityScore {
  overall: number;
  trend: 'improving' | 'declining' | 'stable';
  breakdown: {
    category: string;
    score: number;
    description: string;
  }[];
  immunityLevel: 'weak' | 'developing' | 'moderate' | 'strong' | 'bulletproof';
}
