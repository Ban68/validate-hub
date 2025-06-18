import React from 'react';
import ValuePropositionCanvasEditor from '../components/value-proposition/ValuePropositionCanvasEditor'; // To be created

const ValuePropositionPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Value Proposition Design</h1>
        <p className="mt-1 text-gray-700">
          Clearly articulate how your products and services create value for your customers.
          Ensure you achieve Problem-Solution Fit.
        </p>
      </header>
      <ValuePropositionCanvasEditor />
    </div>
  );
};

export default ValuePropositionPage;