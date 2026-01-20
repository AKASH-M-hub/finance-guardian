// Supabase Integration - Main Export
// Import everything you need from this single file

export { supabase } from './client';
export type { Database } from './types';

// Re-export all helper functions
export {
  // Helper: Get current user
  getCurrentUser,
  
  // User Registration tracking
  recordUserRegistration,
  getUserRegistration,
  getAllRegistrations,
  
  // Profile operations
  getProfile,
  createProfile,
  updateProfile,
  
  // Financial analysis
  getCurrentAnalysis,
  createAnalysis,
  getAnalysisHistory,
  
  // Signals & Recommendations
  getActiveSignals,
  createSignals,
  resolveSignal,
  getRecommendations,
  createRecommendations,
  acceptRecommendation,
  completeRecommendation,
  
  // Chat operations
  getConversations,
  createConversation,
  getMessages,
  addMessage,
  updateConversationTitle,
  syncChatSession,
  getChatSession,
  
  // Check-ins
  getTodayCheckIn,
  getRecentCheckIns,
  createCheckIn,
  updateCheckIn,
  syncTodayCheckIn,
  
  // Goals
  getActiveGoals,
  getAllGoals,
  createGoal,
  updateGoal,
  completeGoal,
  addGoalTransaction,
  getGoalTransactions,
  syncGoals,
  syncGoalTransaction,
  
  // Bulk operations
  getUserDashboardData,
} from './helpers';

// Re-export data sync service
export {
  syncAllUserData,
  getDataSyncStatus,
  clearLocalStorageCache,
} from './dataSync';

// Import/Export utilities
export { importUserData, importFromFile, exportUserData, mapDbProfile, mapDbAnalysis } from './import';
