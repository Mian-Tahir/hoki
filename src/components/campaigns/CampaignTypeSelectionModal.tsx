import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail, Linkedin, MessageSquare, Phone, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export type CampaignType = 'email' | 'linkedin' | 'sms' | 'ai-calling' | 'instantly';

interface CampaignTypeOption {
  id: CampaignType;
  title: string;
  description: string;
  icon: React.ElementType;
}

const campaignTypes: CampaignTypeOption[] = [
  {
    id: 'email',
    title: ' Cold Email Outreach',
    description: 'Send personalized email sequences to your prospects',
    icon: Mail
  },
  {
    id: 'linkedin',
    title: 'LinkedIn Campaign',
    description: 'Automate LinkedIn connection requests and messaging',
    icon: Linkedin
  },
  {
    id: 'sms',
    title: 'SMS Follow-ups',
    description: 'Send SMS messages to engage with your leads',
    icon: MessageSquare
  },
  {
    id: 'ai-calling',
    title: 'AI Calling',
    description: 'Automated AI-powered voice calls to prospects',
    icon: Phone
  },
  {
    id: 'instantly',
    title: 'Instantly Campaign',
    description: 'Create campaigns using your existing Instantly integration',
    icon: Zap
  }
];

interface CampaignTypeSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (campaignType: CampaignType) => void;
}

const CampaignTypeSelectionModal: React.FC<CampaignTypeSelectionModalProps> = ({
  isOpen,
  onClose,
  onSelect
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Select Campaign Type</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
          {campaignTypes.map((type) => {
            const Icon = type.icon;
            return (
              <button
                key={type.id}
                onClick={() => onSelect(type.id)}
                className={cn(
                  "flex flex-col items-start p-4 rounded-lg",
                  "border border-border bg-background",
                  "hover:border-primary hover:bg-accent/50 transition-colors",
                  "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                  "active:bg-accent/70"
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  <Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold text-left">{type.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground text-left">
                  {type.description}
                </p>
              </button>
            );
          })}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CampaignTypeSelectionModal; 