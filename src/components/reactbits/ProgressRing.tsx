import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressRingProps {
  progress: number; // 0-100
  size?: number;
  strokeWidth?: number;
  className?: string;
  children?: React.ReactNode;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressRing: React.FC<ProgressRingProps> = ({
  progress,
  size = 120,
  strokeWidth = 8,
  className,
  children,
  color = 'primary',
  showPercentage = true,
  animated = true,
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (Math.min(100, Math.max(0, progress)) / 100) * circumference;

  const colorMap = {
    primary: 'stroke-primary',
    success: 'stroke-emerald-500',
    warning: 'stroke-amber-500',
    danger: 'stroke-destructive',
  };

  const bgColorMap = {
    primary: 'stroke-primary/20',
    success: 'stroke-emerald-500/20',
    warning: 'stroke-amber-500/20',
    danger: 'stroke-destructive/20',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={size} height={size} className="-rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className={bgColorMap[color]}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className={cn(
            colorMap[color],
            animated && 'transition-all duration-500 ease-out'
          )}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex items-center justify-center">
        {children ?? (
          showPercentage && (
            <span className="text-lg font-bold">{Math.round(progress)}%</span>
          )
        )}
      </div>
    </div>
  );
};

export default ProgressRing;
