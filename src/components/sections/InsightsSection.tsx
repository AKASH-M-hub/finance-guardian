import SpendingChart from '@/components/dashboard/SpendingChart';
import CategoryBreakdown from '@/components/dashboard/CategoryBreakdown';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts';
import { monthlyTrendData } from '@/data/mockData';
import { TrendingUp, BarChart3, PieChart, Calendar } from 'lucide-react';

const InsightsSection = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-primary" />
          Spending Insights
        </h1>
        <p className="text-muted-foreground mt-1">
          Understand your spending patterns and trends
        </p>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SpendingChart />
        <CategoryBreakdown />
      </div>

      {/* Monthly Trend */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Income vs Expenses Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
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
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => `₹${value.toLocaleString()}`}
                />
                <Legend />
                <Bar dataKey="income" fill="hsl(142 76% 36%)" name="Income" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expenses" fill="hsl(var(--primary))" name="Expenses" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Savings Trend */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Calendar className="h-5 w-5 text-primary" />
            Savings Rate Over Time
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyTrendData.map(d => ({
                ...d,
                savingsRate: Math.round(((d.income - d.expenses) / d.income) * 100)
              }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis 
                  dataKey="month" 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                  tickFormatter={(value) => `${value}%`}
                />
                <Tooltip
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Savings Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="savingsRate" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={3}
                  dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {monthlyTrendData.map((d) => {
              const rate = Math.round(((d.income - d.expenses) / d.income) * 100);
              return (
                <div key={d.month} className="p-3 rounded-lg bg-accent/50 text-center">
                  <p className="text-xs text-muted-foreground">{d.month}</p>
                  <p className={`text-lg font-bold ${rate >= 30 ? 'text-emerald-600' : rate >= 15 ? 'text-amber-600' : 'text-destructive'}`}>
                    {rate}%
                  </p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Insights Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-emerald-600 mb-2">✅ What's Going Well</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• January savings rate improved to 54%</li>
              <li>• EMI payments always on time</li>
              <li>• Grocery spending is consistent</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-amber-600 mb-2">⚠️ Areas to Watch</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Weekend spending is 85% higher</li>
              <li>• Food delivery increased 45%</li>
              <li>• December was an expensive month</li>
            </ul>
          </CardContent>
        </Card>
        
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <h4 className="font-medium text-primary mb-2">💡 Suggestions</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Plan weekend activities with budget</li>
              <li>• Cook at home 2-3 times per week</li>
              <li>• Set up auto-transfer to savings</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsSection;
