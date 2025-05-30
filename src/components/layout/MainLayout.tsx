import React, { useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useCampaignProgress } from '@/store/campaignProgress';
import CampaignProgress from '../common/CampaignProgress';

const MainLayout: React.FC = () => {
  const progressState = useCampaignProgress();
  const { isActive, campaignId, campaignName, totalLeads, stopProgress } = progressState;

  // Debug logging
  useEffect(() => {
    console.log('MainLayout - Progress State Changed:', {
      isActive,
      campaignId,
      campaignName,
      totalLeads,
      timestamp: new Date().toISOString(),
      shouldShowProgress: Boolean(isActive && campaignId)
    });
  }, [isActive, campaignId, campaignName, totalLeads]);

  const shouldShowProgress = Boolean(isActive && campaignId);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Progress Bar - Fixed at the very top */}
      {shouldShowProgress && (
        <div 
          className="fixed top-0 left-0 right-0 z-[9999] bg-red-500"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
            backgroundColor: 'red',
            padding: '12px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
          }}
        >
          <div className="max-w-4xl mx-auto">
            <CampaignProgress
              campaignId={campaignId!}
              campaignName={campaignName || 'Campaign'}
              totalLeads={totalLeads}
              onComplete={() => {
                console.log('Progress completed, stopping...');
                stopProgress();
              }}
            />
          </div>
        </div>
      )}

      {/* Debug overlay */}
      {/* {process.env.NODE_ENV === 'development' && (
        <div className="fixed top-0 left-0 bg-black/80 text-white p-2 text-xs z-[10000]">
          Progress Debug: {JSON.stringify({
            isActive,
            hasCampaignId: Boolean(campaignId),
            shouldShow: shouldShowProgress,
            campaignName,
            totalLeads,
            timestamp: new Date().toISOString()
          })}
        </div>
      )} */}

      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100">
          {/* Add padding to main content when progress is shown */}
          <div className={`container mx-auto px-6 ${shouldShowProgress ? 'pt-24' : 'pt-8'} pb-8`}>
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout; 