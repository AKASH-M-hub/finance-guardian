export interface Transaction {
  id: string;
  date: string;
  merchant: string;
  category: TransactionCategory;
  amount: number;
  type: 'income' | 'expense';
}

export type TransactionCategory = 
  | 'food' 
  | 'travel' 
  | 'shopping' 
  | 'entertainment' 
  | 'bills' 
  | 'emi' 
  | 'subscription' 
  | 'health' 
  | 'groceries' 
  | 'fuel' 
  | 'income' 
  | 'other';

export interface BudgetGuardrail {
  category: TransactionCategory;
  limit: number;
  spent: number;
}

export interface StressSignal {
  id: string;
  type: 'micro_spike' | 'emergency_withdrawal' | 'late_bill_risk' | 'category_drift' | 'savings_drop' | 'stress_merchant';
  severity: 'low' | 'medium' | 'high';
  title: string;
  description: string;
  actionable: string;
}

export interface FinancialSummary {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  stressScore: number;
  silentBurdenIndex: number;
  survivalDays: number;
}

export interface LifeEvent {
  id: string;
  name: string;
  startDate: string;
  endDate?: string;
  impact: 'low' | 'medium' | 'high';
}

export interface Subscription {
  id: string;
  name: string;
  amount: number;
  frequency: 'monthly' | 'yearly';
  isActive: boolean;
  isUnwanted?: boolean;
}
