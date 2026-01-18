import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface StressScoreGaugeProps {
  score: number;
  className?: string;
}

const StressScoreGauge = ({ score, className }: StressScoreGaugeProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedScore(score);
    }, 300);
    return () => clearTimeout(timer);
  }, [score]);

  const getScoreStatus = () => {
    if (score <= 30) return { label: 'Safe', color: 'text-emerald-600', bgColor: 'bg-emerald-500' };
    if (score <= 60) return { label: 'Watch', color: 'text-amber-600', bgColor: 'bg-amber-500' };
    return { label: 'Crisis', color: 'text-destructive', bgColor: 'bg-destructive' };
  };

  const status = getScoreStatus();
  const circumference = 2 * Math.PI * 80;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  return (
    <div className={cn("flex flex-col items-center", className)}>
      <div className="relative">
        <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 180 180">
          {/* Background circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="12"
          />
          {/* Animated progress circle */}
          <circle
            cx="90"
            cy="90"
            r="80"
            fill="none"
            stroke={score <= 30 ? '#10b981' : score <= 60 ? '#f59e0b' : 'hsl(var(--destructive))'}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={cn("text-5xl font-bold", status.color)}>
            {animatedScore}
          </span>
          <span className="text-sm text-muted-foreground mt-1">/ 100</span>
        </div>
      </div>
      <div className={cn("mt-4 px-4 py-2 rounded-full font-medium", status.bgColor, "text-primary-foreground")}>
        {status.label} Zone
      </div>
      <p className="mt-3 text-sm text-muted-foreground text-center max-w-xs">
        {score <= 30 
          ? "Your finances are healthy. Keep up the good habits!" 
          : score <= 60 
          ? "Some warning signs detected. Review your spending patterns."
          : "Immediate attention needed. Let's create a recovery plan."}
      </p>
    </div>
  );
};

export default StressScoreGauge;
