import React from 'react';

interface CardProps {
  title?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  bodyClassName?: string;
  actions?: React.ReactNode; // For buttons or other actions in the header
}

const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '', bodyClassName = '', actions }) => {
  return (
    <div className={`bg-white shadow-lg rounded-xl overflow-hidden ${className}`}>
      {title && (
        <div className={`px-4 sm:px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center ${titleClassName}`}>
          {typeof title === 'string' ? <h3 className="text-lg font-semibold text-neutral-dark mb-2 sm:mb-0">{title}</h3> : <div className="mb-2 sm:mb-0">{title}</div>}
          {actions && <div className="flex flex-wrap gap-2 items-center">{actions}</div>}
        </div>
      )}
      <div className={`p-4 sm:p-6 ${bodyClassName}`}>
        {children}
      </div>
    </div>
  );
};

export default Card;
