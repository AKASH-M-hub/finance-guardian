import { Transaction } from '@/types/finance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { categoryIcons } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { ArrowDownRight, ArrowUpRight, Receipt } from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  limit?: number;
}

const TransactionList = ({ transactions, limit = 10 }: TransactionListProps) => {
  const displayTransactions = transactions.slice(0, limit);
  
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
  };

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Receipt className="h-5 w-5 text-primary" />
          Recent Transactions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {displayTransactions.map((transaction) => (
            <div 
              key={transaction.id}
              className="flex items-center justify-between p-4 hover:bg-accent/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-10 h-10 rounded-full flex items-center justify-center text-lg",
                  transaction.type === 'income' ? 'bg-emerald-100' : 'bg-accent'
                )}>
                  {categoryIcons[transaction.category]}
                </div>
                <div>
                  <p className="font-medium text-sm">{transaction.merchant}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">
                      {formatDate(transaction.date)}
                    </span>
                    <Badge variant="secondary" className="text-xs capitalize px-1.5 py-0">
                      {transaction.category}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div className={cn(
                "flex items-center gap-1 font-medium",
                transaction.type === 'income' ? 'text-emerald-600' : 'text-foreground'
              )}>
                {transaction.type === 'income' ? (
                  <ArrowUpRight className="h-4 w-4" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
                )}
                <span>
                  {transaction.type === 'income' ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionList;
