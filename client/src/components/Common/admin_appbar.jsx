// src/components/common/RecruiterAppBarComponent.jsx
import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Button,
  Snackbar, Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/authcontext';

const routeTitles = {
  '/admin_dashboard': 'Dashboard',
  '/admin_users': 'Users',
};

const AdminAppBarComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const currentTitle =
    Object.keys(routeTitles)
      .sort((a, b) => b.length - a.length)
      .find((route) => location.pathname.startsWith(route)) || '';

  const handleLogout = () => {
    logout();             // Clear auth context
    setSnackbarOpen(true); // Show toast
    setShouldRedirect(true); // Trigger redirect delay
  };

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => {
        navigate('/login'); // Redirect after toast
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          bgcolor: '#fff',
          color: '#000',
          boxShadow: 'none',
          width: 'calc(100% - 240px)',
          ml: '240px',
          borderBottom: '1px solid #e0e0e0',
        }}
      >
        <Toolbar sx={{ minHeight: '72px' }}>
          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold', color: '#25324B' }}>
            {routeTitles[currentTitle] || 'Dashboard'}
          </Typography>

          <Button
            variant="outlined"
            onClick={handleLogout}
            sx={{
              mr: 2,
              borderColor: '#d3d3d3',
              color: '#a63923',
              textTransform: 'none',
              fontSize: '14px',
              padding: '10px 24px',
            }}
          >
            Sign Out
          </Button>

          {/* <IconButton>
            <Badge color="error">
              <NotificationsIcon sx={{ color: '#666' }} />
            </Badge>
          </IconButton> */}
        </Toolbar>
      </AppBar>

      {/* ✅ Logout Toast */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1800}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          Signed out successfully.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AdminAppBarComponent;
