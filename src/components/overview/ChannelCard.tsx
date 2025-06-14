import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { PauseCircle, PlayCircle } from 'lucide-react';

interface ChannelCardProps {
  channel: 'email' | 'linkedin' | 'sms' | 'calls';
  title: string;
  metrics: {
    // For calls channel
    Converstions: number;
    Avg_Call_Time: number;
    No_of_Minutes: number;
    // For other channels
    active: number;
    planned: number;
    avgConv: number;
  };
  active: boolean;
  onToggle: () => void;
  icon: React.ReactNode;
}

const ChannelCard: React.FC<ChannelCardProps> = ({
  channel,
  title,
  metrics,
  active,
  onToggle,
  icon
}) => {
  return (
    <Card className="relative">
      <div className="flex items-start justify-between">
        <div className="flex items-center">
          <div className={`p-2 rounded-md bg-channel-${channel}/10 text-channel-${channel}`}>
            {icon}
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-neutral-dark">{title}</h3>
            <Badge variant={channel}>{channel.toUpperCase()}</Badge>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className="text-neutral-dark/70 hover:text-primary"
        >
          {active ? <PauseCircle size={20} /> : <PlayCircle size={20} />}
        </button>
      </div>
      
      <div className="grid grid-cols-3 gap-4 mt-4">
        {channel === 'calls' ? (
          <>
            <div>
              <p className="text-xs text-neutral-dark/70">Minutes</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.No_of_Minutes}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark/70">AVG Call Time</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.Avg_Call_Time} min</p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark/70">Conversions</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.Converstions}</p>
            </div>
          </>
        ) : (
          <>
            <div>
              <p className="text-xs text-neutral-dark/70">Active</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.active}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark/70">Planned</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.planned}</p>
            </div>
            <div>
              <p className="text-xs text-neutral-dark/70">AVG Conversions</p>
              <p className="text-lg font-semibold text-neutral-dark">{metrics.avgConv}%</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
};

export default ChannelCard;
