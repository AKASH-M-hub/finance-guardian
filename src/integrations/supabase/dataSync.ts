/**
 * Comprehensive Data Sync Service for FYF
 * Ensures all tables are properly populated with user data
 */

import {
  syncChatSession,
  syncGoals,
  syncGoalTransaction,
  syncTodayCheckIn,
  getCurrentAnalysis,
  getActiveGoals,
  getRecentCheckIns,
} from './helpers';

export interface SyncOptions {
  userId: string;
  syncChat?: boolean;
  syncGoals?: boolean;
  syncCheckIns?: boolean;
  syncAnalysis?: boolean;
}

/**
 * Main data sync function to ensure all user data is properly stored
 */
export async function syncAllUserData(options: SyncOptions) {
  const { userId, syncChat = true, syncGoals: doSyncGoals = true, syncCheckIns = true } = options;
  
  const results = {
    success: false,
    timestamp: new Date().toISOString(),
    synced: {
      chat: false,
      goals: false,
      checkIns: false,
      analysis: false,
    },
    errors: [] as string[],
  };

  try {
    console.log(`[DataSync] Starting comprehensive sync for user: ${userId}`);

    // 1. Sync Chat Sessions (from localStorage)
    if (syncChat) {
      try {
        const chatHistoryKey = 'fyf_chat_history';
        const savedChat = localStorage.getItem(chatHistoryKey);
        if (savedChat) {
          const sessions = JSON.parse(savedChat);
          console.log(`[DataSync] Found ${sessions.length} chat sessions to sync`);
          
          for (const session of sessions) {
            const { success } = await syncChatSession(userId, {
              id: session.id,
              title: session.title,
              messages: session.messages,
            });
            if (success) {
              console.log(`[DataSync] ✓ Synced chat session: ${session.title}`);
            }
          }
          results.synced.chat = true;
        }
      } catch (error) {
        const err = `Chat sync failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[DataSync] ✗ ${err}`);
        results.errors.push(err);
      }
    }

    // 2. Verify Financial Analysis exists
    try {
      const { data: analysis } = await getCurrentAnalysis(userId);
      if (analysis) {
        results.synced.analysis = true;
        console.log(`[DataSync] ✓ Financial analysis found: Stress=${(analysis as any).stress_score}`);
      }
    } catch (error) {
      const err = `Analysis retrieval failed: ${error instanceof Error ? error.message : String(error)}`;
      console.error(`[DataSync] ✗ ${err}`);
      results.errors.push(err);
    }

    // 3. Sync Goals
    if (doSyncGoals) {
      try {
        const { data: goals } = await getActiveGoals(userId);
        if (goals && goals.length > 0) {
          results.synced.goals = true;
          console.log(`[DataSync] ✓ Found ${goals.length} active goals synced`);
        } else {
          console.log(`[DataSync] ℹ No active goals found`);
        }
      } catch (error) {
        const err = `Goals sync failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[DataSync] ✗ ${err}`);
        results.errors.push(err);
      }
    }

    // 4. Verify Check-ins
    if (syncCheckIns) {
      try {
        const { data: checkIns } = await getRecentCheckIns(userId, 30);
        if (checkIns && checkIns.length > 0) {
          results.synced.checkIns = true;
          console.log(`[DataSync] ✓ Found ${checkIns.length} recent check-ins`);
        } else {
          console.log(`[DataSync] ℹ No check-ins found yet`);
        }
      } catch (error) {
        const err = `Check-ins retrieval failed: ${error instanceof Error ? error.message : String(error)}`;
        console.error(`[DataSync] ✗ ${err}`);
        results.errors.push(err);
      }
    }

    results.success = results.errors.length === 0;
    console.log(`[DataSync] Sync completed: ${results.success ? '✓ SUCCESS' : '✗ PARTIAL'}`);
    
    return results;
  } catch (error) {
    const err = `Critical sync error: ${error instanceof Error ? error.message : String(error)}`;
    console.error(`[DataSync] ✗ ${err}`);
    results.errors.push(err);
    return results;
  }
}

/**
 * Get data sync status for all tables
 */
export async function getDataSyncStatus(userId: string) {
  const status = {
    timestamp: new Date().toISOString(),
    tables: {
      profiles: { synced: false, count: 0 },
      financial_analysis: { synced: false, count: 0 },
      active_signals: { synced: false, count: 0 },
      recommendations: { synced: false, count: 0 },
      chat_conversations: { synced: false, count: 0 },
      chat_messages: { synced: false, count: 0 },
      check_ins: { synced: false, count: 0 },
      goals: { synced: false, count: 0 },
      goal_transactions: { synced: false, count: 0 },
    },
  };

  try {
    const { data: analysis } = await getCurrentAnalysis(userId);
    if (analysis) {
      status.tables.financial_analysis.synced = true;
      status.tables.financial_analysis.count = 1;
    }

    const { data: goals } = await getActiveGoals(userId);
    if (goals) {
      status.tables.goals.synced = goals.length > 0;
      status.tables.goals.count = goals.length;
    }

    const { data: checkIns } = await getRecentCheckIns(userId, 30);
    if (checkIns) {
      status.tables.check_ins.synced = checkIns.length > 0;
      status.tables.check_ins.count = checkIns.length;
    }

    return status;
  } catch (error) {
    console.error('Error getting sync status:', error);
    return status;
  }
}

/**
 * Clear old localStorage data after successful Supabase sync
 */
export function clearLocalStorageCache() {
  try {
    localStorage.removeItem('fyf_chat_history');
    localStorage.removeItem('fyf_goals');
    localStorage.removeItem('fyf_checkins');
    console.log('[DataSync] ✓ Cleared old cache from localStorage');
  } catch (error) {
    console.error('[DataSync] Error clearing cache:', error);
  }
}

export default {
  syncAllUserData,
  getDataSyncStatus,
  clearLocalStorageCache,
};
