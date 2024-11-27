import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Notes } from './pages/Notes';
import { Profile } from './pages/Profile';
import { NotesList } from './components/NoteList';
import { ProtectedRoute } from './components/ProtectedRoute';
import useStore from './store/useStore';

function App() {
  const { initialize, isInitialized, user } = useStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (!isInitialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/notes" replace /> : <Home />} />
            <Route path="/login" element={user ? <Navigate to="/notes" replace /> : <Login />} />
            <Route path="/register" element={user ? <Navigate to="/notes" replace /> : <Register />} />
            <Route path="/notes" element={<ProtectedRoute><NotesList /></ProtectedRoute>} />
            <Route path="/notes/new" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/notes/:id" element={<ProtectedRoute><Notes /></ProtectedRoute>} />
            <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;

