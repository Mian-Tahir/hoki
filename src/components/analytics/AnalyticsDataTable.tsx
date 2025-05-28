import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Download } from 'lucide-react';
import Spinner from '@/components/common/Spinner';

interface AnalyticsEvent {
  id: string;
  timestamp: string;
  event: string;
  channel: string;
  icp: string;
  campaign: string;
  value: string | number;
}

interface AnalyticsDataTableProps {
  filters: {
    campaigns: string[];
    channels: string[];
    icps: string[];
    dateRange: { start: Date; end: Date };
  };
}

const AnalyticsDataTable: React.FC<AnalyticsDataTableProps> = ({ filters }) => {
  const [data, setData] = useState<AnalyticsEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
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
    queryParams.append('page', page.toString());
    queryParams.append('limit', '10');
    
    console.log(`GET /api/analytics/data?${queryParams.toString()}`);
    
    // Simulate API call
    setTimeout(() => {
      // Mock data
      setData([
        { id: '1', timestamp: '2025-05-19 09:30:22', event: 'Lead Discovery', channel: 'LinkedIn', icp: 'SaaS', campaign: 'Q2 Outreach', value: '1 lead' },
        { id: '2', timestamp: '2025-05-19 10:15:45', event: 'Email Sent', channel: 'Email', icp: 'Financial', campaign: 'New Product Launch', value: '25 emails' },
        { id: '3', timestamp: '2025-05-19 11:22:18', event: 'SMS Response', channel: 'SMS', icp: 'Insurance', campaign: 'Enterprise Accounts', value: '3 replies' },
        { id: '4', timestamp: '2025-05-19 13:05:33', event: 'Call Booked', channel: 'Call', icp: 'SaaS', campaign: 'Q2 Outreach', value: '1 appointment' },
        { id: '5', timestamp: '2025-05-19 14:18:57', event: 'Lead Qualified', channel: 'LinkedIn', icp: 'Financial', campaign: 'New Product Launch', value: '5 leads' },
        { id: '6', timestamp: '2025-05-19 15:30:22', event: 'Email Opened', channel: 'Email', icp: 'SaaS', campaign: 'Q2 Outreach', value: '18 opens' },
        { id: '7', timestamp: '2025-05-19 16:42:11', event: 'SMS Sent', channel: 'SMS', icp: 'Insurance', campaign: 'Enterprise Accounts', value: '12 messages' }
      ]);
      setTotalPages(4); // Mock total pages
      setLoading(false);
    }, 1200);
  }, [filters, page]);

  const handleExport = (format: 'csv' | 'pdf') => {
    // Build query params from filters
    const queryParams = new URLSearchParams();
    filters.campaigns.forEach(campaign => queryParams.append('campaign', campaign));
    filters.channels.forEach(channel => queryParams.append('channel', channel));
    filters.icps.forEach(icp => queryParams.append('icp', icp));
    queryParams.append('startDate', filters.dateRange.start.toISOString());
    queryParams.append('endDate', filters.dateRange.end.toISOString());
    queryParams.append('format', format);
    
    console.log(`GET /api/analytics/export?${queryParams.toString()}`);
    
    // In a real app, this would trigger a file download
    alert(`Exporting data in ${format.toUpperCase()} format`);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Events Table</CardTitle>
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
          <CardTitle>Events Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-red-50 p-4 rounded-md text-red-800">
            <p>Failed to load data: {error}</p>
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
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Events Table</CardTitle>
        <div className="flex space-x-2">
          <button 
            onClick={() => handleExport('csv')}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-md text-xs hover:bg-blue-100"
            title="Export as CSV"
          >
            <Download className="h-3 w-3" />
            <span>CSV</span>
          </button>
          <button 
            onClick={() => handleExport('pdf')}
            className="inline-flex items-center space-x-1 px-3 py-1 bg-red-50 text-red-700 rounded-md text-xs hover:bg-red-100"
            title="Export as PDF"
          >
            <Download className="h-3 w-3" />
            <span>PDF</span>
          </button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Timestamp</TableHead>
              <TableHead>Event</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>ICP</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((event) => (
              <TableRow key={event.id}>
                <TableCell className="whitespace-nowrap">{event.timestamp}</TableCell>
                <TableCell>{event.event}</TableCell>
                <TableCell>{event.channel}</TableCell>
                <TableCell>{event.icp}</TableCell>
                <TableCell>{event.campaign}</TableCell>
                <TableCell>{event.value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        
        {/* Pagination */}
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <div className="space-x-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1 text-xs rounded-md bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1 text-xs rounded-md bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalyticsDataTable;
