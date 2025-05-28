import React from 'react';
import { Mail, MessageSquare, Phone, Linkedin } from 'lucide-react';

interface TimelineEventProps {
  type: 'email' | 'linkedin' | 'sms' | 'calls';
  message: string;
  time: string;
  status?: 'success' | 'warning' | 'info' | 'error';
  className?: string;
}

const TimelineEvent: React.FC<TimelineEventProps> = ({ type, message, time, status, className = '' }) => {
  const getIcon = () => {
    const iconProps = { size: 16 };
    
    switch (type) {
      case 'email':
        return <Mail {...iconProps} className="text-blue-600" />;
      case 'linkedin':
        return <Linkedin {...iconProps} className="text-blue-700" />;
      case 'sms':
        return <MessageSquare {...iconProps} className="text-green-600" />;
      case 'calls':
        return <Phone {...iconProps} className="text-purple-600" />;
      default:
        return null;
    }
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'email':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'linkedin':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'sms':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      case 'calls':
        return 'bg-purple-50 border-purple-200 hover:bg-purple-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getStatusStyles = () => {
    switch (status) {
      case 'success':
        return 'border-l-4 border-[#2978FF] bg-green-50/50';
      case 'warning':
        return 'border-l-4 border-yellow-500 bg-yellow-50/50';
      case 'info':
        return 'border-l-4 border-blue-500 bg-blue-50/50';
      case 'error':
        return 'border-l-4 border-orange-500 bg-orange-50/50';
      default:
        return 'border-l-4 border-gray-300';
    }
  };

  const getTimeColor = () => {
    switch (time) {
      case 'Just now':
        return 'text-[#2978FF] font-medium';
      case '1 min ago':
      case '2 mins ago':
        return 'text-blue-600';
      case '3 mins ago':
      case '4 mins ago':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className={`flex py-3 pl-4 transition-all duration-300 ${getTypeStyles()} ${getStatusStyles()} ${className}`}>
      <div className="mr-3 flex-shrink-0">
        <div className={`p-2 rounded-full bg-white shadow-sm ${!className.includes('pointer-events-none') ? 'group-hover:shadow-md' : ''} transition-all duration-300`}>
          {getIcon()}
        </div>
      </div>
      <div className="flex-grow">
        <p className={`text-sm font-medium text-gray-800 ${!className.includes('pointer-events-none') ? 'group-hover:text-gray-900' : ''} transition-colors duration-300`}>
          {message}
        </p>
        <p className={`text-xs mt-1 ${getTimeColor()} transition-colors duration-300`}>
          {time}
        </p>
      </div>
      {status && (
        <div className="ml-2 flex-shrink-0">
          <div className={`w-2 h-2 rounded-full ${
            status === 'success' ? 'bg-[#2978FF]' :
            status === 'warning' ? 'bg-yellow-500' :
            status === 'info' ? 'bg-blue-500' :
            'bg-orange-500'
          }`} />
        </div>
      )}
    </div>
  );
};

export default TimelineEvent;
