import { Subscription } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { CreditCard, AlertTriangle, Check, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

interface SubscriptionLeakCardProps {
  subscriptions: Subscription[];
}

const SubscriptionLeakCard = ({ subscriptions: initialSubscriptions }: SubscriptionLeakCardProps) => {
  const [subscriptions, setSubscriptions] = useState(initialSubscriptions);
  
  const totalMonthly = subscriptions
    .filter(s => s.isActive)
    .reduce((acc, s) => acc + (s.frequency === 'monthly' ? s.amount : s.amount / 12), 0);
  
  const leakedAmount = subscriptions
    .filter(s => s.isUnwanted && s.isActive)
    .reduce((acc, s) => acc + (s.frequency === 'monthly' ? s.amount : s.amount / 12), 0);

  const toggleSubscription = (id: string) => {
    setSubscriptions(prev => 
      prev.map(s => s.id === id ? { ...s, isActive: !s.isActive } : s)
    );
  };

  const markAsUnwanted = (id: string) => {
    setSubscriptions(prev => 
      prev.map(s => s.id === id ? { ...s, isUnwanted: !s.isUnwanted } : s)
    );
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CreditCard className="h-5 w-5 text-primary" />
            Subscription Tracker
          </CardTitle>
          {leakedAmount > 0 && (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              ₹{Math.round(leakedAmount).toLocaleString()}/mo leaked
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4 p-3 rounded-lg bg-primary/10">
          <p className="text-sm text-muted-foreground">Monthly subscription cost</p>
          <p className="text-2xl font-bold text-primary">
            ₹{Math.round(totalMonthly).toLocaleString()}
          </p>
        </div>
        
        <div className="space-y-3">
          {subscriptions.map((sub) => (
            <div 
              key={sub.id}
              className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                sub.isUnwanted && sub.isActive 
                  ? "border-destructive/30 bg-destructive/5" 
                  : "border-border bg-accent/30",
                !sub.isActive && "opacity-50"
              )}
            >
              <div className="flex items-center gap-3">
                <Switch 
                  checked={sub.isActive}
                  onCheckedChange={() => toggleSubscription(sub.id)}
                />
                <div>
                  <p className={cn("font-medium text-sm", !sub.isActive && "line-through")}>
                    {sub.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    ₹{sub.amount}/{sub.frequency === 'monthly' ? 'mo' : 'yr'}
                  </p>
                </div>
              </div>
              
              <Button
                variant={sub.isUnwanted ? "destructive" : "outline"}
                size="sm"
                onClick={() => markAsUnwanted(sub.id)}
                className="h-8"
              >
                {sub.isUnwanted ? (
                  <>
                    <X className="h-3 w-3 mr-1" />
                    Unwanted
                  </>
                ) : (
                  <>
                    <Check className="h-3 w-3 mr-1" />
                    Keep
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>
        
        {leakedAmount > 0 && (
          <p className="mt-4 text-xs text-muted-foreground">
            💡 Cancelling unwanted subscriptions saves you ₹{Math.round(leakedAmount * 12).toLocaleString()}/year
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SubscriptionLeakCard;
