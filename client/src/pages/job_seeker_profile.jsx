import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Common/sidebar';
import AppBarComponent from '../components/Common/appbarcomp';
import TabSwitcher from '../components/tab_switcher';

const JobSeekerProfile = () => (
  <Box data-testid="jobseeker-profile" sx={{ display: 'flex' }}>
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
      <TabSwitcher />
    </Box>
  </Box>
);

export default JobSeekerProfile;
