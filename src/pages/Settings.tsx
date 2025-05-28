import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import Card from '../components/common/Card';
import { Button } from '@/components/ui/button';
import { 
  Save, MailCheck, LinkedinIcon, MessageSquare, Phone, Users, Bell, Key, Shield,
  Settings2, Globe, Zap, Lock, AlertCircle, Calendar, Clock, Database, RefreshCw,
  UserPlus, UserCog, Mail, Smartphone, ShieldCheck, KeyRound, History, Activity
} from 'lucide-react';

type SettingsSection = 'channel-integrations' | 'user-management' | 'notifications' | 'api-settings';

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('channel-integrations');

  const renderSection = () => {
    switch (activeSection) {
      case 'channel-integrations':
        return (
          <section id="channel-integrations" className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Channel Integrations</h2>
            
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-channel-email/10 rounded-full">
                      <MailCheck size={20} className="text-channel-email" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Email Platform</h3>
                      <p className="text-sm text-neutral-dark/70">Connected to SMTP server</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-channel-linkedin/10 rounded-full">
                      <LinkedinIcon size={20} className="text-channel-linkedin" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">LinkedIn</h3>
                      <p className="text-sm text-neutral-dark/70">Connected via PhantomBuster</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-channel-sms/10 rounded-full">
                      <MessageSquare size={20} className="text-channel-sms" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">SMS</h3>
                      <p className="text-sm text-neutral-dark/70">Connected to Twilio</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </Card>
              
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-channel-calls/10 rounded-full">
                      <Phone size={20} className="text-channel-calls" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">AI Calling</h3>
                      <p className="text-sm text-neutral-dark/70">Connected to Vapi</p>
                    </div>
                  </div>
                  <Button variant="outline">Configure</Button>
                </div>
              </Card>

            </div>
          </section>
        );

      case 'user-management':
        return (
          <section id="user-management" className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">User Management</h2>
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Users size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Team Members</h3>
                      <p className="text-sm text-neutral-dark/70">Manage team access and permissions</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Members</Button>
                    <Button variant="outline" size="sm">Add Member</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Shield size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Roles & Permissions</h3>
                      <p className="text-sm text-neutral-dark/70">Configure access levels and roles</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Manage Roles</Button>
                    <Button variant="outline" size="sm">View Permissions</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <UserPlus size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Invitation Management</h3>
                      <p className="text-sm text-neutral-dark/70">Manage pending invitations and access requests</p>
                    </div>
                  </div>
                  <Button variant="outline">View Invitations</Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <History size={20} className="text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Activity Log</h3>
                      <p className="text-sm text-neutral-dark/70">Track user actions and system changes</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Logs</Button>
                    <Button variant="outline" size="sm">Export</Button>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        );

      case 'notifications':
        return (
          <section id="notifications" className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">Notifications</h2>
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-full">
                      <Mail size={20} className="text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-neutral-dark/70">Configure email alert preferences</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Test Email</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Smartphone size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">In-App Notifications</h3>
                      <p className="text-sm text-neutral-dark/70">Set up in-app notification preferences</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Configure</Button>
                    <Button variant="outline" size="sm">Preview</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <AlertCircle size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Alert Rules</h3>
                      <p className="text-sm text-neutral-dark/70">Set up custom alert conditions and triggers</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage Rules</Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <Calendar size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Notification Schedule</h3>
                      <p className="text-sm text-neutral-dark/70">Set quiet hours and notification timing</p>
                    </div>
                  </div>
                  <Button variant="outline">Set Schedule</Button>
                </div>
              </Card>
            </div>
          </section>
        );

      case 'api-settings':
        return (
          <section id="api-settings" className="mb-8">
            <h2 className="text-xl font-semibold text-neutral-dark mb-4">API Settings</h2>
            <div className="space-y-4">
              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-red-100 rounded-full">
                      <KeyRound size={20} className="text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">API Keys</h3>
                      <p className="text-sm text-neutral-dark/70">Manage your API keys and access tokens</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Keys</Button>
                    <Button variant="outline" size="sm">Generate New</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-orange-100 rounded-full">
                      <ShieldCheck size={20} className="text-orange-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">API Security</h3>
                      <p className="text-sm text-neutral-dark/70">Configure API security settings and restrictions</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Security Rules</Button>
                    <Button variant="outline" size="sm">IP Whitelist</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Activity size={20} className="text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Rate Limiting</h3>
                      <p className="text-sm text-neutral-dark/70">Configure API request limits and quotas</p>
                    </div>
                  </div>
                  <Button variant="outline">Set Limits</Button>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-green-100 rounded-full">
                      <Database size={20} className="text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">API Documentation</h3>
                      <p className="text-sm text-neutral-dark/70">Access API documentation and integration guides</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">View Docs</Button>
                    <Button variant="outline" size="sm">Download SDK</Button>
                  </div>
                </div>
              </Card>

              <Card>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="p-2 bg-purple-100 rounded-full">
                      <RefreshCw size={20} className="text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">API Versioning</h3>
                      <p className="text-sm text-neutral-dark/70">Manage API versions and deprecation schedules</p>
                    </div>
                  </div>
                  <Button variant="outline">Manage Versions</Button>
                </div>
              </Card>
            </div>
          </section>
        );
    }
  };

  return (
    <Layout title="Settings" subtitle="Configure your account and integration preferences">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-neutral-dark">Settings Menu</h2>
            </div>
            <ul>
              <li className="border-b border-gray-100">
                <button
                  onClick={() => setActiveSection('channel-integrations')}
                  className={`w-full text-left px-4 py-3 hover:bg-neutral-light ${
                    activeSection === 'channel-integrations' ? 'bg-neutral-light text-primary font-medium' : ''
                  }`}
                >
                  Channel Integrations
                </button>
              </li>
              <li className="border-b border-gray-100">
                <button
                  onClick={() => setActiveSection('user-management')}
                  className={`w-full text-left px-4 py-3 hover:bg-neutral-light ${
                    activeSection === 'user-management' ? 'bg-neutral-light text-primary font-medium' : ''
                  }`}
                >
                  User Management
                </button>
              </li>
              <li className="border-b border-gray-100">
                <button
                  onClick={() => setActiveSection('notifications')}
                  className={`w-full text-left px-4 py-3 hover:bg-neutral-light ${
                    activeSection === 'notifications' ? 'bg-neutral-light text-primary font-medium' : ''
                  }`}
                >
                  Notifications
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveSection('api-settings')}
                  className={`w-full text-left px-4 py-3 hover:bg-neutral-light ${
                    activeSection === 'api-settings' ? 'bg-neutral-light text-primary font-medium' : ''
                  }`}
                >
                  API Settings
                </button>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          {renderSection()}
        </div>
      </div>
    </Layout>
  );
};

export default Settings;
