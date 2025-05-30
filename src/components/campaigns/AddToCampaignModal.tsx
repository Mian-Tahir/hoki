import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Spinner from '../common/Spinner';
import { toast } from 'sonner';
import { OppolloLead } from '../OppolloLeadsData';
import { useCampaignProgress } from '@/store/campaignProgress';

interface Campaign {
  id: string;
  name: string;
  status: string;
  progress: number;
  channels: string[];
  leads: {
    total: number;
    engaged: number;
  };
  lastUpdated: string;
}

interface AddToCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  leads: OppolloLead[];
  onSuccess: (campaignId: string, campaignName: string) => void;
}

const AddToCampaignModal: React.FC<AddToCampaignModalProps> = ({ isOpen, onClose, leads, onSuccess }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const startProgress = useCampaignProgress((state) => state.startProgress);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/api/v2/campaigns', {
          headers: {
             'Authorization': `Bearer ${import.meta.env.VITE_INSTANTLY_API_KEY}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (!response.ok) throw new Error('Failed to fetch campaigns');
      
        const data = await response.json();
        setCampaigns(data.items.map((campaign: any) => ({
          id: campaign.id,
          name: campaign.name,
          status: campaign.status,
          progress: campaign.progress || 0,
          channels: campaign.channels || [],
          leads: campaign.leads || { total: 0, engaged: 0 },
          lastUpdated: campaign.timestamp_updated
        })));
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to fetch campaigns');
      } finally {
        setLoading(false);
      }
    };

    if (isOpen) {
      fetchCampaigns();
    }
  }, [isOpen]);

  const handleAddToCampaign = async () => {
    if (!selectedCampaign || leads.length === 0) return;

    setSubmitting(true);
    try {
      const formattedLeads = leads.map(lead => ({
        id: lead.id,
        createdTime: new Date().toISOString(),
        fields: {
          // Basic Information
          "First Name": lead.firstName || "",
          "Last Name": lead.lastName || "",
          "Title": lead.title || "",
          "Company": lead.company || "",
          "Company Name for Emails": lead.companyNameForEmails || lead.company || "",
          "Email": lead.email || "",
          
          // Email Information
          "Email Status": lead.emailStatus || "Verified",
          "Primary Email Source": lead.primaryEmailSource || lead.source || "Apollo",
          "Primary Email Catch-all Status": lead.primaryEmailCatchallStatus || "Not Catch-all",
          "Primary Email Last Verified At": lead.primaryEmailLastVerifiedAt || new Date().toISOString(),
          
          // Role Information
          "Seniority": lead.seniority || "",
          "Departments": lead.departments || "",
          
          // Contact Information
          "Contact Owner": lead.contactOwner || "",
          "Corporate Phone": lead.corporatePhone || "",
          "Stage": lead.stage || "Cold",
          "Account Owner": lead.accountOwner || "",
          
          // Company Information
          "# Employees": lead.employeeCount || 0,
          "Industry": lead.industry || "",
          "Keywords": lead.keywords ? lead.keywords.split(',').map(k => k.trim()) : [],
          
          // Social Media & Web
          "Person Linkedin Url": lead.personLinkedinUrl || "",
          "Website": lead.website || "",
          "Company Linkedin Url": lead.companyLinkedinUrl || "",
          
          // Location Information
          "City": lead.city || "",
          "State": lead.state || "",
          "Country": lead.country || "",
          "Company Address": lead.companyAddress || "",
          "Company City": lead.companyCity || "",
          "Company State": lead.companyState || "",
          "Company Country": lead.companyCountry || "",
          "Company Phone": lead.companyPhone || "",
          
          // Additional Information
          "SEO Description": lead.seoDescription || "",
          "Technologies": lead.technologies || "",
          
          // Status Flags
          "Email Open": lead.emailOpen || "false",
          "Email Bounced": lead.emailBounced || "false",
          "Replied": lead.replied || "false",
          "Demoed": lead.demoed || "false",
          
          // Apollo Information
          "Apollo Contact Id": lead.apolloContactId || "",
          "Apollo Account Id": lead.apolloAccountId || ""
        }
      }));

      const requestBody = {
        campaignId: selectedCampaign,
        lead: formattedLeads
      };

      console.log('Formatted Leads Data being sent:', JSON.stringify(requestBody, null, 2));

      const webhookUrl = 'https://ahtisham123.app.n8n.cloud/webhook/d78a4721-5b23-4c2d-a855-85f07adf75b1';
      
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server responded with ${response.status}: ${errorText}`);
      }

      const responseData = await response.json();
      console.log('Webhook Response Data:', responseData);

      // Get the campaign name
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      
      // Start the progress tracking
      startProgress(selectedCampaign, campaign?.name || 'Campaign', leads.length);
      
      // Show success toast
      toast.success('Workflow started successfully');
      
      // Call onSuccess with campaign details before closing
      onSuccess(selectedCampaign, campaign?.name || 'Campaign');
      
      // Close the modal after success
      onClose();
    } catch (error) {
      console.error('Error adding leads to campaign:', error);
      toast.error(`Failed to add leads to campaign: ${error.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add to Campaign</DialogTitle>
        </DialogHeader>
        
        {loading ? (
          <div className="flex justify-center py-4">
            <Spinner />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="max-h-[300px] overflow-y-auto">
              {campaigns.map((campaign) => (
                <div
                  key={campaign.id}
                  className={`p-3 rounded-lg cursor-pointer mb-2 transition-colors ${
                    selectedCampaign === campaign.id
                      ? 'bg-secondary text-white'
                      : 'hover:bg-neutral-light'
                  }`}
                  onClick={() => setSelectedCampaign(campaign.id)}
                >
                  <div className="font-medium">{campaign.name}</div>
               
                </div>
              ))}
            </div>
            
            <div className="flex justify-end gap-2 pt-4">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                className="bg-secondary text-white"
                onClick={handleAddToCampaign}
                disabled={!selectedCampaign || submitting}
              >
                {submitting ? <Spinner size="sm" /> : 'Add to Campaign'}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddToCampaignModal; 