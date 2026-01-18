import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface InteractiveCardProps {
  children: React.ReactNode;
  className?: string;
  hoverScale?: number;
  glowColor?: string;
}

const InteractiveCard: React.FC<InteractiveCardProps> = ({
  children,
  className,
  hoverScale = 1.02,
  glowColor = 'hsl(var(--primary) / 0.3)',
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 bg-card transition-all duration-300',
        isHovered && 'shadow-lg',
        className
      )}
      style={{
        transform: isHovered ? `scale(${hoverScale})` : 'scale(1)',
      }}
    >
      {/* Glow effect following cursor */}
      {isHovered && (
        <div
          className="pointer-events-none absolute -inset-px opacity-50 transition-opacity"
          style={{
            background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, ${glowColor}, transparent 50%)`,
          }}
        />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
};

export default InteractiveCard;
