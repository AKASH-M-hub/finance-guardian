// Supabase Integration - Main Export
// Import everything you need from this single file

export { supabase } from './client';
export type { Database } from './types';

// Re-export all helper functions
export {
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
  
  // Check-ins
  getTodayCheckIn,
  getRecentCheckIns,
  createCheckIn,
  updateCheckIn,
  
  // Goals
  getActiveGoals,
  getAllGoals,
  createGoal,
  updateGoal,
  completeGoal,
  addGoalTransaction,
  getGoalTransactions,
  
  // Bulk operations
  getUserDashboardData,
} from './helpers';

// Re-export types
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
} from './helpers';

// Import/Export utilities
export { importUserData, importFromFile, exportUserData } from './import';
