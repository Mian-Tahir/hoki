import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import AnalyticsFilterBar from '@/components/analytics/AnalyticsFilterBar';
import FunnelOverview from '@/components/analytics/FunnelOverview';
import ChannelComparison from '@/components/analytics/ChannelComparison';
import IcpPerformance from '@/components/analytics/IcpPerformance';
import TimeSeriesTrends from '@/components/analytics/TimeSeriesTrends';
import AgentUtilization from '@/components/analytics/AgentUtilization';
import AnalyticsDataTable from '@/components/analytics/AnalyticsDataTable';
import ScheduleReportButton from '@/components/analytics/ScheduleReportButton';
import Spinner from '@/components/common/Spinner';
import Layout from '../components/layout/Layout';

const Analytics: React.FC = () => {
  const [filters, setFilters] = useState({
    campaigns: [],
    channels: [],
    icps: [],
    dateRange: { start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), end: new Date() }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFilterChange = (newFilters: any) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (
    <Layout title="Analytics Dashboard" subtitle="Comprehensive campaign and performance metrics">
      <div className="p-6 space-y-6">
        {/* Global Filter Bar */}
        <AnalyticsFilterBar onChange={handleFilterChange} />
        
        {/* Top Row: Funnel and Channel Comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FunnelOverview filters={filters} />
          <ChannelComparison filters={filters} />
        </div>
        
        {/* Middle Row: ICP Performance and Time Series */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <IcpPerformance filters={filters} />
          <TimeSeriesTrends filters={filters} />
        </div>
        
        {/* Bottom Row: Agent Utilization and Data Table */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AgentUtilization filters={filters} />
          <AnalyticsDataTable filters={filters} />
        </div>
        
        {/* Report Scheduling */}
        <div className="flex justify-end mt-8">
          <ScheduleReportButton />
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
