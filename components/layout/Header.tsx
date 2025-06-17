
import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../../hooks/useAppContext';
import Input from '../ui/Input'; // Assuming Input component is available

// Simple Pencil Icon for editability indication
const PencilIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
  </svg>
);


const Header: React.FC = () => {
  const { projectName, updateProjectName } = useAppContext();
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(projectName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditedName(projectName); // Sync with context if projectName changes externally
  }, [projectName]);

  useEffect(() => {
    if (isEditingName && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditingName]);

  const handleNameClick = () => {
    setIsEditingName(true);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const saveName = () => {
    if (editedName.trim() === '') {
      setEditedName(projectName); // Revert if empty
    } else {
      updateProjectName(editedName.trim());
    }
    setIsEditingName(false);
  };

  const handleNameKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      saveName();
    } else if (e.key === 'Escape') {
      setEditedName(projectName); // Revert to original name from context
      setIsEditingName(false);
    }
  };

  const handleNameBlur = () => {
    saveName();
  };

  return (
    <header className="h-20 bg-white shadow-md flex items-center justify-between px-6">
      <div className="group relative"> {/* Added group for hover effect on pencil */}
        {isEditingName ? (
          <Input
            ref={inputRef}
            type="text"
            value={editedName}
            onChange={handleNameChange}
            onKeyDown={handleNameKeyDown}
            onBlur={handleNameBlur}
            className="text-xl font-semibold text-primary-DEFAULT border-b-2 border-primary-DEFAULT focus:ring-0 focus:border-primary-dark p-0 m-0 h-auto"
            // Basic styling, adjust as needed
          />
        ) : (
          <div className="flex items-center cursor-pointer" onClick={handleNameClick} title="Click to edit project name">
            <h2 className="text-xl font-semibold text-neutral-dark">
              Project: <span className="text-primary-DEFAULT hover:underline">{projectName}</span>
            </h2>
            <PencilIcon className="h-4 w-4 ml-2 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-150" />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-4">
        {/* Placeholder for notifications, user menu, etc. */}
        <div className="w-8 h-8 bg-accent-DEFAULT rounded-full flex items-center justify-center text-white font-bold">
          U
        </div>
      </div>
    </header>
  );
};

export default Header;
