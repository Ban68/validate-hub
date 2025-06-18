
import React from 'react';
import { NavLink } from 'react-router-dom';
import { NAVIGATION_ITEMS } from '../../constants'; 

const Sidebar: React.FC = () => {
  return (
    <div className="w-64 bg-primary-dark text-white flex flex-col">
      <div className="flex items-center justify-center h-20 border-b border-primary-light/30 px-4">
        <img 
          src="https://storage.googleapis.com/pai-images/9140c83a81744b8296b0584988cc8b89.png" 
          alt="Validate Hub Logo" 
          className="h-10 w-auto mr-2" // Adjusted for aspect ratio
        />
        <h1 className="text-2xl font-semibold">Validate Hub</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        {NAVIGATION_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out
               hover:bg-primary-light group
               ${isActive ? 'bg-primary-light text-white shadow-lg' : 'text-indigo-100 hover:bg-primary-light/80 hover:text-white'}`
            }
          >
            {({ isActive }) => ( // Use function as child to get isActive for children elements
              <>
                <item.icon 
                  className={`h-6 w-6 mr-3 transition-colors duration-150 ease-in-out 
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