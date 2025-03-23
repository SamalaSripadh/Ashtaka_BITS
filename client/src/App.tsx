import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Import components
import Navbar from './components/layout/Navbar';
import Home from './components/pages/Home';
import Events from './components/pages/Events';
import EventDetails from './components/pages/EventDetails';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/Dashboard';
import PrivateRoute from './components/routing/PrivateRoute';
import AdminRoute from './components/routing/AdminRoute';
import { AuthProvider, useAuth } from './context/AuthContext';
import About from './components/pages/About';
import Contact from './components/pages/Contact';
import AdminLogin from './components/auth/AdminLogin';
import CreateEvent from './components/admin/CreateEvent';
import AdminCheckIn from './components/pages/AdminCheckIn';
import CheckInScanner from './components/admin/CheckInScanner';

const theme = createTheme({
  palette: {
    primary: {
      main: '#7C3AED',
    },
    secondary: {
      main: '#EC4899',
    },
  },
});

const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/events" element={<Events />} />
      <Route path="/events/:id" element={<EventDetails />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
      <Route path="/admin/login" element={isAuthenticated ? <Navigate to="/" /> : <AdminLogin />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/" /> : <Register />} />

      {/* Protected routes */}
      <Route
        path="/user/dashboard"
        element={
          <PrivateRoute>
            <UserDashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/admin/dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/create-event"
        element={
          <AdminRoute>
            <CreateEvent />
          </AdminRoute>
        }
      />
      <Route
        path="/admin/check-in"
        element={
          <AdminRoute>
            <CheckInScanner />
          </AdminRoute>
        }
      />

      {/* Redirect authenticated users to appropriate dashboard */}
      <Route
        path="*"
        element={
          isAuthenticated ? (
            user?.role === 'admin' ? (
              <Navigate to="/admin/dashboard" replace />
            ) : (
              <Navigate to="/" replace />
            )
          ) : (
            <Navigate to="/" replace />
          )
        }
      />
    </Routes>
  );
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Navbar />
          <AppRoutes />
          <ToastContainer position="top-right" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;