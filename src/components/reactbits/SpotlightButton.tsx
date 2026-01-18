import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  spotlightColor?: string;
}

const SpotlightButton: React.FC<SpotlightButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  spotlightColor,
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const variantStyles = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
    outline: 'border-2 border-primary bg-transparent text-primary hover:bg-primary/10',
    ghost: 'bg-transparent text-foreground hover:bg-accent',
  };

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };

  const defaultSpotlightColors = {
    primary: 'rgba(255, 255, 255, 0.3)',
    secondary: 'rgba(255, 255, 255, 0.2)',
    outline: 'hsl(var(--primary) / 0.3)',
    ghost: 'hsl(var(--primary) / 0.2)',
  };

  const spotlightClr = spotlightColor || defaultSpotlightColors[variant];

  return (
    <button
      ref={buttonRef}
      className={cn(
        'relative overflow-hidden rounded-lg font-medium transition-all duration-300',
        'transform active:scale-[0.98]',
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Spotlight effect */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(120px circle at ${position.x}px ${position.y}px, ${spotlightClr}, transparent 60%)`,
        }}
      />
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
    </button>
  );
};

export default SpotlightButton;
