import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { CampaignType } from './CampaignTypeSelectionModal';
import Spinner from '@/components/common/Spinner';

interface NewCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: any) => Promise<void>;
  campaignType: CampaignType;
  isCreating: boolean;
}

const getCampaignTypeTitle = (type: CampaignType): string => {
  const titles: Record<CampaignType, string> = {
    'email': 'Email Outreach',
    'linkedin': 'LinkedIn Campaign',
    'sms': 'SMS Follow-ups',
    'ai-calling': 'AI Calling',
    'instantly': 'Instantly Campaign'
  };
  return titles[type];
};

const NewCampaignModal: React.FC<NewCampaignModalProps> = ({ isOpen, onClose, onSubmit, campaignType, isCreating }) => {
  const [formData, setFormData] = useState({
    name: '',
    schedule: {
      name: 'My Schedule',
      timing: {
        from: '09:00',
        to: '17:00'
      },
      days: {
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true
      },
      timezone: 'Etc/GMT+12'
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: formData.name,
      campaign_schedule: {
        schedules: [formData.schedule]
      }
    });
    onClose();
  };

  const handleDayChange = (day: string) => {
    setFormData(prev => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        days: {
          ...prev.schedule.days,
          [day]: !prev.schedule.days[day as keyof typeof prev.schedule.days]
        }
      }
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create {getCampaignTypeTitle(campaignType)}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label>Schedule</Label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="from">From</Label>
                  <Input
                    id="from"
                    type="time"
                    value={formData.schedule.timing.from}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        timing: { ...prev.schedule.timing, from: e.target.value }
                      }
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="to">To</Label>
                  <Input
                    id="to"
                    type="time"
                    value={formData.schedule.timing.to}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      schedule: {
                        ...prev.schedule,
                        timing: { ...prev.schedule.timing, to: e.target.value }
                      }
                    }))}
                  />
                </div>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Working Days</Label>
              <div className="grid grid-cols-5 gap-2">
                {['monday', 'tuesday', 'wednesday', 'thursday', 'friday'].map((day) => (
                  <div key={day} className="flex items-center space-x-2">
                    <Checkbox
                      id={day}
                      checked={formData.schedule.days[day as keyof typeof formData.schedule.days]}
                      onCheckedChange={() => handleDayChange(day)}
                    />
                    <Label htmlFor={day} className="text-sm capitalize">{day.slice(0, 3)}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select
                value={formData.schedule.timezone}
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  schedule: { ...prev.schedule, timezone: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Etc/GMT+12">GMT+12</SelectItem>
                  <SelectItem value="Etc/GMT+8">GMT+8</SelectItem>
                  <SelectItem value="Etc/GMT+0">GMT+0</SelectItem>
                  <SelectItem value="Etc/GMT-8">GMT-8</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
            <Button type="submit" disabled={isCreating}>
              {isCreating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Creating...
                </>
              ) : (
                'Create Campaign'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewCampaignModal; 