import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';
import Spinner from '@/components/common/Spinner';
import { AlertCircle } from 'lucide-react';

interface AgentStats {
  totalWorkflows: number;
  errorRate: number;
  uptime: number;
}

interface AgentTimeSeriesDataPoint {
  hour: string;
  tasks: number;
}

interface AgentUtilizationProps {
  filters: {
    campaigns: string[];
    channels: string[];
    icps: string[];
    dateRange: { start: Date; end: Date };
  };
}

const COLORS = {
  primary: '#2978FF',    // Electric Blue
  secondary: '#FF8C42',  // Sunset Orange
  success: '#3EE0B7',    // Mint Green
  warning: '#FFC947',    // Amber Yellow
  error: '#FF4C4C',      // Coral Red
  neutralDark: '#2E2E2E', // Charcoal Gray
  neutralLight: '#F7F7F7', // Soft Ivory
  channels: {
    email: '#74C0FC',    // Sky Blue
    linkedin: '#127E8A', // Deep Teal
    sms: '#B67FFF',      // Lilac Purple
    call: '#FFF35C'      // Sunshine Yellow
  }
};

const AgentUtilization: React.FC<AgentUtilizationProps> = ({ filters }) => {
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [timeData, setTimeData] = useState<AgentTimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    
    // Build query params from filters
    const queryParams = new URLSearchParams();
    filters.campaigns.forEach(campaign => queryParams.append('campaign', campaign));
    filters.channels.forEach(channel => queryParams.append('channel', channel));
    filters.icps.forEach(icp => queryParams.append('icp', icp));
    queryParams.append('startDate', filters.dateRange.start.toISOString());
    queryParams.append('endDate', filters.dateRange.end.toISOString());
    
    console.log(`GET /api/analytics/agent?${queryParams.toString()}`);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      setStats({
        totalWorkflows: 8450,
        errorRate: 2.3,
        uptime: 99.8
      });
      
      setTimeData([
        { hour: '09:00', tasks: 540 },
        { hour: '10:00', tasks: 620 },
        { hour: '11:00', tasks: 750 },
        { hour: '12:00', tasks: 690 },
        { hour: '13:00', tasks: 580 },
        { hour: '14:00', tasks: 650 },
        { hour: '15:00', tasks: 720 },
        { hour: '16:00', tasks: 810 },
        { hour: '17:00', tasks: 780 }
      ]);
      
      setLoading(false);
    }, 900);
  }, [filters]);

  const chartConfig = {
    tasks: {
      label: "Tasks",
      color: COLORS.primary
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Utilization & Health</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-64">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Agent Utilization & Health</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load agent data: {error}</p>
            <button 
              onClick={() => setLoading(true)} 
              className="mt-2 text-sm underline"
            >
              Retry
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agent Utilization & Health</CardTitle>
      </CardHeader>
      <CardContent>
        {stats && (
          <>
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <div style={{ color: COLORS.primary }} className="text-sm">Total Workflows</div>
                <div className="text-2xl font-bold mt-1">{stats.totalWorkflows.toLocaleString()}</div>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${COLORS.error}15` }}
              >
                <div style={{ color: COLORS.error }} className="text-sm">Error Rate</div>
                <div className="text-2xl font-bold mt-1">{stats.errorRate}%</div>
              </div>
              <div 
                className="p-4 rounded-lg"
                style={{ backgroundColor: `${COLORS.success}15` }}
              >
                <div style={{ color: COLORS.success }} className="text-sm">Uptime</div>
                <div className="text-2xl font-bold mt-1">{stats.uptime}%</div>
              </div>
            </div>
            
            <div className="h-40">
              <ChartContainer 
                config={chartConfig} 
                className="h-full w-full"
              >
                <AreaChart
                  data={timeData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <ChartTooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <ChartTooltipContent payload={payload} label={label} />
                        );
                      }
                      return null;
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="tasks" 
                    stroke={COLORS.primary} 
                    fill={`${COLORS.primary}15`} 
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          </>
        )}
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Recent Errors</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-error/10 rounded-lg border border-error/20">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-error mr-2" />
                <h4 className="text-sm font-medium text-error">LinkedIn API Rate Limit</h4>
              </div>
              <p className="mt-1 text-xs text-neutral-dark/70">Occurred 2 hours ago</p>
              <p className="mt-2 text-sm">Too many connection requests sent within timeframe</p>
              <div className="mt-3 flex justify-end">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Resolve</button>
              </div>
            </div>
            
            <div className="p-3 bg-neutral-light rounded-lg border border-neutral-dark/10">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-neutral-dark/70 mr-2" />
                <h4 className="text-sm font-medium">Email Deliverability Warning</h4>
              </div>
              <p className="mt-1 text-xs text-neutral-dark/70">Occurred 1 day ago</p>
              <p className="mt-2 text-sm">Bounce rate increased above threshold (5.2%)</p>
              <div className="mt-3 flex justify-end">
                <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 rounded-md px-3">Resolve</button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <button className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 text-primary underline-offset-4 hover:underline h-9 px-4 py-2">View All Errors</button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AgentUtilization;
