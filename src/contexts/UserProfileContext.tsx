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
  syncTodayCheckIn,
  syncGoals,
  syncGoalTransaction,
} from '@/integrations/supabase/helpers';
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
        // Fetch profile
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profileData && !profileError) {
          const hydratedProfile = mapDbToProfile(profileData);
          setProfileState(hydratedProfile);

          // Fetch current analysis
          const { data: analysisData } = await supabase
            .from('financial_analysis')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_current', true)
            .order('analyzed_at', { ascending: false })
            .limit(1)
            .single();

          if (analysisData) {
            setAnalysis(mapDbToAnalysis(analysisData));
          }

          // Fetch recent check-ins
          const { data: checkInsData } = await supabase
            .from('check_ins')
            .select('*')
            .eq('user_id', session.user.id)
            .order('check_in_date', { ascending: false })
            .limit(30);

          if (checkInsData) {
            setCheckIns(checkInsData.map((ci: any) => ({
              id: ci.id,
              date: ci.check_in_date,
              mood: ci.mood,
              spentToday: ci.spent_today || 0,
              stayedUnderBudget: ci.stayed_under_budget ?? true,
              notes: ci.notes || undefined
            })));
          }

          // Fetch active goals
          const { data: goalsData } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('status', 'active')
            .order('created_at', { ascending: false });

          if (goalsData) {
            setGoals(goalsData.map((g: any) => ({
              id: g.id,
              title: g.title,
              targetAmount: g.target_amount || 0,
              currentAmount: g.current_amount || 0,
              deadline: g.target_date || new Date().toISOString(),
              category: mapGoalCategory(g.goal_type),
              microGoals: [],
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
      // Check if profile exists
      const { data: existingProfile } = await (supabase
        .from('profiles') as any)
        .select('id')
        .eq('id', session.user.id)
        .single();

      const profilePayload = {
        id: session.user.id,
        monthly_income_range: updatedProfile.monthlyIncomeRange,
        income_type: updatedProfile.incomeType,
        country: updatedProfile.country || 'India',
        commitments: updatedProfile.commitments as string[],
        total_fixed_amount: updatedProfile.totalFixedAmount,
        spending_style: updatedProfile.spendingStyle,
        overspend_trigger: updatedProfile.overspendTrigger,
        top_impulse_category: mapImpulseCategoryToDb(updatedProfile.topImpulseCategory),
        money_feeling: mapMoneyFeelingToDb(updatedProfile.moneyFeeling),
        reach_zero_frequency: mapZeroFrequencyToDb(updatedProfile.reachZeroFrequency),
        emergency_readiness: mapEmergencyReadinessToDb(updatedProfile.emergencyReadiness),
        life_situation: mapLifeSituationToDb(updatedProfile.lifeSituation),
        planned_purchase: mapPlannedPurchaseToDb(updatedProfile.plannedPurchase),
        ai_help_level: updatedProfile.aiHelpLevel || 'only_insights',
        is_onboarded: true,
      };

      if (existingProfile) {
        await (supabase.from('profiles') as any).update(profilePayload).eq('id', session.user.id);
      } else {
        await (supabase.from('profiles') as any).insert(profilePayload);
      }

      const computedAnalysis = computeFinancialAnalysis(updatedProfile);
      
      // Mark old analysis as not current
      await (supabase
        .from('financial_analysis') as any)
        .update({ is_current: false })
        .eq('user_id', session.user.id)
        .eq('is_current', true);

      // Insert new analysis
      const { data: analysisData } = await (supabase
        .from('financial_analysis') as any)
        .insert({
          user_id: session.user.id,
          stress_score: computedAnalysis.stressScore,
          risk_level: mapRiskLevelToDb(computedAnalysis.riskLevel),
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
        })
        .select()
        .single();

      if (analysisData) {
        const analysisId = analysisData.id;

        // Insert signals
        const signalsPayload = (computedAnalysis.activeSignals || []).map(s => ({
          analysis_id: analysisId,
          user_id: session.user.id,
          signal_id: s.id,
          signal_type: s.type,
          severity: mapSeverityToDb(s.severity),
          title: s.title,
          description: s.description,
          actionable: s.actionable,
          is_acknowledged: false,
          is_resolved: false,
        }));

        if (signalsPayload.length) {
          await (supabase.from('active_signals') as any).insert(signalsPayload);
        }

        // Insert recommendations
        const recommendationsPayload = (computedAnalysis.recommendations || []).map(r => ({
          analysis_id: analysisId,
          user_id: session.user.id,
          recommendation_id: r.id,
          priority: mapPriorityToDb(r.priority),
          title: r.title,
          description: r.description,
          action: r.action,
          category: r.category,
          is_accepted: false,
          is_completed: false,
        }));

        if (recommendationsPayload.length) {
          await (supabase.from('recommendations') as any).insert(recommendationsPayload);
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
        setCheckIns(prev => [newCheckIn, ...prev.filter(c => c.id !== newCheckIn.id)]);
      }

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
      const syncResult = await syncGoals(session.user.id, [{
        goal_type: mapGoalCategoryToDb(goal.category),
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
          targetAmount: createdGoal.target_amount || 0,
          currentAmount: createdGoal.current_amount || 0,
          deadline: createdGoal.target_date || new Date().toISOString(),
          category: mapGoalCategory(createdGoal.goal_type),
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

// Helper mapping functions
function mapDbToProfile(db: any): UserProfile {
  return {
    id: db.id,
    monthlyIncomeRange: db.monthly_income_range,
    incomeType: db.income_type,
    country: db.country || 'India',
    commitments: db.commitments || [],
    totalFixedAmount: db.total_fixed_amount || 0,
    spendingStyle: db.spending_style || 'mixed',
    overspendTrigger: db.overspend_trigger || 'weekends',
    topImpulseCategory: mapDbToImpulseCategory(db.top_impulse_category),
    moneyFeeling: mapDbToMoneyFeeling(db.money_feeling),
    reachZeroFrequency: mapDbToZeroFrequency(db.reach_zero_frequency),
    emergencyReadiness: mapDbToEmergencyReadiness(db.emergency_readiness),
    lifeSituation: mapDbToLifeSituation(db.life_situation),
    plannedPurchase: mapDbToPlannedPurchase(db.planned_purchase),
    aiHelpLevel: db.ai_help_level || 'only_insights',
    isOnboarded: db.is_onboarded || false,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

function mapDbToAnalysis(db: any): FinancialAnalysis {
  return {
    stressScore: db.stress_score || 0,
    riskLevel: db.risk_level === 'crisis' ? 'crisis' : db.risk_level === 'safe' ? 'safe' : 'watch',
    silentBurdenIndex: db.silent_burden_index || 0,
    survivalDays: db.survival_days || 0,
    debtRisk: db.debt_risk || 0,
    emergencyFundTarget: db.emergency_fund_target || 0,
    weeklyBudget: db.weekly_budget || 0,
    dailyBudget: db.daily_budget || 0,
    activeSignals: [],
    recommendations: [],
    recoveryDays: db.recovery_days || 0,
    healthScore: db.health_score || 0,
  };
}

function mapGoalCategory(dbType: string): UserGoal['category'] {
  const mapping: Record<string, UserGoal['category']> = {
    emergency_fund: 'emergency_fund',
    debt_payoff: 'debt_payment',
    savings: 'custom',
    investment: 'custom',
    purchase: 'purchase',
    custom: 'custom',
  };
  return mapping[dbType] || 'custom';
}

function mapGoalCategoryToDb(category: UserGoal['category']): string {
  const mapping: Record<UserGoal['category'], string> = {
    emergency_fund: 'emergency_fund',
    debt_payment: 'debt_payoff',
    purchase: 'purchase',
    travel: 'custom',
    custom: 'custom',
  };
  return mapping[category] || 'custom';
}

function mapDbToImpulseCategory(db: string | null): any {
  if (!db) return 'shopping';
  const mapping: Record<string, any> = {
    food_delivery: 'food_delivery',
    shopping: 'shopping',
    travel: 'travel',
    entertainment: 'online_services',
    gadgets: 'shopping',
  };
  return mapping[db] || 'shopping';
}

function mapImpulseCategoryToDb(cat: any): any {
  const mapping: Record<string, any> = {
    food_delivery: 'food_delivery',
    shopping: 'shopping',
    travel: 'travel',
    online_services: 'entertainment',
  };
  return mapping[cat] || 'shopping';
}

function mapDbToMoneyFeeling(db: string | null): any {
  if (!db) return 'calm';
  const mapping: Record<string, any> = {
    confident: 'calm',
    comfortable: 'calm',
    slightly_worried: 'slightly_worried',
    very_stressed: 'often_stressed',
    crisis_mode: 'avoid_checking',
  };
  return mapping[db] || 'calm';
}

function mapMoneyFeelingToDb(feeling: any): any {
  const mapping: Record<string, any> = {
    calm: 'comfortable',
    slightly_worried: 'slightly_worried',
    often_stressed: 'very_stressed',
    avoid_checking: 'crisis_mode',
  };
  return mapping[feeling] || 'comfortable';
}

function mapDbToZeroFrequency(db: string | null): any {
  if (!db) return 'never';
  const mapping: Record<string, any> = {
    never: 'never',
    rarely: 'never',
    sometimes: 'sometimes',
    often: 'often',
    always: 'often',
  };
  return mapping[db] || 'never';
}

function mapZeroFrequencyToDb(freq: any): any {
  const mapping: Record<string, any> = {
    never: 'never',
    sometimes: 'sometimes',
    often: 'often',
  };
  return mapping[freq] || 'never';
}

function mapDbToEmergencyReadiness(db: string | null): any {
  if (!db) return 'can_handle';
  const mapping: Record<string, any> = {
    fully_covered: 'can_handle',
    can_handle: 'can_handle',
    will_struggle: 'will_struggle',
    no_safety_net: 'need_to_borrow',
  };
  return mapping[db] || 'can_handle';
}

function mapEmergencyReadinessToDb(readiness: any): any {
  const mapping: Record<string, any> = {
    can_handle: 'can_handle',
    will_struggle: 'will_struggle',
    need_to_borrow: 'no_safety_net',
  };
  return mapping[readiness] || 'will_struggle';
}

function mapDbToLifeSituation(db: string | null): any {
  if (!db) return 'none';
  const mapping: Record<string, any> = {
    none: 'none',
    job_change: 'job_change',
    new_city: 'job_change',
    wedding_planned: 'family_responsibility',
    family_expansion: 'family_responsibility',
    health_concern: 'medical',
  };
  return mapping[db] || 'none';
}

function mapLifeSituationToDb(situation: any): any {
  const mapping: Record<string, any> = {
    none: 'none',
    exams: 'none',
    job_change: 'job_change',
    medical: 'health_concern',
    family_responsibility: 'family_expansion',
  };
  return mapping[situation] || 'none';
}

function mapDbToPlannedPurchase(db: string | null): any {
  if (!db) return 'none';
  const mapping: Record<string, any> = {
    none: 'none',
    vehicle: 'vehicle',
    home: 'vehicle',
    education: 'laptop',
    wedding: 'travel',
    gadget: 'phone',
  };
  return mapping[db] || 'none';
}

function mapPlannedPurchaseToDb(purchase: any): any {
  const mapping: Record<string, any> = {
    none: 'none',
    phone: 'gadget',
    laptop: 'education',
    vehicle: 'vehicle',
    travel: 'wedding',
  };
  return mapping[purchase] || 'none';
}

function mapRiskLevelToDb(level: 'safe' | 'watch' | 'crisis'): any {
  const mapping: Record<string, any> = {
    safe: 'safe',
    watch: 'caution',
    crisis: 'crisis',
  };
  return mapping[level] || 'caution';
}

function mapSeverityToDb(severity: 'low' | 'medium' | 'high'): any {
  return severity;
}

function mapPriorityToDb(priority: 'high' | 'medium' | 'low'): any {
  return priority;
}

// Analysis computation functions
function computeFinancialAnalysis(profile: UserProfile): FinancialAnalysis {
  const incomeRange = incomeRangeToNumber(profile.monthlyIncomeRange);
  const monthlyIncome = incomeRange.avg;
  
  const silentBurdenIndex = Math.min(100, Math.round((profile.totalFixedAmount / monthlyIncome) * 100));
  
  let stressScore = 20;
  
  stressScore += Math.min(30, silentBurdenIndex * 0.4);
  
  if (profile.spendingStyle === 'mostly_impulsive') stressScore += 15;
  else if (profile.spendingStyle === 'mixed') stressScore += 8;
  
  if (profile.moneyFeeling === 'avoid_checking') stressScore += 20;
  else if (profile.moneyFeeling === 'often_stressed') stressScore += 15;
  else if (profile.moneyFeeling === 'slightly_worried') stressScore += 8;
  
  if (profile.reachZeroFrequency === 'often') stressScore += 20;
  else if (profile.reachZeroFrequency === 'sometimes') stressScore += 10;
  
  if (profile.emergencyReadiness === 'need_to_borrow') stressScore += 15;
  else if (profile.emergencyReadiness === 'will_struggle') stressScore += 8;
  
  if (profile.lifeSituation === 'medical' || profile.lifeSituation === 'job_change') stressScore += 10;
  
  stressScore = Math.min(100, Math.round(stressScore));
  
  let riskLevel: 'safe' | 'watch' | 'crisis';
  if (stressScore < 35) riskLevel = 'safe';
  else if (stressScore < 65) riskLevel = 'watch';
  else riskLevel = 'crisis';
  
  const availableMonthly = monthlyIncome - profile.totalFixedAmount;
  const dailyBudget = Math.round(availableMonthly / 30);
  const weeklyBudget = dailyBudget * 7;
  
  const survivalDays = availableMonthly > 0 ? Math.round(availableMonthly / dailyBudget) : 0;
  
  let debtRisk = 0;
  if (profile.emergencyReadiness === 'need_to_borrow') debtRisk += 40;
  if (profile.reachZeroFrequency === 'often') debtRisk += 30;
  if (profile.commitments.some(c => c.includes('emi') || c === 'credit_card')) debtRisk += 20;
  if (silentBurdenIndex > 60) debtRisk += 10;
  debtRisk = Math.min(100, debtRisk);
  
  const emergencyFundTarget = profile.totalFixedAmount * 4;
  
  const activeSignals = generateStressSignals(profile, stressScore, silentBurdenIndex, debtRisk);
  
  const recommendations = generateRecommendations(profile, stressScore, silentBurdenIndex);
  
  const recoveryDays = stressScore > 50 ? Math.round(stressScore * 1.5) : 0;
  
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
      description: `${silentBurdenIndex}% of your income is locked in fixed expenses. This leaves very little flexibility.`,
      actionable: 'Review your subscriptions and EMIs. Consider negotiating rent or consolidating debts.',
    });
  }
  
  if (profile.emergencyReadiness === 'need_to_borrow') {
    signals.push({
      id: 'emergency_unready',
      type: 'emergency_unpreparedness',
      severity: 'high',
      title: 'No Emergency Buffer',
      description: 'An unexpected expense would push you into debt.',
      actionable: 'Start with saving ₹500/week for emergencies. Even small buffers help.',
    });
  }
  
  if (profile.spendingStyle === 'mostly_impulsive') {
    signals.push({
      id: 'impulse_risk',
      type: 'impulse_risk',
      severity: 'medium',
      title: 'Impulse Spending Pattern',
      description: 'Your spending style makes it harder to stick to budgets.',
      actionable: 'Use the 24-hour rule: Wait a day before non-essential purchases over ₹500.',
    });
  }
  
  if (profile.moneyFeeling === 'avoid_checking' || profile.moneyFeeling === 'often_stressed') {
    signals.push({
      id: 'emotional_spending',
      type: 'emotional_spending',
      severity: 'medium',
      title: 'Money Anxiety Detected',
      description: 'Financial stress can lead to avoidance or emotional spending.',
      actionable: 'Do a quick 15-second daily check-in to stay connected without overwhelm.',
    });
  }
  
  if (profile.reachZeroFrequency === 'often') {
    signals.push({
      id: 'zero_balance',
      type: 'zero_balance_risk',
      severity: 'high',
      title: 'Frequent Zero Balance',
      description: 'Reaching zero before salary indicates tight cash flow.',
      actionable: 'Try the weekly budget envelope method to spread spending evenly.',
    });
  }
  
  return signals;
}

function generateRecommendations(
  profile: UserProfile,
  stressScore: number,
  silentBurdenIndex: number
): Recommendation[] {
  const recommendations: Recommendation[] = [];
  
  if (silentBurdenIndex > 50) {
    recommendations.push({
      id: 'reduce_fixed',
      priority: 'high',
      title: 'Reduce Fixed Costs',
      description: 'Your fixed expenses are eating too much of your income.',
      action: 'Review and cut at least one subscription or negotiate a lower rent/EMI.',
      category: 'spending',
    });
  }
  
  if (profile.emergencyReadiness !== 'can_handle') {
    recommendations.push({
      id: 'build_emergency',
      priority: 'high',
      title: 'Start Emergency Fund',
      description: 'Begin building a financial safety net.',
      action: 'Set aside ₹500-1000 weekly until you have 1 month of expenses saved.',
      category: 'emergency',
    });
  }
  
  if (stressScore > 50) {
    recommendations.push({
      id: 'track_spending',
      priority: 'medium',
      title: 'Daily Spending Check',
      description: 'Awareness is the first step to control.',
      action: 'Do a 15-second daily check-in on spending and mood.',
      category: 'spending',
    });
  }
  
  if (profile.spendingStyle !== 'mostly_planned') {
    recommendations.push({
      id: 'plan_purchases',
      priority: 'medium',
      title: 'Plan Before You Spend',
      description: 'Planned spending reduces regret and builds savings.',
      action: 'Create a weekly spending plan each Sunday.',
      category: 'lifestyle',
    });
  }
  
  recommendations.push({
    id: 'review_monthly',
    priority: 'low',
    title: 'Monthly Money Review',
    description: 'Regular reviews help catch issues early.',
    action: 'Schedule 30 minutes at month-end to review spending patterns.',
    category: 'lifestyle',
  });
  
  return recommendations;
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
  
  if (analysis.stressScore >= 70) {
    triggerReasons.push('Very high financial stress');
  }
  if (analysis.survivalDays < 7) {
    triggerReasons.push('Less than 1 week of survival budget');
  }
  if (analysis.debtRisk >= 70) {
    triggerReasons.push('High risk of falling into debt');
  }
  
  const isInCrisis = triggerReasons.length >= 2 || analysis.stressScore >= 80;
  
  let crisisLevel: 'none' | 'warning' | 'critical' = 'none';
  if (isInCrisis) {
    crisisLevel = analysis.stressScore >= 85 ? 'critical' : 'warning';
  }
  
  return {
    isInCrisis,
    crisisLevel,
    triggerReasons,
    activeSince: isInCrisis ? new Date().toISOString() : undefined,
    frozenCategories: isInCrisis ? ['travel', 'shopping', 'entertainment'] : [],
  };
}
