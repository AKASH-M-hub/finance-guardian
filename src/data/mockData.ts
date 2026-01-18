import { Transaction, StressSignal, BudgetGuardrail, FinancialSummary, Subscription, LifeEvent } from '@/types/finance';

export const mockTransactions: Transaction[] = [
  { id: '1', date: '2024-01-15', merchant: 'Swiggy', category: 'food', amount: 450, type: 'expense' },
  { id: '2', date: '2024-01-15', merchant: 'Amazon', category: 'shopping', amount: 2999, type: 'expense' },
  { id: '3', date: '2024-01-14', merchant: 'Uber', category: 'travel', amount: 280, type: 'expense' },
  { id: '4', date: '2024-01-14', merchant: 'Netflix', category: 'subscription', amount: 649, type: 'expense' },
  { id: '5', date: '2024-01-13', merchant: 'BigBasket', category: 'groceries', amount: 1850, type: 'expense' },
  { id: '6', date: '2024-01-13', merchant: 'Petrol Pump', category: 'fuel', amount: 2000, type: 'expense' },
  { id: '7', date: '2024-01-12', merchant: 'Zomato', category: 'food', amount: 380, type: 'expense' },
  { id: '8', date: '2024-01-12', merchant: 'Electricity Board', category: 'bills', amount: 1800, type: 'expense' },
  { id: '9', date: '2024-01-11', merchant: 'HDFC Home Loan', category: 'emi', amount: 25000, type: 'expense' },
  { id: '10', date: '2024-01-10', merchant: 'Salary Credit', category: 'income', amount: 85000, type: 'income' },
  { id: '11', date: '2024-01-10', merchant: 'Myntra', category: 'shopping', amount: 1499, type: 'expense' },
  { id: '12', date: '2024-01-09', merchant: 'Apollo Pharmacy', category: 'health', amount: 650, type: 'expense' },
  { id: '13', date: '2024-01-09', merchant: 'PVR Cinemas', category: 'entertainment', amount: 800, type: 'expense' },
  { id: '14', date: '2024-01-08', merchant: 'Swiggy', category: 'food', amount: 520, type: 'expense' },
  { id: '15', date: '2024-01-07', merchant: 'Spotify', category: 'subscription', amount: 119, type: 'expense' },
];

export const mockStressSignals: StressSignal[] = [
  {
    id: '1',
    type: 'micro_spike',
    severity: 'medium',
    title: 'Food Delivery Spike Detected',
    description: 'Your food delivery spending increased by 45% this week compared to last month average.',
    actionable: 'Consider cooking at home 2-3 times this week to balance spending.'
  },
  {
    id: '2',
    type: 'late_bill_risk',
    severity: 'high',
    title: 'EMI Payment Risk',
    description: 'Based on current balance, you may face difficulty paying next EMI on 25th.',
    actionable: 'Reserve ₹25,000 now to secure your EMI payment.'
  },
  {
    id: '3',
    type: 'category_drift',
    severity: 'low',
    title: 'Shopping Pattern Change',
    description: 'Online shopping increased by 30% this month. This is unusual for you.',
    actionable: 'Use the "Buy Later" feature to delay non-essential purchases.'
  },
];

export const mockBudgetGuardrails: BudgetGuardrail[] = [
  { category: 'food', limit: 8000, spent: 5200 },
  { category: 'shopping', limit: 5000, spent: 4498 },
  { category: 'travel', limit: 3000, spent: 1800 },
  { category: 'entertainment', limit: 2000, spent: 800 },
  { category: 'subscription', limit: 1500, spent: 768 },
];

export const mockFinancialSummary: FinancialSummary = {
  totalIncome: 85000,
  totalExpenses: 38995,
  savings: 46005,
  stressScore: 42,
  silentBurdenIndex: 38,
  survivalDays: 35,
};

export const mockSubscriptions: Subscription[] = [
  { id: '1', name: 'Netflix', amount: 649, frequency: 'monthly', isActive: true },
  { id: '2', name: 'Spotify', amount: 119, frequency: 'monthly', isActive: true },
  { id: '3', name: 'Amazon Prime', amount: 1499, frequency: 'yearly', isActive: true },
  { id: '4', name: 'Disney+ Hotstar', amount: 299, frequency: 'monthly', isActive: true, isUnwanted: true },
  { id: '5', name: 'Gym Membership', amount: 2000, frequency: 'monthly', isActive: false, isUnwanted: true },
];

export const mockLifeEvents: LifeEvent[] = [
  { id: '1', name: 'Festival Season', startDate: '2024-01-10', endDate: '2024-01-20', impact: 'high' },
  { id: '2', name: 'Medical Checkup', startDate: '2024-01-09', impact: 'low' },
];

export const categoryColors: Record<string, string> = {
  food: 'hsl(var(--chart-1))',
  travel: 'hsl(var(--chart-2))',
  shopping: 'hsl(var(--chart-3))',
  entertainment: 'hsl(var(--chart-4))',
  bills: 'hsl(var(--chart-5))',
  emi: 'hsl(var(--destructive))',
  subscription: 'hsl(var(--primary))',
  health: 'hsl(var(--muted))',
  groceries: 'hsl(var(--secondary))',
  fuel: 'hsl(var(--accent-foreground))',
  income: 'hsl(142 76% 36%)',
  other: 'hsl(var(--muted))',
};

export const categoryIcons: Record<string, string> = {
  food: '🍔',
  travel: '🚗',
  shopping: '🛒',
  entertainment: '🎬',
  bills: '📄',
  emi: '🏠',
  subscription: '📺',
  health: '💊',
  groceries: '🥬',
  fuel: '⛽',
  income: '💰',
  other: '📦',
};

export const spendingPatternData = [
  { day: 'Mon', amount: 1200 },
  { day: 'Tue', amount: 800 },
  { day: 'Wed', amount: 1500 },
  { day: 'Thu', amount: 900 },
  { day: 'Fri', amount: 2200 },
  { day: 'Sat', amount: 3500 },
  { day: 'Sun', amount: 2800 },
];

export const monthlyTrendData = [
  { month: 'Sep', income: 80000, expenses: 52000 },
  { month: 'Oct', income: 82000, expenses: 48000 },
  { month: 'Nov', income: 85000, expenses: 55000 },
  { month: 'Dec', income: 85000, expenses: 62000 },
  { month: 'Jan', income: 85000, expenses: 38995 },
];
