import React, { useState, useCallback, useMemo, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Download, Search } from 'lucide-react';
import Badge from '../components/common/Badge';
import OppolloLeadsData, { OppolloLead } from '../components/OppolloLeadsData';
import AddToCampaignModal from '../components/campaigns/AddToCampaignModal';
import { cn } from '@/lib/utils';
import { Checkbox } from "@/components/ui/checkbox";
import { useCampaignProgress } from '@/store/campaignProgress';
import CampaignProgress from '../components/common/CampaignProgress';

const Leads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<OppolloLead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLeads, setSelectedLeads] = useState<Set<string>>(new Set());
  const [isAddToCampaignModalOpen, setIsAddToCampaignModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const startProgress = useCampaignProgress((state) => state.startProgress);
  const isProgressActive = useCampaignProgress((state) => state.isActive);
  const campaignId = useCampaignProgress((state) => state.campaignId);
  const campaignName = useCampaignProgress((state) => state.campaignName);
  const totalLeads = useCampaignProgress((state) => state.totalLeads);
  const stopProgress = useCampaignProgress((state) => state.stopProgress);

  // Debug logging for progress state
  useEffect(() => {
    console.log('Leads component - Progress state:', { isProgressActive });
  }, [isProgressActive]);

  const handleLeadsLoaded = useCallback((loadedLeads: OppolloLead[]) => {
    setLeads(loadedLeads);
  }, []);

  const handleError = useCallback((errorMessage: string | null) => {
    setError(errorMessage);
  }, []);

  const handleLoadingChange = useCallback((isLoading: boolean) => {
    setLoading(isLoading);
  }, []);

  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { variant: 'primary' | 'warning' | 'success' | 'secondary', label: string }> = {
      new: { variant: 'primary', label: 'New' },
      contacted: { variant: 'warning', label: 'Contacted' },
      qualified: { variant: 'success', label: 'Qualified' },
      meeting: { variant: 'secondary', label: 'Meeting Set' },
      // Add any other statuses here
    };

    const statusConfig = statusMap[status.toLowerCase()] || { variant: 'primary', label: status };
    
    return (
      <Badge 
        variant={statusConfig.variant}
        className="px-2.5 py-0.5 text-xs font-medium"
      >
        {statusConfig.label}
      </Badge>
    );
  };

  const handleLeadSelection = (leadId: string) => {
    setSelectedLeads(prev => {
      const newSelected = new Set(prev);
      if (newSelected.has(leadId)) {
        newSelected.delete(leadId);
      } else {
        newSelected.add(leadId);
      }
      return newSelected;
    });
  };

  const handleSelectAllLeads = () => {
    if (selectedLeads.size === filteredLeads.length) {
      setSelectedLeads(new Set());
    } else {
      setSelectedLeads(new Set(filteredLeads.map(lead => lead.id)));
    }
  };

  const handleAddToCampaign = () => {
    console.log('Add to Campaign clicked, selected leads:', selectedLeads.size);
    if (selectedLeads.size > 0) {
      setIsAddToCampaignModalOpen(true);
    }
  };

  const handleCloseAddToCampaignModal = () => {
    console.log('Modal closed');
    setIsAddToCampaignModalOpen(false);
  };

  const filteredLeads = useMemo(() => {
    if (!searchQuery.trim()) return leads;
    
    const searchWords = searchQuery.toLowerCase().trim().split(/\s+/);
    
    return leads.filter(lead => {
      const leadInfo = [
        lead.firstName,
        lead.lastName,
        lead.company,
        lead.title,
        lead.email,
        lead.source
      ].map(info => info.toLowerCase());

      // Check if all search words are found in any of the lead's information
      return searchWords.every(word => 
        leadInfo.some(info => info.includes(word))
      );
    });
  }, [leads, searchQuery]);

  return (
    <Layout title="Leads Explorer" subtitle="Discover and manage your potential customers">
    

      {/* Progress Bar - Show only on Leads page when active */}
      {isProgressActive && campaignId && (
        <div className="w-full bg-white border-b border-gray-200 px-6 py-3 mb-6">
          <CampaignProgress
            campaignId={campaignId}
            campaignName={campaignName || 'Campaign'}
            totalLeads={totalLeads}
            onComplete={stopProgress}
          />
        </div>
      )}

      <OppolloLeadsData
        onLeadsLoaded={handleLeadsLoaded}
        onError={handleError}
        onLoadingChange={handleLoadingChange}
      />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-semibold text-neutral-dark">Lead Database</h2>
          <p className="text-sm text-neutral-dark/70">
            {leads.length} leads total 
            {selectedLeads.size > 0 && ` (${selectedLeads.size} selected)`}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            className={cn(
              "bg-secondary text-white flex items-center hover:bg-secondary/90",
              selectedLeads.size === 0 && "cursor-not-allowed"
            )}
            onClick={handleAddToCampaign}
          >
            <Plus size={16} className="mr-2" />
            Add {selectedLeads.size > 0 ? `${selectedLeads.size} Lead${selectedLeads.size !== 1 ? 's' : ''}` : 'Leads'} to Campaign
          </Button>
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          {/* <Button className="bg-secondary text-white flex items-center">
            <Plus size={16} className="mr-2" />
            Add Lead
          </Button> */}
        </div>
      </div>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-dark/50" />
          </div>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <Spinner />
          </div>
        ) : error ? (
          <div className="p-4 text-red-600 text-center">
            {error}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-neutral-light">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">
                    <div className="flex items-center">
                      <Checkbox
                        checked={selectedLeads.size === filteredLeads.length && filteredLeads.length > 0}
                        onCheckedChange={handleSelectAllLeads}
                        className="mr-2"
                      />
                      Select
                    </div>
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {filteredLeads.map((lead) => (
                  <tr 
                    key={lead.id} 
                    className={cn(
                      "hover:bg-neutral-light/30 cursor-pointer",
                      selectedLeads.has(lead.id) && "bg-neutral-light/20"
                    )}
                    onClick={() => handleLeadSelection(lead.id)}
                  >
                    <td className="px-4 py-3 whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedLeads.has(lead.id)}
                        onCheckedChange={() => handleLeadSelection(lead.id)}
                      />
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-neutral-dark">
                        {`${lead.firstName} ${lead.lastName}`}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-neutral-dark">{lead.company}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-neutral-dark/70">{lead.title}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-neutral-dark/70">{lead.email}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-neutral-dark/70">{lead.source}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {isAddToCampaignModalOpen && (
        <AddToCampaignModal
          isOpen={isAddToCampaignModalOpen}
          onClose={handleCloseAddToCampaignModal}
          leads={filteredLeads.filter(lead => selectedLeads.has(lead.id))}
          onSuccess={(campaignId, campaignName) => {
            console.log('Campaign success - Starting progress:', { 
              campaignId,
              campaignName, 
              leadsCount: selectedLeads.size,
              isProgressActive 
            });
            
            // Only start progress if not already active
            if (!isProgressActive) {
              startProgress(campaignId, campaignName, selectedLeads.size);
            }
            
            setSelectedLeads(new Set());
          }}
        />
      )}
    </Layout>
  );
};

export default Leads;
