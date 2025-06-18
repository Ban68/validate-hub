import React from 'react';
import Card from '../components/ui/Card';
import { useAppContext } from '../hooks/useAppContext';

const SettingsPage: React.FC = () => {
  const { apiKeyStatus } = useAppContext();
  const apiKey = process.env.API_KEY;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-700">
          Manage your application preferences and integrations. (More settings coming soon)
        </p>
      </header>
      <Card title="API Key Configuration">
        {apiKeyStatus === 'ok' && apiKey && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-700 font-semibold">Gemini API Key is configured.</p>
            <p className="text-xs text-gray-500 mt-1 break-all">Key: <code>{apiKey.substring(0,4)}...{apiKey.substring(apiKey.length-4)}</code> (Masked for security)</p>
          </div>
        )}
        {apiKeyStatus === 'missing' && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-700 font-semibold">Gemini API Key is NOT configured.</p>
            <p className="text-sm text-gray-600 mt-1">
              Please set the <code>process.env.API_KEY</code> environment variable in your deployment environment.
              AI-powered features will be disabled until the API key is provided.
            </p>
          </div>
        )}
         {apiKeyStatus === 'checking' && (
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-700 font-semibold">Checking API Key status...</p>
          </div>
        )}
      </Card>
      <Card title="Profile & Preferences">
        <p className="text-gray-800">User profile settings, theme customization, and other preferences will be available here in the future.</p>
      </Card>
    </div>
  );
};

export default SettingsPage;
