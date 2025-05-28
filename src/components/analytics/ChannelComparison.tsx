import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from 'recharts';
import Spinner from '@/components/common/Spinner';

interface ChannelData {
  name: string;
  engagementRate: number;
  messageVolume: number;
  color: string;
}

interface ChannelComparisonProps {
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

const ChannelComparison: React.FC<ChannelComparisonProps> = ({ filters }) => {
  const [data, setData] = useState<ChannelData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeChannels, setActiveChannels] = useState<string[]>(['email', 'linkedin', 'sms', 'call']);

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
    
    console.log(`GET /api/analytics/channel?${queryParams.toString()}`);
    
    // Simulate API call with dynamic mock data
    setTimeout(() => {
      // Generate dynamic mock data based on filters
      const baseChannels = [
        { 
          name: 'Email', 
          baseEngagement: 25,
          baseVolume: 5400,
          color: COLORS.channels.email 
        },
        { 
          name: 'LinkedIn', 
          baseEngagement: 18,
          baseVolume: 2300,
          color: COLORS.channels.linkedin 
        },
        { 
          name: 'SMS', 
          baseEngagement: 32,
          baseVolume: 1800,
          color: COLORS.channels.sms 
        },
        { 
          name: 'Call', 
          baseEngagement: 45,
          baseVolume: 950,
          color: COLORS.channels.call 
        }
      ];

      // Filter channels based on selected channels
      const filteredChannels = baseChannels.filter(channel => {
        const channelId = channelNameToId[channel.name as keyof typeof channelNameToId];
        return filters.channels.length === 0 || filters.channels.includes(channelId);
      });

      // Calculate multipliers based on filters
      const campaignMultiplier = filters.campaigns.length || 1;
      const icpMultiplier = filters.icps.length || 1;
      const totalMultiplier = (campaignMultiplier * icpMultiplier) / 2;
      const normalizedMultiplier = Math.max(0.5, Math.min(2, totalMultiplier));

      // Generate dynamic data with some randomness
      const dynamicData = filteredChannels.map(channel => ({
        name: channel.name,
        engagementRate: Math.round(channel.baseEngagement * normalizedMultiplier * (0.8 + Math.random() * 0.4)),
        messageVolume: Math.round(channel.baseVolume * normalizedMultiplier * (0.8 + Math.random() * 0.4)),
        color: channel.color
      }));

      setData(dynamicData);
      setLoading(false);
    }, 1000);
  }, [filters]);

  const toggleChannel = (channel: string) => {
    setActiveChannels(prev => 
      prev.includes(channel) 
        ? prev.filter(c => c !== channel)
        : [...prev, channel]
    );
  };

  // Map channel names to IDs
  const channelNameToId = {
    'Email': 'email',
    'LinkedIn': 'linkedin',
    'SMS': 'sms',
    'Call': 'call'
  };

  // Filter data based on active channels
  const filteredData = data.filter(item => 
    activeChannels.includes(channelNameToId[item.name as keyof typeof channelNameToId])
  );

  const chartConfig = {
    engagementRate: {
      label: "Engagement Rate",
      color: COLORS.primary
    },
    messageVolume: {
      label: "Message Volume",
      color: COLORS.secondary
    }
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Channel Comparison</CardTitle>
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
          <CardTitle>Channel Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load channel data: {error}</p>
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
        <CardTitle>Channel Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-3 mb-4">
          {data.map((channel) => (
            <div key={channel.name} className="flex items-center space-x-2">
              <Checkbox 
                id={`toggle-${channel.name}`}
                checked={activeChannels.includes(channelNameToId[channel.name as keyof typeof channelNameToId])}
                onCheckedChange={() => toggleChannel(channelNameToId[channel.name as keyof typeof channelNameToId])}
              />
              <label 
                htmlFor={`toggle-${channel.name}`}
                className="text-sm cursor-pointer"
              >
                {channel.name}
              </label>
            </div>
          ))}
        </div>

        <div className="h-64">
          <ChartContainer 
            config={chartConfig} 
            className="h-full w-full"
          >
            <BarChart 
              data={filteredData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
              <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
              <ChartTooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent payload={payload} />
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Bar 
                dataKey="engagementRate" 
                name="Engagement Rate (%)" 
                yAxisId="left" 
                fill={COLORS.primary} 
              />
              <Bar 
                dataKey="messageVolume" 
                name="Message Volume" 
                yAxisId="right" 
                fill={COLORS.secondary} 
              />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChannelComparison;
