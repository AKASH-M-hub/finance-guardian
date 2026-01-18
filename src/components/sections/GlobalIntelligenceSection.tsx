import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useUserProfile } from '@/contexts/UserProfileContext';
import GlowCard from '@/components/reactbits/GlowCard';
import ShimmerButton from '@/components/reactbits/ShimmerButton';
import GradientText from '@/components/reactbits/GradientText';
import { 
  GlobalEvent, 
  ProductRecommendation,
  eventCategoryLabels,
  financialAreaLabels,
  EventCategory,
  FinancialArea 
} from '@/types/globalIntelligence';
import { 
  Globe, 
  TrendingUp, 
  TrendingDown,
  Fuel,
  DollarSign,
  Percent,
  Briefcase,
  BarChart3,
  FileText,
  Package,
  Cpu,
  Ship,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  ShoppingCart,
  ArrowRight,
  RefreshCw,
  Search
} from 'lucide-react';

const eventCategoryIcons: Record<EventCategory, React.ComponentType<any>> = {
  fuel_prices: Fuel,
  inflation: TrendingUp,
  interest_rates: Percent,
  currency: DollarSign,
  employment: Briefcase,
  market: BarChart3,
  policy: FileText,
  commodity: Package,
  technology: Cpu,
  global_trade: Ship,
};

// Simulated global events based on general economic patterns
const generateGlobalEvents = (region: string): GlobalEvent[] => {
  const events: GlobalEvent[] = [
    {
      id: '1',
      title: 'Fuel Price Fluctuations',
      category: 'fuel_prices',
      region: 'Global',
      impact: 'medium',
      affectedAreas: ['transport', 'groceries', 'utilities'],
      summary: 'Global oil prices showing volatility due to supply chain adjustments.',
      userImpact: 'Your transport and delivery costs may increase by 5-10% in the coming weeks.',
      actionSuggestion: 'Consider combining errands to reduce fuel costs.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '2',
      title: 'Interest Rate Updates',
      category: 'interest_rates',
      region: region,
      impact: 'high',
      affectedAreas: ['loans', 'savings', 'rent'],
      summary: 'Central bank reviewing interest rates to manage inflation.',
      userImpact: 'If you have variable-rate loans, your EMI might increase. Savings accounts may offer slightly better returns.',
      actionSuggestion: 'Consider locking in fixed rates for any new loans.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '3',
      title: 'Electronics Market Shift',
      category: 'technology',
      region: 'Global',
      impact: 'low',
      affectedAreas: ['electronics'],
      summary: 'New product releases expected to affect prices of previous generation devices.',
      userImpact: 'Good time to buy older model smartphones and laptops at discounted prices.',
      actionSuggestion: 'Wait 2-3 months if you need new electronics - prices typically drop after new releases.',
      timestamp: new Date().toISOString(),
    },
    {
      id: '4',
      title: 'Seasonal Grocery Trends',
      category: 'commodity',
      region: region,
      impact: 'medium',
      affectedAreas: ['groceries'],
      summary: 'Seasonal changes affecting vegetable and fruit prices.',
      userImpact: 'Some grocery items may be 10-15% more expensive this month.',
      actionSuggestion: 'Stock up on non-perishables and consider seasonal alternatives.',
      timestamp: new Date().toISOString(),
    },
  ];
  
  return events;
};

// Simulated product recommendations
const generateProductRecommendations = (query: string): ProductRecommendation[] => {
  const baseRecommendations: ProductRecommendation[] = [
    {
      id: '1',
      productName: 'Smartphone',
      category: 'Electronics',
      currentMarketPrice: 50000,
      predictedChange: 'decrease',
      bestTimeToBuy: 'wait',
      reason: 'New models launching soon. Prices expected to drop 15-20% in 2-3 months.',
      eventContext: 'Technology cycle and seasonal sales approaching.',
    },
    {
      id: '2',
      productName: 'Laptop',
      category: 'Electronics',
      currentMarketPrice: 75000,
      predictedChange: 'stable',
      bestTimeToBuy: 'now',
      reason: 'Prices are stable and current offerings have good value.',
      eventContext: 'Supply chain has normalized. Good deals available.',
    },
    {
      id: '3',
      productName: 'Two-Wheeler',
      category: 'Vehicle',
      currentMarketPrice: 120000,
      predictedChange: 'increase',
      bestTimeToBuy: 'now',
      reason: 'Fuel prices and material costs may push prices higher.',
      eventContext: 'Global commodity prices affecting manufacturing costs.',
    },
  ];
  
  if (query) {
    const lowerQuery = query.toLowerCase();
    return baseRecommendations.filter(r => 
      r.productName.toLowerCase().includes(lowerQuery) || 
      r.category.toLowerCase().includes(lowerQuery)
    );
  }
  
  return baseRecommendations;
};

const GlobalIntelligenceSection: React.FC = () => {
  const { profile, analysis } = useUserProfile();
  const [events, setEvents] = useState<GlobalEvent[]>([]);
  const [recommendations, setRecommendations] = useState<ProductRecommendation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const region = profile?.country || 'India';

  useEffect(() => {
    loadIntelligence();
  }, [region]);

  const loadIntelligence = () => {
    setIsLoading(true);
    // Simulate API call delay
    setTimeout(() => {
      setEvents(generateGlobalEvents(region));
      setRecommendations(generateProductRecommendations(''));
      setLastUpdated(new Date());
      setIsLoading(false);
    }, 500);
  };

  const handleSearch = () => {
    if (searchQuery) {
      setRecommendations(generateProductRecommendations(searchQuery));
    }
  };

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Complete onboarding to access Global Intelligence</p>
      </div>
    );
  }

  const getOverallOutlook = (): 'positive' | 'neutral' | 'cautious' => {
    const highImpactEvents = events.filter(e => e.impact === 'high').length;
    if (highImpactEvents >= 2) return 'cautious';
    if (highImpactEvents === 1) return 'neutral';
    return 'positive';
  };

  const outlook = getOverallOutlook();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Globe className="h-7 w-7 text-primary" />
            <GradientText>Real-World Intelligence</GradientText>
          </h1>
          <p className="text-muted-foreground mt-1">How global events affect your money</p>
        </div>
        <Button variant="outline" onClick={loadIntelligence} disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Location & Status */}
      <div className="flex flex-wrap gap-4">
        <Badge variant="outline" className="px-3 py-1">
          <MapPin className="h-3 w-3 mr-1" />
          {region}
        </Badge>
        <Badge 
          variant={outlook === 'positive' ? 'default' : outlook === 'neutral' ? 'secondary' : 'destructive'}
          className="px-3 py-1"
        >
          Overall Outlook: {outlook.charAt(0).toUpperCase() + outlook.slice(1)}
        </Badge>
        <Badge variant="outline" className="px-3 py-1">
          <Clock className="h-3 w-3 mr-1" />
          Updated: {lastUpdated.toLocaleTimeString()}
        </Badge>
      </div>

      {/* Product Search */}
      <GlowCard>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-primary" />
            Should You Buy?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Tell us what you're thinking of buying, and we'll analyze if it's a good time based on market trends.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="e.g., Smartphone, Laptop, Vehicle..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <ShimmerButton onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Analyze
            </ShimmerButton>
          </div>
        </CardContent>
      </GlowCard>

      {/* Product Recommendations */}
      {recommendations.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Product Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recommendations.map((rec) => (
              <Card key={rec.id} className={
                rec.bestTimeToBuy === 'now' ? 'border-emerald-500/50' : 
                rec.bestTimeToBuy === 'wait' ? 'border-amber-500/50' : 'border-destructive/50'
              }>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{rec.productName}</span>
                    <Badge 
                      variant={rec.bestTimeToBuy === 'now' ? 'default' : 
                        rec.bestTimeToBuy === 'wait' ? 'secondary' : 'destructive'}
                    >
                      {rec.bestTimeToBuy === 'now' ? '✓ Buy Now' : 
                        rec.bestTimeToBuy === 'wait' ? '⏳ Wait' : '✗ Avoid'}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Market Price:</span>
                    <span className="font-bold">₹{rec.currentMarketPrice.toLocaleString()}</span>
                    {rec.predictedChange === 'increase' ? (
                      <TrendingUp className="h-4 w-4 text-destructive" />
                    ) : rec.predictedChange === 'decrease' ? (
                      <TrendingDown className="h-4 w-4 text-emerald-500" />
                    ) : null}
                  </div>
                  
                  <p className="text-sm">{rec.reason}</p>
                  
                  {rec.eventContext && (
                    <p className="text-xs text-muted-foreground italic">
                      Context: {rec.eventContext}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Global Events */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">What's Happening & What It Means For You</h2>
        
        {events.map((event) => {
          const Icon = eventCategoryIcons[event.category];
          return (
            <Card key={event.id} className={
              event.impact === 'high' ? 'border-destructive/50' : 
              event.impact === 'medium' ? 'border-amber-500/50' : ''
            }>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${
                    event.impact === 'high' ? 'bg-destructive/10' : 
                    event.impact === 'medium' ? 'bg-amber-500/10' : 'bg-primary/10'
                  }`}>
                    <Icon className={`h-6 w-6 ${
                      event.impact === 'high' ? 'text-destructive' : 
                      event.impact === 'medium' ? 'text-amber-500' : 'text-primary'
                    }`} />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-medium">{event.title}</span>
                      <Badge variant="outline" className="text-xs">{eventCategoryLabels[event.category]}</Badge>
                      <Badge 
                        variant={event.impact === 'high' ? 'destructive' : 
                          event.impact === 'medium' ? 'secondary' : 'outline'}
                        className="text-xs"
                      >
                        {event.impact.toUpperCase()} Impact
                      </Badge>
                    </div>
                    
                    <p className="text-sm text-muted-foreground">{event.summary}</p>
                    
                    <Alert className="py-2">
                      <AlertTitle className="text-sm flex items-center gap-2">
                        <ArrowRight className="h-4 w-4" />
                        What This Means For You
                      </AlertTitle>
                      <AlertDescription className="text-sm mt-1">
                        {event.userImpact}
                      </AlertDescription>
                    </Alert>
                    
                    {event.actionSuggestion && (
                      <div className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-emerald-500 mt-0.5" />
                        <span className="text-emerald-700 dark:text-emerald-400">{event.actionSuggestion}</span>
                      </div>
                    )}
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {event.affectedAreas.map((area) => (
                        <Badge key={area} variant="outline" className="text-xs">
                          {financialAreaLabels[area as FinancialArea]}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Key Insights Summary */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-primary" />
            Key Insights for This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <span>Monitor your transport budget - fuel price volatility may affect costs</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <span>Good time to negotiate fixed-rate loans before potential rate changes</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <span>Consider delaying major electronics purchases for better deals</span>
            </li>
            <li className="flex items-start gap-2 text-sm">
              <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
              <span>Stock up on essentials during sale seasons to hedge against price increases</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default GlobalIntelligenceSection;
