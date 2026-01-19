export interface ImpulseSpend {
  id: string;
  amount: number;
  merchant: string;
  timeToDecision: number; // seconds
  category: string;
  timestamp: Date;
  deviceType: 'mobile' | 'desktop';
}

export interface PlannedSpend {
  id: string;
  amount: number;
  merchant: string;
  plannedDate: Date;
  actualDate: Date;
  category: string;
  wasDelayed: boolean;
}

export interface TimeEmotionCorrelation {
  timeSlot: string;
  emotionalState: 'stressed' | 'bored' | 'happy' | 'anxious' | 'tired' | 'neutral';
  spendingFrequency: number;
  averageAmount: number;
  confidence: number;
}

export interface StressMerchantPattern {
  merchantName: string;
  category: string;
  stressCorrelation: number;
  visitFrequency: number;
  averageSpend: number;
  typicalTiming: string;
}

export interface BoredomSpendSignal {
  frequency: 'low' | 'moderate' | 'high';
  typicalCategories: string[];
  averageAmount: number;
  peakTimes: string[];
  weekdayPattern: string[];
}

export interface RewardSpend {
  id: string;
  triggerEvent: string;
  amount: number;
  category: string;
  timestamp: Date;
  satisfactionLevel: number;
}

export interface RegretPrediction {
  transactionId: string;
  regretProbability: number;
  factors: string[];
  recommendation: string;
  historicalAccuracy: number;
}

export interface SpendAfterEvent {
  eventType: 'exam' | 'deadline' | 'conflict' | 'celebration' | 'disappointment' | 'other';
  eventDescription: string;
  spendingIncrease: number;
  affectedCategories: string[];
  recoveryTime: string;
}

export interface EmotionFrequencySummary {
  emotion: string;
  frequency: number;
  totalSpent: number;
  averagePerOccurrence: number;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface EmotionMoneyExplanation {
  pattern: string;
  explanation: string;
  frequency: number;
  financialImpact: number;
  suggestions: string[];
}
