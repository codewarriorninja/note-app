import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useStore from '../store/useStore';

export const Navbar: React.FC = () => {
  const { user, logout } = useStore();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const handleLogout = () => {
    logout();
    setIsDropdownOpen(false);
  };

  return (
    <nav className="bg-blue-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link to={user ? "/notes" : "/"} className="text-2xl font-bold">NoteApp</Link>
        <div>
          {user ? (
            <div className="relative">
              <button 
                onClick={toggleDropdown}
                className="focus:outline-none"
                aria-haspopup="true"
                aria-expanded={isDropdownOpen}
              >
                {user.username}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                  <Link to="/notes" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>My Notes</Link>
                  <Link to="/notes/new" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Create Note</Link>
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => setIsDropdownOpen(false)}>Update Profile</Link>
                  <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Logout</button>
                </div>
              )}
            </div>
          ) : (
            <div>
              <Link to="/login" className="mr-4">Login</Link>
              <Link to="/register">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

