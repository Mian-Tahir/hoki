import React, { useState, useEffect } from 'react';
import Layout from '../components/layout/Layout';
import KpiCard from '../components/overview/KpiCard';
import ChannelCard from '../components/overview/ChannelCard';
import Timeline from '../components/overview/Timeline';
import QuickActions from '../components/overview/QuickActions';
import { Users, BarChart3, Mail, Linkedin, MessageSquare, Phone } from 'lucide-react';
import { getLeadsCountToday } from '../components/AirtableExample';
import { getCampaignStats } from '../components/CampaignStats';

const Overview: React.FC = () => {
  const [channelStatus, setChannelStatus] = useState({
    email: true,
    linkedin: true,
    sms: false,
    calls: true
  });
  const [leadsCount, setLeadsCount] = useState<string>("0");
  const [engagementStats, setEngagementStats] = useState({
    percentage: "0",
    change: { value: "0%", positive: true }
  });

  useEffect(() => {
    const fetchData = async () => {
      const [count, stats] = await Promise.all([
        getLeadsCountToday(),
        getCampaignStats()
      ]);
      
      setLeadsCount(count.toString());
      
      // Calculate engagement change (mock data for now)
      const previousEngagement = 25; // This would come from historical data
      const currentEngagement = stats.average_engagement;
      const change = ((currentEngagement - previousEngagement) / previousEngagement) * 100;
      
      setEngagementStats({
        percentage: stats.average_engagement.toFixed(1),
        change: {
          value: `${Math.abs(change).toFixed(1)}%`,
          positive: change >= 0
        }
      });
    };

    fetchData();
    // Refresh the data every 5 minutes
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleChannel = (channel: keyof typeof channelStatus) => {
    setChannelStatus(prev => ({
      ...prev,
      [channel]: !prev[channel]
    }));
  };

  return (
    <Layout title="Overview" subtitle="Real-time dashboard of all your outreach activities">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <KpiCard 
          title="Leads Discovered Today" 
          value={leadsCount}
          change={{ value: "12%", positive: true }}
          icon={<Users size={20} className="text-primary" />}
        />
        <KpiCard 
          title="Qualified Leads %" 
          value="32%" 
          change={{ value: "5%", positive: true }}
          icon={<Users size={20} className="text-primary" />}
        />
        <KpiCard 
          title="Overall Engagement %" 
          value={`${engagementStats.percentage}%`}
          change={engagementStats.change}
          icon={<BarChart3 size={20} className="text-primary" />}
        />
        <KpiCard 
          title="Appointments Booked" 
          value="18" 
          change={{ value: "2%", positive: false }}
          icon={<BarChart3 size={20} className="text-primary" />}
        />
        <KpiCard 
          title="Calls Completed" 
          value="43" 
          change={{ value: "15%", positive: true }}
          icon={<Phone size={20} className="text-primary" />}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <ChannelCard 
          channel="email"
          title="Instantly Campaigns"
          metrics={{ 
            active: 245,  // Lower value
            planned: 3245,  // Higher value
            avgConv: 28,  // Percentage based on active
            Converstions: 0,
            Avg_Call_Time: 0,
            No_of_Minutes: 0
          }}
          active={channelStatus.email}
          onToggle={() => toggleChannel('email')}
          icon={<Mail size={20} />}
        />
        <ChannelCard 
          channel="linkedin"
          title="LinkedIn Campaign"
          metrics={{ 
            active: 143,  // Lower value
            planned: 1243,  // Higher value
            avgConv: 32,  // Percentage based on active
            Converstions: 0,
            Avg_Call_Time: 0,
            No_of_Minutes: 0
          }}
          active={channelStatus.linkedin}
          onToggle={() => toggleChannel('linkedin')}
          icon={<Linkedin size={20} />}
        />
        <ChannelCard 
          channel="sms"
          title="SMS Follow-ups"
          metrics={{ 
            active: 62,  // Lower value
            planned: 562,  // Higher value
            avgConv: 45,  // Percentage based on active
            Converstions: 0,
            Avg_Call_Time: 0,
            No_of_Minutes: 0
          }}
          active={channelStatus.sms}
          onToggle={() => toggleChannel('sms')}
          icon={<MessageSquare size={20} />}
        />
        <ChannelCard 
          channel="calls"
          title="AI Calling"
          metrics={{ 
            active: 0,
            planned: 0,
            avgConv: 0,
            Converstions: 45,  // Number of successful conversions
            Avg_Call_Time: 1.5, // Average call time in minutes
            No_of_Minutes: 156  // Total minutes of calls
          }}
          active={channelStatus.calls}
          onToggle={() => toggleChannel('calls')}
          icon={<Phone size={20} />}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Timeline />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>
    </Layout>
  );
};

export default Overview;
