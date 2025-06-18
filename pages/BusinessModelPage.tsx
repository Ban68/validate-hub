
import React from 'react';
import BusinessModelCanvasEditor from '../components/business-model/BusinessModelCanvasEditor';
import FermiEstimationTool from '../components/business-model/FermiEstimationTool'; 

const BusinessModelPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Business Model Design</h1>
        <p className="mt-1 text-sm sm:text-base text-gray-700">
          Map out and test the economic viability of your business idea.
        </p>
      </header>
      
      <section>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Business Model Canvas</h2>
        <BusinessModelCanvasEditor />
      </section>

      <section className="mt-8">
         <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Financial Viability Checks</h2>
        <FermiEstimationTool />
        {/* Placeholder for Resource Runway Calculator
        <Card title="Resource Runway Calculator (Coming Soon)" className="mt-6">
          <p>This tool will help you project cash burn and remaining runway based on current spending and planned experiments.</p>
        </Card>
        */}
      </section>
    </div>
  );
};

export default BusinessModelPage;
