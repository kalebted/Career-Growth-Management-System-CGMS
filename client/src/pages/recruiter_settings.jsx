import React from 'react';
import { Box } from '@mui/material';
import SettingsPage from '../components/settingschange';
import RecruiterSidebar from '../components/common/recruiter_sidebar.jsx';
import RecruiterAppBarComponent from '../components/common/recruiter_appbarcomp';

const RecruiterSettings = () => (
  <Box sx={{ display: 'flex' }}>
    <RecruiterSidebar />
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
      <RecruiterAppBarComponent />
      <Box sx={{ marginTop: '50px', px: 4 }}>
        <SettingsPage />
      </Box>
    </Box>
  </Box>
);

export default RecruiterSettings;
