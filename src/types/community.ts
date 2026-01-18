// Community & Support Layer Types - Module 6

export interface TrustedContact {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  relationship: 'family' | 'friend' | 'mentor' | 'partner';
  canReceiveAlerts: boolean;
  addedAt: string;
}

export interface AccountabilityBuddy {
  id: string;
  name: string;
  status: 'invited' | 'active' | 'paused';
  sharedMetrics: ('savings_progress' | 'streak_days' | 'goal_progress')[];
  lastUpdateSent?: string;
}

export interface CommunityTip {
  id: string;
  category: 'saving' | 'budgeting' | 'impulse_control' | 'emergency' | 'lifestyle';
  tip: string;
  upvotes: number;
  userDemographic: 'student' | 'young_professional' | 'family' | 'general';
  isAnonymous: boolean;
}

export interface SavingChallenge {
  id: string;
  title: string;
  description: string;
  duration: number; // days
  targetSavings: number;
  participants: number;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'active' | 'completed';
  userProgress?: {
    joined: boolean;
    savedAmount: number;
    daysCompleted: number;
  };
}

export interface PeerTrend {
  id: string;
  ageGroup: '18-25' | '26-35' | '36-45' | '45+';
  incomeRange: string;
  metric: string;
  averageValue: number;
  trend: 'up' | 'down' | 'stable';
  percentile?: number;
}

export interface StressHeatmapData {
  region: string;
  stressLevel: number;
  sampleSize: number;
  topStressors: string[];
  timestamp: string;
}

export interface SOSRequest {
  id: string;
  userId: string;
  type: 'financial_stress' | 'emergency_expense' | 'emotional_support';
  message?: string;
  status: 'pending' | 'acknowledged' | 'resolved';
  createdAt: string;
}

export interface MotivationContent {
  id: string;
  type: 'quote' | 'tip' | 'success_story' | 'encouragement';
  content: string;
  author?: string;
  category: 'recovery' | 'saving' | 'debt_free' | 'general';
}

// Labels
export const challengeStatusLabels = {
  upcoming: 'Starting Soon',
  active: 'In Progress',
  completed: 'Completed',
};

export const stressLevelLabels = (level: number) => {
  if (level <= 30) return 'Low Stress';
  if (level <= 60) return 'Moderate Stress';
  return 'High Stress';
};
