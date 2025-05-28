
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronUp, Calendar } from 'lucide-react';

interface FilterProps {
  onChange: (filters: any) => void;
}

const AnalyticsFilterBar: React.FC<FilterProps> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([]);
  const [selectedICPs, setSelectedICPs] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().substring(0, 10),
    end: new Date().toISOString().substring(0, 10)
  });

  // Mock campaign data - in a real app this would come from an API
  const campaigns = [
    { id: 'camp1', name: 'Q2 Outreach' },
    { id: 'camp2', name: 'New Product Launch' },
    { id: 'camp3', name: 'Enterprise Accounts' }
  ];

  const channels = [
    { id: 'email', name: 'Email' },
    { id: 'linkedin', name: 'LinkedIn' },
    { id: 'sms', name: 'SMS' },
    { id: 'call', name: 'AI Call' }
  ];

  const icpSegments = [
    { id: 'saas', name: 'SaaS' },
    { id: 'financial', name: 'Financial' },
    { id: 'insurance', name: 'Insurance' }
  ];

  const handleCampaignChange = (campaign: string) => {
    const newSelection = selectedCampaigns.includes(campaign)
      ? selectedCampaigns.filter(c => c !== campaign)
      : [...selectedCampaigns, campaign];
    
    setSelectedCampaigns(newSelection);
    onChange({ campaigns: newSelection });
  };

  const handleChannelChange = (channel: string) => {
    const newSelection = selectedChannels.includes(channel)
      ? selectedChannels.filter(c => c !== channel)
      : [...selectedChannels, channel];
    
    setSelectedChannels(newSelection);
    onChange({ channels: newSelection });
  };

  const handleICPChange = (icp: string) => {
    const newSelection = selectedICPs.includes(icp)
      ? selectedICPs.filter(c => c !== icp)
      : [...selectedICPs, icp];
    
    setSelectedICPs(newSelection);
    onChange({ icps: newSelection });
  };

  const handleDateChange = (type: 'start' | 'end', value: string) => {
    const newDateRange = { ...dateRange, [type]: value };
    setDateRange(newDateRange);
    onChange({ dateRange: { 
      start: new Date(newDateRange.start), 
      end: new Date(newDateRange.end) 
    }});
  };

  return (
    <Card>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
          <span className="font-medium">Analytics Filters</span>
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-6 pt-0">
            {/* Campaign Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Campaigns</h3>
              <div className="space-y-2">
                {campaigns.map(campaign => (
                  <div key={campaign.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`campaign-${campaign.id}`}
                      checked={selectedCampaigns.includes(campaign.id)}
                      onCheckedChange={() => handleCampaignChange(campaign.id)}
                    />
                    <label 
                      htmlFor={`campaign-${campaign.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {campaign.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Channel Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Channels</h3>
              <div className="space-y-2">
                {channels.map(channel => (
                  <div key={channel.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`channel-${channel.id}`}
                      checked={selectedChannels.includes(channel.id)}
                      onCheckedChange={() => handleChannelChange(channel.id)}
                    />
                    <label 
                      htmlFor={`channel-${channel.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {channel.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* ICP Segment Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">ICP Segments</h3>
              <div className="space-y-2">
                {icpSegments.map(icp => (
                  <div key={icp.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={`icp-${icp.id}`}
                      checked={selectedICPs.includes(icp.id)}
                      onCheckedChange={() => handleICPChange(icp.id)}
                    />
                    <label 
                      htmlFor={`icp-${icp.id}`}
                      className="text-sm cursor-pointer"
                    >
                      {icp.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Date Range Filter */}
            <div>
              <h3 className="text-sm font-medium mb-3">Date Range</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    value={dateRange.start}
                    onChange={(e) => handleDateChange('start', e.target.value)}
                    className="text-sm"
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <Input 
                    type="date" 
                    value={dateRange.end}
                    onChange={(e) => handleDateChange('end', e.target.value)}
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};

export default AnalyticsFilterBar;
