import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface RippleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  rippleColor?: string;
}

interface Ripple {
  x: number;
  y: number;
  id: number;
}

const RippleButton: React.FC<RippleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  rippleColor,
  className,
  onClick,
  ...props
}) => {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    
    const rect = buttonRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple = { x, y, id: Date.now() };
    setRipples((prev) => [...prev, newRipple]);
    
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
    
    onClick?.(e);
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90',
    ghost: 'bg-transparent hover:bg-muted',
    danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const getRippleColor = () => {
    if (rippleColor) return rippleColor;
    switch (variant) {
      case 'primary': return 'hsl(var(--primary-foreground) / 0.3)';
      case 'secondary': return 'hsl(var(--secondary-foreground) / 0.3)';
      case 'ghost': return 'hsl(var(--primary) / 0.2)';
      case 'danger': return 'hsl(var(--destructive-foreground) / 0.3)';
      default: return 'hsl(var(--foreground) / 0.2)';
    }
  };

  return (
    <button
      ref={buttonRef}
      onClick={handleClick}
      className={cn(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-200',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {ripples.map((ripple) => (
        <span
          key={ripple.id}
          className="absolute animate-ping rounded-full pointer-events-none"
          style={{
            left: ripple.x,
            top: ripple.y,
            width: 10,
            height: 10,
            marginLeft: -5,
            marginTop: -5,
            background: getRippleColor(),
            animation: 'ripple 0.6s linear',
          }}
        />
      ))}
      <span className="relative z-10">{children}</span>
      
      <style>{`
        @keyframes ripple {
          to {
            transform: scale(40);
            opacity: 0;
          }
        }
      `}</style>
    </button>
  );
};

export default RippleButton;
