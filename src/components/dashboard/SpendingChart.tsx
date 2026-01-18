import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { spendingPatternData } from '@/data/mockData';
import { TrendingUp } from 'lucide-react';

const SpendingChart = () => {
  const weekendDays = ['Sat', 'Sun'];
  
  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-primary" />
          Weekly Spending Pattern
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={spendingPatternData}>
              <defs>
                <linearGradient id="colorSpending" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))"
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                tickFormatter={(value) => `₹${value/1000}k`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: 'var(--shadow-lg)'
                }}
                formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Spending']}
              />
              <Area 
                type="monotone" 
                dataKey="amount" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorSpending)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        <div className="mt-4 p-3 rounded-lg bg-accent/50">
          <p className="text-sm text-muted-foreground">
            <span className="text-amber-600 font-medium">⚠️ Weekend Spike: </span>
            Your spending increases by 85% on weekends. Consider planning weekend activities with a budget.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpendingChart;
