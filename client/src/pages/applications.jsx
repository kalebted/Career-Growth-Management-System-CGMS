import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Common/sidebar';
import AppBarComponent from '../components/Common/appbarcomp';
import RecentApplicationHistory from '../components/Dashboard Page/recentapplicationhistory';

const Applications = () => (
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
      <Box sx={{marginTop: '50px'}}>
      <RecentApplicationHistory />
      </Box>
     
    </Box>
  </Box>
);

export default Applications;