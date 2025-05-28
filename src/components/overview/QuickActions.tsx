
import React, { useState } from 'react';
import Card from '../common/Card';
import { PauseCircle, PlayCircle, Plus, Settings } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

const QuickActions: React.FC = () => {
  const [allPaused, setAllPaused] = useState(false);
  const [agentStatus, setAgentStatus] = useState<'active' | 'maintenance' | 'offline'>('active');

  return (
    <Card className="space-y-6">
      <div>
        <h2 className="font-semibold text-neutral-dark mb-4">Quick Actions</h2>
        
        <Dialog>
          <DialogTrigger asChild>
            <button className="w-full py-3 px-4 bg-secondary text-white rounded-md font-medium flex items-center justify-center">
              <Plus size={18} className="mr-2" />
              New Campaign
            </button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-200 rounded-md"
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Target Audience</label>
                  <select className="w-full p-2 border border-gray-200 rounded-md">
                    <option>Select audience</option>
                    <option>Decision Makers</option>
                    <option>Tech Leaders</option>
                    <option>HR Professionals</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-dark mb-1">Channels</label>
                  <div className="flex space-x-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-primary" />
                      <span>Email</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-primary" />
                      <span>LinkedIn</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-primary" />
                      <span>SMS</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded text-primary" />
                      <span>Calls</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex justify-end space-x-3">
              <Button variant="outline">Cancel</Button>
              <Button className="bg-primary text-white">Create Campaign</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-neutral-dark/70 mb-2">Global Controls</h3>
        <button
          onClick={() => setAllPaused(!allPaused)}
          className={`w-full py-2 px-4 rounded-md font-medium flex items-center justify-center mb-3 ${
            allPaused 
              ? 'bg-success/20 text-success'
              : 'bg-error/20 text-error'
          }`}
        >
          {allPaused ? (
            <>
              <PlayCircle size={18} className="mr-2" />
              Resume All Campaigns
            </>
          ) : (
            <>
              <PauseCircle size={18} className="mr-2" />
              Pause All Campaigns
            </>
          )}
        </button>
      </div>
      
      <div>
        <h3 className="text-sm font-medium text-neutral-dark/70 mb-2">Agent Status</h3>
        <select
          value={agentStatus}
          onChange={(e) => setAgentStatus(e.target.value as 'active' | 'maintenance' | 'offline')}
          className="w-full p-2 border border-gray-200 rounded-md"
        >
          <option value="active">Active - Running All Tasks</option>
          <option value="maintenance">Maintenance - Essential Tasks Only</option>
          <option value="offline">Offline - Paused All Tasks</option>
        </select>
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button className="text-primary font-medium flex items-center text-sm">
          <Settings size={16} className="mr-2" />
          Advanced Settings
        </button>
      </div>
    </Card>
  );
};

export default QuickActions;
