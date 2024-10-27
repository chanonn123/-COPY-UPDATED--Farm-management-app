import React, { useEffect, useState } from 'react';
import { Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard';
import ProtectedRoute from './ProtectedRoute';
import Welcome from './Welcome';
import UserProfile from './UserProfile';
import { auth } from './firebase';
import 'bootstrap/dist/css/bootstrap.min.css';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log('Auth state changed:', user);
      setIsAuthenticated(!!user);
      console.log('Current pathname:', location.pathname);
      if (user && !location.pathname.startsWith('/dashboard') && !location.pathname.startsWith('/profile')) {
        console.log('Navigating to dashboard');
        navigate('/dashboard');
      }
    });

    return () => unsubscribe();
  }, [navigate, location.pathname]);

  const handleLogout = async () => {
    try {
      await auth.signOut();
      console.log('User logged out');
      setIsAuthenticated(false);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      {isAuthenticated && (
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
          <div className="container-fluid">
            <Link className="navbar-brand" to="/dashboard">🥬 Farm App</Link>
            <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile" onClick={() => console.log('Navigating to Profile')}>Profile</Link>
                </li>
              </ul>
              <button className="btn btn-outline-danger" onClick={handleLogout}>Logout</button>
            </div>
          </div>
        </nav>
      )}

      <div className="container">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/login" element={<Login />} />
          <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};

export default App;
