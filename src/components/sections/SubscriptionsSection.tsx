import SubscriptionLeakCard from '@/components/dashboard/SubscriptionLeakCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockSubscriptions } from '@/data/mockData';
import { CreditCard, TrendingDown, AlertTriangle, DollarSign } from 'lucide-react';

const SubscriptionsSection = () => {
  const activeSubscriptions = mockSubscriptions.filter(s => s.isActive);
  const unwantedActive = mockSubscriptions.filter(s => s.isActive && s.isUnwanted);
  
  const monthlyTotal = activeSubscriptions.reduce((acc, s) => 
    acc + (s.frequency === 'monthly' ? s.amount : s.amount / 12), 0
  );
  
  const yearlyTotal = monthlyTotal * 12;
  const leakedMonthly = unwantedActive.reduce((acc, s) => 
    acc + (s.frequency === 'monthly' ? s.amount : s.amount / 12), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard className="h-6 w-6 text-primary" />
          Subscription Leak Finder
        </h1>
        <p className="text-muted-foreground mt-1">
          Detect and eliminate unwanted recurring payments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Monthly Subscriptions</p>
                <p className="text-2xl font-bold">₹{Math.round(monthlyTotal).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Yearly Cost</p>
                <p className="text-2xl font-bold">₹{Math.round(yearlyTotal).toLocaleString()}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center">
                <TrendingDown className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-destructive/30 bg-destructive/5 shadow-md">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Potential Savings</p>
                <p className="text-2xl font-bold text-destructive">
                  ₹{Math.round(leakedMonthly * 12).toLocaleString()}/yr
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SubscriptionLeakCard subscriptions={mockSubscriptions} />
        
        <Card className="border-border/50 shadow-md">
          <CardHeader>
            <CardTitle className="text-lg">How We Detect Subscription Leaks</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-accent/50">
              <h4 className="font-medium text-sm mb-2">🔍 Pattern Detection</h4>
              <p className="text-xs text-muted-foreground">
                We analyze your transaction history to identify recurring payments 
                at regular intervals (monthly, quarterly, yearly).
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/50">
              <h4 className="font-medium text-sm mb-2">📊 Usage Analysis</h4>
              <p className="text-xs text-muted-foreground">
                Subscriptions you haven't used in 30+ days are flagged as 
                potential leaks that you might want to cancel.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-accent/50">
              <h4 className="font-medium text-sm mb-2">💡 Smart Suggestions</h4>
              <p className="text-xs text-muted-foreground">
                We identify overlapping services (e.g., multiple streaming platforms) 
                and suggest consolidation opportunities.
              </p>
            </div>
            
            <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
              <h4 className="font-medium text-sm mb-2 text-primary">🎯 Action Required</h4>
              <p className="text-xs text-muted-foreground">
                Mark subscriptions you no longer need as "Unwanted" and we'll 
                remind you to cancel them before the next billing cycle.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">💰 Subscription Savings Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">1.</span>
              <p className="text-muted-foreground">
                Review all subscriptions quarterly - you'd be surprised what you're paying for but not using.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">2.</span>
              <p className="text-muted-foreground">
                Look for annual billing options - often 15-20% cheaper than monthly.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">3.</span>
              <p className="text-muted-foreground">
                Share family plans with trusted people to split costs on streaming services.
              </p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-primary font-bold">4.</span>
              <p className="text-muted-foreground">
                Cancel before free trials end - set calendar reminders to avoid surprise charges.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionsSection;
