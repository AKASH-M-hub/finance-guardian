import { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import DashboardSection from '@/components/sections/DashboardSection';
import TransactionsSection from '@/components/sections/TransactionsSection';
import StressSignalsSection from '@/components/sections/StressSignalsSection';
import BudgetSection from '@/components/sections/BudgetSection';
import InsightsSection from '@/components/sections/InsightsSection';
import SubscriptionsSection from '@/components/sections/SubscriptionsSection';
import LifeEventsSection from '@/components/sections/LifeEventsSection';
import ReportsSection from '@/components/sections/ReportsSection';

const Index = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardSection />;
      case 'transactions':
        return <TransactionsSection />;
      case 'stress-signals':
        return <StressSignalsSection />;
      case 'budget':
        return <BudgetSection />;
      case 'insights':
        return <InsightsSection />;
      case 'subscriptions':
        return <SubscriptionsSection />;
      case 'life-events':
        return <LifeEventsSection />;
      case 'reports':
        return <ReportsSection />;
      default:
        return <DashboardSection />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
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
    </div>
  );
};

export default Index;
