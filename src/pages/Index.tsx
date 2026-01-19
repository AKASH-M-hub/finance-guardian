import { useState, useEffect } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import StressSignalsSection from '@/components/sections/StressSignalsSection';
import BudgetSection from '@/components/sections/BudgetSection';
import SubscriptionsSection from '@/components/sections/SubscriptionsSection';
import LifeEventsSection from '@/components/sections/LifeEventsSection';
import ReportsSection from '@/components/sections/ReportsSection';
import SettingsSection from '@/components/sections/SettingsSection';
import AICoachSection from '@/components/sections/AICoachSection';
import AICoachChatSection from '@/components/sections/AICoachChatSection';
import CrisisModeSection from '@/components/sections/CrisisModeSection';
import EMIIntelligenceSection from '@/components/sections/EMIIntelligenceSection';
import GlobalIntelligenceSection from '@/components/sections/GlobalIntelligenceSection';
import CommunitySupportSection from '@/components/sections/CommunitySupportSection';
import FutureSelfProjectionSection from '@/components/sections/FutureSelfProjectionSection';
import SocialInfluenceFirewallSection from '@/components/sections/SocialInfluenceFirewallSection';
import CircadianCashFlowSection from '@/components/sections/CircadianCashFlowSection';
import PrivacyTrustSection from '@/components/sections/PrivacyTrustSection';
import QuantumSimulatorSection from '@/components/sections/QuantumSimulatorSection';
import CognitiveLoadSection from '@/components/sections/CognitiveLoadSection';
import { FinancialIdentitySection } from '@/components/sections/FinancialIdentitySection';
import { IntergenerationalSection } from '@/components/sections/IntergenerationalSection';
import { DecisionFatigueSection } from '@/components/sections/DecisionFatigueSection';
import LifestyleInflationSection from '@/components/sections/LifestyleInflationSection';
import EmotionalSpendingSection from '@/components/sections/EmotionalSpendingSection';
import FinancialRecoverySection from '@/components/sections/FinancialRecoverySection';
import RegretPreventionSection from '@/components/sections/RegretPreventionSection';
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
      case 'financial-identity':
        return <FinancialIdentitySection />;
      case 'intergenerational':
        return <IntergenerationalSection />;
      case 'decision-fatigue':
        return <DecisionFatigueSection />;
      case 'lifestyle-inflation':
        return <LifestyleInflationSection />;
      case 'emotional-spending':
        return <EmotionalSpendingSection />;
      case 'financial-recovery':
        return <FinancialRecoverySection />;
      case 'regret-prevention':
        return <RegretPreventionSection />;
      case 'privacy-trust':
        return <PrivacyTrustSection />;
      case 'quantum-simulator':
        return <QuantumSimulatorSection />;
      case 'cognitive-load':
        return <CognitiveLoadSection />;
      case 'reports':
        return <ReportsSection />;
      case 'settings':
        return <SettingsSection />;
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
