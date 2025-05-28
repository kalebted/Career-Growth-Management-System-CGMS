import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography, Avatar, Badge } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import {
  Dashboard as DashboardIcon,
  Message as MessageIcon,
  Work as WorkIcon,
  Search as SearchIcon,
  Business as BusinessIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Help as HelpIcon,
  Psychology as PsychologyIcon
} from '@mui/icons-material';
import { useAuth } from '../../utils/authcontext';

const navItems = [
  { text: 'Dashboard', path: '/dashboard', icon: DashboardIcon },
  { text: 'My Applications', path: '/applications', icon: WorkIcon },
  { text: 'Find Jobs', path: '/find_jobs', icon: SearchIcon },
  { text: 'My Profile', path: '/jobseeker_profile', icon: PersonIcon },
  { text: 'Recommendations', path: '/ai_recommendations', icon: PsychologyIcon },
];

const settingsItems = [
  { text: 'Settings', path: '/settings', icon: SettingsIcon },
  { text: 'Help Center', path: '/help', icon: HelpIcon },
];

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  // 🔥 Active highlighting logic - exact or subpath
  const isActive = (path) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const renderNavItem = ({ text, icon: Icon, path, badge }) => {
    const active = isActive(path);
    return (
      <ListItem
        key={text}
        button
        component={Link}
        to={path}
        sx={{
          bgcolor: active ? '#EEF2FF' : 'transparent',
          py: 1,
          px: 3,
        }}
      >
        <ListItemIcon>
          <Icon sx={{ color: active ? '#055F08' : '#6B7280' }} />
        </ListItemIcon>
        <ListItemText
          primary={text}
          primaryTypographyProps={{
            fontSize: '0.95rem',
            fontWeight: active ? 'bold' : 'normal',
            color: active ? '#055F08' : '#7C8493',
          }}
        />
        {badge && (
          <Badge
            badgeContent={badge}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: '#055F08',
                color: '#fff',
                fontSize: '0.7rem',
                minWidth: '18px',
                height: '18px',
                right: 10,
                top: 10,
              },
            }}
          />
        )}
      </ListItem>
    );
  };

  return (
    <Drawer
    data-testid="sidebar"
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          backgroundColor: '#F9F9FC',
        },
      }}
    >
      <Box sx={{ p: 3, pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#202430' }}>
          CGMS
        </Typography>
      </Box>

      <List>
        {navItems.map(renderNavItem)}
      </List>

      <Box sx={{ px: 3, pt: 2 }}>
        <Typography
          variant="caption"
          sx={{
            color: '#6B7280',
            fontWeight: 'bold',
            fontSize: '0.7rem',
            letterSpacing: 1,
            mb: 1,
          }}
        >
          SETTINGS
        </Typography>
        <List>
          {settingsItems.map(renderNavItem)}
        </List>
      </Box>

      {user && (
        <Box sx={{ p: 3, mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Avatar sx={{ width: 40, height: 40, mr: 2, bgcolor: '#FF4081' }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="body2" sx={{ fontWeight: 'bold', fontSize: '0.9rem' }}>
                {user.name}
              </Typography>
              <Typography variant="caption" sx={{ color: '#6B7280', fontSize: '0.75rem' }}>
                {user.email}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}
    </Drawer>
  );
};

export default Sidebar;
