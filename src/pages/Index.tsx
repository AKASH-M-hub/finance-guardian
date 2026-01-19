import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import StressSignalsSection from '@/components/sections/StressSignalsSection';
import BudgetSection from '@/components/sections/BudgetSection';
import SubscriptionsSection from '@/components/sections/SubscriptionsSection';
import LifeEventsSection from '@/components/sections/LifeEventsSection';
import ReportsSection from '@/components/sections/ReportsSection';
import AICoachSection from '@/components/sections/AICoachSection';
import AICoachChatSection from '@/components/sections/AICoachChatSection';
import CrisisModeSection from '@/components/sections/CrisisModeSection';
import EMIIntelligenceSection from '@/components/sections/EMIIntelligenceSection';
import GlobalIntelligenceSection from '@/components/sections/GlobalIntelligenceSection';
import CommunitySupportSection from '@/components/sections/CommunitySupportSection';
import FutureSelfProjectionSection from '@/components/sections/FutureSelfProjectionSection';
import SocialInfluenceFirewallSection from '@/components/sections/SocialInfluenceFirewallSection';
import CircadianCashFlowSection from '@/components/sections/CircadianCashFlowSection';
import OnboardingForm from '@/components/onboarding/OnboardingForm';
import AIChatbot from '@/components/chat/AIChatbot';
import SpotlightCursor from '@/components/reactbits/SpotlightCursor';
import { UserProfileProvider, useUserProfile } from '@/contexts/UserProfileContext';

const AppContent = () => {
  const { isOnboarded } = useUserProfile();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(!isOnboarded);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSection />;
      case 'ai-chat':
        return <AICoachChatSection />;
      case 'ai-coach':
        return <AICoachSection />;
      case 'crisis-mode':
        return <CrisisModeSection />;
      case 'future-self':
        return <FutureSelfProjectionSection />;
      case 'community':
        return <CommunitySupportSection />;
      case 'emi-intelligence':
        return <EMIIntelligenceSection />;
      case 'global-intelligence':
        return <GlobalIntelligenceSection />;
      case 'stress-signals':
        return <StressSignalsSection />;
      case 'budget':
        return <BudgetSection />;
      case 'subscriptions':
        return <SubscriptionsSection />;
      case 'life-events':
        return <LifeEventsSection />;
      case 'social-firewall':
        return <SocialInfluenceFirewallSection />;
      case 'circadian':
        return <CircadianCashFlowSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <DashboardSection />;
    }
  };

  if (showOnboarding || !isOnboarded) {
    return (
      <>
        <SpotlightCursor />
        <OnboardingForm onComplete={() => setShowOnboarding(false)} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <SpotlightCursor />
      <Header onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        
        <main className="flex-1 md:ml-64 p-6">
          <div className="max-w-7xl mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>

      <AIChatbot />
    </div>
  );
};

const Index = () => {
  return (
    <UserProfileProvider>
      <AppContent />
    </UserProfileProvider>
  );
};

export default Index;
