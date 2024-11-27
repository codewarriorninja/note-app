import React from 'react';
import { Link } from 'react-router-dom';

export const Home: React.FC = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold mb-4">Welcome to NoteApp</h1>
      <p className="mb-4">A simple and secure way to manage your notes.</p>
      <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Get Started</Link>
    </div>
  );
};

