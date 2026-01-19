// Database Helper Functions for FYF
// Utility functions for common database operations

import { supabase } from './client';
import type { Database } from './types';

type Profile = Database['public']['Tables']['profiles']['Row'];
type ProfileInsert = Database['public']['Tables']['profiles']['Insert'];
type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];

type FinancialAnalysis = Database['public']['Tables']['financial_analysis']['Row'];
type FinancialAnalysisInsert = Database['public']['Tables']['financial_analysis']['Insert'];

type ActiveSignal = Database['public']['Tables']['active_signals']['Row'];
type ActiveSignalInsert = Database['public']['Tables']['active_signals']['Insert'];

type Recommendation = Database['public']['Tables']['recommendations']['Row'];
type RecommendationInsert = Database['public']['Tables']['recommendations']['Insert'];

type ChatConversation = Database['public']['Tables']['chat_conversations']['Row'];
type ChatMessage = Database['public']['Tables']['chat_messages']['Row'];
type ChatMessageInsert = Database['public']['Tables']['chat_messages']['Insert'];

type CheckIn = Database['public']['Tables']['check_ins']['Row'];
type CheckInInsert = Database['public']['Tables']['check_ins']['Insert'];

type Goal = Database['public']['Tables']['goals']['Row'];
type GoalInsert = Database['public']['Tables']['goals']['Insert'];
type GoalUpdate = Database['public']['Tables']['goals']['Update'];

type GoalTransaction = Database['public']['Tables']['goal_transactions']['Row'];
type GoalTransactionInsert = Database['public']['Tables']['goal_transactions']['Insert'];

// =====================================================
// PROFILE OPERATIONS
// =====================================================

export async function getProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function createProfile(profile: ProfileInsert) {
  const { data, error } = await supabase
    .from('profiles')
    .insert(profile)
    .select()
    .single();

  return { data, error };
}

export async function updateProfile(userId: string, updates: ProfileUpdate) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// FINANCIAL ANALYSIS OPERATIONS
// =====================================================

export async function getCurrentAnalysis(userId: string) {
  const { data, error } = await supabase
    .from('financial_analysis')
    .select('*')
    .eq('user_id', userId)
    .eq('is_current', true)
    .order('analyzed_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

export async function createAnalysis(analysis: FinancialAnalysisInsert) {
  // First, mark all existing analysis as not current
  await supabase
    .from('financial_analysis')
    .update({ is_current: false })
    .eq('user_id', analysis.user_id)
    .eq('is_current', true);

  // Then insert the new analysis
  const { data, error } = await supabase
    .from('financial_analysis')
    .insert({ ...analysis, is_current: true })
    .select()
    .single();

  return { data, error };
}

export async function getAnalysisHistory(userId: string, limit = 10) {
  const { data, error } = await supabase
    .from('financial_analysis')
    .select('*')
    .eq('user_id', userId)
    .order('analyzed_at', { ascending: false })
    .limit(limit);

  return { data, error };
}

// =====================================================
// SIGNALS & RECOMMENDATIONS
// =====================================================

export async function getActiveSignals(userId: string) {
  const { data, error } = await supabase
    .from('active_signals')
    .select('*')
    .eq('user_id', userId)
    .eq('is_resolved', false)
    .order('severity', { ascending: false });

  return { data, error };
}

export async function createSignals(signals: ActiveSignalInsert[]) {
  const { data, error } = await supabase
    .from('active_signals')
    .insert(signals)
    .select();

  return { data, error };
}

export async function resolveSignal(signalId: string) {
  const { data, error } = await supabase
    .from('active_signals')
    .update({ 
      is_resolved: true, 
      resolved_at: new Date().toISOString() 
    })
    .eq('id', signalId)
    .select()
    .single();

  return { data, error };
}

export async function getRecommendations(userId: string) {
  const { data, error } = await supabase
    .from('recommendations')
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('priority', { ascending: false });

  return { data, error };
}

export async function createRecommendations(recommendations: RecommendationInsert[]) {
  const { data, error } = await supabase
    .from('recommendations')
    .insert(recommendations)
    .select();

  return { data, error };
}

export async function acceptRecommendation(recommendationId: string) {
  const { data, error } = await supabase
    .from('recommendations')
    .update({ 
      is_accepted: true, 
      accepted_at: new Date().toISOString() 
    })
    .eq('id', recommendationId)
    .select()
    .single();

  return { data, error };
}

export async function completeRecommendation(recommendationId: string) {
  const { data, error } = await supabase
    .from('recommendations')
    .update({ 
      is_completed: true, 
      completed_at: new Date().toISOString() 
    })
    .eq('id', recommendationId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// CHAT OPERATIONS
// =====================================================

export async function getConversations(userId: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .select('*')
    .eq('user_id', userId)
    .order('last_updated', { ascending: false });

  return { data, error };
}

export async function createConversation(userId: string, title: string = 'New Conversation') {
  const { data, error } = await supabase
    .from('chat_conversations')
    .insert({ user_id: userId, title })
    .select()
    .single();

  return { data, error };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await supabase
    .from('chat_messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('message_index', { ascending: true });

  return { data, error };
}

export async function addMessage(message: ChatMessageInsert) {
  const { data, error } = await supabase
    .from('chat_messages')
    .insert(message)
    .select()
    .single();

  return { data, error };
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const { data, error } = await supabase
    .from('chat_conversations')
    .update({ title })
    .eq('id', conversationId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// CHECK-INS OPERATIONS
// =====================================================

export async function getTodayCheckIn(userId: string) {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .eq('check_in_date', today)
    .single();

  return { data, error };
}

export async function getRecentCheckIns(userId: string, days = 30) {
  const { data, error } = await supabase
    .from('check_ins')
    .select('*')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: false })
    .limit(days);

  return { data, error };
}

export async function createCheckIn(checkIn: CheckInInsert) {
  const { data, error } = await supabase
    .from('check_ins')
    .insert(checkIn)
    .select()
    .single();

  return { data, error };
}

export async function updateCheckIn(checkInId: string, updates: Partial<CheckInInsert>) {
  const { data, error } = await supabase
    .from('check_ins')
    .update(updates)
    .eq('id', checkInId)
    .select()
    .single();

  return { data, error };
}

// =====================================================
// GOALS OPERATIONS
// =====================================================

export async function getActiveGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getAllGoals(userId: string) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function createGoal(goal: GoalInsert) {
  const { data, error } = await supabase
    .from('goals')
    .insert(goal)
    .select()
    .single();

  return { data, error };
}

export async function updateGoal(goalId: string, updates: GoalUpdate) {
  const { data, error } = await supabase
    .from('goals')
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
}

export async function completeGoal(goalId: string) {
  const { data, error } = await supabase
    .from('goals')
    .update({ 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    })
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
}

export async function addGoalTransaction(transaction: GoalTransactionInsert) {
  const { data, error } = await supabase
    .from('goal_transactions')
    .insert(transaction)
    .select()
    .single();

  return { data, error };
}

export async function getGoalTransactions(goalId: string) {
  const { data, error } = await supabase
    .from('goal_transactions')
    .select('*')
    .eq('goal_id', goalId)
    .order('created_at', { ascending: false });

  return { data, error };
}

// =====================================================
// BULK DATA OPERATIONS
// =====================================================

export async function getUserDashboardData(userId: string) {
  const [
    profileResult,
    analysisResult,
    signalsResult,
    recommendationsResult,
    goalsResult,
  ] = await Promise.all([
    getProfile(userId),
    getCurrentAnalysis(userId),
    getActiveSignals(userId),
    getRecommendations(userId),
    getActiveGoals(userId),
  ]);

  return {
    profile: profileResult.data,
    analysis: analysisResult.data,
    signals: signalsResult.data || [],
    recommendations: recommendationsResult.data || [],
    goals: goalsResult.data || [],
    errors: {
      profile: profileResult.error,
      analysis: analysisResult.error,
      signals: signalsResult.error,
      recommendations: recommendationsResult.error,
      goals: goalsResult.error,
    }
  };
}

// =====================================================
// EXPORT TYPES FOR CONVENIENCE
// =====================================================

export type {
  Profile,
  ProfileInsert,
  ProfileUpdate,
  FinancialAnalysis,
  FinancialAnalysisInsert,
  ActiveSignal,
  ActiveSignalInsert,
  Recommendation,
  RecommendationInsert,
  ChatConversation,
  ChatMessage,
  ChatMessageInsert,
  CheckIn,
  CheckInInsert,
  Goal,
  GoalInsert,
  GoalUpdate,
  GoalTransaction,
  GoalTransactionInsert,
};
