import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface FloatingNavbarProps {
  items: NavItem[];
  activeItem: string;
  onItemClick: (id: string) => void;
  className?: string;
}

const FloatingNavbar: React.FC<FloatingNavbarProps> = ({
  items,
  activeItem,
  onItemClick,
  className,
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <nav
      className={cn(
        'fixed bottom-6 left-1/2 -translate-x-1/2 z-50',
        'transition-all duration-300 ease-out',
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0',
        className
      )}
    >
      <div className="flex items-center gap-1 px-2 py-2 rounded-2xl bg-card/80 backdrop-blur-lg border border-border/50 shadow-xl">
        {items.map((item) => {
          const Icon = item.icon;
          const isActive = activeItem === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => onItemClick(item.id)}
              className={cn(
                'relative px-4 py-2 rounded-xl transition-all duration-200',
                'flex items-center gap-2 text-sm font-medium',
                isActive 
                  ? 'text-primary-foreground' 
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              {/* Active background */}
              {isActive && (
                <span 
                  className="absolute inset-0 rounded-xl bg-primary"
                  style={{
                    animation: 'scaleIn 0.2s ease-out',
                  }}
                />
              )}
              
              <Icon className="relative z-10 w-4 h-4" />
              <span className="relative z-10 hidden sm:inline">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default FloatingNavbar;
