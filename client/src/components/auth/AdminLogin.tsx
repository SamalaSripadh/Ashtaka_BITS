import React from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import { API_URL } from '../../config';

interface AdminLoginValues {
  email: string;
  password: string;
}

const AdminLogin: React.FC = () => {
  const navigate = useNavigate();
  const { setUser, user, isAuthenticated } = useAuth();

  // Redirect if already authenticated as admin
  React.useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      navigate('/admin/dashboard');
    }
  }, [isAuthenticated, user, navigate]);

  const formik = useFormik<AdminLoginValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      try {
        const requestData = {
          ...values,
          isAdminLogin: true
        };
        
        // Send admin login request
        const response = await fetch(`${API_URL}/api/auth/login`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(requestData),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Login failed');
        }

        // Store user data and token
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);

        // Update auth context state
        setUser(data.user);
        
        // Show success message
        toast.success('Welcome back, Admin!');
        
        // Navigate to admin dashboard
        navigate('/admin/dashboard');
      } catch (err) {
        console.error('Login error:', err);
        toast.error(err instanceof Error ? err.message : 'Server connection error');
      }
    },
  });

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center" sx={{ mb: 4 }}>
          Admin Login
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <TextField
            fullWidth
            id="email"
            name="email"
            label="Email"
            value={formik.values.email}
            onChange={formik.handleChange}
            error={formik.touched.email && Boolean(formik.errors.email)}
            helperText={formik.touched.email && formik.errors.email}
            margin="normal"
          />

          <TextField
            fullWidth
            id="password"
            name="password"
            label="Password"
            type="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
            margin="normal"
          />

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'center' }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                minWidth: 200,
                background: 'linear-gradient(45deg, #7C3AED 30%, #EC4899 90%)',
                '&:hover': {
                  background: 'linear-gradient(45deg, #6D28D9 30%, #DB2777 90%)',
                },
              }}
            >
              Login as Admin
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default AdminLogin;