import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Clock, 
  Shield, 
  PiggyBank, 
  Lightbulb,
  Sparkles
} from 'lucide-react';
import { toast } from 'sonner';

const QuickActions = () => {
  const actions = [
    {
      icon: Clock,
      title: 'Buy Later',
      description: 'Delay impulse purchases',
      color: 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/20',
      action: () => toast.success('Buy Later mode activated! You\'ll be reminded in 48 hours.')
    },
    {
      icon: Shield,
      title: 'Bill Shield',
      description: 'Reserve money for bills',
      color: 'bg-primary/10 text-primary hover:bg-primary/20',
      action: () => toast.success('₹30,800 reserved for upcoming EMI and bills.')
    },
    {
      icon: PiggyBank,
      title: 'Mini Savings',
      description: 'Quick saving challenge',
      color: 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20',
      action: () => toast.success('7-day challenge started: Save ₹2,000 this week!')
    },
    {
      icon: Lightbulb,
      title: 'Smart Cuts',
      description: 'Reduction suggestions',
      color: 'bg-purple-500/10 text-purple-600 hover:bg-purple-500/20',
      action: () => toast.info('Tip: Cooking 3 meals at home can save ₹1,200/week')
    },
  ];

  return (
    <Card className="border-border/50 shadow-md">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Button
            key={action.title}
            variant="outline"
            className={`h-auto flex-col items-start p-4 ${action.color} border-transparent`}
            onClick={action.action}
          >
            <action.icon className="h-5 w-5 mb-2" />
            <span className="font-medium text-sm">{action.title}</span>
            <span className="text-xs opacity-80 text-left">{action.description}</span>
          </Button>
        ))}
      </CardContent>
    </Card>
  );
};

export default QuickActions;
