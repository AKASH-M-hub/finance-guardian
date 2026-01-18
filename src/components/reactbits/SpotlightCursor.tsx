import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface SpotlightCursorProps {
  color?: string;
  size?: number;
  blur?: number;
  enabled?: boolean;
}

const SpotlightCursor: React.FC<SpotlightCursorProps> = ({
  color = 'hsl(var(--primary) / 0.15)',
  size = 400,
  blur = 100,
  enabled = true,
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!enabled) return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      className={cn(
        'pointer-events-none fixed inset-0 z-[100] transition-opacity duration-300',
        'hidden md:block'
      )}
      style={{
        background: `radial-gradient(${size}px circle at ${position.x}px ${position.y}px, ${color}, transparent ${blur}%)`,
      }}
    />
  );
};

export default SpotlightCursor;
