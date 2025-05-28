import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Spinner from '@/components/common/Spinner';

interface Day {
  id: string;
  label: string;
}

interface EditCampaignModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (campaignData: any) => Promise<void>;
  campaign: {
    id: string;
    name: string;
    status: 'active' | 'paused' | 'completed' | 'draft';
    channels: Array<'email' | 'linkedin' | 'sms' | 'calls'>;
  };
  isSubmitting: boolean;
}

type FormData = {
  parent_campaign: string;
  name: string;
  conditions: {
    crm_status: number[];
    reply_contains: string;
  };
  subsequence_schedule: {
    start_date: string;
    end_date: string;
    schedules: Array<{
      name: string;
      timing: {
        from: string;
        to: string;
      };
      days: {
        [key: string]: boolean;
      };
      timezone: string;
    }>;
  };
  sequences: Array<{
    steps: Array<{
      type: string;
      delay: number;
      variants: Array<{
        subject: string;
        body: string;
        v_disabled: boolean;
      }>;
    }>;
  }>;
};

const days: Day[] = [
  { id: "0", label: "Sunday" },
  { id: "1", label: "Monday" },
  { id: "2", label: "Tuesday" },
  { id: "3", label: "Wednesday" },
  { id: "4", label: "Thursday" },
  { id: "5", label: "Friday" },
  { id: "6", label: "Saturday" }
];

const EditCampaignModal = ({
  isOpen,
  onClose,
  onSubmit,
  campaign,
  isSubmitting
}: EditCampaignModalProps): JSX.Element => {
  const [formData, setFormData] = useState<FormData>({
    parent_campaign: campaign.id,
    name: campaign.name,
    conditions: {
      crm_status: [],
      reply_contains: ""
    },
    subsequence_schedule: {
      start_date: new Date().toISOString(),
      end_date: new Date().toISOString(),
      schedules: [
        {
          name: "Default Schedule",
          timing: {
            from: "09:00",
            to: "17:00"
          },
          days: {
            "0": true,
            "1": true,
            "2": true,
            "3": true,
            "4": true,
            "5": false,
            "6": false
          },
          timezone: "Etc/GMT+12"
        }
      ]
    },
    sequences: [
      {
        steps: [
          {
            type: "email",
            delay: 2,
            variants: [
              {
                subject: "Hello {{firstName}}",
                body: "Hey {{firstName}},\n\nI hope you are doing well.",
                v_disabled: false
              }
            ]
          }
        ]
      }
    ]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  const handleDayChange = (dayId: string) => {
    setFormData(prev => {
      const currentDays = { ...prev.subsequence_schedule.schedules[0].days };
      currentDays[dayId] = !currentDays[dayId];
      
      return {
        ...prev,
        subsequence_schedule: {
          ...prev.subsequence_schedule,
          schedules: [{
            ...prev.subsequence_schedule.schedules[0],
            days: currentDays
          }]
        }
      };
    });
  };

  const handleCrmStatusChange = (value: string) => {
    const status = parseInt(value);
    setFormData(prev => ({
      ...prev,
      conditions: {
        ...prev.conditions,
        crm_status: prev.conditions.crm_status.includes(status)
          ? prev.conditions.crm_status.filter(s => s !== status)
          : [...prev.conditions.crm_status, status]
      }
    }));
  };

  const crmStatuses = Array.from({ length: 9 }, (_, i) => i + 1);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            {/* Basic Info */}
            <div className="grid gap-2">
              <Label htmlFor="name">Campaign Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>

            {/* Conditions */}
            <div className="grid gap-4">
              <h3 className="font-medium">Conditions</h3>
              <div className="grid gap-2">
                <Label>CRM Status</Label>
                <Select
                  value=""
                  onValueChange={handleCrmStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select CRM status" />
                  </SelectTrigger>
                  <SelectContent>
                    {crmStatuses.map((status) => (
                      <SelectItem 
                        key={status} 
                        value={status.toString()}
                        className={formData.conditions.crm_status.includes(status) ? "bg-accent" : ""}
                      >
                     {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {formData.conditions.crm_status.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formData.conditions.crm_status.map((status) => (
                      <div
                        key={status}
                        className="flex items-center gap-1 px-2 py-1 bg-accent rounded-md text-sm"
                      >
                        <span> {status}</span>
                        <button
                          type="button"
                          onClick={() => handleCrmStatusChange(status.toString())}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="reply_contains">Reply Contains</Label>
                <Input
                  id="reply_contains"
                  value={formData.conditions.reply_contains}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    conditions: { ...prev.conditions, reply_contains: e.target.value }
                  }))}
                placeholder="Enter yes or no"
                />
              </div>
            </div>
 {/* Sequence */}
 <div className="grid gap-4">
              <h3 className="font-medium">Sequence</h3>
              <div className="grid gap-4 border rounded-lg p-4">
                <div className="grid gap-2">
                  <Label htmlFor="email_subject">Email Subject</Label>
                  <Input
                    id="email_subject"
                    value={formData.sequences[0].steps[0].variants[0].subject}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sequences: [{
                        ...prev.sequences[0],
                        steps: [{
                          ...prev.sequences[0].steps[0],
                          variants: [{
                            ...prev.sequences[0].steps[0].variants[0],
                            subject: e.target.value
                          }]
                        }]
                      }]
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="email_body">Email Body</Label>
                  <textarea
                    id="email_body"
                    className="min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={formData.sequences[0].steps[0].variants[0].body}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sequences: [{
                        ...prev.sequences[0],
                        steps: [{
                          ...prev.sequences[0].steps[0],
                          variants: [{
                            ...prev.sequences[0].steps[0].variants[0],
                            body: e.target.value
                          }]
                        }]
                      }]
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="delay">Delay (days)</Label>
                  <Input
                    id="delay"
                    type="number"
                    min="0"
                    value={formData.sequences[0].steps[0].delay}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      sequences: [{
                        ...prev.sequences[0],
                        steps: [{
                          ...prev.sequences[0].steps[0],
                          delay: parseInt(e.target.value)
                        }]
                      }]
                    }))}
                  />
                </div>
              </div>
            </div>
            {/* Schedule */}
            <div className="grid gap-4">
              <h3 className="font-medium">Schedule</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input
                    id="start_date"
                    type="datetime-local"
                    value={formData.subsequence_schedule.start_date.slice(0, 16)}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subsequence_schedule: {
                        ...prev.subsequence_schedule,
                        start_date: new Date(e.target.value).toISOString()
                      }
                    }))}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input
                    id="end_date"
                    type="datetime-local"
                    value={formData.subsequence_schedule.end_date.slice(0, 16)}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subsequence_schedule: {
                        ...prev.subsequence_schedule,
                        end_date: new Date(e.target.value).toISOString()
                      }
                    }))}
                  />
                </div>
              </div>

              {/* Schedule Details */}
              <div className="grid gap-4 border rounded-lg p-4">
                <div className="grid gap-2">
                  <Label htmlFor="schedule_name">Schedule Name</Label>
                  <Input
                    id="schedule_name"
                    value={formData.subsequence_schedule.schedules[0].name}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      subsequence_schedule: {
                        ...prev.subsequence_schedule,
                        schedules: [{
                          ...prev.subsequence_schedule.schedules[0],
                          name: e.target.value
                        }]
                      }
                    }))}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="from">From</Label>
                    <Input
                      id="from"
                      type="time"
                      value={formData.subsequence_schedule.schedules[0].timing.from}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subsequence_schedule: {
                          ...prev.subsequence_schedule,
                          schedules: [{
                            ...prev.subsequence_schedule.schedules[0],
                            timing: {
                              ...prev.subsequence_schedule.schedules[0].timing,
                              from: e.target.value
                            }
                          }]
                        }
                      }))}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="to">To</Label>
                    <Input
                      id="to"
                      type="time"
                      value={formData.subsequence_schedule.schedules[0].timing.to}
                      onChange={(e) => setFormData(prev => ({
                        ...prev,
                        subsequence_schedule: {
                          ...prev.subsequence_schedule,
                          schedules: [{
                            ...prev.subsequence_schedule.schedules[0],
                            timing: {
                              ...prev.subsequence_schedule.schedules[0].timing,
                              to: e.target.value
                            }
                          }]
                        }
                      }))}
                    />
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label>Days</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {days.map((dayItem) => {
                      const isChecked = formData.subsequence_schedule.schedules[0].days[dayItem.id];
                      
                      return (
                        <div key={dayItem.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${dayItem.id}`}
                            checked={Boolean(isChecked)}
                            onCheckedChange={() => handleDayChange(dayItem.id)}
                          />
                          <Label htmlFor={`day-${dayItem.id}`}>{dayItem.label}</Label>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid gap-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={formData.subsequence_schedule.schedules[0].timezone}
                    onValueChange={(value) => setFormData(prev => ({
                      ...prev,
                      subsequence_schedule: {
                        ...prev.subsequence_schedule,
                        schedules: [{
                          ...prev.subsequence_schedule.schedules[0],
                          timezone: value
                        }]
                      }
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
                    <SelectItem value="UTC-12">UTC-12</SelectItem>
                    <SelectItem value="UTC-11">UTC-11</SelectItem>
                    <SelectItem value="UTC-10">UTC-10</SelectItem>
                    <SelectItem value="UTC-9">UTC-9</SelectItem>
                    <SelectItem value="UTC-8">UTC-8</SelectItem>
                    <SelectItem value="UTC-7">UTC-7</SelectItem>
                    <SelectItem value="UTC-6">UTC-6</SelectItem>
                    <SelectItem value="UTC-5">UTC-5</SelectItem>
                    <SelectItem value="UTC-4">UTC-4</SelectItem>
                    <SelectItem value="UTC-3">UTC-3</SelectItem>
                    <SelectItem value="UTC-2">UTC-2</SelectItem>
                    <SelectItem value="UTC-1">UTC-1</SelectItem>
                    <SelectItem value="UTC+0">UTC+0</SelectItem>
                    <SelectItem value="UTC+1">UTC+1</SelectItem>
                    <SelectItem value="UTC+2">UTC+2</SelectItem>
                    <SelectItem value="UTC+3">UTC+3</SelectItem>
                    <SelectItem value="UTC+4">UTC+4</SelectItem>
                    <SelectItem value="UTC+5">UTC+5</SelectItem>
                    <SelectItem value="UTC+5:30">UTC+5:30</SelectItem>
                    <SelectItem value="UTC+6">UTC+6</SelectItem>
                    <SelectItem value="UTC+7">UTC+7</SelectItem>
                    <SelectItem value="UTC+8">UTC+8</SelectItem>
                    <SelectItem value="UTC+9">UTC+9</SelectItem>
                    <SelectItem value="UTC+9:30">UTC+9:30</SelectItem>
                    <SelectItem value="UTC+10">UTC+10</SelectItem>
                    <SelectItem value="UTC+11">UTC+11</SelectItem>
                    <SelectItem value="UTC+12">UTC+12</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

           
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCampaignModal; 