import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUserTie, FaUserAlt } from 'react-icons/fa';
import LeftPanel from '../components/SignUp/Login Page/leftPanelTW.jsx';
import { useAuth } from '../utils/authcontext';
import { setGoogleUserRole } from '../utils/api';
import { Snackbar, Alert } from '@mui/material';

const SelectRolePage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [user, setUser] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  useEffect(() => {
    const stored = localStorage.getItem('userData');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  const handleRoleSelection = async (role) => {
    try {
      if (!user || !user._id) throw new Error("Missing user ID");

      const updated = await setGoogleUserRole({ userId: user._id, role });

      localStorage.setItem('token', updated.token);
      localStorage.setItem('userData', JSON.stringify(updated.user));
      login(updated.token, updated.user);

      setSnackbar({
        open: true,
        message: `Role set to ${role}. Redirecting...`,
        severity: 'success',
      });

      setTimeout(() => {
        navigate(role === 'recruiter' ? '/recruiter_dashboard' : '/dashboard');
      }, 1200);
    } catch (err) {
      console.error("Failed to set role:", err.message);
      setSnackbar({
        open: true,
        message: 'Failed to set role. Try again.',
        severity: 'error',
      });
    }
  };

  return (
    <div className="flex min-h-screen">
      <LeftPanel />
      <div className="flex items-center justify-center flex-1 p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <h1 className="text-2xl font-semibold text-gray-800 text-center">Select Your Role</h1>
          <p className="text-sm text-center text-gray-600">
            Help us tailor your experience.
          </p>

          <div className="space-y-4">
            <button
              className="flex items-center justify-center w-full py-3 text-white bg-green-600 rounded-lg hover:bg-green-700"
              onClick={() => handleRoleSelection('job_seeker')}
            >
              <FaUserAlt className="mr-2" />
              I'm a Job Seeker
            </button>
            <button
              className="flex items-center justify-center w-full py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
              onClick={() => handleRoleSelection('recruiter')}
            >
              <FaUserTie className="mr-2" />
              I'm a Recruiter
            </button>
          </div>
        </div>
      </div>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default SelectRolePage;
