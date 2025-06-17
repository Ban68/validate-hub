
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import { ROUTES } from '../constants';


const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center">
      <img src="https://picsum.photos/300/200?grayscale&blur=2" alt="Lost and Confused" className="rounded-lg shadow-xl mb-8" />
      <h1 className="text-6xl font-bold text-primary-DEFAULT">404</h1>
      <p className="text-2xl font-medium text-neutral-dark mt-4">Oops! Page Not Found.</p>
      <p className="text-neutral-DEFAULT mt-2 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to={ROUTES.DASHBOARD}>
        <Button variant="primary" size="lg">
          Go to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
