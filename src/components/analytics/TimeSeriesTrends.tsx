import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend
} from 'recharts';
import Spinner from '@/components/common/Spinner';

interface TimeSeriesDataPoint {
  date: string;
  leads: number;
  qualified: number;
  sent: number;
  replied: number;
}

interface TimeSeriesTrendsProps {
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

const TimeSeriesTrends: React.FC<TimeSeriesTrendsProps> = ({ filters }) => {
  const [data, setData] = useState<TimeSeriesDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMetric, setSelectedMetric] = useState<'leads' | 'qualified' | 'sent' | 'replied'>('leads');

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
    queryParams.append('metric', selectedMetric);
    
    console.log(`GET /api/analytics/trend?${queryParams.toString()}`);
    
    // Simulate API call with dynamic mock data
    setTimeout(() => {
      // Calculate multipliers based on filters
      const campaignMultiplier = filters.campaigns.length || 1;
      const channelMultiplier = filters.channels.length || 1;
      const icpMultiplier = filters.icps.length || 1;
      const totalMultiplier = (campaignMultiplier * channelMultiplier * icpMultiplier) / 4;
      const normalizedMultiplier = Math.max(0.5, Math.min(2, totalMultiplier));

      // Generate dates for the last 7 days
      const dates = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (6 - i));
        return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit' });
      });

      // Generate dynamic data with trends and randomness
      const generateTrendData = () => {
        const baseValue = 30 + Math.random() * 20; // Random starting point
        const trend = (Math.random() - 0.3) * 5; // Slight upward trend on average
        
        return dates.map((date, index) => {
          const trendValue = baseValue + (trend * index);
          const randomFactor = 0.8 + Math.random() * 0.4; // Random variation
          const value = Math.round(trendValue * randomFactor * normalizedMultiplier);
          return value;
        });
      };

      const leads = generateTrendData();
      const qualified = leads.map(v => Math.round(v * (0.4 + Math.random() * 0.2)));
      const sent = leads.map(v => Math.round(v * (2 + Math.random() * 1)));
      const replied = leads.map(v => Math.round(v * (0.2 + Math.random() * 0.2)));

      const dynamicData = dates.map((date, index) => ({
        date,
        leads: leads[index],
        qualified: qualified[index],
        sent: sent[index],
        replied: replied[index]
      }));

      setData(dynamicData);
      setLoading(false);
    }, 1000);
  }, [filters, selectedMetric]);

  const chartConfig = {
    leads: {
      label: "Leads",
      color: COLORS.primary
    },
    qualified: {
      label: "Qualified",
      color: COLORS.success
    },
    sent: {
      label: "Sent",
      color: COLORS.warning
    },
    replied: {
      label: "Replied",
      color: COLORS.secondary
    }
  };

  const handleMetricChange = (metric: 'leads' | 'qualified' | 'sent' | 'replied') => {
    setSelectedMetric(metric);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Time-Series Trends</CardTitle>
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
          <CardTitle>Time-Series Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load trend data: {error}</p>
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
        <CardTitle>Time-Series Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-x-2 mb-4 flex items-center">
          <span className="text-sm text-muted-foreground">Metric:</span>
          {Object.keys(chartConfig).map((metric) => (
            <button
              key={metric}
              onClick={() => handleMetricChange(metric as 'leads' | 'qualified' | 'sent' | 'replied')}
              className={`px-3 py-1 text-xs rounded-full ${
                selectedMetric === metric 
                  ? 'text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
              }`}
              style={{
                backgroundColor: selectedMetric === metric ? chartConfig[metric as keyof typeof chartConfig].color : undefined
              }}
            >
              {chartConfig[metric as keyof typeof chartConfig].label}
            </button>
          ))}
        </div>

        <div className="h-64">
          <ChartContainer 
            config={chartConfig} 
            className="h-full w-full"
          >
            <LineChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <ChartTooltipContent label={label} payload={payload} />
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey={selectedMetric} 
                stroke={chartConfig[selectedMetric].color}
                activeDot={{ r: 8 }} 
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default TimeSeriesTrends;
