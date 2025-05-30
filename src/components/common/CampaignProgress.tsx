import React, { useEffect, useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { useCampaignProgress } from '@/store/campaignProgress'; // Import the store

interface CampaignProgressProps {
  campaignId: string;
  campaignName: string;
  totalLeads: number;
  onComplete: () => void;
}

const STATUSES = [
  { name: 'Qualifying', color: '#3B82F6' }, // blue-500
  { name: 'Enrichment', color: '#A78BFA' }, // purple-500
  { name: 'Personalization', color: '#F472B6' }, // pink-500
  { name: 'Completed', color: '#22C55E' } // green-500
];

const CampaignProgress: React.FC<CampaignProgressProps> = ({
  campaignId,
  campaignName,
  totalLeads,
  onComplete
}) => {
  const [currentStatus, setCurrentStatus] = useState(0);
  const [progress, setProgress] = useState(0);
  const SECONDS_PER_LEAD = 40;
  const totalTime = totalLeads * SECONDS_PER_LEAD * 1000;
  const statusTime = totalTime / STATUSES.length;
  
  const { startTime, isActive } = useCampaignProgress(); // Get startTime and isActive from the store
  const animationFrameRef = useRef<number>();
  const [isResuming, setIsResuming] = useState(false); // State to track if resuming

  useEffect(() => {
    console.log('CampaignProgress useEffect triggered. State:', {
      campaignId,
      campaignName,
      totalLeads,
      startTime,
      isActive,
      timestamp: new Date().toISOString()
    });

    if (!isActive || !startTime) {
      console.log('Progress is not active or startTime is null. Stopping animation.');
      setProgress(0);
      setCurrentStatus(0);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      return; // Don't start animation if not active or startTime is null
    }

    // Indicate resuming briefly
    setIsResuming(true);
    const resumeTimer = setTimeout(() => setIsResuming(false), 500); // Flash for 500ms

    const updateProgress = () => {
      const now = Date.now();
      const elapsedTime = now - startTime;
      const currentProgress = Math.min((elapsedTime / totalTime) * 100, 100);
      const currentStatusIndex = Math.min(
        Math.floor(elapsedTime / statusTime),
        STATUSES.length - 1
      );

      // Console log progress updates for debugging
      if (animationFrameRef.current === undefined || animationFrameRef.current % 60 === 0 || currentProgress === 100) { // Log roughly once per second
         console.log('Progress Update:', { 
           elapsedTime: elapsedTime / 1000, 
           currentProgress: Math.round(currentProgress), 
           currentStatus: STATUSES[currentStatusIndex].name,
           totalTime: totalTime / 1000,
           startTime: startTime
         });
      }

      setProgress(currentProgress);
      setCurrentStatus(currentStatusIndex);

      if (currentProgress < 100) {
        animationFrameRef.current = requestAnimationFrame(updateProgress);
      } else {
        console.log('Progress completed - final state:', { currentProgress: 100, currentStatus: STATUSES[STATUSES.length - 1].name });
        onComplete();
      }
    };

    console.log('Starting progress animation loop...');
     // Add a small delay before starting the animation loop after mount/state change
    const startAnimationTimer = setTimeout(() => {
       animationFrameRef.current = requestAnimationFrame(updateProgress);
    }, 50); // 50ms delay

    return () => {
      console.log('Cleaning up progress animation frame:', animationFrameRef.current);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      clearTimeout(resumeTimer); // Clean up resume timer
      clearTimeout(startAnimationTimer); // Clean up start animation timer
    };
  }, [totalTime, statusTime, onComplete, totalLeads, startTime, isActive]);

  // Calculate time remaining based on startTime
  const elapsedTime = startTime ? Date.now() - startTime : 0;
  const timeRemaining = Math.max(0, Math.ceil((totalTime - elapsedTime) / 1000));

  // Create a dynamic gradient string based on progress up to the current status
  const currentGradientColors = STATUSES
    .slice(0, currentStatus + 1)
    .map(s => s.color)
    .join(', ');

  const backgroundStyle = {
    backgroundImage: `linear-gradient(to right, ${currentGradientColors})`,
    backgroundSize: `100% 100%`,
    backgroundPosition: `0% 0%`,
    width: `${progress}%`,
  };

  return (
    <div className={cn("w-full bg-white rounded-lg p-4 shadow-sm transition-opacity duration-500", isResuming && "opacity-50")}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Processing Campaign: {campaignName}
          </h3>
          <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
            {totalLeads} lead{totalLeads !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-lg font-bold text-gray-900">
            {Math.round(progress)}%
          </span>
          <span className="text-sm text-gray-600">
            {timeRemaining}s remaining
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden mb-3">
        <div
          className="h-full transition-none ease-linear"
          style={backgroundStyle}
        />
      </div>

      {/* Status Indicators */}
      <div className="flex justify-between items-center">
        {STATUSES.map((status, index) => (
          <div
            key={status.name}
            className={cn(
              "flex flex-col items-center space-y-1",
              index <= currentStatus ? "opacity-100" : "opacity-40"
            )}
          >
            <div
              className={cn(
                "w-3 h-3 rounded-full",
                index <= currentStatus
                  ? `bg-[${status.color}]`
                  : "bg-gray-300"
              )}
            />
            <span className="text-sm font-medium text-gray-700">{status.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CampaignProgress; 