
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants'; 

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void; // Used to close sidebar if clicking a link on mobile
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const handleNavLinkClick = () => {
    if (isOpen && window.innerWidth < 768) { // 768px is typical 'md' breakpoint
      onClose();
    }
  };

  return (
    <div 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-primary-dark text-white 
        flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        md:translate-x-0 md:static md:inset-0 md:flex md:w-64 
      `}
      aria-hidden={!isOpen && window.innerWidth < 768} // Hide from screen readers on mobile when closed
    >
      <div className="flex items-center justify-center h-20 border-b border-primary-light/30 px-4 shrink-0"> {/* Added shrink-0 */}
        <img 
          src="https://storage.googleapis.com/pai-images/9140c83a81744b8296b0584988cc8b89.png" 
          alt="Validate Hub Logo" 
          className="h-10 w-auto mr-2"
        />
        <h1 className="text-2xl font-semibold">Validate Hub</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto"> {/* Added overflow-y-auto */}
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            onClick={handleNavLinkClick}
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
      <div className="p-4 border-t border-primary-light/30 shrink-0"> {/* Added shrink-0 */}
        <p className="text-xs text-indigo-300">© 2024 Validate Hub</p>
      </div>
    </div>
  );
};

export default Sidebar;
