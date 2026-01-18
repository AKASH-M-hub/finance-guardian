import { useState } from 'react';
import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { mockTransactions, categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { 
  Search, 
  Filter, 
  ArrowDownRight, 
  ArrowUpRight, 
  Receipt,
  Upload,
  FileText
} from 'lucide-react';

const TransactionsSection = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredTransactions = mockTransactions.filter(t => {
    const matchesSearch = t.merchant.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || t.category === categoryFilter;
    const matchesType = typeFilter === 'all' || t.type === typeFilter;
    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = [...new Set(mockTransactions.map(t => t.category))];

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { 
      weekday: 'short',
      day: 'numeric', 
      month: 'short' 
    });
  };

  // Find expensive spends (top 3)
  const expensiveSpends = [...mockTransactions]
    .filter(t => t.type === 'expense')
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Receipt className="h-6 w-6 text-primary" />
            Transaction Analyzer
          </h1>
          <p className="text-muted-foreground mt-1">
            All your transactions, categorized and analyzed
          </p>
        </div>
        <Button className="gap-2">
          <Upload className="h-4 w-4" />
          Upload Statement
        </Button>
      </div>

      {/* Expensive Spends Alert */}
      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center gap-2 text-amber-600">
            <FileText className="h-5 w-5" />
            Top Expensive Spends This Month
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {expensiveSpends.map((spend, index) => (
              <div 
                key={spend.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-background border border-border"
              >
                <span className="text-lg font-bold text-amber-600">#{index + 1}</span>
                <div>
                  <p className="font-medium text-sm">{spend.merchant}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(spend.date)}</p>
                </div>
                <span className="font-bold">₹{spend.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-border/50 shadow-md">
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search merchants..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat} className="capitalize">
                    {categoryIcons[cat]} {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transaction List */}
      <Card className="border-border/50 shadow-md">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredTransactions.length === 0 ? (
              <div className="p-8 text-center">
                <Receipt className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No transactions found</p>
              </div>
            ) : (
              filteredTransactions.map((transaction) => (
                <div 
                  key={transaction.id}
                  className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-xl",
                      transaction.type === 'income' ? 'bg-emerald-100' : 'bg-accent'
                    )}>
                      {categoryIcons[transaction.category]}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.merchant}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-sm text-muted-foreground">
                          {formatDate(transaction.date)}
                        </span>
                        <Badge variant="secondary" className="capitalize text-xs">
                          {transaction.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className={cn(
                    "flex items-center gap-2 text-lg font-semibold",
                    transaction.type === 'income' ? 'text-emerald-600' : 'text-foreground'
                  )}>
                    {transaction.type === 'income' ? (
                      <ArrowUpRight className="h-5 w-5" />
                    ) : (
                      <ArrowDownRight className="h-5 w-5 text-muted-foreground" />
                    )}
                    <span>
                      {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Transactions</p>
            <p className="text-2xl font-bold">{filteredTransactions.length}</p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Inflow</p>
            <p className="text-2xl font-bold text-emerald-600">
              ₹{filteredTransactions
                .filter(t => t.type === 'income')
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-md">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Total Outflow</p>
            <p className="text-2xl font-bold text-destructive">
              ₹{filteredTransactions
                .filter(t => t.type === 'expense')
                .reduce((acc, t) => acc + t.amount, 0)
                .toLocaleString()}
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TransactionsSection;
