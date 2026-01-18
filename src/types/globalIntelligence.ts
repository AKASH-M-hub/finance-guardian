// Real-World Intelligence Connector Types

export interface GlobalEvent {
  id: string;
  title: string;
  category: EventCategory;
  region: string;
  impact: ImpactLevel;
  affectedAreas: FinancialArea[];
  summary: string;
  userImpact: string; // "What this means for you"
  actionSuggestion?: string;
  timestamp: string;
  source?: string;
}

export type EventCategory =
  | 'fuel_prices'
  | 'inflation'
  | 'interest_rates'
  | 'currency'
  | 'employment'
  | 'market'
  | 'policy'
  | 'commodity'
  | 'technology'
  | 'global_trade';

export type ImpactLevel = 'low' | 'medium' | 'high';

export type FinancialArea =
  | 'transport'
  | 'groceries'
  | 'rent'
  | 'savings'
  | 'investments'
  | 'loans'
  | 'utilities'
  | 'electronics'
  | 'travel';

export interface ProductRecommendation {
  id: string;
  productName: string;
  category: string;
  currentMarketPrice: number;
  predictedChange: 'increase' | 'stable' | 'decrease';
  bestTimeToBuy: 'now' | 'wait' | 'avoid';
  reason: string;
  eventContext?: string;
}

export interface WorldIntelligenceSummary {
  lastUpdated: string;
  region: string;
  overallOutlook: 'positive' | 'neutral' | 'cautious';
  activeEvents: GlobalEvent[];
  recommendations: ProductRecommendation[];
  keyInsights: string[];
}

export const eventCategoryLabels: Record<EventCategory, string> = {
  fuel_prices: 'Fuel Prices',
  inflation: 'Inflation',
  interest_rates: 'Interest Rates',
  currency: 'Currency Exchange',
  employment: 'Employment',
  market: 'Stock Market',
  policy: 'Government Policy',
  commodity: 'Commodities',
  technology: 'Technology',
  global_trade: 'Global Trade',
};

export const financialAreaLabels: Record<FinancialArea, string> = {
  transport: 'Transport',
  groceries: 'Groceries',
  rent: 'Rent/Housing',
  savings: 'Savings',
  investments: 'Investments',
  loans: 'Loans/EMI',
  utilities: 'Utilities',
  electronics: 'Electronics',
  travel: 'Travel',
};
