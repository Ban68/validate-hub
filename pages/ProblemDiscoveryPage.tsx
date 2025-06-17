import React from 'react';
import ProblemCanvasForm from '../components/problem-discovery/ProblemCanvasForm';

const ProblemDiscoveryPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Problem Discovery</h1>
        <p className="mt-1 text-gray-700">
          Start by deeply understanding the customer problem before jumping to solutions.
        </p>
      </header>
      <ProblemCanvasForm />
    </div>
  );
};

export default ProblemDiscoveryPage;