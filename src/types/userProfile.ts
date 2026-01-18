// User Profile & Financial Context Types

export interface UserProfile {
  id?: string;
  // Basic Profile
  monthlyIncomeRange: IncomeRange;
  incomeType: IncomeType;
  country: string;
  
  // Fixed Monthly Commitments
  commitments: Commitment[];
  totalFixedAmount: number;
  
  // Spending Behaviour
  spendingStyle: SpendingStyle;
  overspendTrigger: OverspendTrigger;
  topImpulseCategory: ImpulseCategory;
  
  // Financial Comfort
  moneyFeeling: MoneyFeeling;
  reachZeroFrequency: ZeroFrequency;
  emergencyReadiness: EmergencyReadiness;
  
  // Context (Optional)
  lifeSituation: LifeSituation;
  plannedPurchase: PlannedPurchase;
  aiHelpLevel: AIHelpLevel;
  
  // Computed Fields
  isOnboarded: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export type IncomeRange = 
  | 'below_25k' 
  | '25k_50k' 
  | '50k_1L' 
  | 'above_1L';

export type IncomeType = 
  | 'salary' 
  | 'student' 
  | 'freelance' 
  | 'business';

export type Commitment = 
  | 'rent' 
  | 'emi_education' 
  | 'emi_personal' 
  | 'emi_home' 
  | 'credit_card' 
  | 'family_support' 
  | 'subscriptions';

export type SpendingStyle = 
  | 'mostly_planned' 
  | 'mixed' 
  | 'mostly_impulsive';

export type OverspendTrigger = 
  | 'late_night' 
  | 'weekends' 
  | 'stress_days' 
  | 'social_events';

export type ImpulseCategory = 
  | 'food_delivery' 
  | 'shopping' 
  | 'travel' 
  | 'online_services';

export type MoneyFeeling = 
  | 'calm' 
  | 'slightly_worried' 
  | 'often_stressed' 
  | 'avoid_checking';

export type ZeroFrequency = 
  | 'never' 
  | 'sometimes' 
  | 'often';

export type EmergencyReadiness = 
  | 'can_handle' 
  | 'will_struggle' 
  | 'need_to_borrow';

export type LifeSituation = 
  | 'exams' 
  | 'job_change' 
  | 'medical' 
  | 'family_responsibility' 
  | 'none';

export type PlannedPurchase = 
  | 'phone' 
  | 'laptop' 
  | 'vehicle' 
  | 'travel' 
  | 'none';

export type AIHelpLevel = 
  | 'only_insights' 
  | 'insights_suggestions' 
  | 'auto_guardrails';

// Computed financial analysis from user profile
export interface FinancialAnalysis {
  stressScore: number; // 0-100
  riskLevel: 'safe' | 'watch' | 'crisis';
  silentBurdenIndex: number; // % of income that's fixed
  survivalDays: number;
  debtRisk: number; // 0-100
  emergencyFundTarget: number;
  weeklyBudget: number;
  dailyBudget: number;
  
  // Stress signals from profile
  activeSignals: ProfileStressSignal[];
  recommendations: Recommendation[];
  
  // Recovery timeline
  recoveryDays: number;
  healthScore: number; // 0-100
}

export interface ProfileStressSignal {
  id: string;
  type: 'income_stress' | 'commitment_overload' | 'impulse_risk' | 'emotional_spending' | 'zero_balance_risk' | 'emergency_unpreparedness';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionable: string;
}

export interface Recommendation {
  id: string;
  priority: 'high' | 'medium' | 'low';
  title: string;
  description: string;
  action: string;
  category: 'savings' | 'spending' | 'emergency' | 'debt' | 'lifestyle';
}

// Goal and streak tracking
export interface UserGoal {
  id: string;
  title: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: 'emergency_fund' | 'travel' | 'purchase' | 'debt_payment' | 'custom';
  microGoals: MicroGoal[];
}

export interface MicroGoal {
  id: string;
  title: string;
  amount: number;
  isCompleted: boolean;
  dueDate: string;
}

export interface Streak {
  id: string;
  type: 'under_budget' | 'no_impulse' | 'savings_daily' | 'check_in';
  currentDays: number;
  longestDays: number;
  lastUpdated: string;
}

export interface DailyCheckIn {
  id: string;
  date: string;
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious';
  spentToday: number;
  stayedUnderBudget: boolean;
  notes?: string;
}

// Crisis Mode Types
export interface CrisisStatus {
  isInCrisis: boolean;
  crisisLevel: 'none' | 'warning' | 'critical';
  triggerReasons: string[];
  activeSince?: string;
  frozenCategories: string[];
  survivalPlan?: SurvivalPlan;
}

export interface SurvivalPlan {
  id: string;
  duration: number; // days
  dailyBudget: number;
  essentialOnly: boolean;
  allowedCategories: string[];
  startDate: string;
  endDate: string;
}

// Helper functions for income ranges
export const incomeRangeToNumber = (range: IncomeRange): { min: number; max: number; avg: number } => {
  switch (range) {
    case 'below_25k': return { min: 10000, max: 25000, avg: 17500 };
    case '25k_50k': return { min: 25000, max: 50000, avg: 37500 };
    case '50k_1L': return { min: 50000, max: 100000, avg: 75000 };
    case 'above_1L': return { min: 100000, max: 300000, avg: 150000 };
  }
};

export const incomeRangeLabels: Record<IncomeRange, string> = {
  'below_25k': 'Below ₹25,000',
  '25k_50k': '₹25,000 - ₹50,000',
  '50k_1L': '₹50,000 - ₹1,00,000',
  'above_1L': 'Above ₹1,00,000'
};

export const incomeTypeLabels: Record<IncomeType, string> = {
  'salary': 'Salary',
  'student': 'Student',
  'freelance': 'Freelance',
  'business': 'Business'
};

export const commitmentLabels: Record<Commitment, string> = {
  'rent': 'Rent',
  'emi_education': 'EMI (Education)',
  'emi_personal': 'EMI (Personal)',
  'emi_home': 'EMI (Home)',
  'credit_card': 'Credit Card Bill',
  'family_support': 'Family Support',
  'subscriptions': 'Subscriptions'
};

export const spendingStyleLabels: Record<SpendingStyle, string> = {
  'mostly_planned': 'Mostly Planned',
  'mixed': 'Mixed',
  'mostly_impulsive': 'Mostly Impulsive'
};

export const overspendTriggerLabels: Record<OverspendTrigger, string> = {
  'late_night': 'Late Night',
  'weekends': 'Weekends',
  'stress_days': 'Stress Days',
  'social_events': 'Social Events'
};

export const impulseCategoryLabels: Record<ImpulseCategory, string> = {
  'food_delivery': 'Food Delivery',
  'shopping': 'Shopping',
  'travel': 'Travel',
  'online_services': 'Online Services'
};

export const moneyFeelingLabels: Record<MoneyFeeling, string> = {
  'calm': 'Calm',
  'slightly_worried': 'Slightly Worried',
  'often_stressed': 'Often Stressed',
  'avoid_checking': 'Avoid Checking'
};

export const zeroFrequencyLabels: Record<ZeroFrequency, string> = {
  'never': 'Never',
  'sometimes': 'Sometimes',
  'often': 'Often'
};

export const emergencyReadinessLabels: Record<EmergencyReadiness, string> = {
  'can_handle': 'Can Handle',
  'will_struggle': 'Will Struggle',
  'need_to_borrow': 'Need to Borrow'
};

export const lifeSituationLabels: Record<LifeSituation, string> = {
  'exams': 'Exams',
  'job_change': 'Job Change',
  'medical': 'Medical',
  'family_responsibility': 'Family Responsibility',
  'none': 'None'
};

export const plannedPurchaseLabels: Record<PlannedPurchase, string> = {
  'phone': 'Phone',
  'laptop': 'Laptop',
  'vehicle': 'Vehicle',
  'travel': 'Travel',
  'none': 'None'
};

export const aiHelpLevelLabels: Record<AIHelpLevel, string> = {
  'only_insights': 'Only Insights',
  'insights_suggestions': 'Insights + Suggestions',
  'auto_guardrails': 'Auto Guardrails'
};
