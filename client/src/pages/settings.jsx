// src/pages/Settings.jsx

import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Common/sidebar';
import AppBarComponent from '../components/Common/appbarcomp';
import SettingsPage from '../components/settingschange';
import RecruiterSidebar from '../components/common/recruiter_sidebar';
import RecruiterAppBarComponent from '../components/common/recruiter_appbarcomp';

const Settings = () => (
  <Box sx={{ display: 'flex' }}>
    <Sidebar />
    <Box
      component="main"
      sx={{
        flexGrow: 1,
        bgcolor: '#fafafa',
        ml: '0px',
        width: 'calc(100% - 240px)',
        backgroundColor: 'white',
      }}
    >
      <AppBarComponent />
      <Box sx={{ marginTop: '50px', px: 4 }}>
        <SettingsPage />
      </Box>
    </Box>
  </Box>
);

export default Settings;
