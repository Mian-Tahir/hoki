import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import CampaignCard from '../components/campaigns/CampaignCard';
import CampaignFilters from '../components/campaigns/CampaignFilters';
import NewCampaignModal from '../components/campaigns/NewCampaignModal';
import CampaignTypeSelectionModal, { CampaignType } from '../components/campaigns/CampaignTypeSelectionModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Spinner from '../components/common/Spinner';
import { toast } from 'sonner';

interface Campaign {
  id: string;
  name: string;
  status: number;
  campaign_schedule: {
    schedules: Array<{
      name: string;
      timing: {
        from: string;
        to: string;
      };
      days: Record<string, boolean>;
      timezone: string;
    }>;
  };
  timestamp_created: string;
  timestamp_updated: string;
  organization: string;
}

interface CampaignResponse {
  items: Campaign[];
  next_starting_after: string;
}

// Helper function to get random number between min and max
const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random channels
const getRandomChannels = () => {
  const allChannels = ['email', 'linkedin', 'sms', 'calls'] as const;
  const numChannels = getRandomNumber(1, 4);
  const shuffled = [...allChannels].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, numChannels);
};

// Map API campaign to our UI campaign format
const mapCampaignToUI = (campaign: Campaign) => {
  // Generate random leads data
  const totalLeads = getRandomNumber(50, 500);
  const engagedLeads = getRandomNumber(0, totalLeads);
  
  // Generate random progress (0-100)
  const progress = getRandomNumber(0, 100);
  
  // Get random channels
  const channels = getRandomChannels();
  
  // Generate a more varied status based on progress and random chance
  let status: 'active' | 'paused' | 'completed' | 'draft';
  if (progress === 100) {
    status = 'completed';
  } else if (progress === 0) {
    status = 'draft';
  } else {
    // For campaigns in progress, randomly assign status
    const statusChance = Math.random();
    if (statusChance < 0.7) {
      status = 'active';
    } else if (statusChance < 0.9) {
      status = 'paused';
    } else {
      status = 'draft';
    }
  }

  return {
    id: campaign.id,
    name: campaign.name,
    status,
    progress,
    channels,
    leads: {
      total: totalLeads,
      engaged: engagedLeads
    },
    lastUpdated: new Date(campaign.timestamp_updated).toLocaleDateString()
  };
};

const Campaigns: React.FC = () => {
  const [campaigns, setCampaigns] = useState<ReturnType<typeof mapCampaignToUI>[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [filters, setFilters] = useState({});
  const [isTypeSelectionModalOpen, setIsTypeSelectionModalOpen] = useState(false);
  const [isNewCampaignModalOpen, setIsNewCampaignModalOpen] = useState(false);
  const [selectedCampaignType, setSelectedCampaignType] = useState<CampaignType | null>(null);

  const fetchCampaigns = async () => {
    try {
      const response = await fetch('/api/api/v2/campaigns', {
        headers: {
          'Authorization': 'Bearer OTE5ZDY3NzMtM2ZmMi00OTZiLWFhNTAtYjI2MDJmYmRjOTVmOmtGTEpTbXJZTHZ2RA==',
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch campaigns');
      
      const data: CampaignResponse = await response.json();
      setCampaigns(data.items.map(mapCampaignToUI));
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      toast.error('Failed to fetch campaigns');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const handleCampaignTypeSelect = (type: CampaignType) => {
    setSelectedCampaignType(type);
    setIsTypeSelectionModalOpen(false);
    setIsNewCampaignModalOpen(true);
  };

  const handleNewCampaignModalClose = () => {
    setIsNewCampaignModalOpen(false);
    setSelectedCampaignType(null);
  };

  const handleCreateCampaign = async (campaignData: any) => {
    setIsCreating(true);
    try {
      const response = await fetch('/api/api/v2/campaigns', {
        method: 'POST',
        headers: {
          'Authorization': 'Bearer OTE5ZDY3NzMtM2ZmMi00OTZiLWFhNTAtYjI2MDJmYmRjOTVmOmtGTEpTbXJZTHZ2RA==',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(campaignData)
      });

      if (!response.ok) throw new Error('Failed to create campaign');
      
      const newCampaign = await response.json();
      // Add the new campaign to the list immediately
      setCampaigns(prev => [...prev, mapCampaignToUI(newCampaign)]);
      toast.success('Campaign created successfully');
      handleNewCampaignModalClose();
    } catch (error) {
      console.error('Error creating campaign:', error);
      toast.error('Failed to create campaign');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <Layout title="Campaign Studio" subtitle="Create and manage your multi-channel campaigns">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-dark">Your Campaigns</h2>
          <p className="text-sm text-neutral-dark/70">
            {campaigns.length} campaigns total • {campaigns.filter(c => c.status === 'active').length} active
          </p>
        </div>
        <Button 
          className="bg-secondary text-white flex items-center"
          onClick={() => setIsTypeSelectionModalOpen(true)}
        >
          <Plus size={16} className="mr-2" />
          New Campaign
        </Button>
      </div>
      
      <CampaignFilters onFilterChange={setFilters} />
      
      {loading ? (
        <div className="flex justify-center py-10">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map((campaign) => (
            <CampaignCard
              key={campaign.id}
              id={campaign.id}
              name={campaign.name}
              status={campaign.status}
              progress={campaign.progress}
              channels={campaign.channels}
              leads={campaign.leads}
              lastUpdated={campaign.lastUpdated}
            />
          ))}
        </div>
      )}

      <CampaignTypeSelectionModal
        isOpen={isTypeSelectionModalOpen}
        onClose={() => setIsTypeSelectionModalOpen(false)}
        onSelect={handleCampaignTypeSelect}
      />

      {selectedCampaignType && (
        <NewCampaignModal
          isOpen={isNewCampaignModalOpen}
          onClose={handleNewCampaignModalClose}
          onSubmit={handleCreateCampaign}
          campaignType={selectedCampaignType}
          isCreating={isCreating}
        />
      )}
    </Layout>
  );
};

export default Campaigns;
