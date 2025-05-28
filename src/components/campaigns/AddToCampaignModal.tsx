import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Spinner from '../common/Spinner';
import { toast } from 'sonner';

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
  lead: any;
}

const AddToCampaignModal: React.FC<AddToCampaignModalProps> = ({ isOpen, onClose, lead }) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await fetch('/api/api/v2/campaigns', {
          headers: {
            'Authorization': 'Bearer OTE5ZDY3NzMtM2ZmMi00OTZiLWFhNTAtYjI2MDJmYmRjOTVmOmtGTEpTbXJZTHZ2RA==',
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
    if (!selectedCampaign || !lead) return;

    setSubmitting(true);
    try {
      // Log the incoming lead data
      console.log('Original Lead Data:', lead);

      // Map the lead data to match the complete structure
      const leadData = {
        id: lead.id || `rec${Math.random().toString(36).substring(2, 15)}`,
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
          "Seniority": lead.seniority || (lead.title?.includes("CEO") || lead.title?.includes("Founder") ? "Founder" : 
                      lead.title?.includes("CTO") ? "C-Suite" : 
                      lead.title?.includes("VP") || lead.title?.includes("Director") ? "Executive" : "Manager"),
          "Departments": lead.departments || (lead.title?.includes("CTO") ? "Engineering" :
                        lead.title?.includes("CEO") ? "C-Suite" :
                        lead.title?.includes("Marketing") ? "Marketing" :
                        lead.title?.includes("Sales") ? "Sales" : "Other"),
          
          // Contact Information
          "Contact Owner": lead.contactOwner || "myar2032002@gmail.com",
          "Corporate Phone": lead.corporatePhone || "",
          "Stage": lead.stage || "Cold",
          "Account Owner": lead.accountOwner || "myar2032002@gmail.com",
          
          // Company Information
          "# Employees": lead.employeeCount || 0,
          "Industry": lead.industry || "Technology",
          "Keywords": lead.keywords || "technology, software, saas, startup",
          
          // Social Media & Web
          "Person Linkedin Url": lead.personLinkedinUrl || "",
          "Website": lead.website || `https://${lead.company?.toLowerCase().replace(/\s+/g, '')}.com`,
          "Company Linkedin Url": lead.companyLinkedinUrl || "",
          
          // Location Information
          "City": lead.city || "San Francisco",
          "State": lead.state || "California",
          "Country": lead.country || "United States",
          "Company Address": lead.companyAddress || "",
          "Company City": lead.companyCity || lead.city || "San Francisco",
          "Company State": lead.companyState || lead.state || "California",
          "Company Country": lead.companyCountry || lead.country || "United States",
          "Company Phone": lead.companyPhone || lead.corporatePhone || "",
          
          // Additional Information
          "SEO Description": lead.seoDescription || `${lead.company} - ${lead.title}`,
          "Technologies": lead.technologies || "Web, Mobile, Cloud",
          
          // Status Flags
          "Email Open": lead.emailOpen || "false",
          "Email Bounced": lead.emailBounced || "false",
          "Replied": lead.replied || "false",
          "Demoed": lead.demoed || "false",
          
          // Apollo Information
          "Apollo Contact Id": lead.apolloContactId || "",
          "Apollo Account Id": lead.apolloAccountId || ""
        }
      };

      const requestBody = {
        campaignId: selectedCampaign,
        lead: [leadData]
      };

      // Log the formatted data being sent
      console.log('Formatted Lead Data being sent:', JSON.stringify(requestBody, null, 2));

      const webhookUrl = 'https://ahtisham123.app.n8n.cloud/webhook/18ae9077-e0b8-4db8-ab60-e83083b599c1';
      try {
        console.log('Attempting to send request to webhook...');
        const response = await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestBody)
        });

        // Log the response status and headers
        console.log('Response status:', response.status);
        console.log('Response headers:', Object.fromEntries(response.headers.entries()));

        if (!response.ok) {
          const errorText = await response.text();
          console.error('Server responded with error:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Server responded with ${response.status}: ${errorText}`);
        }

        const responseData = await response.json();
        console.log('Webhook Response Data:', responseData);

        toast.success('Lead added to campaign successfully');
        onClose();
      } catch (error) {
        console.error('Detailed error information:', {
          name: error.name,
          message: error.message,
          stack: error.stack,
          cause: error.cause
        });
        toast.error(`Failed to add lead to campaign: ${error.message}`);
      } finally {
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error adding lead to campaign:', error);
      toast.error('Failed to add lead to campaign');
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