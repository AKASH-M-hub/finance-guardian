import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface CountUpNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
  separator?: string;
}

const CountUpNumber: React.FC<CountUpNumberProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className,
  separator = ',',
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const startTimeRef = useRef<number | null>(null);
  const startValueRef = useRef(0);
  const frameRef = useRef<number>();

  useEffect(() => {
    startValueRef.current = displayValue;
    startTimeRef.current = null;
    
    const animate = (timestamp: number) => {
      if (!startTimeRef.current) {
        startTimeRef.current = timestamp;
      }
      
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function (ease-out-expo)
      const easeOut = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      
      const current = startValueRef.current + (value - startValueRef.current) * easeOut;
      setDisplayValue(current);
      
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };
    
    frameRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [value, duration]);

  const formatNumber = (num: number) => {
    const fixed = num.toFixed(decimals);
    const [whole, decimal] = fixed.split('.');
    const withSeparator = whole.replace(/\B(?=(\d{3})+(?!\d))/g, separator);
    return decimal ? `${withSeparator}.${decimal}` : withSeparator;
  };

  return (
    <span className={cn('tabular-nums', className)}>
      {prefix}{formatNumber(displayValue)}{suffix}
    </span>
  );
};

export default CountUpNumber;
