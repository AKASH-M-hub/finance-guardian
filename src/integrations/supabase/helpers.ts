// Database Helper Functions for FYF
// Utility functions for common database operations

import { supabase } from './client';

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
    const { data, error } = await (supabase
      .from('user_registrations') as any)
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
    console.warn('user_registrations table not found - run RUN_IN_SUPABASE.sql');
    return { data: null, error };
  }
}

export async function getUserRegistration(userId: string) {
  const { data, error } = await (supabase
    .from('user_registrations') as any)
    .select('*')
    .eq('user_id', userId)
    .single();

  return { data, error };
}

export async function getAllRegistrations(limit = 100) {
  const { data, error } = await (supabase
    .from('user_registrations') as any)
    .select('*')
    .order('registration_date', { ascending: false })
    .limit(limit);

  return { data, error };
}

// =====================================================
// PROFILE OPERATIONS
// =====================================================

export async function getProfile(userId: string) {
  const { data, error } = await (supabase
    .from('profiles') as any)
    .select('*')
    .eq('id', userId)
    .single();

  return { data, error };
}

export async function createProfile(profile: any) {
  let profileData = { ...profile };
  
  if (!profileData.email && profileData.id) {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.email) {
      profileData.email = user.email;
    }
  }

  const { data, error } = await (supabase
    .from('profiles') as any)
    .insert(profileData)
    .select()
    .single();

  if (data && profileData.email) {
    try {
      await recordUserRegistration({
        user_id: data.id,
        email: profileData.email,
        user_agent: typeof navigator !== 'undefined' ? navigator?.userAgent : undefined,
      });
    } catch (error) {
      console.warn('Could not record registration:', error);
    }
  }

  return { data, error };
}

export async function updateProfile(userId: string, updates: any) {
  const { data, error } = await (supabase
    .from('profiles') as any)
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
  const { data, error } = await (supabase
    .from('financial_analysis') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('is_current', true)
    .order('analyzed_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

export async function createAnalysis(analysis: any) {
  await (supabase
    .from('financial_analysis') as any)
    .update({ is_current: false })
    .eq('user_id', analysis.user_id)
    .eq('is_current', true);

  const { data, error } = await (supabase
    .from('financial_analysis') as any)
    .insert({ ...analysis, is_current: true })
    .select()
    .single();

  return { data, error };
}

export async function getAnalysisHistory(userId: string, limit = 10) {
  const { data, error } = await (supabase
    .from('financial_analysis') as any)
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
  const { data, error } = await (supabase
    .from('active_signals') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('is_resolved', false)
    .order('severity', { ascending: false });

  return { data, error };
}

export async function createSignals(signals: any[]) {
  const { data, error } = await (supabase
    .from('active_signals') as any)
    .insert(signals)
    .select();

  return { data, error };
}

export async function resolveSignal(signalId: string) {
  const { data, error } = await (supabase
    .from('active_signals') as any)
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
  const { data, error } = await (supabase
    .from('recommendations') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('is_completed', false)
    .order('priority', { ascending: false });

  return { data, error };
}

export async function createRecommendations(recommendations: any[]) {
  const { data, error } = await (supabase
    .from('recommendations') as any)
    .insert(recommendations)
    .select();

  return { data, error };
}

export async function acceptRecommendation(recommendationId: string) {
  const { data, error } = await (supabase
    .from('recommendations') as any)
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
  const { data, error } = await (supabase
    .from('recommendations') as any)
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
  const { data, error } = await (supabase
    .from('chat_conversations') as any)
    .select('*')
    .eq('user_id', userId)
    .order('last_updated', { ascending: false });

  return { data, error };
}

export async function createConversation(userId: string, title: string = 'New Conversation') {
  const { data, error } = await (supabase
    .from('chat_conversations') as any)
    .insert({ user_id: userId, title })
    .select()
    .single();

  return { data, error };
}

export async function getMessages(conversationId: string) {
  const { data, error } = await (supabase
    .from('chat_messages') as any)
    .select('*')
    .eq('conversation_id', conversationId)
    .order('message_index', { ascending: true });

  return { data, error };
}

export async function addMessage(message: any) {
  const { data, error } = await (supabase
    .from('chat_messages') as any)
    .insert(message)
    .select()
    .single();

  return { data, error };
}

export async function updateConversationTitle(conversationId: string, title: string) {
  const { data, error } = await (supabase
    .from('chat_conversations') as any)
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
  
  const { data, error } = await (supabase
    .from('check_ins') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('check_in_date', today)
    .single();

  return { data, error };
}

export async function getRecentCheckIns(userId: string, days = 30) {
  const { data, error } = await (supabase
    .from('check_ins') as any)
    .select('*')
    .eq('user_id', userId)
    .order('check_in_date', { ascending: false })
    .limit(days);

  return { data, error };
}

export async function createCheckIn(checkIn: any) {
  const { data, error } = await (supabase
    .from('check_ins') as any)
    .insert(checkIn)
    .select()
    .single();

  return { data, error };
}

export async function updateCheckIn(checkInId: string, updates: any) {
  const { data, error } = await (supabase
    .from('check_ins') as any)
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
  const { data, error } = await (supabase
    .from('goals') as any)
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getAllGoals(userId: string) {
  const { data, error } = await (supabase
    .from('goals') as any)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function createGoal(goal: any) {
  const { data, error } = await (supabase
    .from('goals') as any)
    .insert(goal)
    .select()
    .single();

  return { data, error };
}

export async function updateGoal(goalId: string, updates: any) {
  const { data, error } = await (supabase
    .from('goals') as any)
    .update(updates)
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
}

export async function completeGoal(goalId: string) {
  const { data, error } = await (supabase
    .from('goals') as any)
    .update({ 
      status: 'completed', 
      completed_at: new Date().toISOString() 
    })
    .eq('id', goalId)
    .select()
    .single();

  return { data, error };
}

export async function addGoalTransaction(transaction: any) {
  const { data, error } = await (supabase
    .from('goal_transactions') as any)
    .insert(transaction)
    .select()
    .single();

  return { data, error };
}

export async function getGoalTransactions(goalId: string) {
  const { data, error } = await (supabase
    .from('goal_transactions') as any)
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

export async function syncChatSession(userId: string, sessionData: {
  id: string;
  title: string;
  messages: Array<{ id: string; role: 'user' | 'assistant'; content: string; timestamp: string }>;
}) {
  try {
    const { data: existingConv } = await (supabase
      .from('chat_conversations') as any)
      .select('id')
      .eq('user_id', userId)
      .eq('id', sessionData.id)
      .single();

    let conversationId = existingConv?.id;

    if (!existingConv) {
      const { data: newConv, error } = await (supabase
        .from('chat_conversations') as any)
        .insert({
          id: sessionData.id,
          user_id: userId,
          title: sessionData.title,
          created_at: new Date().toISOString(),
          last_updated: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating conversation:', error);
        return { success: false, error };
      }
      conversationId = newConv?.id;
    } else {
      await (supabase
        .from('chat_conversations') as any)
        .update({
          title: sessionData.title,
          last_updated: new Date().toISOString(),
        })
        .eq('id', sessionData.id)
        .eq('user_id', userId);
    }

    const { data: existingMessages } = await (supabase
      .from('chat_messages') as any)
      .select('id')
      .eq('conversation_id', conversationId);

    const existingMessageIds = new Set((existingMessages || []).map((m: any) => m.id));

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
      const { error: msgError } = await (supabase
        .from('chat_messages') as any)
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

export async function getChatSession(userId: string, conversationId: string) {
  try {
    const { data: conversation, error: convError } = await (supabase
      .from('chat_conversations') as any)
      .select('*')
      .eq('user_id', userId)
      .eq('id', conversationId)
      .single();

    if (convError) {
      return { data: null, error: convError };
    }

    const { data: messages, error: msgError } = await (supabase
      .from('chat_messages') as any)
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

    const { data, error } = await (supabase
      .from('goals') as any)
      .insert(goalsToInsert)
      .select();

    return { data, error };
  } catch (error) {
    console.error('Error syncing goals:', error);
    return { data: null, error };
  }
}

export async function syncGoalTransaction(userId: string, goalId: string, transaction: {
  amount: number;
  transaction_type: 'contribution' | 'withdrawal';
  notes?: string;
}) {
  try {
    const { data, error } = await (supabase
      .from('goal_transactions') as any)
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

export async function syncTodayCheckIn(userId: string, checkIn: {
  mood: 'great' | 'good' | 'okay' | 'stressed' | 'anxious';
  spent_today: number;
  stayed_under_budget?: boolean;
  notes?: string;
}) {
  try {
    const today = new Date().toISOString().split('T')[0];

    const { data: existingCheckIn } = await (supabase
      .from('check_ins') as any)
      .select('id')
      .eq('user_id', userId)
      .eq('check_in_date', today)
      .single();

    let result;

    if (existingCheckIn) {
      result = await (supabase
        .from('check_ins') as any)
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
      result = await (supabase
        .from('check_ins') as any)
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
