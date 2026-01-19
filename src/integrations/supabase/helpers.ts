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

type UserRegistration = Database['public']['Tables']['user_registrations']['Row'];
type UserRegistrationInsert = Database['public']['Tables']['user_registrations']['Insert'];

// =====================================================
// HELPER: Get current user
// =====================================================
export async function getCurrentUser() {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
}

// =====================================================
// USER REGISTRATION OPERATIONS
// =====================================================

export async function recordUserRegistration(registration: {
  user_id: string;
  email: string;
  registration_source?: string;
  ip_address?: string;
  user_agent?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('user_registrations')
      .insert({
        user_id: registration.user_id,
        email: registration.email,
        registration_source: registration.registration_source || 'web_app',
        ip_address: registration.ip_address,
        user_agent: registration.user_agent,
        registration_date: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    // Table might not exist yet - fail silently
    console.warn('user_registrations table not found - run RUN_IN_SUPABASE.sql');
    return { data: null, error };
  }
}

export async function getUserRegistration(userId: string) {
  const { data, error } = await supabase
    .from('user_registrations')
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
}

export async function getAllRegistrations(limit = 100) {
  // Admin function - would need additional RLS policies for admin access
  const { data, error } = await supabase
    .from('user_registrations')
    .select('*')
    .order('registration_date', { ascending: false })
    .limit(limit);

  return { data, error };
}

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
  // If email not provided, fetch from auth.users
  let profileData = { ...profile };
  
  if (!profileData.email && profileData.id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      profileData.email = user.email;
    }
  }

  const { data, error } = await supabase
    .from('profiles')
    .insert(profileData)
    .select()
    .single();

  // Record registration in audit table
  if (data && profileData.email) {
    try {
      await recordUserRegistration({
        user_id: data.id,
        email: profileData.email,
        user_agent: navigator?.userAgent,
      });
    } catch (error) {
      // Fail silently if table doesn't exist yet
      console.warn('Could not record registration:', error);
    }
  }

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
// COMPREHENSIVE DATA SYNC & BATCH OPERATIONS
// =====================================================

/**
 * Sync chat session and all messages to Supabase
 * Creates or updates conversation and persists all messages
 */
export async function syncChatSession(userId: string, sessionData: {
  id: string;
  title: string;
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string }>;
}) {
  try {
    // First, check if conversation exists
    const { data: existingConv, error: checkError } = await supabase
      .from('chat_conversations')
      .select('id')
      .eq('user_id', userId)
      .eq('id', sessionData.id)
      .single();

    let conversationId = existingConv?.id;
    let convError = null;

    if (!existingConv) {
      // Create new conversation
      const { data: newConv, error } = await supabase
        .from('chat_conversations')
        .insert({
          id: sessionData.id,
          user_id: userId,
          title: sessionData.title,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      conversationId = newConv?.id;
      convError = error;
    } else {
      // Update conversation title and timestamp
      await supabase
        .from('chat_conversations')
        .update({
          title: sessionData.title,
          last_updated: new Date().toISOString(),
        })
        .eq('id', sessionData.id)
        .eq('user_id', userId);
    }

    if (convError) {
      console.error('Error creating/updating conversation:', convError);
      return { success: false, error: convError };
    }

    // Get existing messages to avoid duplicates
    const { data: existingMessages } = await supabase
      .from('chat_messages')
      .select('id')
      .eq('conversation_id', conversationId);

    const existingMessageIds = new Set(existingMessages?.map(m => m.id) || []);

    // Filter and persist only new messages
    const newMessages = sessionData.messages
      .filter(m => !existingMessageIds.has(m.id))
      .map((m, index) => ({
        id: m.id,
        conversation_id: conversationId,
        user_id: userId,
        role: m.role,
        content: m.content,
        message_index: index,
        created_at: m.timestamp,
      }));

    if (newMessages.length > 0) {
      const { error: msgError } = await supabase
        .from('chat_messages')
        .insert(newMessages);

      if (msgError) {
        console.error('Error saving messages:', msgError);
        return { success: false, error: msgError };
      }
    }

    return { success: true, conversationId };
  } catch (error) {
    console.error('Error syncing chat session:', error);
    return { success: false, error };
  }
}

/**
 * Retrieve complete chat session from Supabase
 */
export async function getChatSession(userId: string, conversationId: string) {
  try {
    const { data: conversation, error: convError } = await supabase
      .from('chat_conversations')
      .select('*')
      .eq('user_id', userId)
      .eq('id', conversationId)
      .single();

    if (convError) {
      return { data: null, error: convError };
    }

    const { data: messages, error: msgError } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('conversation_id', conversationId)
      .order('message_index', { ascending: true });

    if (msgError) {
      return { data: null, error: msgError };
    }

    return {
      data: {
        ...conversation,
        messages: messages || [],
      },
      error: null,
    };
  } catch (error) {
    console.error('Error retrieving chat session:', error);
    return { data: null, error };
  }
}

/**
 * Sync goals with user
 */
export async function syncGoals(userId: string, goals: Array<{
  id?: string;
  goal_type: string;
  title: string;
  description?: string;
  target_amount?: number;
  current_amount?: number;
  target_date?: string;
  status?: string;
}>) {
  try {
    const goalsToInsert = goals
      .filter(g => g.title && g.goal_type)
      .map(g => ({
        user_id: userId,
        goal_type: g.goal_type,
        title: g.title,
        description: g.description,
        target_amount: g.target_amount || 0,
        current_amount: g.current_amount || 0,
        target_date: g.target_date,
        status: g.status || 'active',
        started_at: new Date().toISOString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }));

    if (goalsToInsert.length === 0) {
      return { data: [], error: null };
    }

    const { data, error } = await supabase
      .from('goals')
      .insert(goalsToInsert)
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error syncing goals:', error);
    return { data: null, error };
  }
}

/**
 * Add goal transaction (contribution or withdrawal)
 */
export async function syncGoalTransaction(userId: string, goalId: string, transaction: {
  amount: number;
  transaction_type: 'contribution' | 'withdrawal';
  notes?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('goal_transactions')
      .insert({
        goal_id: goalId,
        user_id: userId,
        amount: transaction.amount,
        transaction_type: transaction.transaction_type,
        notes: transaction.notes,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    return { data, error };
  } catch (error) {
    console.error('Error adding goal transaction:', error);
    return { data: null, error };
  }
}

/**
 * Sync today's check-in data
 */
export async function syncTodayCheckIn(userId: string, checkIn: {
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious';
  spent_today: number;
  stayed_under_budget?: boolean;
  notes?: string;
}) {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Check if check-in already exists for today
    const { data: existingCheckIn } = await supabase
      .from('check_ins')
      .select('id')
      .eq('user_id', userId)
      .eq('check_in_date', today)
      .single();

    let result;

    if (existingCheckIn) {
      // Update existing check-in
      result = await supabase
        .from('check_ins')
        .update({
          mood: checkIn.mood,
          spent_today: checkIn.spent_today,
          stayed_under_budget: checkIn.stayed_under_budget ?? true,
          notes: checkIn.notes,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingCheckIn.id)
        .select()
        .single();
    } else {
      // Create new check-in
      result = await supabase
        .from('check_ins')
        .insert({
          user_id: userId,
          check_in_date: today,
          mood: checkIn.mood,
          spent_today: checkIn.spent_today,
          stayed_under_budget: checkIn.stayed_under_budget ?? true,
          notes: checkIn.notes,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();
    }

    return { data: result.data, error: result.error };
  } catch (error) {
    console.error('Error syncing check-in:', error);
    return { data: null, error };
  }
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
  UserRegistration,
  UserRegistrationInsert,
};
