export interface EmotionalChronotype {
  id: string;
  vulnerabilityWindows: {
    startHour: number;
    endHour: number;
    riskLevel: 'low' | 'medium' | 'high';
    typicalTriggers: string[];
  }[];
  chronotype: 'morning-lark' | 'night-owl' | 'hybrid';
  peakDecisionHours: number[];
}

export interface EnergyBalance {
  currentEnergy: number;
  maxEnergy: number;
  recoveryRate: number;
  suggestedSpendingWindow: {
    start: string;
    end: string;
  };
  avoidSpendingWindows: {
    start: string;
    end: string;
    reason: string;
  }[];
}

export interface SleepSpendingCorrelation {
  date: Date;
  sleepHours: number;
  sleepQuality: number;
  nextDaySpending: number;
  impulseDecisions: number;
  correlation: number;
}

export interface CircadianFinancialPlan {
  id: string;
  taskType: 'bill-payment' | 'investment' | 'budgeting' | 'major-purchase';
  optimalTimeSlot: {
    dayOfWeek: string;
    hour: number;
  };
  reason: string;
  successProbability: number;
}

export interface HormonalCycleAwareness {
  currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  dayInCycle: number;
  spendingRiskLevel: 'low' | 'moderate' | 'elevated' | 'high';
  historicalPatterns: {
    phase: string;
    avgSpendingIncrease: number;
    topCategories: string[];
  }[];
  suggestions: string[];
}

export interface SeasonalAffectiveAdjustment {
  currentSeason: string;
  weatherImpact: number;
  moodCorrelation: number;
  suggestedBudgetAdjustment: number;
  affectedCategories: {
    category: string;
    adjustment: number;
    reason: string;
  }[];
}

export interface BiologicalFinancialClock {
  currentHour: number;
  energyLevel: number;
  cognitiveCapacity: number;
  emotionalStability: number;
  optimalForDecisions: boolean;
  hourlyData: {
    hour: number;
    energy: number;
    cognitive: number;
    emotional: number;
    recommended: 'spend' | 'save' | 'avoid' | 'optimal';
  }[];
}
