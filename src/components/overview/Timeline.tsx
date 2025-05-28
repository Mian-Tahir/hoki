import React, { useEffect, useState, useRef } from 'react';
import TimelineEvent from './TimelineEvent';
import Spinner from '../common/Spinner';

interface Event {
  id: string;
  type: 'email' | 'linkedin' | 'sms' | 'calls';
  message: string;
  time: string;
  status?: 'success' | 'warning' | 'info' | 'error';
}

interface EventTemplate {
  message: string;
  status?: 'success' | 'warning' | 'info' | 'error';
}

const Timeline: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);

  // Separate events by type for better distribution
  const eventsByType: Record<Event['type'], EventTemplate[]> = {
    email: [
      { message: 'Follow-up email sent to John Smith', status: 'success' },
      { message: 'Campaign email sent to 500 contacts', status: 'info' },
      { message: 'Newsletter opened by 45% recipients', status: 'success' },
      { message: 'Email bounced: invalid address', status: 'error' },
      { message: 'Meeting confirmation sent to 30 leads', status: 'info' },
      { message: 'Follow-up sequence started for 100 leads', status: 'success' },
      { message: 'Email opened by Marketing Director', status: 'info' },
      { message: 'Email delivery failed to 5 recipients', status: 'error' }
    ],
    linkedin: [
      { message: 'Connection request sent to Sarah Davis', status: 'info' },
      { message: 'Profile viewed by CTO', status: 'info' },
      { message: 'Connection accepted by Tech Lead', status: 'success' },
      { message: 'Message replied by Sarah Miller', status: 'success' },
      { message: 'Connection request sent to Industry Expert', status: 'info' },
      { message: 'Profile viewed by HR Director', status: 'info' },
      { message: 'New connection from Sales Manager', status: 'success' },
      { message: 'Message sent to 50 connections', status: 'info' }
    ],
    calls: [
      { message: 'Call scheduled with Mike Johnson', status: 'info' },
      { message: 'Call completed with Marketing Director', status: 'success' },
      { message: 'Voicemail left for Sales Manager', status: 'warning' },
      { message: 'Call scheduled with HR Director', status: 'info' },
      { message: 'Call rescheduled with Product Manager', status: 'warning' },
      { message: 'New lead discovered: Alex Thompson', status: 'success' },
      { message: 'Call duration: 15 minutes', status: 'info' },
      { message: 'Missed call from Tech Lead', status: 'warning' }
    ],
    sms: [
      { message: 'SMS reminder sent to David Wilson', status: 'success' },
      { message: 'Bulk SMS sent to 200 leads', status: 'info' },
      { message: 'Appointment reminder sent to 50 leads', status: 'info' },
      { message: 'Welcome message sent to new leads', status: 'success' },
      { message: 'Event reminder sent to 200 contacts', status: 'info' },
      { message: 'SMS delivery failed to +1234567890', status: 'error' },
      { message: 'SMS replied by 30 recipients', status: 'success' },
      { message: 'SMS sent to VIP clients', status: 'info' }
    ]
  };

  // Function to get a random event of a specific type
  const getRandomEventOfType = (type: Event['type']): Event => {
    const typeEvents = eventsByType[type];
    const randomEvent = typeEvents[Math.floor(Math.random() * typeEvents.length)];
    return {
      id: Math.random().toString(36).substr(2, 9),
      type,
      message: randomEvent.message,
      status: randomEvent.status,
      time: 'Just now'
    };
  };

  // Function to generate a set of events with good type distribution
  const generateDiverseEvents = (count: number): Event[] => {
    const types: Event['type'][] = ['email', 'linkedin', 'sms', 'calls'];
    const events: Event[] = [];
    let lastType: Event['type'] | null = null;

    while (events.length < count) {
      // Filter out the last used type to avoid repetition
      const availableTypes = types.filter(type => type !== lastType);
      const randomType = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      
      events.push(getRandomEventOfType(randomType));
      lastType = randomType;
    }

    return events;
  };

  // Function to update event times
  const updateEventTimes = (currentEvents: Event[]): Event[] => {
    return currentEvents.map(event => {
      const timeMap: { [key: string]: string } = {
        'Just now': '1 min ago',
        '1 min ago': '2 mins ago',
        '2 mins ago': '3 mins ago',
        '3 mins ago': '4 mins ago',
        '4 mins ago': '5 mins ago',
        '5 mins ago': '6 mins ago',
        '6 mins ago': '7 mins ago',
        '7 mins ago': '8 mins ago',
        '8 mins ago': '9 mins ago',
        '9 mins ago': '10 mins ago'
      };
      return {
        ...event,
        time: timeMap[event.time] || event.time
      };
    });
  };

  // Function to handle continuous scrolling
  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
      if (scrollTop + clientHeight >= scrollHeight - 50) {
        setEvents(prevEvents => {
          const updatedEvents = updateEventTimes(prevEvents);
          const newEvents = generateDiverseEvents(2);
          return [...updatedEvents.slice(2), ...newEvents];
        });
        scrollRef.current.scrollTop = 0;
      }
    }
  };

  useEffect(() => {
    // Initial load with 10 diverse events
    setEvents(generateDiverseEvents(25));
    setLoading(false);

    // Set up continuous scrolling
    const scrollInterval = setInterval(() => {
      if (scrollRef.current) {
        scrollRef.current.scrollTop += 1;
      }
    }, 70);

    // Update events every 10 seconds
    const updateInterval = setInterval(() => {
      setEvents(prevEvents => {
        const updatedEvents = updateEventTimes(prevEvents);
        const newEvents = generateDiverseEvents(2);
        return [...updatedEvents.slice(2), ...newEvents];
      });
    }, 1000);

    return () => {
      clearInterval(scrollInterval);
      clearInterval(updateInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-10">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm h-[calc(100vh-13rem)]">
      <div className="p-4 border-b border-gray-200">
        <h2 className="font-semibold text-neutral-dark">Global Timeline</h2>
        <p className="text-sm text-neutral-dark/70">Real-time activity across all channels</p>
      </div>
      <div 
        ref={scrollRef}
        onScroll={handleScroll}
        className="relative h-[calc(100%-4rem)] overflow-hidden"
      >
        <div 
          className="absolute w-full"
          style={{
            animation: 'scroll 30s linear infinite'
          }}
        >
          {events.map((event) => (
            <TimelineEvent 
              key={event.id}
              type={event.type}
              message={event.message}
              time={event.time}
              status={event.status}
            />
          ))}
        </div>
      </div>
      <style>
        {`
          @keyframes scroll {
            0% {
              transform: translateY(0);
            }
            100% {
              transform: translateY(-50%);
            }
          }
        `}
      </style>
    </div>
  );
};

export default Timeline;
