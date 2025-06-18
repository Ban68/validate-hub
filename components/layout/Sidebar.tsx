
import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_ITEMS, XMarkIcon } from '../../constants'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen && window.innerWidth < 768) { // md breakpoint
      onClose();
    }
  }, [location.pathname, isOpen, onClose]);


  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white flex-col
        transform transition-transform duration-300 ease-in-out 
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:relative md:translate-x-0 md:flex md:flex-shrink-0
      `}
      aria-label="Sidebar"
    >
      <div className="flex items-center justify-between h-20 border-b border-primary-light/30 px-4">
        <div className="flex items-center">
          <img 
            src="https://storage.googleapis.com/pai-images/9140c83a81744b8296b0584988cc8b89.png" 
            alt="Validate Hub Logo" 
            className="h-10 w-auto mr-2"
          />
          <h1 className="text-2xl font-semibold">Validate Hub</h1>
        </div>
        <button 
          onClick={onClose} 
          className="md:hidden text-indigo-200 hover:text-white"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={() => { if (window.innerWidth < 768) onClose(); }} // Close sidebar on nav item click on mobile
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
               hover:bg-primary-light group
               ${isActive ? 'bg-primary-light text-white shadow-lg' : 'text-indigo-100 hover:bg-primary-light/80 hover:text-white'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon 
                  className={`h-6 w-6 mr-3 transition-colors duration-150 ease-in-out shrink-0
                              ${isActive ? 'text-white' : 'text-indigo-300 group-hover:text-white'}`} 
                  aria-hidden="true"
                />
                <span className="transition-colors duration-150 ease-in-out">
                  {item.name}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-primary-light/30">
        <p className="text-xs text-indigo-300">© 2024 Validate Hub</p>
      </div>
    </div>
  );
};

export default Sidebar;
