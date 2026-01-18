import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface HoverCard3DProps {
  children: React.ReactNode;
  className?: string;
  intensity?: number;
  glareEnabled?: boolean;
}

const HoverCard3D: React.FC<HoverCard3DProps> = ({
  children,
  className,
  intensity = 15,
  glareEnabled = true,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    const rotateXValue = (mouseY / (rect.height / 2)) * -intensity;
    const rotateYValue = (mouseX / (rect.width / 2)) * intensity;
    
    setRotateX(rotateXValue);
    setRotateY(rotateYValue);
    
    // Update glare position
    const glareX = ((e.clientX - rect.left) / rect.width) * 100;
    const glareY = ((e.clientY - rect.top) / rect.height) * 100;
    setGlarePosition({ x: glareX, y: glareY });
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition({ x: 50, y: 50 });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative overflow-hidden rounded-xl border border-border/50 bg-card transition-transform duration-150',
        className
      )}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Glare effect */}
      {glareEnabled && (
        <div
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity hover:opacity-30"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, hsl(var(--primary) / 0.4) 0%, transparent 60%)`,
            opacity: Math.abs(rotateX) > 2 || Math.abs(rotateY) > 2 ? 0.3 : 0,
          }}
        />
      )}
      
      <div style={{ transform: 'translateZ(20px)' }}>{children}</div>
    </div>
  );
};

export default HoverCard3D;
