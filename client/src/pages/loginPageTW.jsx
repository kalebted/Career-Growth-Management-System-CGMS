import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LeftPanel from '../components/SignUp/Login Page/leftPanelTW.jsx';
import GoogleSignInButton from '../components/SignUp/Login Page/googleSignInButtonTW.jsx';
import { loginUser } from '../utils/api';
import { useAuth } from '../utils/authcontext';
import { jwtDecode } from 'jwt-decode';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useGoogleLogin } from '@react-oauth/google';
import API from '../utils/axiosInstance'; // ✅ use API instance with baseURL

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

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
    setSuccess('');

    console.log('✅ handleSubmit triggered');
    console.log('✅ formData:', formData);

    if (!formData.email || !formData.password) {
      setError('Email and password are required.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      const response = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      console.log('✅ Response from loginUser:', response);

      if (response.token && response.user) {
        login(response.token, response.user);
        const decoded = jwtDecode(response.token);
        console.log('✅ Decoded Token:', decoded);

        setSuccess('Login successful! Redirecting...');

        setTimeout(() => {
          if (decoded.role === 'admin') {
            navigate('/admin_dashboard');
          } else if (decoded.role === 'recruiter') {
            navigate('/recruiter_dashboard');
          } else {
            navigate('/dashboard'); // Default for job seekers
          }
        }, 1500);
      } else {
        throw new Error('Missing token or user in response');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      if (err.response?.status === 400) {
        setError('Invalid email or password. Please try again.');
      } else {
        setError(err.message || 'Login failed. Please try again.');
      }
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await API.post('/auth/google-login', {
          access_token: tokenResponse.access_token,
        });

        const { token, user, needsRole } = res.data;

        if (needsRole) {
          localStorage.setItem('userData', JSON.stringify(user));
          navigate('/select-role'); // 👈 user will pick their role next
        } else {
          localStorage.setItem('token', token);
          localStorage.setItem('userData', JSON.stringify(user));
          login(token, user);

          if (user.role === 'admin') {
            navigate('/admin_dashboard');
          } else if (user.role === 'recruiter') {
            navigate('/recruiter_dashboard');
          } else {
            navigate('/dashboard');
          }
        }
      } catch (err) {
        console.error('Google login error:', err);
        setError('Google login failed');
      }
    },
    onError: () => {
      setError('Google login failed');
    },
  });

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">Welcome Back</h1>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}
          {success && <p className="text-sm text-green-600 text-center">{success}</p>}

          <GoogleSignInButton text="Login with Google" onClick={handleGoogleLogin} />

          <p className="text-sm text-center text-gray-500">Or login with email</p>

          <div className="space-y-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email Address"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 flex items-center text-gray-500 right-3"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center text-sm text-gray-600">
              <input
                type="checkbox"
                name="remember"
                checked={formData.remember}
                onChange={handleChange}
                className="mr-2"
              />
              Remember me
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-3 text-white transition bg-green-600 rounded-lg hover:bg-green-700"
          >
            Login
          </button>

          <p className="text-sm text-center text-gray-600">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={() => navigate('/signup')}
              className="text-green-600 hover:underline"
            >
              Sign Up
            </button>
          </p>

          <p className="text-sm text-center text-gray-600">
            Or have you{' '}
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-green-600 hover:underline"
            >
              Forgotten Your Password
            </button>
            ?
          </p>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
