import { useState } from 'react';
import type { ReactElement } from 'react';
import { AppLayout, type TabName } from './adapters/ui/components/layout/AppLayout';
import { RoutesTab } from './adapters/ui/components/routes/RoutesTab';
import { CompareTab } from './adapters/ui/components/compare/CompareTab';
import { BankingTab } from './adapters/ui/components/banking/BankingTab';
import { PoolingTab } from './adapters/ui/components/pooling/PoolingTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('Routes');

  const content: Record<TabName, ReactElement> = {
    Routes: <RoutesTab />,
    Compare: <CompareTab />,
    Banking: <BankingTab />,
    Pooling: <PoolingTab />,
  };

  return (
    <AppLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {content[activeTab]}
    </AppLayout>
  );
}

