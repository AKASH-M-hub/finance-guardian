export interface ConsentSettings {
  dataAnalysis: boolean;
  anonymizedAggregation: boolean;
  communitySharing: boolean;
  thirdPartyAccess: boolean;
}

export interface ProtectedCategory {
  id: string;
  name: string;
  isProtected: boolean;
  isIncognito: boolean;
}

export interface DataExport {
  type: 'json' | 'csv';
  includeAnalysis: boolean;
  dateRange?: { start: Date; end: Date };
}

export interface SecuritySettings {
  sessionLock: boolean;
  deviceLockRequired: boolean;
  biometricEnabled: boolean;
  autoLogoutMinutes: number;
}

export interface AIExplanation {
  id: string;
  timestamp: Date;
  scoreChange: number;
  previousScore: number;
  newScore: number;
  reasons: string[];
  dataPoints: {
    category: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];
}

export interface PrivacyStats {
  dataPointsStored: number;
  lastDataDeletion?: Date;
  anonymizedContributions: number;
  incognitoCategories: number;
}
