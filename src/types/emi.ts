// EMI Intelligence & Product Future-Value Advisor Types

export interface EMIProduct {
  id: string;
  name: string;
  category: ProductCategory;
  totalPrice: number;
  downPayment: number;
  emiAmount: number;
  tenure: number; // months
  interestRate: number;
  startDate?: string;
  endDate?: string;
  status: 'considering' | 'active' | 'completed';
}

export type ProductCategory = 
  | 'smartphone'
  | 'laptop'
  | 'vehicle'
  | 'appliance'
  | 'furniture'
  | 'electronics'
  | 'other';

export interface EMIAnalysis {
  productId: string;
  affordabilityScore: number; // 0-100
  canAfford: boolean;
  monthlyImpact: number; // % of income
  
  // Product value analysis
  lifeExpectancy: number; // months
  obsolescenceRisk: 'low' | 'medium' | 'high';
  futureRelevance: 'low' | 'medium' | 'high';
  valueDecayRate: number; // % per year
  
  // EMI vs Value
  totalEMIPaid: number;
  estimatedFutureValue: number;
  valueBalance: 'positive' | 'neutral' | 'negative';
  
  // Stock/Market prediction (if applicable)
  stockPrediction?: StockPrediction;
  
  // Advisory
  recommendation: 'buy' | 'wait' | 'avoid';
  reasonCodes: string[];
  alternativeSuggestion?: string;
}

export interface StockPrediction {
  currentPrice: number;
  predictedPrice: number;
  years: number;
  changePercent: number;
  confidence: 'low' | 'medium' | 'high';
  trend: 'up' | 'stable' | 'down';
}

// Product lifecycle data
export const productLifeExpectancy: Record<ProductCategory, { minMonths: number; maxMonths: number; avgMonths: number }> = {
  smartphone: { minMonths: 24, maxMonths: 48, avgMonths: 36 },
  laptop: { minMonths: 36, maxMonths: 72, avgMonths: 48 },
  vehicle: { minMonths: 60, maxMonths: 180, avgMonths: 120 },
  appliance: { minMonths: 60, maxMonths: 144, avgMonths: 96 },
  furniture: { minMonths: 60, maxMonths: 180, avgMonths: 120 },
  electronics: { minMonths: 24, maxMonths: 60, avgMonths: 36 },
  other: { minMonths: 24, maxMonths: 60, avgMonths: 36 },
};

// Obsolescence risk by category
export const obsolescenceRiskByCategory: Record<ProductCategory, 'low' | 'medium' | 'high'> = {
  smartphone: 'high',
  laptop: 'medium',
  vehicle: 'low',
  appliance: 'low',
  furniture: 'low',
  electronics: 'high',
  other: 'medium',
};

export const categoryLabels: Record<ProductCategory, string> = {
  smartphone: 'Smartphone',
  laptop: 'Laptop/Computer',
  vehicle: 'Vehicle',
  appliance: 'Home Appliance',
  furniture: 'Furniture',
  electronics: 'Electronics',
  other: 'Other',
};
