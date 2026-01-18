import React, { useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface GlowCardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glowColor?: string;
  glowSize?: number;
  glowOpacity?: number;
}

const GlowCard: React.FC<GlowCardProps> = ({
  children,
  className,
  glowColor = 'hsl(var(--primary))',
  glowSize = 200,
  glowOpacity = 0.15,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setPosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300',
        'hover:shadow-lg hover:border-primary/30',
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      {...props}
    >
      {/* Glow effect */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          background: `radial-gradient(${glowSize}px circle at ${position.x}px ${position.y}px, ${glowColor} / ${glowOpacity}, transparent 60%)`,
        }}
      />
      
      {/* Border glow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-xl transition-opacity duration-500"
        style={{
          opacity: isHovering ? 1 : 0,
          boxShadow: `inset 0 0 20px ${glowColor} / 0.1`,
        }}
      />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};

export default GlowCard;
