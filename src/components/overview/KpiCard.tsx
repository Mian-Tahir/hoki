
import React from 'react';
import Card from '../common/Card';
import { ArrowDown, ArrowUp } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string | number;
    positive: boolean;
  };
  icon: React.ReactNode;
  color?: string;
}

const KpiCard: React.FC<KpiCardProps> = ({ title, value, change, icon, color = 'primary' }) => {
  return (
    <Card className="flex items-start justify-between">
      <div>
        <h3 className="text-sm font-medium text-neutral-dark/70">{title}</h3>
        <p className={`text-2xl font-semibold mt-1 text-${color}`}>{value}</p>
        {change && (
          <div className="flex items-center mt-1">
            <span 
              className={`text-xs font-medium flex items-center ${
                change.positive ? 'text-success' : 'text-error'
              }`}
            >
              {change.positive ? 
                <ArrowUp size={12} className="mr-1" /> : 
                <ArrowDown size={12} className="mr-1" />
              }
              {change.value}
            </span>
            <span className="text-xs text-neutral-dark/50 ml-1">vs last week</span>
          </div>
        )}
      </div>
      <div className={`p-2 rounded-md bg-${color}/10`}>
        {icon}
      </div>
    </Card>
  );
};

export default KpiCard;
