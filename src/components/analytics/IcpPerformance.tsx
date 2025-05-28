import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import Spinner from '@/components/common/Spinner';

interface IcpData {
  name: string;
  value: number;
  engagement: number;
  color: string;
}

interface IcpPerformanceProps {
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

const IcpPerformance: React.FC<IcpPerformanceProps> = ({ filters }) => {
  const [data, setData] = useState<IcpData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedIcp, setSelectedIcp] = useState<string | null>(null);

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
    
    console.log(`GET /api/analytics/ICP?${queryParams.toString()}`);
    
    // Simulate API call with dynamic mock data
    setTimeout(() => {
      // Base ICP data
      const baseIcpData = [
        { name: 'SaaS', baseValue: 650, baseEngagement: 28, color: COLORS.primary },
        { name: 'Financial', baseValue: 420, baseEngagement: 32, color: COLORS.success },
        { name: 'Insurance', baseValue: 180, baseEngagement: 15, color: COLORS.secondary }
      ];

      // Filter ICPs based on selected ICPs
      const filteredIcps = baseIcpData.filter(icp => 
        filters.icps.length === 0 || filters.icps.includes(icp.name.toLowerCase())
      );

      // Calculate multipliers based on filters
      const campaignMultiplier = filters.campaigns.length || 1;
      const channelMultiplier = filters.channels.length || 1;
      const totalMultiplier = (campaignMultiplier * channelMultiplier) / 2;
      const normalizedMultiplier = Math.max(0.5, Math.min(2, totalMultiplier));

      // Generate dynamic data with some randomness
      const dynamicData = filteredIcps.map(icp => ({
        name: icp.name,
        value: Math.round(icp.baseValue * normalizedMultiplier * (0.8 + Math.random() * 0.4)),
        engagement: Math.round(icp.baseEngagement * normalizedMultiplier * (0.8 + Math.random() * 0.4)),
        color: icp.color
      }));

      setData(dynamicData);
      setLoading(false);
    }, 1200);
  }, [filters]);

  const handlePieClick = (data: any, index: number) => {
    setSelectedIcp(data.name);
    console.log(`Selected ICP: ${data.name}`);
    // This would typically trigger a drill-down view
  };

  // Format for better display
  const formatData = data.map(item => ({
    ...item,
    name: `${item.name} (${item.engagement}%)`,
  }));

  const chartConfig = {
    saas: {
      label: "SaaS",
      color: COLORS.primary
    },
    financial: {
      label: "Financial",
      color: COLORS.success
    },
    insurance: {
      label: "Insurance",
      color: COLORS.secondary
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ICP Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          <Spinner />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>ICP Performance Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load ICP data: {error}</p>
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

  const totalLeads = data.reduce((sum, item) => sum + item.value, 0);
  const avgEngagement = data.reduce((sum, item) => sum + (item.value * item.engagement), 0) / totalLeads;

  return (
    <Card>
      <CardHeader>
        <CardTitle>ICP Performance Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col h-64">
          {selectedIcp && (
            <div className="mb-2 text-sm">
              <button 
                onClick={() => setSelectedIcp(null)}
                className="text-sm hover:underline"
                style={{ color: COLORS.primary }}
              >
                ← Back to overview
              </button>
              <span className="ml-2">Viewing details for {selectedIcp}</span>
            </div>
          )}
          
          <ChartContainer 
            config={chartConfig} 
            className="h-full w-full"
          >
            <PieChart>
              <Pie
                data={formatData}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                onClick={handlePieClick}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-2 border rounded shadow text-sm">
                        <div><strong>{data.name.split(' ')[0]}</strong></div>
                        <div>Leads: {data.value}</div>
                        <div>Engagement: {data.engagement}%</div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
            </PieChart>
          </ChartContainer>
          
          <div className="text-sm text-muted-foreground mt-4 text-center">
            <div>Total Leads: <span className="font-medium">{totalLeads}</span></div>
            <div>Average Engagement: <span className="font-medium">{avgEngagement.toFixed(1)}%</span></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default IcpPerformance;
