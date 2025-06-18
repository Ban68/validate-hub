
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import DashboardPage from './pages/DashboardPage';
import ProblemDiscoveryPage from './pages/ProblemDiscoveryPage';
import CustomerInsightsPage from './pages/CustomerInsightsPage';
import ExperimentationPage from './pages/ExperimentationPage';
import ValuePropositionPage from './pages/ValuePropositionPage';
import BusinessModelPage from './pages/BusinessModelPage';
import LearningIterationPage from './pages/LearningIterationPage';
import CollaborationPage from './pages/CollaborationPage';
import SettingsPage from './pages/SettingsPage';
import NotFoundPage from './pages/NotFoundPage';
import { useAppContext } from './hooks/useAppContext';
import { ROUTES } from './constants';

const App: React.FC = () => {
  const { apiKeyStatus } = useAppContext();

  return (
    <HashRouter>
      <div className="flex h-screen bg-gray-100">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <Header />
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
            {apiKeyStatus === 'missing' && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6" role="alert">
                <p className="font-bold">API Key Error</p>
                <p>Gemini API Key is not configured. Please set the <code>process.env.API_KEY</code> environment variable.</p>
              </div>
            )}
            <Routes>
              <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
              <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
              <Route path={ROUTES.PROBLEM_DISCOVERY} element={<ProblemDiscoveryPage />} />
              <Route path={ROUTES.CUSTOMER_INSIGHTS} element={<CustomerInsightsPage />} />
              <Route path={ROUTES.EXPERIMENTATION} element={<ExperimentationPage />} />
              <Route path={ROUTES.VALUE_PROPOSITION} element={<ValuePropositionPage />} />
              <Route path={ROUTES.BUSINESS_MODEL} element={<BusinessModelPage />} />
              <Route path={ROUTES.LEARNING_ITERATION} element={<LearningIterationPage />} />
              <Route path={ROUTES.COLLABORATION} element={<CollaborationPage />} />
              <Route path={ROUTES.SETTINGS} element={<SettingsPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
