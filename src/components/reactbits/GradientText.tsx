import React from 'react';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'rainbow' | 'cool' | 'warm';
  className?: string;
  animate?: boolean;
}

const GradientText: React.FC<GradientTextProps> = ({
  children,
  variant = 'primary',
  className,
  animate = false,
}) => {
  const gradients = {
    primary: 'from-primary via-primary/80 to-primary/60',
    success: 'from-emerald-500 via-emerald-400 to-teal-400',
    warning: 'from-amber-500 via-orange-400 to-yellow-400',
    rainbow: 'from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500',
    cool: 'from-cyan-400 via-blue-500 to-purple-500',
    warm: 'from-rose-400 via-orange-400 to-amber-400',
  };

  return (
    <span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradients[variant],
        animate && 'animate-gradient bg-[length:200%_auto]',
        className
      )}
    >
      {children}
    </span>
  );
};

export default GradientText;
