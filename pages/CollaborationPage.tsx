import React from 'react';
import Card from '../components/ui/Card';
import { UserGroupIcon } from '../constants'; // Assuming UserGroupIcon

const CollaborationPage: React.FC = () => {
  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold text-gray-900">Collaboration Hub</h1>
        <p className="mt-1 text-gray-700">
          Work with your team, mentors, and advisors effectively throughout the validation process.
        </p>
      </header>

      <Card title="Shared Understanding" className="bg-primary-DEFAULT/5">
        <div className="flex items-start space-x-4">
          <UserGroupIcon className="h-12 w-12 text-primary-DEFAULT mt-1"/>
          <div>
            <h3 className="text-lg font-semibold text-primary-dark">Working Together in ValiMate</h3>
            <p className="text-sm text-gray-800 mt-1">
              Currently, ValiMate operates with a single project context. All data you input (Problem Canvas, Interviews, Hypotheses, etc.) is part of this shared workspace.
            </p>
            <p className="text-sm text-gray-800 mt-2">
              <strong>To collaborate with your team:</strong> Ensure everyone is working within the same ValiMate instance or by sharing exported data (if export features are added in the future).
            </p>
            <p className="text-sm text-gray-800 mt-2">
              <strong>To share with mentors/advisors:</strong> You can walk them through your ValiMate dashboards and canvases during meetings, or share specific insights you've documented.
            </p>
          </div>
        </div>
      </Card>

      <Card title="Future Collaboration Enhancements">
        <div className="space-y-4">
          <div>
            <h4 className="font-semibold text-neutral-dark">Role-Based Access & Real-time Collaboration</h4>
            <p className="text-sm text-gray-800">
              (Coming Soon) Allow multiple team members to access and contribute with tailored views and permissions. Features like real-time co-editing and commenting on specific items (hypotheses, interview notes) are planned.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-dark">Digital Brainstorming Board</h4>
            <p className="text-sm text-gray-800">
              (Coming Soon) Integrated tools for visual brainstorming, enabling remote teams to generate and organize ideas collaboratively within ValiMate.
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-dark">Expert & Advisory Board Module</h4>
            <p className="text-sm text-gray-800">
              (Coming Soon) Facilitate structured feedback requests to external mentors or industry experts, allowing you to log their advice and track its influence on your validation journey.
            </p>
          </div>
        </div>
         <div className="mt-6 p-4 bg-gray-100 rounded flex items-center justify-center text-gray-500">
            Advanced collaboration features are under development. Stay tuned!
        </div>
      </Card>
    </div>
  );
};

export default CollaborationPage;