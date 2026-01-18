import React from 'react';
import { cn } from '@/lib/utils';

interface ShimmerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
}

const ShimmerButton: React.FC<ShimmerButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  ...props
}) => {
  const variantStyles = {
    primary: 'bg-primary text-primary-foreground',
    success: 'bg-emerald-600 text-white',
    warning: 'bg-amber-500 text-white',
    danger: 'bg-destructive text-destructive-foreground',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  return (
    <button
      className={cn(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-300',
        'transform hover:scale-[1.02] active:scale-[0.98]',
        'before:absolute before:inset-0 before:-translate-x-full',
        'before:animate-[shimmer_2s_infinite]',
        'before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default ShimmerButton;
