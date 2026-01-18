import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import AnimatedCounter from '@/components/reactbits/AnimatedCounter';
import GradientText from '@/components/reactbits/GradientText';
import { 
  EMIProduct, 
  EMIAnalysis, 
  ProductCategory, 
  StockPrediction,
  productLifeExpectancy, 
  obsolescenceRiskByCategory,
  categoryLabels 
} from '@/types/emi';
import { incomeRangeToNumber } from '@/types/userProfile';
import { 
  Calculator, 
  TrendingUp, 
  TrendingDown,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Smartphone,
  Laptop,
  Car,
  Home,
  Tv,
  Package,
  LineChart,
  DollarSign,
  Calendar
} from 'lucide-react';

const categoryIcons: Record<ProductCategory, React.ComponentType<any>> = {
  smartphone: Smartphone,
  laptop: Laptop,
  vehicle: Car,
  appliance: Home,
  furniture: Home,
  electronics: Tv,
  other: Package,
};

const EMIIntelligenceSection: React.FC = () => {
  const { profile, analysis } = useUserProfile();
  const [products, setProducts] = useState<EMIProduct[]>([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [predictionYears, setPredictionYears] = useState(2);
  const [newProduct, setNewProduct] = useState<Partial<EMIProduct>>({
    name: '',
    category: 'smartphone',
    totalPrice: 50000,
    downPayment: 0,
    emiAmount: 0,
    tenure: 12,
    interestRate: 12,
  });

  if (!profile || !analysis) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access EMI Intelligence</p>
      </div>
    );
  }

  const income = incomeRangeToNumber(profile.monthlyIncomeRange);
  const availableForEMI = income.avg - profile.totalFixedAmount - (income.avg * 0.3);

  // Calculate EMI
  const calculateEMI = (principal: number, rate: number, tenure: number) => {
    const monthlyRate = rate / 100 / 12;
    if (monthlyRate === 0) return principal / tenure;
    return Math.round(
      (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
      (Math.pow(1 + monthlyRate, tenure) - 1)
    );
  };

  // Analyze product
  const analyzeProduct = (product: EMIProduct): EMIAnalysis => {
    const loanAmount = product.totalPrice - product.downPayment;
    const emi = calculateEMI(loanAmount, product.interestRate, product.tenure);
    const totalPaid = emi * product.tenure;
    
    const affordabilityScore = Math.max(0, Math.min(100, 
      100 - ((emi / availableForEMI) * 100)
    ));
    
    const lifecycle = productLifeExpectancy[product.category];
    const obsolescence = obsolescenceRiskByCategory[product.category];
    
    // Value decay calculation
    const valueDecayRate = obsolescence === 'high' ? 35 : obsolescence === 'medium' ? 20 : 10;
    const yearsOfEMI = product.tenure / 12;
    const estimatedFutureValue = product.totalPrice * Math.pow((100 - valueDecayRate) / 100, yearsOfEMI);
    
    const valueBalance = totalPaid <= estimatedFutureValue * 1.2 ? 'positive' : 
      totalPaid <= estimatedFutureValue * 1.5 ? 'neutral' : 'negative';
    
    // Recommendation logic
    let recommendation: 'buy' | 'wait' | 'avoid' = 'buy';
    const reasonCodes: string[] = [];
    
    if (affordabilityScore < 30) {
      recommendation = 'avoid';
      reasonCodes.push('EMI too high relative to your available income');
    }
    
    if (emi / income.avg > 0.2) {
      recommendation = recommendation === 'avoid' ? 'avoid' : 'wait';
      reasonCodes.push('EMI would exceed 20% of your income');
    }
    
    if (obsolescence === 'high' && product.tenure > 18) {
      recommendation = recommendation === 'avoid' ? 'avoid' : 'wait';
      reasonCodes.push('Product may become outdated before EMI ends');
    }
    
    if (valueBalance === 'negative') {
      recommendation = 'avoid';
      reasonCodes.push('Total EMI paid significantly exceeds product value');
    }
    
    if (analysis.stressScore > 60) {
      recommendation = 'wait';
      reasonCodes.push('Your current financial stress is high');
    }
    
    if (recommendation === 'buy') {
      reasonCodes.push('Product fits within your budget');
      if (lifecycle.avgMonths > product.tenure) {
        reasonCodes.push('Product lifespan exceeds EMI tenure');
      }
    }
    
    // Stock prediction simulation (simplified)
    const confidenceValue: 'low' | 'medium' | 'high' = obsolescence === 'low' ? 'high' : obsolescence === 'medium' ? 'medium' : 'low';
    const stockPrediction: StockPrediction = {
      currentPrice: product.totalPrice,
      predictedPrice: Math.round(product.totalPrice * (1 - (valueDecayRate / 100) * predictionYears)),
      years: predictionYears,
      changePercent: -valueDecayRate * predictionYears,
      confidence: confidenceValue,
      trend: 'down',
    };
    
    return {
      productId: product.id,
      affordabilityScore,
      canAfford: affordabilityScore >= 50,
      monthlyImpact: Math.round((emi / income.avg) * 100),
      lifeExpectancy: lifecycle.avgMonths,
      obsolescenceRisk: obsolescence,
      futureRelevance: obsolescence === 'high' ? 'low' : obsolescence === 'medium' ? 'medium' : 'high',
      valueDecayRate,
      totalEMIPaid: totalPaid,
      estimatedFutureValue: Math.round(estimatedFutureValue),
      valueBalance,
      stockPrediction,
      recommendation,
      reasonCodes,
      alternativeSuggestion: recommendation === 'avoid' ? 
        'Consider saving for 6 months and buying outright, or look for a more affordable option.' : undefined,
    };
  };

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.totalPrice) {
      const loanAmount = (newProduct.totalPrice || 0) - (newProduct.downPayment || 0);
      const emi = calculateEMI(loanAmount, newProduct.interestRate || 12, newProduct.tenure || 12);
      
      const product: EMIProduct = {
        id: Date.now().toString(),
        name: newProduct.name,
        category: (newProduct.category || 'other') as ProductCategory,
        totalPrice: newProduct.totalPrice || 0,
        downPayment: newProduct.downPayment || 0,
        emiAmount: emi,
        tenure: newProduct.tenure || 12,
        interestRate: newProduct.interestRate || 12,
        status: 'considering',
      };
      
      setProducts(prev => [...prev, product]);
      setNewProduct({
        name: '',
        category: 'smartphone',
        totalPrice: 50000,
        downPayment: 0,
        tenure: 12,
        interestRate: 12,
      });
      setShowAddProduct(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Calculator className="h-7 w-7 text-primary" />
            <GradientText>EMI Intelligence</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">Smart product value advisor before you commit to EMI</p>
        </div>
        <Button onClick={() => setShowAddProduct(true)}>
          Analyze New Product
        </Button>
      </div>

      {/* EMI Capacity Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Monthly Income</p>
                <p className="text-xl font-bold">₹<AnimatedCounter value={income.avg} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Fixed Expenses</p>
                <p className="text-xl font-bold">₹<AnimatedCounter value={profile.totalFixedAmount} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-emerald-500/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Available for New EMI</p>
                <p className="text-xl font-bold text-emerald-600">₹<AnimatedCounter value={Math.max(0, availableForEMI)} /></p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Prediction Years Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <LineChart className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Value Prediction Timeframe:</span>
            <div className="flex gap-2">
              {[1, 2, 3, 5].map((years) => (
                <Button
                  key={years}
                  variant={predictionYears === years ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setPredictionYears(years)}
                >
                  {years} Year{years > 1 ? 's' : ''}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Add Product Form */}
      {showAddProduct && (
        <GlowCard>
          <CardHeader>
            <CardTitle>Analyze New Product for EMI</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                placeholder="Product Name (e.g., iPhone 15 Pro)"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
              />
              
              <Select
                value={newProduct.category}
                onValueChange={(v) => setNewProduct({ ...newProduct, category: v as ProductCategory })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(categoryLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <label className="text-sm text-muted-foreground">
                Total Price: ₹{(newProduct.totalPrice || 0).toLocaleString()}
              </label>
              <Slider
                value={[newProduct.totalPrice || 50000]}
                onValueChange={([v]) => setNewProduct({ ...newProduct, totalPrice: v })}
                min={5000}
                max={500000}
                step={5000}
                className="mt-2"
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-muted-foreground">Down Payment: ₹{(newProduct.downPayment || 0).toLocaleString()}</label>
                <Slider
                  value={[newProduct.downPayment || 0]}
                  onValueChange={([v]) => setNewProduct({ ...newProduct, downPayment: v })}
                  min={0}
                  max={newProduct.totalPrice || 50000}
                  step={1000}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Tenure: {newProduct.tenure} months</label>
                <Slider
                  value={[newProduct.tenure || 12]}
                  onValueChange={([v]) => setNewProduct({ ...newProduct, tenure: v })}
                  min={3}
                  max={36}
                  step={3}
                  className="mt-2"
                />
              </div>
              
              <div>
                <label className="text-sm text-muted-foreground">Interest Rate: {newProduct.interestRate}%</label>
                <Slider
                  value={[newProduct.interestRate || 12]}
                  onValueChange={([v]) => setNewProduct({ ...newProduct, interestRate: v })}
                  min={0}
                  max={30}
                  step={0.5}
                  className="mt-2"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <ShimmerButton onClick={handleAddProduct} className="flex-1">
                Analyze Product
              </ShimmerButton>
              <Button variant="ghost" onClick={() => setShowAddProduct(false)}>Cancel</Button>
            </div>
          </CardContent>
        </GlowCard>
      )}

      {/* Product Analyses */}
      {products.length === 0 && !showAddProduct && (
        <Card className="border-dashed">
          <CardContent className="p-8 text-center">
            <Calculator className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-lg font-medium mb-2">No products analyzed yet</p>
            <p className="text-muted-foreground mb-4">
              Add a product you're considering buying on EMI to get a comprehensive value analysis.
            </p>
            <Button onClick={() => setShowAddProduct(true)}>Analyze Your First Product</Button>
          </CardContent>
        </Card>
      )}

      {products.map((product) => {
        const analysis = analyzeProduct(product);
        const Icon = categoryIcons[product.category];
        
        return (
          <GlowCard key={product.id}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{categoryLabels[product.category]}</p>
                  </div>
                </div>
                <Badge 
                  variant={analysis.recommendation === 'buy' ? 'default' : 
                    analysis.recommendation === 'wait' ? 'secondary' : 'destructive'}
                  className="text-base px-4 py-1"
                >
                  {analysis.recommendation === 'buy' ? '✓ Good to Buy' : 
                    analysis.recommendation === 'wait' ? '⏳ Wait' : '✗ Avoid'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* EMI Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Monthly EMI</p>
                  <p className="text-lg font-bold">₹{product.emiAmount.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Tenure</p>
                  <p className="text-lg font-bold">{product.tenure} months</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Total EMI Paid</p>
                  <p className="text-lg font-bold">₹{analysis.totalEMIPaid.toLocaleString()}</p>
                </div>
                <div className="p-3 rounded-lg bg-muted/50">
                  <p className="text-xs text-muted-foreground">Interest Cost</p>
                  <p className="text-lg font-bold text-destructive">
                    ₹{(analysis.totalEMIPaid - product.totalPrice + product.downPayment).toLocaleString()}
                  </p>
                </div>
              </div>

              {/* Affordability Score */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Affordability Score</span>
                  <span className={`font-bold ${analysis.affordabilityScore >= 70 ? 'text-emerald-600' : 
                    analysis.affordabilityScore >= 40 ? 'text-amber-500' : 'text-destructive'}`}>
                    {Math.round(analysis.affordabilityScore)}%
                  </span>
                </div>
                <Progress value={analysis.affordabilityScore} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  EMI would be {analysis.monthlyImpact}% of your monthly income
                </p>
              </div>

              {/* Product Value Analysis */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Life Expectancy</p>
                    <p className="text-sm font-medium">{Math.round(analysis.lifeExpectancy / 12)} years</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <AlertTriangle className={`h-4 w-4 ${analysis.obsolescenceRisk === 'high' ? 'text-destructive' : 
                    analysis.obsolescenceRisk === 'medium' ? 'text-amber-500' : 'text-emerald-500'}`} />
                  <div>
                    <p className="text-xs text-muted-foreground">Obsolescence Risk</p>
                    <p className="text-sm font-medium capitalize">{analysis.obsolescenceRisk}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-4 w-4 text-destructive" />
                  <div>
                    <p className="text-xs text-muted-foreground">Value Decay</p>
                    <p className="text-sm font-medium">{analysis.valueDecayRate}%/year</p>
                  </div>
                </div>
              </div>

              {/* Stock/Value Prediction */}
              {analysis.stockPrediction && (
                <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <LineChart className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Value Prediction in {predictionYears} Year{predictionYears > 1 ? 's' : ''}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground">Current Value</p>
                      <p className="text-lg font-bold">₹{analysis.stockPrediction.currentPrice.toLocaleString()}</p>
                    </div>
                    <TrendingDown className="h-6 w-6 text-destructive" />
                    <div>
                      <p className="text-xs text-muted-foreground">Predicted Value</p>
                      <p className="text-lg font-bold text-destructive">₹{analysis.stockPrediction.predictedPrice.toLocaleString()}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      {analysis.stockPrediction.changePercent}% change
                    </Badge>
                  </div>
                </div>
              )}

              {/* EMI vs Value Analysis */}
              <Alert variant={analysis.valueBalance === 'positive' ? 'default' : 
                analysis.valueBalance === 'neutral' ? 'default' : 'destructive'}>
                {analysis.valueBalance === 'positive' ? (
                  <CheckCircle className="h-4 w-4" />
                ) : analysis.valueBalance === 'neutral' ? (
                  <AlertTriangle className="h-4 w-4" />
                ) : (
                  <XCircle className="h-4 w-4" />
                )}
                <AlertTitle>EMI vs Value Balance: {analysis.valueBalance.toUpperCase()}</AlertTitle>
                <AlertDescription>
                  Total EMI paid (₹{analysis.totalEMIPaid.toLocaleString()}) vs 
                  Estimated future value (₹{analysis.estimatedFutureValue.toLocaleString()})
                </AlertDescription>
              </Alert>

              {/* Reasons */}
              <div className="space-y-2">
                <p className="text-sm font-medium">Analysis Summary:</p>
                {analysis.reasonCodes.map((reason, i) => (
                  <div key={i} className="flex items-start gap-2 text-sm">
                    <div className={`w-2 h-2 rounded-full mt-1.5 ${
                      analysis.recommendation === 'buy' ? 'bg-emerald-500' : 
                      analysis.recommendation === 'wait' ? 'bg-amber-500' : 'bg-destructive'
                    }`} />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>

              {/* Alternative Suggestion */}
              {analysis.alternativeSuggestion && (
                <Alert>
                  <AlertDescription>{analysis.alternativeSuggestion}</AlertDescription>
                </Alert>
              )}

              <Button 
                variant="outline" 
                onClick={() => setProducts(prev => prev.filter(p => p.id !== product.id))}
              >
                Remove Analysis
              </Button>
            </CardContent>
          </GlowCard>
        );
      })}
    </div>
  );
};

export default EMIIntelligenceSection;
