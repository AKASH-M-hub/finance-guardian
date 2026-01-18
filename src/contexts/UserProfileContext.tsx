import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  UserProfile, 
  FinancialAnalysis, 
  ProfileStressSignal,
  Recommendation,
  CrisisStatus,
  Streak,
  DailyCheckIn,
  UserGoal,
  incomeRangeToNumber 
} from '@/types/userProfile';

interface UserProfileContextType {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  analysis: FinancialAnalysis | null;
  crisisStatus: CrisisStatus;
  streaks: Streak[];
  checkIns: DailyCheckIn[];
  goals: UserGoal[];
  addCheckIn: (checkIn: Omit<DailyCheckIn, 'id'>) => void;
  addGoal: (goal: Omit<UserGoal, 'id'>) => void;
  updateGoalProgress: (goalId: string, amount: number) => void;
  isOnboarded: boolean;
  clearProfile: () => void;
}

const UserProfileContext = createContext<UserProfileContextType | undefined>(undefined);

const STORAGE_KEY = 'fyf_user_profile';
const CHECKINS_KEY = 'fyf_check_ins';
const GOALS_KEY = 'fyf_goals';
const STREAKS_KEY = 'fyf_streaks';

export const UserProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [analysis, setAnalysis] = useState<FinancialAnalysis | null>(null);
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [goals, setGoals] = useState<UserGoal[]>([]);
  const [streaks, setStreaks] = useState<Streak[]>([
    { id: '1', type: 'under_budget', currentDays: 0, longestDays: 0, lastUpdated: new Date().toISOString() },
    { id: '2', type: 'no_impulse', currentDays: 0, longestDays: 0, lastUpdated: new Date().toISOString() },
    { id: '3', type: 'savings_daily', currentDays: 0, longestDays: 0, lastUpdated: new Date().toISOString() },
    { id: '4', type: 'check_in', currentDays: 0, longestDays: 0, lastUpdated: new Date().toISOString() },
  ]);

  // Load from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem(STORAGE_KEY);
    const savedCheckIns = localStorage.getItem(CHECKINS_KEY);
    const savedGoals = localStorage.getItem(GOALS_KEY);
    const savedStreaks = localStorage.getItem(STREAKS_KEY);
    
    if (savedProfile) {
      setProfileState(JSON.parse(savedProfile));
    }
    if (savedCheckIns) {
      setCheckIns(JSON.parse(savedCheckIns));
    }
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedStreaks) {
      setStreaks(JSON.parse(savedStreaks));
    }
  }, []);

  // Compute analysis whenever profile changes
  useEffect(() => {
    if (profile) {
      const computedAnalysis = computeFinancialAnalysis(profile);
      setAnalysis(computedAnalysis);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    }
  }, [profile]);

  // Save check-ins and goals
  useEffect(() => {
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(checkIns));
  }, [checkIns]);

  useEffect(() => {
    localStorage.setItem(GOALS_KEY, JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem(STREAKS_KEY, JSON.stringify(streaks));
  }, [streaks]);

  const setProfile = (newProfile: UserProfile) => {
    setProfileState({ ...newProfile, isOnboarded: true, updatedAt: new Date().toISOString() });
  };

  const clearProfile = () => {
    setProfileState(null);
    setAnalysis(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const addCheckIn = (checkIn: Omit<DailyCheckIn, 'id'>) => {
    const newCheckIn: DailyCheckIn = {
      ...checkIn,
      id: Date.now().toString(),
    };
    setCheckIns(prev => [newCheckIn, ...prev]);
    
    // Update streaks
    if (checkIn.stayedUnderBudget) {
      updateStreak('under_budget');
    }
    updateStreak('check_in');
  };

  const updateStreak = (type: Streak['type']) => {
    setStreaks(prev => prev.map(streak => {
      if (streak.type === type) {
        const newCurrent = streak.currentDays + 1;
        return {
          ...streak,
          currentDays: newCurrent,
          longestDays: Math.max(streak.longestDays, newCurrent),
          lastUpdated: new Date().toISOString(),
        };
      }
      return streak;
    }));
  };

  const addGoal = (goal: Omit<UserGoal, 'id'>) => {
    const newGoal: UserGoal = {
      ...goal,
      id: Date.now().toString(),
    };
    setGoals(prev => [...prev, newGoal]);
  };

  const updateGoalProgress = (goalId: string, amount: number) => {
    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
        };
      }
      return goal;
    }));
  };

  const crisisStatus = computeCrisisStatus(analysis);

  return (
    <UserProfileContext.Provider 
      value={{ 
        profile, 
        setProfile, 
        analysis, 
        crisisStatus,
        streaks,
        checkIns,
        goals,
        addCheckIn,
        addGoal,
        updateGoalProgress,
        isOnboarded: profile?.isOnboarded ?? false,
        clearProfile 
      }}
    >
      {children}
    </UserProfileContext.Provider>
  );
};

export const useUserProfile = () => {
  const context = useContext(UserProfileContext);
  if (!context) {
    throw new Error('useUserProfile must be used within a UserProfileProvider');
  }
  return context;
};

// Analysis computation functions
function computeFinancialAnalysis(profile: UserProfile): FinancialAnalysis {
  const incomeRange = incomeRangeToNumber(profile.monthlyIncomeRange);
  const monthlyIncome = incomeRange.avg;
  
  // Calculate Silent Burden Index
  const silentBurdenIndex = Math.min(100, Math.round((profile.totalFixedAmount / monthlyIncome) * 100));
  
  // Base stress score calculation
  let stressScore = 20; // Base score
  
  // Add stress based on burden
  stressScore += Math.min(30, silentBurdenIndex * 0.4);
  
  // Add stress based on spending style
  if (profile.spendingStyle === 'mostly_impulsive') stressScore += 15;
  else if (profile.spendingStyle === 'mixed') stressScore += 8;
  
  // Add stress based on money feeling
  if (profile.moneyFeeling === 'avoid_checking') stressScore += 20;
  else if (profile.moneyFeeling === 'often_stressed') stressScore += 15;
  else if (profile.moneyFeeling === 'slightly_worried') stressScore += 8;
  
  // Add stress based on zero balance frequency
  if (profile.reachZeroFrequency === 'often') stressScore += 20;
  else if (profile.reachZeroFrequency === 'sometimes') stressScore += 10;
  
  // Add stress based on emergency readiness
  if (profile.emergencyReadiness === 'need_to_borrow') stressScore += 15;
  else if (profile.emergencyReadiness === 'will_struggle') stressScore += 8;
  
  // Life situation impacts
  if (profile.lifeSituation === 'medical' || profile.lifeSituation === 'job_change') stressScore += 10;
  
  stressScore = Math.min(100, Math.round(stressScore));
  
  // Determine risk level
  let riskLevel: 'safe' | 'watch' | 'crisis';
  if (stressScore < 35) riskLevel = 'safe';
  else if (stressScore < 65) riskLevel = 'watch';
  else riskLevel = 'crisis';
  
  // Calculate available amount after fixed expenses
  const availableMonthly = monthlyIncome - profile.totalFixedAmount;
  const dailyBudget = Math.round(availableMonthly / 30);
  const weeklyBudget = dailyBudget * 7;
  
  // Survival days calculation
  const survivalDays = availableMonthly > 0 ? Math.round(availableMonthly / dailyBudget) : 0;
  
  // Debt risk calculation
  let debtRisk = 0;
  if (profile.emergencyReadiness === 'need_to_borrow') debtRisk += 40;
  if (profile.reachZeroFrequency === 'often') debtRisk += 30;
  if (profile.commitments.some(c => c.includes('emi') || c === 'credit_card')) debtRisk += 20;
  if (silentBurdenIndex > 60) debtRisk += 10;
  debtRisk = Math.min(100, debtRisk);
  
  // Emergency fund target (3-6 months of expenses)
  const emergencyFundTarget = profile.totalFixedAmount * 4;
  
  // Generate stress signals
  const activeSignals = generateStressSignals(profile, stressScore, silentBurdenIndex, debtRisk);
  
  // Generate recommendations
  const recommendations = generateRecommendations(profile, stressScore, silentBurdenIndex);
  
  // Recovery timeline
  const recoveryDays = stressScore > 50 ? Math.round(stressScore * 1.5) : 0;
  
  // Health score (inverse of stress with some smoothing)
  const healthScore = Math.max(0, 100 - stressScore + (profile.spendingStyle === 'mostly_planned' ? 10 : 0));

  return {
    stressScore,
    riskLevel,
    silentBurdenIndex,
    survivalDays,
    debtRisk,
    emergencyFundTarget,
    weeklyBudget,
    dailyBudget,
    activeSignals,
    recommendations,
    recoveryDays,
    healthScore: Math.min(100, healthScore),
  };
}

function generateStressSignals(
  profile: UserProfile, 
  stressScore: number, 
  silentBurdenIndex: number,
  debtRisk: number
): ProfileStressSignal[] {
  const signals: ProfileStressSignal[] = [];
  
  if (silentBurdenIndex > 50) {
    signals.push({
      id: 'burden_high',
      type: 'commitment_overload',
      severity: silentBurdenIndex > 70 ? 'high' : 'medium',
      title: 'High Fixed Expense Burden',
      description: `${silentBurdenIndex}% of your income goes to fixed expenses. This leaves little room for flexibility.`,
      actionable: 'Review your fixed commitments and identify any that can be reduced or eliminated.',
    });
  }
  
  if (profile.spendingStyle === 'mostly_impulsive') {
    signals.push({
      id: 'impulse_high',
      type: 'impulse_risk',
      severity: 'high',
      title: 'Impulse Spending Pattern',
      description: 'Your spending style indicates frequent unplanned purchases.',
      actionable: `Use the "Buy Later" feature before purchases, especially for ${profile.topImpulseCategory.replace('_', ' ')}.`,
    });
  }
  
  if (profile.moneyFeeling === 'avoid_checking' || profile.moneyFeeling === 'often_stressed') {
    signals.push({
      id: 'emotional_spending',
      type: 'emotional_spending',
      severity: profile.moneyFeeling === 'avoid_checking' ? 'high' : 'medium',
      title: 'Financial Anxiety Detected',
      description: 'Your relationship with money shows signs of stress avoidance.',
      actionable: 'Try the 15-second daily check-in to build a healthier money relationship.',
    });
  }
  
  if (profile.reachZeroFrequency === 'often') {
    signals.push({
      id: 'zero_balance',
      type: 'zero_balance_risk',
      severity: 'high',
      title: 'Frequent Zero Balance',
      description: 'You often reach zero before your next income. This puts you at risk.',
      actionable: 'Activate Crisis Mode to protect essential expenses.',
    });
  }
  
  if (profile.emergencyReadiness === 'need_to_borrow') {
    signals.push({
      id: 'no_emergency',
      type: 'emergency_unpreparedness',
      severity: 'high',
      title: 'No Emergency Buffer',
      description: 'You would need to borrow for a ₹10,000 emergency.',
      actionable: 'Start micro-saving with our round-off challenge to build an emergency fund.',
    });
  }
  
  if (debtRisk > 60) {
    signals.push({
      id: 'debt_warning',
      type: 'income_stress',
      severity: 'high',
      title: 'Debt Risk Warning',
      description: 'Your financial pattern indicates high risk of falling into a debt cycle.',
      actionable: 'Enable auto-guardrails to prevent overspending in high-risk categories.',
    });
  }
  
  return signals;
}

function generateRecommendations(
  profile: UserProfile,
  stressScore: number,
  silentBurdenIndex: number
): Recommendation[] {
  const recs: Recommendation[] = [];
  
  // Priority: Emergency fund
  if (profile.emergencyReadiness !== 'can_handle') {
    recs.push({
      id: 'build_emergency',
      priority: 'high',
      title: 'Build Emergency Fund',
      description: 'Having 3-6 months of expenses saved provides security and reduces stress.',
      action: 'Start with ₹500/week micro-savings',
      category: 'emergency',
    });
  }
  
  // High burden
  if (silentBurdenIndex > 50) {
    recs.push({
      id: 'reduce_burden',
      priority: 'high',
      title: 'Reduce Fixed Commitments',
      description: 'Your fixed expenses are taking too much of your income.',
      action: 'Review subscriptions and negotiate bills',
      category: 'spending',
    });
  }
  
  // Impulse control
  if (profile.spendingStyle === 'mostly_impulsive') {
    recs.push({
      id: 'impulse_control',
      priority: 'medium',
      title: 'Delay Impulse Purchases',
      description: 'Wait 24-48 hours before making unplanned purchases.',
      action: 'Enable "Buy Later" reminders',
      category: 'spending',
    });
  }
  
  // Daily check-in
  if (stressScore > 40) {
    recs.push({
      id: 'daily_checkin',
      priority: 'medium',
      title: 'Start Daily Check-ins',
      description: '15 seconds a day to track mood and spending builds awareness.',
      action: 'Enable daily check-in notifications',
      category: 'lifestyle',
    });
  }
  
  // Savings habit
  recs.push({
    id: 'micro_savings',
    priority: profile.emergencyReadiness === 'can_handle' ? 'low' : 'high',
    title: 'Micro-Savings Challenge',
    description: 'Round-off savings from each transaction builds funds automatically.',
    action: 'Activate round-off savings',
    category: 'savings',
  });
  
  return recs;
}

function computeCrisisStatus(analysis: FinancialAnalysis | null): CrisisStatus {
  if (!analysis) {
    return {
      isInCrisis: false,
      crisisLevel: 'none',
      triggerReasons: [],
      frozenCategories: [],
    };
  }
  
  const triggerReasons: string[] = [];
  
  if (analysis.stressScore >= 70) triggerReasons.push('Very high stress score');
  if (analysis.debtRisk >= 70) triggerReasons.push('High debt risk');
  if (analysis.silentBurdenIndex >= 80) triggerReasons.push('Extreme fixed expense burden');
  if (analysis.survivalDays <= 7) triggerReasons.push('Less than a week of survival buffer');
  
  const isInCrisis = triggerReasons.length >= 2 || 
    analysis.stressScore >= 80 || 
    analysis.survivalDays <= 3;
  
  const crisisLevel = isInCrisis ? 'critical' : 
    triggerReasons.length > 0 ? 'warning' : 'none';
  
  return {
    isInCrisis,
    crisisLevel,
    triggerReasons,
    frozenCategories: isInCrisis ? ['shopping', 'entertainment', 'travel'] : [],
  };
}
