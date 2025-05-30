import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useCampaignProgress } from '@/store/campaignProgress';

interface LayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title, subtitle }) => {
  const { isActive } = useCampaignProgress();

  return (
    <div className="flex min-h-screen bg-neutral-light">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Header title={title} subtitle={subtitle} />
        <main className={`flex-1 p-6 ${isActive ? 'pt-4' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
