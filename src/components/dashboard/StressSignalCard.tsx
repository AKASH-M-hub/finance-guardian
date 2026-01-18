import { StressSignal } from '@/types/finance';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, AlertTriangle, Info, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StressSignalCardProps {
  signal: StressSignal;
  onAction?: () => void;
}

const StressSignalCard = ({ signal, onAction }: StressSignalCardProps) => {
  const getSignalConfig = () => {
    switch (signal.severity) {
      case 'high':
        return {
          icon: AlertCircle,
          bgColor: 'bg-destructive/10',
          borderColor: 'border-destructive/30',
          iconColor: 'text-destructive',
          badgeColor: 'bg-destructive text-destructive-foreground'
        };
      case 'medium':
        return {
          icon: AlertTriangle,
          bgColor: 'bg-amber-500/10',
          borderColor: 'border-amber-500/30',
          iconColor: 'text-amber-600',
          badgeColor: 'bg-amber-500 text-primary-foreground'
        };
      default:
        return {
          icon: Info,
          bgColor: 'bg-primary/10',
          borderColor: 'border-primary/30',
          iconColor: 'text-primary',
          badgeColor: 'bg-primary text-primary-foreground'
        };
    }
  };

  const config = getSignalConfig();
  const Icon = config.icon;

  return (
    <Card className={cn("border transition-all hover:shadow-lg", config.borderColor, config.bgColor)}>
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <div className={cn("p-2 rounded-full", config.bgColor)}>
            <Icon className={cn("h-5 w-5", config.iconColor)} />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-sm truncate">{signal.title}</h4>
              <span className={cn("text-xs px-2 py-0.5 rounded-full capitalize", config.badgeColor)}>
                {signal.severity}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-3">
              {signal.description}
            </p>
            
            <div className="flex items-center justify-between">
              <p className="text-xs text-foreground font-medium">
                💡 {signal.actionable}
              </p>
              {onAction && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={onAction}
                  className="shrink-0"
                >
                  Take Action
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StressSignalCard;
