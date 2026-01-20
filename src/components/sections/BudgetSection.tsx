import { useState } from 'react';
import { BudgetGuardrail, TransactionCategory } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { mockBudgetGuardrails, categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Plus, 
  Edit2, 
  Check, 
  X,
  Lock,
  Unlock,
  AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';

const BudgetSection = () => {
  const [guardrails, setGuardrails] = useState<BudgetGuardrail[]>(mockBudgetGuardrails);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');
  const [lockedCategories, setLockedCategories] = useState<string[]>(['food', 'travel']);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategory, setNewCategory] = useState<TransactionCategory>('other');
  const [newCategoryLimit, setNewCategoryLimit] = useState('');

  const startEdit = (category: string, currentLimit: number) => {
    setEditingId(category);
    setEditValue(currentLimit.toString());
  };

  const saveEdit = (category: string) => {
    const newLimit = parseInt(editValue);
    if (isNaN(newLimit) || newLimit <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }
    
    setGuardrails(prev => 
      prev.map(g => g.category === category ? { ...g, limit: newLimit } : g)
    );
    setEditingId(null);
    toast.success(`Budget for ${category} updated to ₹${newLimit.toLocaleString()}`);
  };

  const toggleLock = (category: string) => {
    if (lockedCategories.includes(category)) {
      setLockedCategories(prev => prev.filter(c => c !== category));
      toast.info(`${category} is now unlocked from essential protection`);
    } else {
      setLockedCategories(prev => [...prev, category]);
      toast.success(`${category} is now protected as essential spending`);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-destructive';
    if (percentage >= 70) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const totalBudget = guardrails.reduce((acc, g) => acc + g.limit, 0);
  const totalSpent = guardrails.reduce((acc, g) => acc + g.spent, 0);
  const overallPercentage = Math.round((totalSpent / totalBudget) * 100);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Shield className="h-6 w-6 text-primary" />
            Budget Guardrails
          </h1>
          <p className="text-muted-foreground mt-1">
            Set limits and protect your essential spending
          </p>
        </div>
        <Button className="gap-2" onClick={() => setShowAddCategory(true)}>
          <Plus className="h-4 w-4" />
          Add Category
        </Button>
      </div>

      {/* Overall Progress */}
      <Card className="border-border/50 shadow-md">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Budget Usage</p>
              <p className="text-3xl font-bold">
                ₹{totalSpent.toLocaleString()} 
                <span className="text-lg font-normal text-muted-foreground">
                  {' / '}₹{totalBudget.toLocaleString()}
                </span>
              </p>
            </div>
            <div className={cn(
              "text-4xl font-bold",
              overallPercentage >= 90 ? 'text-destructive' : 
              overallPercentage >= 70 ? 'text-amber-600' : 'text-emerald-600'
            )}>
              {overallPercentage}%
            </div>
          </div>
          <Progress value={overallPercentage} className="h-4" />
          <p className="mt-4 text-sm text-muted-foreground">
            {totalBudget - totalSpent > 0 
              ? `₹${(totalBudget - totalSpent).toLocaleString()} remaining this month`
              : `₹${Math.abs(totalBudget - totalSpent).toLocaleString()} over budget!`}
          </p>
        </CardContent>
      </Card>

      {/* Add Category Form */}
      {showAddCategory && (
        <Card className="border-primary/50">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Add New Category</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Select
                value={newCategory}
                onValueChange={(v) => setNewCategory(v as TransactionCategory)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {(['food', 'travel', 'shopping', 'entertainment', 'bills', 'emi', 'subscription', 'health', 'groceries', 'fuel', 'other'] as TransactionCategory[])
                    .filter(cat => !guardrails.some(g => g.category === cat))
                    .map((cat) => (
                      <SelectItem key={cat} value={cat} className="capitalize">
                        {categoryIcons[cat] || '📦'} {cat}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <Input
                type="number"
                placeholder="Monthly limit (e.g., 5000)"
                value={newCategoryLimit}
                onChange={(e) => setNewCategoryLimit(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={() => {
                  if (!newCategoryLimit) {
                    toast.error('Please enter a limit amount');
                    return;
                  }
                  const limit = parseInt(newCategoryLimit);
                  if (isNaN(limit) || limit <= 0) {
                    toast.error('Please enter a valid limit amount');
                    return;
                  }
                  if (guardrails.some(g => g.category === newCategory)) {
                    toast.error('This category already exists');
                    return;
                  }
                  setGuardrails(prev => [...prev, {
                    category: newCategory,
                    limit: limit,
                    spent: 0
                  }]);
                  setNewCategory('other');
                  setNewCategoryLimit('');
                  setShowAddCategory(false);
                  toast.success(`Category "${newCategory}" added with ₹${limit.toLocaleString()} limit`);
                }}
                className="gap-2"
              >
                <Check className="h-4 w-4" />
                Add Category
              </Button>
              <Button variant="ghost" onClick={() => {
                setShowAddCategory(false);
                setNewCategory('other');
                setNewCategoryLimit('');
              }}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Essential Protection */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <Lock className="h-5 w-5 text-primary" />
            Essential Expense Protection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            Protected categories won't be included in spending reduction suggestions. 
            Toggle the lock to mark categories as essential.
          </p>
          <div className="flex flex-wrap gap-2">
            {guardrails.map((g) => (
              <Badge 
                key={g.category}
                variant={lockedCategories.includes(g.category) ? 'default' : 'outline'}
                className="cursor-pointer gap-1 py-1.5 px-3"
                onClick={() => toggleLock(g.category)}
              >
                {lockedCategories.includes(g.category) ? (
                  <Lock className="h-3 w-3" />
                ) : (
                  <Unlock className="h-3 w-3" />
                )}
                {categoryIcons[g.category]} {g.category}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Budgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {guardrails.map((guardrail) => {
          const percentage = Math.round((guardrail.spent / guardrail.limit) * 100);
          const isEditing = editingId === guardrail.category;
          const isLocked = lockedCategories.includes(guardrail.category);
          const remaining = guardrail.limit - guardrail.spent;
          
          return (
            <Card 
              key={guardrail.category}
              className={cn(
                "border-border/50 shadow-md transition-all",
                percentage >= 90 && "border-destructive/30",
                isLocked && "ring-1 ring-primary/30"
              )}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-xl">
                      {categoryIcons[guardrail.category]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-medium capitalize">{guardrail.category}</span>
                        {isLocked && (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <Lock className="h-2 w-2" />
                            Protected
                          </Badge>
                        )}
                      </div>
                      {percentage >= 90 && (
                        <span className="text-xs text-destructive flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          Near limit!
                        </span>
                      )}
                    </div>
                  </div>
                  
                  {isEditing ? (
                    <div className="flex items-center gap-2">
                      <Input
                        type="number"
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="w-24 h-8 text-right"
                        autoFocus
                      />
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => saveEdit(guardrail.category)}
                      >
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button 
                        size="icon" 
                        variant="ghost" 
                        className="h-8 w-8"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      className="h-8 w-8"
                      onClick={() => startEdit(guardrail.category, guardrail.limit)}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>
                      ₹{guardrail.spent.toLocaleString()} spent
                    </span>
                    <span className="text-muted-foreground">
                      Limit: ₹{guardrail.limit.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="relative h-2 bg-border rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all",
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Tips */}
      <Card className="border-border/50 shadow-md">
        <CardHeader>
          <CardTitle className="text-lg">💡 Smart Budgeting Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Set realistic limits based on your past 3-month average spending</li>
            <li>• Mark essential categories like food and travel as protected</li>
            <li>• Review and adjust limits at the start of each month</li>
            <li>• Enable notifications when you reach 70% of any limit</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default BudgetSection;
