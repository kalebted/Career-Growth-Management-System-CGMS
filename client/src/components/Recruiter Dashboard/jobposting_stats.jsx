  import React, { useState, useEffect } from 'react';
  import {
    Box,
    Typography,
    Grid,
    Card,
    Button,
  } from '@mui/material';
  import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
  import PersonSearchIcon from '@mui/icons-material/PersonSearch';
  import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
  import { getMyJobPosts } from '../../utils/api';
  import { useAuth } from '../../utils/authcontext';
  import { Link } from 'react-router-dom';

  const JobPostStats = () => {
    const [jobs, setJobs] = useState([]);
    const { user } = useAuth();
const firstName = user?.name?.split(' ')[0] || 'User';
    useEffect(() => {
      const fetchJobs = async () => {
        try {
          const jobData = await getMyJobPosts();
          setJobs(jobData);
        } catch (err) {
          console.error('Error fetching job posts:', err);
        }
      };

      fetchJobs();
    }, []);

    const totalJobsPosted = jobs.length;
    const totalJobsOpen = jobs.filter((job) => job.status === 'open').length;
    const applicantsDeclined = totalJobsPosted > 0 ? Math.round((totalJobsPosted - totalJobsOpen) / totalJobsPosted * 100) : 0;
    const applicantsHired = 100 - applicantsDeclined;

    return (
      <Box sx={{ mt: 10, px: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600, color: '#25324B' }}>
              Good morning, {firstName}
            </Typography>
            <Typography variant="body2" sx={{ color: '#6B7280' }}>
              Here is what’s happening with your job postings
            </Typography>
          </Box>
        </Box>

        <Grid container spacing={6} justifyContent="center" alignItems="flex-start">
          <Grid item xs={12} md={3}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, paddingLeft: 4 }}>
              {/* Total Jobs Posted */}
              <Card sx={{ p: 5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: 16, textAlign: 'center', paddingBottom: 1 }}>
                  Total Jobs Posted
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                    {totalJobsPosted}
                  </Typography>
                  <Box sx={{ bgcolor: '#E8F0FE', p: 1.5, borderRadius: 2 }}>
                    <WorkOutlineIcon sx={{ fontSize: 30, color: '#055F08' }} />
                  </Box>
                </Box>
              </Card>

              {/* Open Jobs */}
              <Card sx={{ p: 5 }}>
                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, fontSize: 16, textAlign: 'center'}}>
                  Open Jobs
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#25324B'}}>
                    {totalJobsOpen}
                  </Typography>
                  <Box sx={{ bgcolor: '#E8F0FE', p: 1.5, borderRadius: 2 }}>
                    <PersonSearchIcon sx={{ fontSize: 30, color: '#25324B' }} />
                  </Box>
                </Box>
              </Card>
            </Box>
          </Grid>

          {/* Jobs Applied Status */}
          <Grid item xs={12} md={9}>
            <Card sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 2 }}>
                Job Posting Status Overview
              </Typography>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                <Box
                  sx={{
                    width: 228,
                    height: 218,
                    borderRadius: '50%',
                    background: `conic-gradient(#055F08 0% ${applicantsDeclined}%, #E0E0E0 ${applicantsDeclined}% 100%)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Box sx={{ width: 140, height: 140, borderRadius: '50%', backgroundColor: '#fff' }} />
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                <Typography variant="body2">
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#055F08',
                      display: 'inline-block',
                      mr: 1,
                    }}
                  />
                  {applicantsDeclined}% Closed
                </Typography>
                <Typography variant="body2">
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: '#E0E0E0',
                      display: 'inline-block',
                      mr: 1,
                    }}
                  />
                  {applicantsHired}% Open
                </Typography>
              </Box>
              <Link to="/jop_posts" style={{ textDecoration: 'none' }}>
              <Button variant="text" sx={{ color: '#055F08', mt: 1 }}>
                View All Jobs <ArrowForwardIosIcon fontSize="small" />
              </Button>
              </Link>
            </Card>
          </Grid>
        </Grid>
      </Box>
    );
  };

  export default JobPostStats;
