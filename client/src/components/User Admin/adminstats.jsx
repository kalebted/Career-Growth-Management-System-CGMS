import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Card } from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GroupIcon from '@mui/icons-material/Group';
import { getAdminDashboard } from '../../utils/api';

const AdminStats = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    totalRecruiters: 0,
    totalJobSeekers: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getAdminDashboard();
        setStats(data);
      } catch (error) {
        console.error('Error fetching admin stats:', error);
      }
    };

    fetchStats();
  }, []);

  const chartData = [
    { label: 'Job Seekers', value: stats.totalJobSeekers, color: '#4CAF50' },
    { label: 'Recruiters', value: stats.totalRecruiters, color: '#2196F3' },
  ];

  const totalUsers = chartData.reduce((sum, item) => sum + item.value, 0);

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#25324B' }}>
          Welcome, Admin
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          Here are the current platform statistics.
        </Typography>
      </Box>

      <Grid container spacing={6} justifyContent="center" alignItems="flex-start">
        {/* Left Column - Vertical Alignment */}
        <Grid item xs={12} md={4}>
          <Box display="flex" flexDirection="column" gap={4}>
            {/* Total Jobs Posted */}
            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Total Jobs Posted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {stats.totalJobs}
                </Typography>
                <Box sx={{ bgcolor: '#E8F0FE', p: 1.5, borderRadius: 2 }}>
                  <WorkOutlineIcon sx={{ fontSize: 28, color: '#055F08' }} />
                </Box>
              </Box>
            </Card>

            {/* Total Users (Job Seekers + Recruiters) */}
            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Total Users
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {stats.totalJobSeekers + stats.totalRecruiters}
                </Typography>
                <Box sx={{ bgcolor: '#F3E5F5', p: 1.5, borderRadius: 2 }}>
                  <GroupIcon sx={{ fontSize: 28, color: '#8E24AA' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Right Column - Users Breakdown Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
              Users Breakdown
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 228,
                  height: 228,
                  borderRadius: '50%',
                  background: `conic-gradient(
                    ${chartData.map((d, i) =>
                      `${d.color} ${chartData.slice(0, i).reduce((a, b) => a + (b.value / totalUsers) * 100, 0)}% ${chartData.slice(0, i + 1).reduce((a, b) => a + (b.value / totalUsers) * 100, 0)}%`
                    ).join(', ')}
                  )`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Box sx={{ width: 140, height: 140, borderRadius: '50%', backgroundColor: '#fff' }} />
              </Box>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2 }}>
              {chartData.map((item, idx) => (
                <Typography key={idx} variant="body2">
                  <Box
                    component="span"
                    sx={{
                      width: 10,
                      height: 10,
                      backgroundColor: item.color,
                      display: 'inline-block',
                      mr: 1,
                    }}
                  />
                  {item.label}: {item.value}
                </Typography>
              ))}
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminStats;
