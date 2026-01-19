export interface QuantumBudgetState {
  id: string;
  name: string;
  probability: number;
  allocations: {
    category: string;
    amount: number;
    flexibility: number;
  }[];
  isCollapsed: boolean;
}

export interface FinancialEntanglement {
  id: string;
  expense1: {
    category: string;
    name: string;
    amount: number;
  };
  expense2: {
    category: string;
    name: string;
    amount: number;
  };
  correlationStrength: number;
  explanation: string;
}

export interface QuantumTunnelingPath {
  id: string;
  goal: string;
  targetAmount: number;
  conventionalPath: {
    months: number;
    monthlySaving: number;
  };
  tunnelingPath: {
    months: number;
    strategy: string;
    unconventionalActions: string[];
  };
  successProbability: number;
}

export interface ParallelReality {
  id: string;
  scenario: string;
  decisions: {
    original: string;
    alternative: string;
  }[];
  outcomes: {
    savings: number;
    stressLevel: number;
    financialHealth: number;
  };
  divergencePoint: Date;
}

export interface CollapsePredictor {
  futureState: string;
  probability: number;
  requiredActions: string[];
  timeline: string;
}
