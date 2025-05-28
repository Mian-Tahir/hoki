
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Settings, 
  Grid3X3,
  UserRound,
  PanelLeft,
  Bot,
  Home,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

const Sidebar = () => {
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { path: '/', name: 'Overview', icon: <Home size={20} /> },
    { path: '/campaigns', name: 'Campaign Studio', icon: <Grid3X3 size={20} /> },
    { path: '/leads', name: 'Leads Explorer', icon: <UserRound size={20} /> },
    { path: '/agent', name: 'Agent Control', icon: <Bot size={20} /> },
    { path: '/analytics', name: 'Analytics', icon: <BarChart3 size={20} /> },
    { path: '/settings', name: 'Settings', icon: <Settings size={20} /> },
  ];

  return (
    <div className={`bg-white border-r border-gray-200 h-screen sticky top-0 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      <div className="px-4 py-5 flex items-center justify-between border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center">
            <span className="font-bold text-lg text-neutral-dark">HOKI</span>
            <span className="ml-2 text-xs text-neutral-dark/70">Business Agent</span>
          </div>
        )}
        {collapsed && <div className="mx-auto font-bold text-lg text-primary">H</div>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="text-neutral-dark/70 hover:text-primary p-1 rounded"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>
      
      <nav className="py-4">
        <ul className="space-y-1 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`sidebar-item ${location.pathname === item.path ? 'active' : ''} ${collapsed ? 'justify-center' : ''}`}
              >
                <span className={location.pathname === item.path ? 'text-primary' : 'text-neutral-dark/70'}>
                  {item.icon}
                </span>
                {!collapsed && <span>{item.name}</span>}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="absolute bottom-0 w-full border-t border-gray-200 p-4">
        {!collapsed && (
          <div className="flex items-center">
            <div className="w-8 h-8 rounded-full bg-neutral-dark/10 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-dark">JD</span>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-neutral-dark">John Doe</p>
              <p className="text-xs text-neutral-dark/70">Admin</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="flex justify-center">
            <div className="w-8 h-8 rounded-full bg-neutral-dark/10 flex items-center justify-center">
              <span className="text-sm font-medium text-neutral-dark">JD</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
