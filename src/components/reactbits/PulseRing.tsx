import React from 'react';
import { cn } from '@/lib/utils';

interface PulseRingProps {
  color?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children?: React.ReactNode;
  className?: string;
}

const PulseRing: React.FC<PulseRingProps> = ({
  color = 'primary',
  size = 'md',
  children,
  className,
}) => {
  const colorStyles = {
    primary: 'bg-primary',
    success: 'bg-emerald-500',
    warning: 'bg-amber-500',
    danger: 'bg-destructive',
  };

  const sizeStyles = {
    sm: 'w-3 h-3',
    md: 'w-4 h-4',
    lg: 'w-6 h-6',
  };

  const ringSize = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={cn('relative inline-flex items-center justify-center', ringSize[size], className)}>
      {/* Pulse rings */}
      <span
        className={cn(
          'absolute rounded-full opacity-75 animate-ping',
          colorStyles[color],
          sizeStyles[size]
        )}
      />
      <span
        className={cn(
          'absolute rounded-full opacity-50 animate-ping animation-delay-300',
          colorStyles[color],
          sizeStyles[size]
        )}
        style={{ animationDelay: '0.3s' }}
      />
      
      {/* Center dot or children */}
      {children ? (
        <span className="relative z-10">{children}</span>
      ) : (
        <span
          className={cn(
            'relative rounded-full',
            colorStyles[color],
            sizeStyles[size]
          )}
        />
      )}
    </div>
  );
};

export default PulseRing;
