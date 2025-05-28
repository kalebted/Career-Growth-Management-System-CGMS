import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Menu,
  MenuItem,
  IconButton,
  Avatar,
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/authcontext';

const NavBar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/');
  };

  const isJobSeeker = user?.role === 'job_seeker';

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'white',
        color: 'black',
        padding: '0.5rem 2rem',
      }}
    >
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          maxWidth: '100%',
          margin: 0,
          padding: 0,
          width: '100%',
        }}
      >
        <Typography
  onClick={() => window.location.href = '/'} // ✅ forces full reload
  sx={{
    marginLeft: '8rem',
    fontFamily: "'Arial', sans-serif",
    fontWeight: 900,
    fontSize: '2rem',
    color: '#1a3c5e',
    letterSpacing: '2px',
    cursor: 'pointer', // 👈 make it clickable
    '&:hover': {
      color: '#155d23',
    },
  }}
>
  CGMS
</Typography>

        <Box
          sx={{
            display: 'flex',
            gap: '1rem',
            marginLeft: '100px',
          }}
        >
          <Button
            component={Link}
            to="/dashboard"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#1a3c5e',
              padding: '0.5rem 1rem',
              '&:hover': {
                color: '#155d23',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            component={Link}
            to="/find_jobs"
            sx={{
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              color: '#1a3c5e',
              padding: '0.5rem 1rem',
              '&:hover': {
                color: '#155d23',
              },
            }}
          >
            Browse Jobs
          </Button>
        </Box>

        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
            marginLeft: 'auto',
            marginRight: '8rem',
          }}
        >
          {isJobSeeker ? (
            <>
              <IconButton onClick={handleMenuOpen}>
                <Avatar>{user?.name?.charAt(0).toUpperCase() || 'U'}</Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                <MenuItem onClick={() => { navigate('/profile'); handleMenuClose(); }}>
                  My Profile
                </MenuItem>
                <MenuItem onClick={handleLogout}>Sign Out</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                sx={{
                  color: '#1e7c2e',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.5rem 1rem',
                  '&:hover': {
                    color: '#155d23',
                  },
                }}
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/signup"
                variant="contained"
                sx={{
                  backgroundColor: '#1e7c2e',
                  color: '#fff',
                  textTransform: 'none',
                  fontWeight: 600,
                  fontSize: '1rem',
                  padding: '0.5rem 1.5rem',
                  '&:hover': {
                    backgroundColor: '#155d23',
                  },
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
