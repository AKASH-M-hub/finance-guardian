import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  Shield, 
  CreditCard,
  Calendar,
  FileText,
  HelpCircle,
  X,
  Brain,
  Siren,
  Calculator,
  Globe,
  MessageCircle,
  Users,
  Clock,
  ShieldBan,
  Activity
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ activeTab, onTabChange, isOpen = true, onClose }: SidebarProps) => {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'ai-chat', label: 'AI Coach Chat', icon: MessageCircle },
    { id: 'ai-coach', label: 'AI Coach', icon: Brain },
    { id: 'crisis-mode', label: 'Crisis Mode', icon: Siren },
    { id: 'future-self', label: 'Future Self', icon: Clock },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'emi-intelligence', label: 'EMI Intelligence', icon: Calculator },
    { id: 'global-intelligence', label: 'World Intelligence', icon: Globe },
    { id: 'stress-signals', label: 'Stress Signals', icon: AlertTriangle },
    { id: 'budget', label: 'Budget Guardrails', icon: Shield },
    { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
    { id: 'life-events', label: 'Life Events', icon: Calendar },
    { id: 'social-firewall', label: 'Social Firewall', icon: ShieldBan },
    { id: 'circadian', label: 'Circadian Flow', icon: Activity },
    { id: 'reports', label: 'Reports', icon: FileText },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside className={cn(
        "fixed left-0 top-16 z-50 h-[calc(100vh-4rem)] w-64 border-r border-border bg-card transition-transform md:translate-x-0",
        isOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          <div className="flex items-center justify-between mb-4 md:hidden">
            <span className="font-semibold">Menu</span>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <nav className="space-y-1 flex-1 overflow-y-auto">
            {menuItems.map((item) => (
              <Button
                key={item.id}
                variant={activeTab === item.id ? 'secondary' : 'ghost'}
                className={cn(
                  "w-full justify-start gap-3 h-11",
                  activeTab === item.id && "bg-primary/10 text-primary font-medium"
                )}
                onClick={() => {
                  onTabChange(item.id);
                  onClose?.();
                }}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Button>
            ))}
          </nav>
          
          <div className="pt-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 h-11 text-muted-foreground"
            >
              <HelpCircle className="h-5 w-5" />
              Help & Support
            </Button>
            
            <div className="mt-4 p-4 rounded-lg bg-primary/10">
              <p className="text-sm font-medium text-primary">No Shame Mode</p>
              <p className="text-xs text-muted-foreground mt-1">
                We're here to help, not judge. Your financial wellness journey is personal.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
