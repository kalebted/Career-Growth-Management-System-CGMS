import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Link,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LeftPanel from '../components/SignUp/Login Page/leftpanel';
import GoogleSignInButton from '../components/SignUp/Login Page/googlesigninbutton';
import { loginUser } from '../utils/api';
import { useAuth } from '../utils/authcontext';
import { jwtDecode } from 'jwt-decode';
import '../styles/login.css';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    console.log('✅ handleSubmit triggered');

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });
      console.log('✅ Response from loginUser:', response);

      if (!response.token || !response.user) {
        throw new Error('Missing token or user in response');
      }

      const decoded = jwtDecode(response.token);
      console.log('✅ Decoded Role:', decoded.role);

      // Navigate immediately based on token role
      switch (decoded.role) {
        case 'admin':
          navigate('/admin_dashboard');
          break;
        case 'recruiter':
          navigate('/recruiter_dashboard');
          break;
        case 'job_seeker':
        default:
          navigate('/');
          break;
      }

      // Then update AuthContext
      login(response.token, response.user);
      alert('Login successful!');

    } catch (err) {
      setError(err.message || err.msg || 'Login failed');
    }
  };

  return (
    <div className="container">
      <LeftPanel />
      <div className="right-panel">
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>Welcome Back</Typography>

            {error && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {error}
              </Typography>
            )}

            <GoogleSignInButton text="Login with Google" />

            <Typography variant="body2" sx={{ textAlign: 'center', mb: 2 }}>
              Or login with email
            </Typography>

            <TextField
              fullWidth
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              required
            />

            <TextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={formData.remember}
                  onChange={handleChange}
                  name="remember"
                  color="success"
                />
              }
              label="Remember me"
              sx={{ my: 2 }}
            />

            <Button
              fullWidth
              variant="contained"
              color="success"
              type="submit"
              sx={{ py: 1.5 }}
            >
              Login
            </Button>

            <Typography variant="body2" sx={{ mt: 2, textAlign: 'center' }}>
              Don't have an account?{' '}
              <Link href="/signup" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>
                Sign Up
              </Link>
            </Typography>
          </Box>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
