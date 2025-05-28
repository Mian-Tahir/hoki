import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Spinner from '@/components/common/Spinner';

interface FunnelData {
  discovered: number;
  qualified: number;
  engaged: number;
  booked: number;
}

interface FunnelOverviewProps {
  filters: {
    campaigns: string[];
    channels: string[];
    icps: string[];
    dateRange: { start: Date; end: Date };
  };
}

// Add color constants at the top of the file after imports
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

const FunnelOverview: React.FC<FunnelOverviewProps> = ({ filters }) => {
  const [data, setData] = useState<FunnelData | null>(null);
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
    
    console.log(`GET /api/analytics/funnel?${queryParams.toString()}`);
    
    // Simulate API call with dynamic mock data
    setTimeout(() => {
      // Generate dynamic mock data based on filters
      const baseValue = 1000;
      const campaignMultiplier = filters.campaigns.length || 1;
      const channelMultiplier = filters.channels.length || 1;
      const icpMultiplier = filters.icps.length || 1;
      
      // Calculate total multiplier (normalized between 0.5 and 2)
      const totalMultiplier = (campaignMultiplier * channelMultiplier * icpMultiplier) / 4;
      const normalizedMultiplier = Math.max(0.5, Math.min(2, totalMultiplier));
      
      // Generate base numbers with some randomness
      const discovered = Math.round(baseValue * normalizedMultiplier * (0.8 + Math.random() * 0.4));
      const qualified = Math.round(discovered * (0.4 + Math.random() * 0.2));
      const engaged = Math.round(qualified * (0.4 + Math.random() * 0.2));
      const booked = Math.round(engaged * (0.3 + Math.random() * 0.2));

      setData({
        discovered,
        qualified,
        engaged,
        booked
      });
      setLoading(false);
    }, 800);
    
  }, [filters]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Funnel Overview</CardTitle>
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
          <CardTitle>Funnel Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load funnel data: {error}</p>
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

  // Calculate conversion rates
  const getConversionRate = (current: number, previous: number): number => {
    return previous ? Math.round((current / previous) * 100) : 0;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {data && (
          <div className="space-y-5">
            <div className="flex flex-col space-y-4">
              {/* Leads Discovered */}
              <div className="relative">
                <div 
                  className="h-10 rounded-md flex items-center px-4"
                  style={{ 
                    backgroundColor: COLORS.primary,
                    color: COLORS.neutralLight
                  }}
                >
                  <span className="font-medium">Leads Discovered</span>
                  <span className="ml-auto font-bold">{data.discovered.toLocaleString()}</span>
                </div>
                <div className="h-6"></div>
              </div>
              
              {/* Qualified */}
              <div className="relative">
                <div 
                  className="h-10 rounded-md flex items-center px-4"
                  style={{ 
                    width: `${getConversionRate(data.qualified, data.discovered)}%`,
                    backgroundColor: COLORS.success,
                    color: COLORS.neutralDark
                  }}
                >
                  <span className="font-medium">Qualified</span>
                  <span className="ml-auto font-bold">{data.qualified.toLocaleString()}</span>
                </div>
                <div 
                  className="absolute right-0 top-2 text-xs"
                  style={{ color: COLORS.success }}
                >
                  {getConversionRate(data.qualified, data.discovered)}%
                </div>
                <div className="h-6"></div>
              </div>
              
              {/* Engaged */}
              <div className="relative">
                <div 
                  className="h-10 rounded-md flex items-center px-4"
                  style={{ 
                    width: `${getConversionRate(data.engaged, data.qualified)}%`,
                    backgroundColor: COLORS.warning,
                    color: COLORS.neutralDark
                  }}
                >
                  <span className="font-medium">Engaged</span>
                  <span className="ml-auto font-bold">{data.engaged.toLocaleString()}</span>
                </div>
                <div 
                  className="absolute right-0 top-2 text-xs"
                  style={{ color: COLORS.warning }}
                >
                  {getConversionRate(data.engaged, data.qualified)}%
                </div>
                <div className="h-6"></div>
              </div>
              
              {/* Appointments Booked */}
              <div className="relative">
                <div 
                  className="h-10 rounded-md flex items-center px-4"
                  style={{ 
                    width: `${getConversionRate(data.booked, data.engaged)}%`,
                    backgroundColor: COLORS.secondary,
                    color: COLORS.neutralLight
                  }}
                >
                  <span className="font-medium">Appointments Booked</span>
                  <span className="ml-auto font-bold">{data.booked.toLocaleString()}</span>
                </div>
                <div 
                  className="absolute right-0 top-2 text-xs"
                  style={{ color: COLORS.secondary }}
                >
                  {getConversionRate(data.booked, data.engaged)}%
                </div>
              </div>
            </div>
            
            <div className="text-sm text-muted-foreground mt-4">
              <div className="flex justify-between">
                <span>Overall Conversion: <span className="font-medium" style={{ color: COLORS.primary }}>{getConversionRate(data.booked, data.discovered)}%</span></span>
                <span>Last updated: {new Date().toLocaleTimeString()}</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FunnelOverview;
