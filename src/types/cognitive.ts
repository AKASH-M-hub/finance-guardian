export interface DecisionFatigueData {
  date: Date;
  decisionsCount: number;
  timeSpentComparing: number;
  qualityScore: number;
  optionsCompared: number;
}

export interface ParalysisPoint {
  id: string;
  timestamp: Date;
  appName: string;
  duration: number;
  actionTaken: boolean;
  category: string;
}

export interface MentalBandwidth {
  current: number;
  max: number;
  recoveryRate: number;
  peakHours: number[];
  lowHours: number[];
}

export interface AutopilotSpending {
  id: string;
  timestamp: Date;
  amount: number;
  category: string;
  duringWorkHours: boolean;
  distractionLevel: 'low' | 'medium' | 'high';
}

export interface ProcrastinationScore {
  overall: number;
  byCategory: {
    category: string;
    score: number;
    avgDelayHours: number;
  }[];
  trend: 'improving' | 'worsening' | 'stable';
}

export interface CognitiveBudget {
  dailyTotal: number;
  spent: number;
  reserved: number;
  reservedFor: string[];
  recoveryTips: string[];
}

export interface FocusRecoverySuggestion {
  id: string;
  message: string;
  action: string;
  impact: 'high' | 'medium' | 'low';
}
