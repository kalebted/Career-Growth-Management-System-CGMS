import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/common/recruiter_sidebar';
import AppBarComponent from '../components/common/recruiter_appbarcomp';
import Company from '../components/Recruiter/company';
import RecruiterDetails from '../components/Recruiter/recruiter_details';
import RecruiterSidebar from '../components/common/recruiter_sidebar.jsx';
import RecruiterAppBarComponent from '../components/common/recruiter_appbarcomp';


const RecruiterProfile = () => (
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
      <Company />
      <RecruiterDetails />
    </Box>
  </Box>
);

export default RecruiterProfile;