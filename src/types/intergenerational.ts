// Module 14: Intergenerational Pattern Breaker Types

export type FinancialArchetype = 
  | 'scarcity_hoarder'
  | 'generous_giver'
  | 'status_seeker'
  | 'anxious_avoider'
  | 'impulsive_spender'
  | 'silent_saver'
  | 'debt_normalizer'
  | 'wealth_skeptic';

export interface FamilyFinancialArchetype {
  id: string;
  archetype: FinancialArchetype;
  matchPercentage: number;
  inheritedFrom: 'mother' | 'father' | 'grandparent' | 'cultural';
  manifestations: string[];
  healthyAspects: string[];
  challengingAspects: string[];
}

export interface GhostBudgetItem {
  id: string;
  category: string;
  allocatedAmount: number;
  actualNeed: number;
  familyOrigin: string;
  unconsciousReason: string;
  adjustmentSuggestion: string;
}

export interface GenerationalDebtCycle {
  id: string;
  pattern: string;
  currentAge: number;
  parentAge: number;
  grandparentAge: number;
  cyclePhase: 'accumulating' | 'peak' | 'recovering';
  breakingStrategy: string;
}

export interface AncestralMoneyStory {
  id: string;
  belief: string;
  origin: string;
  emotionalCharge: 'positive' | 'negative' | 'mixed';
  currentImpact: string;
  truthPercentage: number;
  alternativeBelief: string;
}

export interface PatternInterruptionChallenge {
  id: string;
  title: string;
  description: string;
  targetPattern: string;
  duration: 'daily' | 'weekly' | 'monthly';
  difficulty: 'easy' | 'medium' | 'hard';
  completionRate: number;
  streakDays: number;
}

export interface LegacyBuilderGoal {
  id: string;
  newPattern: string;
  replacingPattern: string;
  progressPercentage: number;
  milestones: {
    id: string;
    description: string;
    completed: boolean;
    date?: Date;
  }[];
  impactOnFuture: string;
}

export interface FamilyFinancialDNA {
  archetypes: FamilyFinancialArchetype[];
  dominantTraits: string[];
  riskFactors: string[];
  strengths: string[];
  generationalScore: number; // 0-100, how much pattern is broken
  researchInsights: string[];
}

export interface IntergenerationalProfile {
  familyDNA: FamilyFinancialDNA;
  ghostBudgets: GhostBudgetItem[];
  debtCycles: GenerationalDebtCycle[];
  moneyStories: AncestralMoneyStory[];
  activeChallenges: PatternInterruptionChallenge[];
  legacyGoals: LegacyBuilderGoal[];
}
