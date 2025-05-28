import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import Badge from '../components/common/Badge';
import { Bot, AlertCircle, CheckCircle2, RefreshCw, Save, Settings, Mail, Linkedin, MessageSquare, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Agent: React.FC = () => {
  const [agentActive, setAgentActive] = useState(true);
  const [processingMode, setProcessingMode] = useState<'automatic' | 'manual'>('automatic');
  const [selectedSetting, setSelectedSetting] = useState<string | null>(null);
  
  const settingsCards = [
    {
      id: 'email-outreach',
      title: ' Cold Email Agent',
      icon: Mail,
      description: 'Manage email templates and sequences'
    },
    {
      id: 'linkedin-campaign',
      title: 'LinkedIn Agent',
      icon: Linkedin,
      description: 'Set up LinkedIn connection strategies'
    },
    {
      id: 'sms-followups',
      title: 'SMS  Agent',
      icon: MessageSquare,
      description: 'Configure SMS messaging rules'
    },
    {
      id: 'ai-calling',
      title: 'AI Calling Agent',
      icon: Phone,
      description: 'Manage AI calling parameters'
    }
  ];

  const renderSettingsContent = (settingId: string) => {
    switch(settingId) {
      case 'email-outreach':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Daily Email Limit</label>
              <input type="number" className="w-full border border-gray-200 rounded-md p-2" placeholder="Enter daily limit" />
            </div>
            <div>
              <label className="block text-sm mb-1">Email Template Style</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Formal Business</option>
                <option>Personal Touch</option>
                <option>Value Proposition</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Follow-up Sequence</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>3-Step Sequence</option>
                <option>5-Step Sequence</option>
                <option>7-Step Sequence</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Bounce Rate Threshold</label>
              <input type="number" className="w-full border border-gray-200 rounded-md p-2" placeholder="Enter percentage" />
            </div>
          </div>
        );

      case 'linkedin-campaign':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Connection Requests per Day</label>
              <input type="number" className="w-full border border-gray-200 rounded-md p-2" placeholder="Enter daily limit" />
            </div>
            <div>
              <label className="block text-sm mb-1">Target Audience</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Industry Leaders</option>
                <option>Decision Makers</option>
                <option>Potential Clients</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Personalization Level</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>High (Full Custom)</option>
                <option>Medium (Semi-Custom)</option>
                <option>Low (Template)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Engagement Strategy</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Direct Outreach</option>
                <option>Content Sharing</option>
                <option>Comment Engagement</option>
                <option>Mixed Approach</option>
              </select>
            </div>
          </div>
        );

      case 'sms-followups':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Messages per Day</label>
              <input type="number" className="w-full border border-gray-200 rounded-md p-2" placeholder="Enter daily limit" />
            </div>
            <div>
              <label className="block text-sm mb-1">Message Length</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Short (160 chars)</option>
                <option>Medium (320 chars)</option>
                <option>Long (480 chars)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Response Window</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>1 hour</option>
                <option>2 hours</option>
                <option>4 hours</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Opt-out Keywords</label>
              <input type="text" className="w-full border border-gray-200 rounded-md p-2" placeholder="STOP, CANCEL, etc." />
            </div>
          </div>
        );

      case 'ai-calling':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm mb-1">Calls per Day</label>
              <input type="number" className="w-full border border-gray-200 rounded-md p-2" placeholder="Enter daily limit" />
            </div>
            <div>
              <label className="block text-sm mb-1">Call Duration</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Short (2-3 mins)</option>
                <option>Medium (5-7 mins)</option>
                <option>Long (10-15 mins)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Voice Style</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Professional</option>
                <option>Friendly</option>
                <option>Enthusiastic</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Call Scheduling</label>
              <select className="w-full border border-gray-200 rounded-md p-2">
                <option>Business Hours Only</option>
                <option>Extended Hours</option>
                <option>Time Zone Based</option>
                <option>Custom</option>
              </select>
            </div>
            <div>
              <label className="block text-sm mb-1">Call Recording</label>
              <div className="flex items-center space-x-2">
                <Switch />
                <span className="text-sm">Enable call recording and analysis</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout title="Agent Control Center" subtitle="Manage your AI assistant's behavior and monitor performance">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-neutral-dark">Agent Status</h3>
            </div>
            <div className="p-2 bg-primary/10 rounded-full">
              <Bot size={20} className="text-primary" />
            </div>
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span>Active</span>
            <Switch 
              checked={agentActive} 
              onCheckedChange={setAgentActive} 
              className={agentActive ? "bg-success" : ""} 
            />
          </div>
          
          <div className="flex justify-between items-center mb-6">
            <span>Processing Mode</span>
            <div className="flex space-x-2">
              <button 
                className={`px-3 py-1 text-sm rounded ${processingMode === 'automatic' ? 'bg-primary text-white' : 'bg-neutral-light'}`}
                onClick={() => setProcessingMode('automatic')}
              >
                Automatic
              </button>
              <button 
                className={`px-3 py-1 text-sm rounded ${processingMode === 'manual' ? 'bg-primary text-white' : 'bg-neutral-light'}`}
                onClick={() => setProcessingMode('manual')}
              >
                Manual
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-100 pt-4">
            <p className="text-sm text-neutral-dark/70">Last health check: 5 minutes ago</p>
            <p className="text-sm text-success flex items-center mt-1">
              <CheckCircle2 size={14} className="mr-1" /> All systems operational
            </p>
          </div>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Current Tasks</h3>
          <ul className="space-y-3">
            <li className="flex justify-between items-center p-2 bg-channel-email/10 rounded">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-success rounded-full mr-2"></div>
                <span className="text-sm">Processing email responses</span>
              </div>
              <Badge variant="success">Active</Badge>
            </li>
            <li className="flex justify-between items-center p-2 bg-channel-linkedin/10 rounded">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-warning rounded-full mr-2"></div>
                <span className="text-sm">LinkedIn connection requests</span>
              </div>
              <Badge variant="warning">Pending</Badge>
            </li>
            <li className="flex justify-between items-center p-2 bg-channel-sms/10 rounded">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-neutral-dark rounded-full mr-2"></div>
                <span className="text-sm">SMS follow-ups</span>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </li>
            <li className="flex justify-between items-center p-2 bg-channel-calls/10 rounded">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-neutral-dark rounded-full mr-2"></div>
                <span className="text-sm">Call planning</span>
              </div>
              <Badge variant="secondary">Scheduled</Badge>
            </li>
          </ul>
        </Card>
        
        <Card>
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Agent Health</h3>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>API Rate Limits</span>
                <span className="text-success">85%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-success h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Error Rate</span>
                <span className="text-success">2.3%</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-success h-full rounded-full" style={{ width: '2.3%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Response Time</span>
                <span className="text-warning">462ms</span>
              </div>
              <div className="w-full bg-gray-200 h-2 rounded-full">
                <div className="bg-warning h-full rounded-full" style={{ width: '46.2%' }}></div>
              </div>
            </div>
            
            <div className="pt-2">
              <Button variant="outline" size="sm" className="w-full flex items-center justify-center">
                <RefreshCw size={14} className="mr-2" />
                Run Diagnostics
              </Button>
            </div>
          </div>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* <Card>
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Recent Errors</h3>
          
          <div className="space-y-3">
            <div className="p-3 bg-error/10 rounded-lg border border-error/20">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-error mr-2" />
                <h4 className="text-sm font-medium text-error">LinkedIn API Rate Limit</h4>
              </div>
              <p className="mt-1 text-xs text-neutral-dark/70">Occurred 2 hours ago</p>
              <p className="mt-2 text-sm">Too many connection requests sent within timeframe</p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">Resolve</Button>
              </div>
            </div>
            
            <div className="p-3 bg-neutral-light rounded-lg border border-neutral-dark/10">
              <div className="flex items-center">
                <AlertCircle size={16} className="text-neutral-dark/70 mr-2" />
                <h4 className="text-sm font-medium">Email Deliverability Warning</h4>
              </div>
              <p className="mt-1 text-xs text-neutral-dark/70">Occurred 1 day ago</p>
              <p className="mt-2 text-sm">Bounce rate increased above threshold (5.2%)</p>
              <div className="mt-3 flex justify-end">
                <Button variant="outline" size="sm">Resolve</Button>
              </div>
            </div>
          </div>
          
          <div className="mt-4 pt-3 border-t border-gray-100 text-center">
            <Button variant="link" size="sm">View All Errors</Button>
          </div>
        </Card> */}
        
        {/* Settings Cards Section */}
        <Card>
          <h3 className="text-lg font-semibold text-neutral-dark mb-4">Quick Settings Access</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {settingsCards.map((card) => (
              <button
                key={card.id}
                onClick={() => setSelectedSetting(card.id)}
                className="p-12 bg-neutral-light hover:bg-neutral-light/80 rounded-lg text-left transition-all border-2 border-transparent hover:border-primary relative group"
              >
                <div className="flex items-start space-x-6">
                  <div className="p-3 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <card.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-lg text-neutral-dark mb-2">{card.title}</h4>
                    <p className="text-sm text-neutral-dark/70">{card.description}</p>
                  </div>
                </div>
                <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="text-primary">
                    Configure →
                  </div>
                </div>
              </button>
            ))}
          </div>
        </Card>

        {/* Settings Modal */}
        <Dialog open={!!selectedSetting} onOpenChange={() => setSelectedSetting(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {settingsCards.find(card => card.id === selectedSetting)?.title || 'Settings'}
              </DialogTitle>
            </DialogHeader>
            <div className="mt-4">
              {selectedSetting && renderSettingsContent(selectedSetting)}
            </div>
            <div className="mt-6 flex justify-end">
              <Button 
                className="bg-primary text-white flex items-center"
                onClick={() => setSelectedSetting(null)}
              >
                <Save size={16} className="mr-2" />
                Save Changes
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
};

export default Agent;
