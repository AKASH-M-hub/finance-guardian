import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, TrendingDown } from 'lucide-react';

interface SurvivalMeterProps {
  days: number;
  currentBalance: number;
  dailySpendRate: number;
}

const SurvivalMeter = ({ days, currentBalance, dailySpendRate }: SurvivalMeterProps) => {
  const getSurvivalStatus = () => {
    if (days >= 30) return { status: 'Healthy', color: 'bg-emerald-500', textColor: 'text-emerald-600' };
    if (days >= 15) return { status: 'Moderate', color: 'bg-amber-500', textColor: 'text-amber-600' };
    return { status: 'Critical', color: 'bg-destructive', textColor: 'text-destructive' };
  };

  const status = getSurvivalStatus();
  const maxDays = 45;
  const percentage = Math.min((days / maxDays) * 100, 100);

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Salary-to-Salary Survival
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative pt-4">
          {/* Days display */}
          <div className="text-center mb-6">
            <span className={`text-5xl font-bold ${status.textColor}`}>{days}</span>
            <span className="text-xl text-muted-foreground ml-2">days</span>
            <p className="text-sm text-muted-foreground mt-1">
              until next salary at current spending rate
            </p>
          </div>

          {/* Visual meter */}
          <div className="relative h-4 bg-border rounded-full overflow-hidden">
            <div 
              className={`h-full ${status.color} transition-all duration-1000 ease-out rounded-full`}
              style={{ width: `${percentage}%` }}
            />
            {/* Markers */}
            <div className="absolute top-0 left-1/3 w-px h-full bg-foreground/20" />
            <div className="absolute top-0 left-2/3 w-px h-full bg-foreground/20" />
          </div>
          
          {/* Labels */}
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>Critical</span>
            <span>Moderate</span>
            <span>Healthy</span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-lg bg-accent/50">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-muted-foreground">Current Balance</span>
            <span className="font-medium">₹{currentBalance.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <TrendingDown className="h-3 w-3" />
              Daily Spend Rate
            </span>
            <span className="font-medium">₹{dailySpendRate.toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SurvivalMeter;
