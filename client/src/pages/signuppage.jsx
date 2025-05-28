import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Tabs, Tab } from '@mui/material';
import LeftPanel from '../components/SignUp/Login Page/leftPanelTW.jsx';
import GoogleSignInButton from '../components/SignUp/Login Page/googleSignInButtonTW.jsx';
import { registerUser } from '../utils/api';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../utils/axiosInstance';
import { useAuth } from '../utils/authcontext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [tabValue, setTabValue] = useState(0);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'job_seeker',
  });

  const [formErrors, setFormErrors] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleTabChange = (_, newValue) => {
    setTabValue(newValue);
    setFormData((prev) => ({
      ...prev,
      role: newValue === 0 ? 'job_seeker' : 'recruiter',
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const errors = {};
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.name.trim()) errors.name = 'Full name is required.';
    if (!formData.email.trim()) {
      errors.email = 'Email is required.';
    } else if (!emailPattern.test(formData.email)) {
      errors.email = 'Invalid email format.';
    }

    if (!formData.username.trim()) errors.username = 'Username is required.';
    else if (formData.username.length < 3) errors.username = 'Username must be at least 3 characters.';

    if (!formData.password) {
      errors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      errors.password = 'Password must be at least 6 characters.';
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      return;
    }

    try {
      const response = await registerUser(formData);
      if (response.token) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        throw new Error('Unexpected response');
      }
    } catch (err) {
      const serverMessage =
        err.response?.data?.message || err.message || 'Registration failed. Please try again.';
      setError(serverMessage);
    }
  };

  const handleGoogleSignUp = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post('/auth/google-login', {
          access_token: tokenResponse.access_token,
        });

        const { token, user, needsRole } = res.data;

        if (needsRole) {
          localStorage.setItem('userData', JSON.stringify(user));
          navigate('/select-role');
        } else {
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(user));
          login(token, user);
          navigate(user.role === 'recruiter' ? '/recruiter_dashboard' : '/dashboard');
        }
      } catch (err) {
        console.error('Google sign-up error:', err);
        setError('Google sign-up failed. Please try again.');
      }
    },
    onError: () => {
      setError('Google sign-up failed. Please try again.');
    },
  });

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <Typography variant="h5" className="text-gray-800 font-semibold text-2xl text-center">
            Get More Opportunities
          </Typography>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <GoogleSignInButton text="Sign Up with Google" onClick={handleGoogleSignUp} />

          <p className="text-sm text-center text-gray-500">Or sign up with email</p>

          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
              <Tab label="Job Seeker" />
              <Tab label="Recruiter" />
            </Tabs>
          </Box>

          <div>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {formErrors.name && <p className="text-xs text-red-500">{formErrors.name}</p>}
          </div>

          <div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {formErrors.email && <p className="text-xs text-red-500">{formErrors.email}</p>}
          </div>

          <div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {formErrors.username && <p className="text-xs text-red-500">{formErrors.username}</p>}
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {formErrors.password && <p className="text-xs text-red-500">{formErrors.password}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
          >
            Continue
          </button>

          <p className="text-sm text-center text-gray-600">
            Already have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-green-600 hover:underline"
            >
              Login
            </button>
          </p>

          <p className="text-xs text-center text-gray-500">
            By clicking 'Continue', you accept our{' '}
            <a href="#" className="text-green-600 hover:underline">Terms of Service</a> and{' '}
            <a href="#" className="text-green-600 hover:underline">Privacy Policy</a>.
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
