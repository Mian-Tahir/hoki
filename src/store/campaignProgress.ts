import { create } from 'zustand';

interface CampaignProgressState {
  isActive: boolean;
  campaignId: string | null;
  campaignName: string | null;
  totalLeads: number;
  startTime: number | null;
  startProgress: (campaignId: string, campaignName: string, totalLeads: number) => void;
  stopProgress: () => void;
}

export const useCampaignProgress = create<CampaignProgressState>((set) => ({
  isActive: false,
  campaignId: null,
  campaignName: null,
  totalLeads: 0,
  startTime: null,
  startProgress: (campaignId, campaignName, totalLeads) => {
    console.log('Store: Starting progress with:', { 
      campaignId, 
      campaignName, 
      totalLeads,
      timestamp: new Date().toISOString()
    });
    set((state) => {
      console.log('Store: Previous state:', state);
      const newStartTime = state.isActive ? state.startTime : Date.now();
      return { 
        isActive: true, 
        campaignId, 
        campaignName, 
        totalLeads,
        startTime: newStartTime
      };
    });
  },
  stopProgress: () => {
    console.log('Store: Stopping progress at:', new Date().toISOString());
    set((state) => {
      console.log('Store: Previous state before stop:', state);
      return { 
        isActive: false, 
        campaignId: null, 
        campaignName: null, 
        totalLeads: 0,
        startTime: null
      };
    });
  },
})); 