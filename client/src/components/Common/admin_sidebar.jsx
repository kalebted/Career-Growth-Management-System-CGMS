import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Typography,
  Avatar,
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { Dashboard as DashboardIcon, People as PeopleIcon } from '@mui/icons-material';
import { useAuth } from '../../utils/authcontext';

const navItems = [
  { text: 'Dashboard', path: '/admin_dashboard', icon: DashboardIcon },
  { text: 'Users', path: '/admin_users', icon: PeopleIcon },
];

const AdminSidebar = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Drawer
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
          CGMS Admin
        </Typography>
      </Box>

      <List>
        {navItems.map(({ text, icon: Icon, path }) => {
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
            </ListItem>
          );
        })}
      </List>

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

export default AdminSidebar;
