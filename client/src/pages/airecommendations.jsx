import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/Common/sidebar';
import AppBarComponent from '../components/Common/appbarcomp';
import ApplicationStats from '../components/Dashboard Page/applicationstats';
import RecentApplicationHistory from '../components/Dashboard Page/recentapplicationhistory';
import CVAIProcessor from '../components/cvaiprocessor';

const AiRecommendations = () => (
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
      <CVAIProcessor />
    </Box>
  </Box>
);

export default AiRecommendations;