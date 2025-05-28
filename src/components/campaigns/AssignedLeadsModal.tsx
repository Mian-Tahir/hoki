import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";

interface Lead {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  company_name: string;
  company_domain: string;
  email_open_count: number;
  email_reply_count: number;
  status: number;
  timestamp_created: string;
  timestamp_updated: string;
}

interface AssignedLeadsModalProps {
  isOpen: boolean;
  onClose: () => void;
  campaignId: string;
}

const AssignedLeadsModal: React.FC<AssignedLeadsModalProps> = ({
  isOpen,
  onClose,
  campaignId,
}) => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Function to generate random boolean
  const getRandomBoolean = () => Math.random() > 0.5;

  // Function to add dummy data to leads
  const addDummyData = (leads: Lead[]) => {
    return leads.map(lead => {
      const hasOpened = getRandomBoolean();
      return {
        ...lead,
        email_open_count: hasOpened ? 1 : 0,
        // Reply status depends on open status
        email_reply_count: hasOpened ? getRandomBoolean() ? 1 : 0 : 0
      };
    });
  };

  useEffect(() => {
    const fetchLeads = async () => {
      if (!isOpen || !campaignId) {
        console.log('AssignedLeadsModal: Modal closed or no campaign ID provided', { isOpen, campaignId });
        return;
      }
      console.log('AssignedLeadsModal: Fetching leads for campaign', { campaignId });
      
      setIsLoading(true);
      try {
        const response = await fetch('/api/api/v2/leads/list', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer OTE5ZDY3NzMtM2ZmMi00OTZiLWFhNTAtYjI2MDJmYmRjOTVmOmtGTEpTbXJZTHZ2RA=='
          },
          body: JSON.stringify({
            campaign: campaignId,
            in_campaign: true
          })
        });

        if (!response.ok) {
          const errorText = await response.text();
          console.error('API Error Response:', {
            status: response.status,
            statusText: response.statusText,
            body: errorText
          });
          throw new Error(`Failed to fetch leads: ${response.status} ${response.statusText}`);
        }

        const contentType = response.headers.get('content-type');
        if (!contentType || !contentType.includes('application/json')) {
          throw new Error('Server did not return JSON');
        }

        const data = await response.json();
        if (!data.items || !Array.isArray(data.items)) {
          throw new Error('Invalid response format');
        }
        
        // Add dummy data to the leads
        setLeads(addDummyData(data.items));
      } catch (error) {
        console.error('Error fetching leads:', error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch leads. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, [isOpen, campaignId, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] w-[1400px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assigned Leads</DialogTitle>
          <p className="text-sm text-neutral-500 mt-2">
            View and monitor the engagement status of Assigned Leads in this campaign.
          </p>
        </DialogHeader>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[250px]">Email</TableHead>
                <TableHead className="w-[200px]">Company</TableHead>
                <TableHead className="w-[200px]">Company Domain</TableHead>
                <TableHead className="text-center w-[150px]">Email Open Status</TableHead>
                <TableHead className="text-center w-[150px]">Email Reply Status</TableHead>
                <TableHead className="w-[100px]">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {leads.map((lead) => (
                <TableRow key={lead.id}>
                  <TableCell className="font-medium">{`${lead.first_name} ${lead.last_name}`}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company_name}</TableCell>
                  <TableCell>{lead.company_domain}</TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded-full text-xs font-medium ${
                      lead.email_open_count > 0 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {lead.email_open_count > 0 ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`inline-flex items-center justify-center w-20 px-3 py-1 rounded-full text-xs font-medium ${
                      lead.email_open_count === 0 
                        ? 'bg-gray-100 text-gray-400 border border-gray-200' 
                        : lead.email_reply_count > 0 
                          ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                          : 'bg-red-100 text-red-800 border border-red-200'
                    }`}>
                      {lead.email_open_count === 0 ? 'No' : lead.email_reply_count > 0 ? 'Yes' : 'No'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lead.status === 1 
                        ? 'bg-green-100 text-green-800 border border-green-200' 
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {lead.status === 1 ? 'Active' : 'Inactive'}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
              {leads.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4">
                    No leads assigned to this campaign
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AssignedLeadsModal; 