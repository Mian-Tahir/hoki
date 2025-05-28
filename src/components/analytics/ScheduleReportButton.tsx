
import React, { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';

interface FormValues {
  email: string;
  frequency: string;
  includeCharts: boolean;
  includeTable: boolean;
}

const ScheduleReportButton: React.FC = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormValues>({
    defaultValues: {
      email: '',
      frequency: 'weekly',
      includeCharts: true,
      includeTable: true
    }
  });

  const onSubmit = (data: FormValues) => {
    console.log('POST /api/analytics/schedule', data);
    
    // Simulate API call
    setTimeout(() => {
      setOpen(false);
      toast({
        title: "Report Scheduled",
        description: `Your analytics report will be sent to ${data.email} ${data.frequency}.`,
      });
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90">
          Schedule Report
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader>
            <DialogTitle>Schedule Analytics Report</DialogTitle>
            <DialogDescription>
              Set up recurring reports to be delivered to your inbox.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 my-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                Email Address
              </label>
              <Input
                id="email"
                placeholder="your@email.com"
                {...register('email', { 
                  required: 'Email is required', 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
              )}
            </div>
            
            <div className="space-y-2">
              <label htmlFor="frequency" className="text-sm font-medium">
                Frequency
              </label>
              <select
                id="frequency"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                {...register('frequency', { required: true })}
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Report Contents
              </label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeCharts"
                  {...register('includeCharts')}
                  defaultChecked
                />
                <label
                  htmlFor="includeCharts"
                  className="text-sm cursor-pointer"
                >
                  Include charts and visualizations
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTable"
                  {...register('includeTable')}
                  defaultChecked
                />
                <label
                  htmlFor="includeTable"
                  className="text-sm cursor-pointer"
                >
                  Include events Tabels
                </label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm hover:bg-primary/90"
            >
              Schedule Report
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleReportButton;
