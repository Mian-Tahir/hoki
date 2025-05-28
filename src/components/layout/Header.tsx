
import React from 'react';
import { Bell, Search } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

const Header: React.FC<HeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="flex items-center justify-between py-4 px-6 border-b border-gray-200 bg-white">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-dark">{title}</h1>
        {subtitle && <p className="text-sm text-neutral-dark/60">{subtitle}</p>}
      </div>
      
      <div className="flex items-center space-x-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-neutral-dark/50" />
        </div>
        
        <button className="relative p-2 text-neutral-dark/70 hover:bg-neutral-light rounded-md">
          <Bell size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-error rounded-full"></span>
        </button>
      </div>
    </div>
  );
};

export default Header;
