// Module 13: Financial Identity Protector Types

export interface SelfWorthDecoupler {
  id: string;
  currentNetWorth: number;
  selfWorthScore: number; // 0-100, independent of finances
  lastAffirmation: string;
  decouplingStrength: 'weak' | 'moderate' | 'strong';
  dailyReminders: string[];
}

export interface IdentityPreservationSuggestion {
  id: string;
  hobby: string;
  lowCostAlternative: string;
  estimatedCost: number;
  identityTrait: string;
  lastEngaged: Date;
}

export interface EvenIfScenario {
  id: string;
  financialSituation: string;
  coreIdentityTrait: string;
  affirmationMessage: string;
  relevanceScore: number;
}

export interface ImposterSyndromeAlert {
  id: string;
  timestamp: Date;
  triggerEvent: string;
  anxietyLevel: 'low' | 'medium' | 'high';
  copingStrategy: string;
  resolved: boolean;
}

export interface MicroIdentityInvestment {
  id: string;
  category: string;
  description: string;
  cost: number;
  identityReinforcement: string;
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface NarrativeReframe {
  id: string;
  originalNarrative: string;
  reframedNarrative: string;
  emotion: 'shame' | 'guilt' | 'fear' | 'regret';
  lessonLearned: string;
}

export interface FinancialSelfCompassionScore {
  overall: number; // 0-100
  components: {
    selfKindness: number;
    commonHumanity: number;
    mindfulness: number;
    selfJudgment: number; // inverse
    isolation: number; // inverse
    overIdentification: number; // inverse
  };
  trend: 'improving' | 'stable' | 'declining';
  lastAssessment: Date;
}

export interface FinancialIdentityProfile {
  selfWorthDecoupler: SelfWorthDecoupler;
  identityPreservations: IdentityPreservationSuggestion[];
  evenIfScenarios: EvenIfScenario[];
  imposterAlerts: ImposterSyndromeAlert[];
  microInvestments: MicroIdentityInvestment[];
  narrativeReframes: NarrativeReframe[];
  compassionScore: FinancialSelfCompassionScore;
}
