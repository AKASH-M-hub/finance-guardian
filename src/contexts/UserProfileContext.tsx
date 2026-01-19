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
import { supabase } from '@/integrations/supabase/client';
import { 
  getProfile, 
  createProfile, 
  getCurrentAnalysis, 
  createAnalysis,
  getRecentCheckIns,
  createCheckIn,
  getActiveGoals,
  createGoal,
  syncTodayCheckIn,
  syncGoals,
  syncGoalTransaction,
} from '@/integrations/supabase/helpers';
import { mapDbProfile, mapDbAnalysis } from '@/integrations/supabase/import';
import { useToast } from '@/hooks/use-toast';

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
  const { toast } = useToast();

  // Hydrate from Supabase on mount
  useEffect(() => {
    const hydrateFromSupabase = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) return;

      try {
        const profileResult = await getProfile(session.user.id);
        if (profileResult.data) {
          const hydratedProfile = mapDbProfile(profileResult.data);
          setProfileState(hydratedProfile);

          const analysisResult = await getCurrentAnalysis(session.user.id);
          if (analysisResult.data) {
            setAnalysis(mapDbAnalysis(analysisResult.data));
          }

          const checkInsResult = await getRecentCheckIns(session.user.id);
          if (checkInsResult.data) {
            setCheckIns(checkInsResult.data.map(ci => ({
              id: ci.id,
              date: ci.check_in_date,
              moodScore: ci.mood_score,
              spendingControl: ci.spending_control,
              notes: ci.notes || undefined
            })));
          }

          const goalsResult = await getActiveGoals(session.user.id);
          if (goalsResult.data) {
            setGoals(goalsResult.data.map(g => ({
              id: g.id,
              title: g.title,
              targetAmount: g.target_amount,
              currentAmount: g.current_amount,
              deadline: g.deadline,
              category: g.category as UserGoal['category']
            })));
          }
        }
      } catch (error) {
        console.error('Error hydrating from Supabase:', error);
      }
    };

    hydrateFromSupabase();
  }, []);

  // Compute analysis whenever profile changes
  useEffect(() => {
    if (profile) {
      const computedAnalysis = computeFinancialAnalysis(profile);
      setAnalysis(computedAnalysis);
    }
  }, [profile]);

  const setProfile = async (newProfile: UserProfile) => {
    const updatedProfile = { ...newProfile, isOnboarded: true, updatedAt: new Date().toISOString() };
    setProfileState(updatedProfile);

    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      const existingProfile = await getProfile(session.user.id);
      
      const moneyFeelingMap: Record<string, any> = {
        calm: 'comfortable',
        slightly_worried: 'slightly_worried',
        often_stressed: 'very_stressed',
        avoid_checking: 'crisis_mode',
      };

      const reachZeroMap: Record<string, any> = {
        never: 'never',
        sometimes: 'sometimes',
        often: 'often',
      };

      const emergencyMap: Record<string, any> = {
        can_handle: 'can_handle',
        will_struggle: 'will_struggle',
        need_to_borrow: 'no_safety_net',
      };

      const topImpulseMap: Record<string, any> = {
        food_delivery: 'food_delivery',
        shopping: 'shopping',
        travel: 'travel',
        online_services: 'entertainment',
      };

      const profilePayload = {
        id: session.user.id,
        monthly_income_range: updatedProfile.monthlyIncomeRange,
        income_type: updatedProfile.incomeType,
        country: updatedProfile.country || 'India',
        commitments: updatedProfile.commitments,
        total_fixed_amount: updatedProfile.totalFixedAmount,
        spending_style: updatedProfile.spendingStyle,
        overspend_trigger: updatedProfile.overspendTrigger,
        top_impulse_category: topImpulseMap[updatedProfile.topImpulseCategory] || 'shopping',
        money_feeling: moneyFeelingMap[updatedProfile.moneyFeeling] || 'comfortable',
        reach_zero_frequency: reachZeroMap[updatedProfile.reachZeroFrequency] || 'never',
        emergency_readiness: emergencyMap[updatedProfile.emergencyReadiness] || 'will_struggle',
        life_situation: updatedProfile.lifeSituation || 'none',
        planned_purchase: updatedProfile.plannedPurchase || 'none',
        ai_help_level: updatedProfile.aiHelpLevel || 'only_insights',
        is_onboarded: true,
      };

      if (existingProfile.data) {
        await supabase.from('profiles').update(profilePayload).eq('user_id', session.user.id);
      } else {
        await createProfile(profilePayload);
      }

      const computedAnalysis = computeFinancialAnalysis(updatedProfile);
      const riskLevelMap: Record<string, any> = {
        safe: 'safe',
        watch: 'caution',
        crisis: 'crisis',
      };

      const analysisPayload = {
        user_id: session.user.id,
        stress_score: computedAnalysis.stressScore,
        risk_level: riskLevelMap[computedAnalysis.riskLevel] || 'caution',
        silent_burden_index: computedAnalysis.silentBurdenIndex,
        survival_days: computedAnalysis.survivalDays,
        debt_risk: computedAnalysis.debtRisk,
        emergency_fund_target: computedAnalysis.emergencyFundTarget,
        weekly_budget: computedAnalysis.weeklyBudget,
        daily_budget: computedAnalysis.dailyBudget,
        recovery_days: computedAnalysis.recoveryDays,
        health_score: computedAnalysis.healthScore,
        is_current: true,
        analyzed_at: new Date().toISOString(),
      };

      const analysisResult = await createAnalysis(analysisPayload);
      const analysisId = analysisResult.data?.id;

      if (analysisId) {
        const signalsPayload = (computedAnalysis.activeSignals || []).map(s => ({
          analysis_id: analysisId,
          user_id: session.user.id,
          signal_id: s.id,
          signal_type: s.type,
          severity: s.severity,
          title: s.title,
          description: s.description,
          actionable: s.actionable,
          is_acknowledged: false,
          is_resolved: false,
        }));

        if (signalsPayload.length) {
          await supabase.from('active_signals').insert(signalsPayload);
        }

        const recommendationsPayload = (computedAnalysis.recommendations || []).map(r => ({
          analysis_id: analysisId,
          user_id: session.user.id,
          recommendation_id: r.id,
          priority: r.priority,
          title: r.title,
          description: r.description,
          action: r.action,
          category: r.category,
          is_accepted: false,
          is_completed: false,
        }));

        if (recommendationsPayload.length) {
          await supabase.from('recommendations').insert(recommendationsPayload);
        }
      }

      toast({
        title: 'Profile saved successfully!',
        description: 'Your financial profile has been saved to the database.',
      });
    } catch (error) {
      console.error('Error saving profile to Supabase:', error);
      toast({
        title: 'Error saving profile',
        description: 'There was an error saving your profile. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const clearProfile = () => {
    setProfileState(null);
    setAnalysis(null);
  };

  const addCheckIn = async (checkIn: Omit<DailyCheckIn, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      // Use new sync function that properly handles check-ins
      const result = await syncTodayCheckIn(session.user.id, {
        mood: checkIn.mood || 'okay',
        spent_today: checkIn.spentToday || 0,
        stayed_under_budget: checkIn.stayedUnderBudget ?? true,
        notes: checkIn.notes || undefined,
      });

      if (result.data) {
        const newCheckIn: DailyCheckIn = {
          id: result.data.id,
          date: result.data.check_in_date,
          mood: result.data.mood,
          spentToday: result.data.spent_today,
          stayedUnderBudget: result.data.stayed_under_budget,
          notes: result.data.notes || undefined
        };
        setCheckIns(prev => [newCheckIn, ...prev]);
      }

      // Update streaks
      if (checkIn.stayedUnderBudget) {
        updateStreak('under_budget');
      }
      updateStreak('check_in');
    } catch (error) {
      console.error('Error saving check-in:', error);
    }
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

  const addGoal = async (goal: Omit<UserGoal, 'id'>) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    try {
      // Sync goals to Supabase
      const syncResult = await syncGoals(session.user.id, [{
        goal_type: goal.category,
        title: goal.title,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount,
        target_date: goal.deadline,
        status: 'active',
      }]);

      if (syncResult.data && syncResult.data.length > 0) {
        const createdGoal = syncResult.data[0];
        const newGoal: UserGoal = {
          id: createdGoal.id,
          title: createdGoal.title,
          targetAmount: createdGoal.target_amount,
          currentAmount: createdGoal.current_amount,
          deadline: createdGoal.target_date || new Date().toISOString(),
          category: (createdGoal.goal_type as any) || 'custom',
          microGoals: goal.microGoals || [],
        };
        setGoals(prev => [...prev, newGoal]);
        console.log('Goal synced successfully:', newGoal);
      }
    } catch (error) {
      console.error('Error saving goal:', error);
    }
  };

  const updateGoalProgress = async (goalId: string, amount: number) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) return;

    setGoals(prev => prev.map(goal => {
      if (goal.id === goalId) {
        return {
          ...goal,
          currentAmount: Math.min(goal.currentAmount + amount, goal.targetAmount),
        };
      }
      return goal;
    }));

    // Sync transaction to Supabase
    try {
      await syncGoalTransaction(session.user.id, goalId, {
        amount,
        transaction_type: 'contribution',
        notes: 'Goal progress update',
      });
    } catch (error) {
      console.error('Error syncing goal transaction:', error);
    }
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
