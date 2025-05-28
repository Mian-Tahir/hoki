
import React from 'react';
import { Search, Filter } from 'lucide-react';

interface CampaignFiltersProps {
  onFilterChange: (filters: any) => void;
}

const CampaignFilters: React.FC<CampaignFiltersProps> = ({ onFilterChange }) => {
  return (
    <div className="mb-6 flex flex-col md:flex-row gap-4">
      <div className="relative flex-grow">
        <input
          type="text"
          placeholder="Search campaigns..."
          className="pl-10 pr-4 py-2 w-full border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
        />
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-dark/50" />
      </div>
      
      <div className="flex gap-3">
        <select className="px-3 py-2 border border-gray-200 rounded-md">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="paused">Paused</option>
          <option value="completed">Completed</option>
          <option value="draft">Draft</option>
        </select>
        
        <select className="px-3 py-2 border border-gray-200 rounded-md">
          <option value="">All Channels</option>
          <option value="email">Email</option>
          <option value="linkedin">LinkedIn</option>
          <option value="sms">SMS</option>
          <option value="calls">Calls</option>
        </select>
        
        <button className="px-3 py-2 border border-gray-200 rounded-md flex items-center">
          <Filter size={16} className="mr-2" />
          More Filters
        </button>
      </div>
    </div>
  );
};

export default CampaignFilters;
