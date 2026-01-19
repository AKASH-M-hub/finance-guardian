// Data Import Utility - Import existing FYF data export into Supabase
// Usage: Run this script to migrate data from JSON export to database

import { supabase } from './client';
import type { Database } from './types';

interface ExportedData {
  profile: any;
  analysis: any;
  chatHistory: any[];
  checkIns: any[];
  goals: any[];
  exportedAt: string;
}

/**
 * Import data from JSON export file into Supabase database
 */
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
    // 1. Import Profile
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

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .upsert(profileData)
      .select()
      .single();

    if (profileError) {
      results.errors.push(`Profile: ${profileError.message}`);
    } else {
      results.profile = profile;
      console.log('✅ Profile imported');
    }

    // 2. Import Financial Analysis
    if (exportData.analysis) {
      console.log('📊 Importing financial analysis...');
      const analysisData = {
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
      };

      const { data: analysis, error: analysisError } = await supabase
        .from('financial_analysis')
        .insert(analysisData)
        .select()
        .single();

      if (analysisError) {
        results.errors.push(`Analysis: ${analysisError.message}`);
      } else {
        results.analysis = analysis;
        console.log('✅ Analysis imported');

        // 2a. Import Active Signals
        if (exportData.analysis.activeSignals && analysis) {
          console.log('🚨 Importing active signals...');
          const signalsData = exportData.analysis.activeSignals.map((signal: any) => ({
            analysis_id: analysis.id,
            user_id: userId,
            signal_id: signal.id,
            signal_type: signal.type,
            severity: signal.severity,
            title: signal.title,
            description: signal.description,
            actionable: signal.actionable,
          }));

          const { data: signals, error: signalsError } = await supabase
            .from('active_signals')
            .insert(signalsData)
            .select();

          if (signalsError) {
            results.errors.push(`Signals: ${signalsError.message}`);
          } else {
            results.signals = signals || [];
            console.log(`✅ ${signals?.length || 0} signals imported`);
          }
        }

        // 2b. Import Recommendations
        if (exportData.analysis.recommendations && analysis) {
          console.log('💡 Importing recommendations...');
          const recommendationsData = exportData.analysis.recommendations.map((rec: any) => ({
            analysis_id: analysis.id,
            user_id: userId,
            recommendation_id: rec.id,
            priority: rec.priority,
            title: rec.title,
            description: rec.description,
            action: rec.action,
            category: rec.category,
          }));

          const { data: recommendations, error: recsError } = await supabase
            .from('recommendations')
            .insert(recommendationsData)
            .select();

          if (recsError) {
            results.errors.push(`Recommendations: ${recsError.message}`);
          } else {
            results.recommendations = recommendations || [];
            console.log(`✅ ${recommendations?.length || 0} recommendations imported`);
          }
        }
      }
    }

    // 3. Import Chat History
    if (exportData.chatHistory && exportData.chatHistory.length > 0) {
      console.log('💬 Importing chat history...');
      
      for (const chat of exportData.chatHistory) {
        // Create conversation
        const { data: conversation, error: convError } = await supabase
          .from('chat_conversations')
          .insert({
            user_id: userId,
            title: chat.title || 'New Conversation',
            created_at: chat.createdAt,
            last_updated: chat.lastUpdated,
          })
          .select()
          .single();

        if (convError) {
          results.errors.push(`Conversation ${chat.id}: ${convError.message}`);
          continue;
        }

        results.conversations.push(conversation);

        // Insert messages
        if (chat.messages && chat.messages.length > 0) {
          const messagesData = chat.messages.map((msg: any, index: number) => ({
            conversation_id: conversation?.id,
            user_id: userId,
            role: msg.role,
            content: msg.content,
            message_index: index,
            created_at: msg.timestamp,
          }));

          const { error: messagesError } = await supabase
            .from('chat_messages')
            .insert(messagesData);

          if (messagesError) {
            results.errors.push(`Messages for ${chat.id}: ${messagesError.message}`);
          }
        }
      }
      console.log(`✅ ${results.conversations.length} conversations imported`);
    }

    // 4. Import Check-ins
    if (exportData.checkIns && exportData.checkIns.length > 0) {
      console.log('📅 Importing check-ins...');
      const checkInsData = exportData.checkIns.map((checkIn: any) => ({
        user_id: userId,
        check_in_date: checkIn.date,
        mood: checkIn.mood,
        spent_today: checkIn.spentToday,
        stayed_under_budget: checkIn.stayedUnderBudget,
        notes: checkIn.notes,
      }));

      const { data: checkIns, error: checkInsError } = await supabase
        .from('check_ins')
        .insert(checkInsData)
        .select();

      if (checkInsError) {
        results.errors.push(`Check-ins: ${checkInsError.message}`);
      } else {
        results.checkIns = checkIns || [];
        console.log(`✅ ${checkIns?.length || 0} check-ins imported`);
      }
    }

    // 5. Import Goals
    if (exportData.goals && exportData.goals.length > 0) {
      console.log('🎯 Importing goals...');
      const goalsData = exportData.goals.map((goal: any) => ({
        user_id: userId,
        goal_type: goal.type || 'custom',
        title: goal.title,
        description: goal.description,
        target_amount: goal.targetAmount,
        current_amount: goal.currentAmount || 0,
        target_date: goal.targetDate,
        status: goal.status || 'active',
      }));

      const { data: goals, error: goalsError } = await supabase
        .from('goals')
        .insert(goalsData)
        .select();

      if (goalsError) {
        results.errors.push(`Goals: ${goalsError.message}`);
      } else {
        results.goals = goals || [];
        console.log(`✅ ${goals?.length || 0} goals imported`);
      }
    }

    // Summary
    console.log('\n📊 Import Summary:');
    console.log(`✅ Profile: ${results.profile ? 'Success' : 'Failed'}`);
    console.log(`✅ Analysis: ${results.analysis ? 'Success' : 'Failed'}`);
    console.log(`✅ Signals: ${results.signals.length} imported`);
    console.log(`✅ Recommendations: ${results.recommendations.length} imported`);
    console.log(`✅ Conversations: ${results.conversations.length} imported`);
    console.log(`✅ Check-ins: ${results.checkIns.length} imported`);
    console.log(`✅ Goals: ${results.goals.length} imported`);

    if (results.errors.length > 0) {
      console.log('\n⚠️ Errors encountered:');
      results.errors.forEach(error => console.log(`  - ${error}`));
    }

    return results;

  } catch (error) {
    console.error('❌ Import failed:', error);
    throw error;
  }
}

/**
 * Helper function to load and import from a JSON file
 */
export async function importFromFile(userId: string, jsonData: string) {
  try {
    const exportData: ExportedData = JSON.parse(jsonData);
    return await importUserData(userId, exportData);
  } catch (error) {
    console.error('Failed to parse JSON:', error);
    throw new Error('Invalid JSON format');
  }
}

/**
 * Export current user data (reverse operation)
 */
export async function exportUserData(userId: string) {
  try {
    console.log('📤 Exporting user data...');

    const [
      profileResult,
      analysisResult,
      signalsResult,
      recommendationsResult,
      conversationsResult,
      checkInsResult,
      goalsResult,
    ] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', userId).single(),
      supabase.from('financial_analysis').select('*').eq('user_id', userId).eq('is_current', true).single(),
      supabase.from('active_signals').select('*').eq('user_id', userId).eq('is_resolved', false),
      supabase.from('recommendations').select('*').eq('user_id', userId).eq('is_completed', false),
      supabase.from('chat_conversations').select('*, chat_messages(*)').eq('user_id', userId),
      supabase.from('check_ins').select('*').eq('user_id', userId),
      supabase.from('goals').select('*').eq('user_id', userId),
    ]);

    const exportData = {
      profile: profileResult.data,
      analysis: {
        ...(analysisResult.data as any),
        activeSignals: signalsResult.data,
        recommendations: recommendationsResult.data,
      },
      chatHistory: conversationsResult.data,
      checkIns: checkInsResult.data,
      goals: goalsResult.data,
      exportedAt: new Date().toISOString(),
    };

    console.log('✅ Export complete');
    return exportData;

  } catch (error) {
    console.error('❌ Export failed:', error);
    throw error;
  }
}

/**
 * Map database profile to UI UserProfile type
 */
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
    financialGoals: dbProfile.financial_goals || [],
    triggerSituations: dbProfile.trigger_situations || [],
    isOnboarded: dbProfile.is_onboarded || false,
    createdAt: dbProfile.created_at,
    updatedAt: dbProfile.updated_at,
  };
}

/**
 * Map database analysis to UI FinancialAnalysis type
 */
export function mapDbAnalysis(dbAnalysis: any): any {
  return {
    stressScore: dbAnalysis.stress_score,
    riskLevel: dbAnalysis.risk_level,
    silentBurdenIndex: dbAnalysis.silent_burden_index,
    availableMonthly: dbAnalysis.available_monthly,
    recommendedDiscretionary: dbAnalysis.recommended_discretionary,
    safeSpendingToday: dbAnalysis.safe_spending_today,
    insights: dbAnalysis.primary_insights || [],
    signals: [],
    recommendations: [],
  };
}
