
import React, { useState } from 'react';
import { MessageSquare, FileSignature, Bell, Megaphone, Building2 } from 'lucide-react';
import { SecureMessenger } from './SecureMessenger';
import { PermissionForms } from './PermissionForms';
import { HealthNoticeGenerator } from './HealthNoticeGenerator';
import { NotificationSettings } from './NotificationSettings';
import { ExternalDirectory } from './ExternalDirectory';
import { PageHeader } from '../ui/PageHeader';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { DirectorySchool } from '../../types';
import { useToast } from '../ui/Toast';

type Tab = 'MESSAGES' | 'DIRECTORY' | 'FORMS' | 'NOTICES' | 'SETTINGS';

interface CommunicationHubProps {
    directory?: DirectorySchool[];
}

export const CommunicationHub: React.FC<CommunicationHubProps> = ({ directory = [] }) => {
  const [activeTab, setActiveTab] = useState<Tab>('MESSAGES');
  const { addToast } = useToast(); // Access toast hook

  return (
    <div className="h-full flex flex-col space-y-6 animate-fade-in">
        <PageHeader 
            title="Communication Center" 
            subtitle="Secure parent/staff messaging and document management."
            actions={
                <div className="flex space-x-2 bg-white p-1 rounded-lg border border-slate-200 shadow-sm overflow-x-auto max-w-full no-scrollbar">
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('MESSAGES')}
                        icon={MessageSquare}
                        className={`whitespace-nowrap ${activeTab === 'MESSAGES' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Messages
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('DIRECTORY')}
                        icon={Building2}
                        className={`whitespace-nowrap ${activeTab === 'DIRECTORY' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        District Directory
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('FORMS')}
                        icon={FileSignature}
                        className={`whitespace-nowrap ${activeTab === 'FORMS' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Permission Forms
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('NOTICES')}
                        icon={Megaphone}
                        className={`whitespace-nowrap ${activeTab === 'NOTICES' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Health Notices
                    </Button>
                    <Button 
                        variant={'ghost'} 
                        size="sm"
                        onClick={() => setActiveTab('SETTINGS')}
                        icon={Bell}
                        className={`whitespace-nowrap ${activeTab === 'SETTINGS' ? 'bg-primary-50 text-primary-700 shadow-none hover:bg-primary-100' : ''}`}
                    >
                        Notifications
                    </Button>
                </div>
            }
        />

        <Card className="flex-1 min-h-0 flex flex-col" noPadding>
            {activeTab === 'MESSAGES' && <SecureMessenger />}
            {activeTab === 'DIRECTORY' && <ExternalDirectory schools={directory} />}
            {activeTab === 'FORMS' && <PermissionForms />}
            {activeTab === 'NOTICES' && <HealthNoticeGenerator />}
            {activeTab === 'SETTINGS' && <NotificationSettings />}
        </Card>
    </div>
  );
};
