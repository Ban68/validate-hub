
import React from 'react';
import Card from '../components/ui/Card';
import { ChartBarIcon, LightBulbIcon, UsersIcon, BeakerIcon } from '../constants';
import { Link } from 'react-router-dom';
import { ROUTES } from '../constants';

const DashboardPage: React.FC = () => {
  const quickLinks = [
    { name: 'Define Problem', path: ROUTES.PROBLEM_DISCOVERY, icon: LightBulbIcon, color: 'text-purple-500', bgColor: 'bg-purple-100' },
    { name: 'Understand Customers', path: ROUTES.CUSTOMER_INSIGHTS, icon: UsersIcon, color: 'text-sky-500', bgColor: 'bg-sky-100' },
    { name: 'Run Experiments', path: ROUTES.EXPERIMENTATION, icon: BeakerIcon, color: 'text-amber-500', bgColor: 'bg-amber-100' },
  ];

  return (
    <div className="space-y-6">
      <Card title="Welcome to Validate Hub!" className="bg-white">
        <p className="text-md sm:text-lg text-gray-800">
          Ready to turn your business idea into a validated model? Validate Hub guides you through each step.
        </p>
        <p className="mt-2 text-sm text-gray-800">
          Start by defining the problem you're solving, understanding your customers, and designing experiments to test your assumptions.
        </p>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {quickLinks.map(link => (
          <Link to={link.path} key={link.name} className="block hover:shadow-xl transition-shadow duration-200 rounded-xl">
            <Card className={`h-full ${link.bgColor}`}>
              <div className="flex flex-col items-center justify-center p-4 text-center">
                <link.icon className={`h-10 w-10 sm:h-12 sm:w-12 mb-3 ${link.color}`} />
                <h3 className={`text-lg sm:text-xl font-semibold ${link.color}`}>{link.name}</h3>
                <p className="text-xs sm:text-sm text-gray-800 mt-1">Navigate to {link.name.toLowerCase()} module.</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
      
      <Card title="Your Validation Journey">
        <div className="flex items-center space-x-4">
          <ChartBarIcon className="h-8 w-8 sm:h-10 sm:w-10 text-secondary-DEFAULT" />
          <div>
            <h4 className="font-semibold text-neutral-dark">Track Your Progress</h4>
            <p className="text-sm text-gray-800">
              As you complete modules, your progress will be visualized here. Keep validating! (Feature coming soon)
            </p>
          </div>
        </div>
         <div className="mt-4 h-24 sm:h-32 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-sm sm:text-base">
            Placeholder for Progress Visualization
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
