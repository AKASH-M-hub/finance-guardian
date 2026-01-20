// Data Import Utility - Import existing FYF data export into Supabase

import { supabase } from './client';

interface ExportedData {
  profile: any;
  analysis: any;
  chatHistory: any[];
  checkIns: any[];
  goals: any[];
  exportedAt: string;
}

export async function importUserData(userId: string, exportData: ExportedData) {
  const results = {
    profile: null as any,
    analysis: null as any,
    signals: [] as any[],
    recommendations: [] as any[],
    conversations: [] as any[],
    checkIns: [] as any[],
    goals: [] as any[],
    errors: [] as string[],
  };

  try {
    console.log('📋 Importing profile...');
    const profileData = {
      id: userId,
      monthly_income_range: exportData.profile.monthlyIncomeRange,
      income_type: exportData.profile.incomeType,
      country: exportData.profile.country || 'India',
      commitments: exportData.profile.commitments || [],
      total_fixed_amount: exportData.profile.totalFixedAmount || 0,
      spending_style: exportData.profile.spendingStyle,
      overspend_trigger: exportData.profile.overspendTrigger,
      top_impulse_category: exportData.profile.topImpulseCategory,
      money_feeling: exportData.profile.moneyFeeling,
      reach_zero_frequency: exportData.profile.reachZeroFrequency,
      emergency_readiness: exportData.profile.emergencyReadiness,
      life_situation: exportData.profile.lifeSituation,
      planned_purchase: exportData.profile.plannedPurchase,
      ai_help_level: exportData.profile.aiHelpLevel,
      is_onboarded: exportData.profile.isOnboarded || false,
    };

    const { data: profile, error: profileError } = await (supabase
      .from('profiles') as any)
      .upsert(profileData)
      .select()
      .single();

    if (profileError) {
      results.errors.push(`Profile: ${profileError.message}`);
    } else {
      results.profile = profile;
    }

    if (exportData.analysis) {
      const { data: analysis, error: analysisError } = await (supabase
        .from('financial_analysis') as any)
        .insert({
          user_id: userId,
          stress_score: exportData.analysis.stressScore,
          risk_level: exportData.analysis.riskLevel,
          silent_burden_index: exportData.analysis.silentBurdenIndex,
          survival_days: exportData.analysis.survivalDays,
          debt_risk: exportData.analysis.debtRisk,
          health_score: exportData.analysis.healthScore,
          emergency_fund_target: exportData.analysis.emergencyFundTarget,
          weekly_budget: exportData.analysis.weeklyBudget,
          daily_budget: exportData.analysis.dailyBudget,
          recovery_days: exportData.analysis.recoveryDays,
          is_current: true,
        })
        .select()
        .single();

      if (analysisError) {
        results.errors.push(`Analysis: ${analysisError.message}`);
      } else {
        results.analysis = analysis;
      }
    }

    return results;
  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

export async function importFromFile(userId: string, jsonData: string) {
  const exportData: ExportedData = JSON.parse(jsonData);
  return await importUserData(userId, exportData);
}

export async function exportUserData(userId: string) {
  const [profileResult, analysisResult] = await Promise.all([
    (supabase.from('profiles') as any).select('*').eq('id', userId).single(),
    (supabase.from('financial_analysis') as any).select('*').eq('user_id', userId).eq('is_current', true).single(),
  ]);

  return {
    profile: profileResult.data,
    analysis: analysisResult.data,
    exportedAt: new Date().toISOString(),
  };
}

export function mapDbProfile(dbProfile: any): any {
  return {
    monthlyIncomeRange: dbProfile.monthly_income_range,
    incomeType: dbProfile.income_type,
    country: dbProfile.country || 'India',
    commitments: dbProfile.commitments || [],
    totalFixedAmount: dbProfile.total_fixed_amount || 0,
    spendingStyle: dbProfile.spending_style,
    overspendTrigger: dbProfile.overspend_trigger,
    topImpulseCategory: dbProfile.top_impulse_category,
    moneyFeeling: dbProfile.money_feeling,
    reachZeroFrequency: dbProfile.reach_zero_frequency,
    emergencyReadiness: dbProfile.emergency_readiness,
    lifeSituation: dbProfile.life_situation,
    plannedPurchase: dbProfile.planned_purchase,
    aiHelpLevel: dbProfile.ai_help_level,
    isOnboarded: dbProfile.is_onboarded || false,
  };
}

export function mapDbAnalysis(dbAnalysis: any): any {
  return {
    stressScore: dbAnalysis.stress_score,
    riskLevel: dbAnalysis.risk_level,
    silentBurdenIndex: dbAnalysis.silent_burden_index,
    survivalDays: dbAnalysis.survival_days,
    debtRisk: dbAnalysis.debt_risk,
    healthScore: dbAnalysis.health_score,
  };
}
