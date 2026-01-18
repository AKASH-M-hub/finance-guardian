import { BudgetGuardrail } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { Shield } from 'lucide-react';

interface BudgetGuardrailCardProps {
  guardrails: BudgetGuardrail[];
}

const BudgetGuardrailCard = ({ guardrails }: BudgetGuardrailCardProps) => {
  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Shield className="h-5 w-5 text-primary" />
          Budget Guardrails
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {guardrails.map((guardrail) => {
          const percentage = Math.round((guardrail.spent / guardrail.limit) * 100);
          const remaining = guardrail.limit - guardrail.spent;
          
          return (
            <div key={guardrail.category} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[guardrail.category]}</span>
                  <span className="text-sm font-medium capitalize">{guardrail.category}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium">
                    ₹{guardrail.spent.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {' / '}₹{guardrail.limit.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className="h-2"
                />
                <div 
                  className={cn(
                    "absolute top-0 left-0 h-full rounded-full transition-all",
                    getProgressColor(percentage)
                  )}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-muted-foreground">
                <span className={cn(
                  percentage >= 90 ? 'text-destructive' : 
                  percentage >= 70 ? 'text-amber-600' : 'text-emerald-600'
                )}>
                  {percentage}% used
                </span>
                <span>
                  {remaining > 0 
                    ? `₹${remaining.toLocaleString()} left` 
                    : `₹${Math.abs(remaining).toLocaleString()} over`}
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
};

export default BudgetGuardrailCard;
