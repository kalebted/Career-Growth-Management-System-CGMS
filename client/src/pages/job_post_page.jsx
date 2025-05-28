import React from 'react';
import { Box } from '@mui/material';
import Sidebar from '../components/common/recruiter_sidebar';
import AppBarComponent from '../components/common/recruiter_appbarcomp';
import PostJobs from '../components/Recruiter/post_jobs';
import RecentJobPosts from '../components/Recruiter Dashboard/recruiter_dashboard_JobPosts';
import RecruiterSidebar from '../components/common/recruiter_sidebar';
import RecruiterAppBarComponent from '../components/common/recruiter_appbarcomp';

const PostJobsDashboard = () => (
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
      <PostJobs />
      <RecentJobPosts />
    </Box>
  </Box>
);

export default PostJobsDashboard;