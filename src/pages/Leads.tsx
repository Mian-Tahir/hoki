import React, { useState, useCallback } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Spinner from '../components/common/Spinner';
import { Button } from '@/components/ui/button';
import { Filter, Plus, Download, Search } from 'lucide-react';
import Badge from '../components/common/Badge';
import OppolloLeadsData, { OppolloLead } from '../components/OppolloLeadsData';
import AddToCampaignModal from '../components/campaigns/AddToCampaignModal';
import { cn } from '@/lib/utils';

const Leads: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [leads, setLeads] = useState<OppolloLead[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<OppolloLead | null>(null);
  const [isAddToCampaignModalOpen, setIsAddToCampaignModalOpen] = useState(false);

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

  const handleAddToCampaign = (lead: OppolloLead, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLead(lead);
    setIsAddToCampaignModalOpen(true);
  };

  const handleCloseAddToCampaignModal = () => {
    setIsAddToCampaignModalOpen(false);
    setSelectedLead(null);
  };

  return (
    <Layout title="Leads Explorer" subtitle="Discover and manage your potential customers">
      {/* Data fetching component */}
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
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" className="flex items-center">
            <Filter size={16} className="mr-2" />
            Filter
          </Button>
          <Button variant="outline" className="flex items-center">
            <Download size={16} className="mr-2" />
            Export
          </Button>
          <Button className="bg-secondary text-white flex items-center">
            <Plus size={16} className="mr-2" />
            Add Lead
          </Button>
        </div>
      </div>
      
      <Card>
        <div className="mb-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search leads..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
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
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Company</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-neutral-dark/70 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {leads.map((lead) => (
                  <tr key={lead.id} className="hover:bg-neutral-light/30 cursor-pointer">
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
                    <td className="px-4 py-3 whitespace-nowrap">
                      <Button 
                        className="bg-secondary text-white flex items-center hover:bg-secondary/90"
                        size="sm"
                        onClick={(e) => handleAddToCampaign(lead, e)}
                      >
                        <Plus size={14} className="mr-1" />
                        Add to Campaign
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {selectedLead && (
        <AddToCampaignModal
          isOpen={isAddToCampaignModalOpen}
          onClose={handleCloseAddToCampaignModal}
          lead={selectedLead}
        />
      )}
    </Layout>
  );
};

export default Leads;
