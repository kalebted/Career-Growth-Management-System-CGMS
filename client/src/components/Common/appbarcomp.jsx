// src/components/common/AppBarComponent.jsx

import React, { useState, useEffect } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, Badge, Button,
  Menu, MenuItem, ListItemText, CircularProgress, Snackbar, Alert
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/authcontext';
import { getNotifications, markNotificationAsRead } from '../../utils/api';

const routeTitles = {
  '/dashboard': 'Dashboard',
  '/applications': 'My Applications',
  '/find_jobs': 'Find Jobs',
  '/jobseeker_profile': 'My Profile',
  '/ai_recommendations': 'Recommendations',
  '/settings': 'Settings',
  '/help': 'Help Center',
};

const AppBarComponent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const open = Boolean(anchorEl);
  const unreadCount = notifications.filter(n => n.read_status !== 'read').length;

  const currentTitle =
    Object.keys(routeTitles).sort((a, b) => b.length - a.length)
      .find((route) => location.pathname.startsWith(route)) || '';

  useEffect(() => {
    if (shouldRedirect) {
      const timer = setTimeout(() => navigate('/login'), 2000);
      return () => clearTimeout(timer);
    }
  }, [shouldRedirect, navigate]);

  // Polling logic for notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const allNotes = await getNotifications();
        setNotifications(allNotes.slice(0, 6));
      } catch (err) {
        console.error('Failed to fetch notifications:', err.message);
      }
    };

    fetchNotifications(); // Initial fetch on mount

    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  const handleOpenMenu = async (event) => {
    setAnchorEl(event.currentTarget);

    try {
      const unread = notifications.filter(n => n.read_status !== 'read');
      for (const note of unread) {
        await markNotificationAsRead(note._id);
      }
      setNotifications((prev) => prev.map(n => ({ ...n, read_status: 'read' })));
    } catch (err) {
      console.error("Error marking notifications as read:", err.message);
    }
  };

  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    setShowSnackbar(true);
    setShouldRedirect(true);
  };

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
            href="/"
            variant="outlined"
            sx={{ mr: 2, borderColor: '#d3d3d3', color: '#055F08' }}
          >
            Back to homepage
          </Button>

          <Button
            onClick={handleLogout}
            variant="outlined"
            sx={{ mr: 2, borderColor: '#d3d3d3', color: '#a63923' }}
          >
            Sign Out
          </Button>

          <IconButton onClick={handleOpenMenu}>
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon sx={{ color: '#666' }} />
            </Badge>
          </IconButton>

          <Menu anchorEl={anchorEl} open={open} onClose={handleClose}>
            <MenuItem disabled>
              <Typography variant="subtitle2">Notifications</Typography>
            </MenuItem>

            {loading ? (
              <MenuItem><CircularProgress size={20} /></MenuItem>
            ) : notifications.length === 0 ? (
              <MenuItem>No notifications</MenuItem>
            ) : (
              notifications.map((note) => (
                <MenuItem
                  key={note._id}
                  sx={{
                    backgroundColor: note.read_status !== 'read' ? '#f5f5f5' : 'inherit',
                    '&:hover': { backgroundColor: '#eeeeee' },
                  }}
                >
                  <ListItemText
                    primary={note.notification_content}
                    secondary={new Date(note.sent_date).toLocaleString()}
                  />
                </MenuItem>
              ))
            )}
          </Menu>
        </Toolbar>
      </AppBar>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={1800}
        onClose={() => setShowSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity="info" sx={{ width: '100%' }}>
          You have been signed out.
        </Alert>
      </Snackbar>
    </>
  );
};

export default AppBarComponent;
