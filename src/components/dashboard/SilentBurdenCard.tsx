import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, Home, Receipt, Zap } from 'lucide-react';

interface SilentBurdenCardProps {
  burdenIndex: number;
  rent?: number;
  emi?: number;
  bills?: number;
  salary: number;
}

const SilentBurdenCard = ({ 
  burdenIndex, 
  rent = 15000, 
  emi = 25000, 
  bills = 5000,
  salary 
}: SilentBurdenCardProps) => {
  const getBurdenStatus = () => {
    if (burdenIndex <= 30) return { status: 'Comfortable', color: 'text-emerald-600' };
    if (burdenIndex <= 50) return { status: 'Manageable', color: 'text-amber-600' };
    return { status: 'High Pressure', color: 'text-destructive' };
  };

  const status = getBurdenStatus();
  const fixedExpenses = rent + emi + bills;

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-primary" />
          Silent Burden Index
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-4xl font-bold">{burdenIndex}%</span>
            <span className={`ml-2 text-sm font-medium ${status.color}`}>
              {status.status}
            </span>
          </div>
          <div className="text-right text-sm text-muted-foreground">
            <p>Fixed: ₹{fixedExpenses.toLocaleString()}</p>
            <p>Salary: ₹{salary.toLocaleString()}</p>
          </div>
        </div>
        
        <Progress value={burdenIndex} className="h-3 mb-6" />
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
            <div className="flex items-center gap-2">
              <Home className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Rent</span>
            </div>
            <span className="text-sm">₹{rent.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
            <div className="flex items-center gap-2">
              <Receipt className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">EMI</span>
            </div>
            <span className="text-sm">₹{emi.toLocaleString()}</span>
          </div>
          
          <div className="flex items-center justify-between p-3 rounded-lg bg-accent/50">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">Bills</span>
            </div>
            <span className="text-sm">₹{bills.toLocaleString()}</span>
          </div>
        </div>

        <p className="mt-4 text-xs text-muted-foreground">
          {burdenIndex}% of your salary is already committed before you start spending.
        </p>
      </CardContent>
    </Card>
  );
};

export default SilentBurdenCard;
