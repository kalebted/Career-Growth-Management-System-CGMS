import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box, Typography, Grid, Card, Button
} from '@mui/material';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useAuth } from '../../utils/authcontext';
import { getMyApplications } from '../../utils/api';

const ApplicationStats = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'User';

  const [applications, setApplications] = useState([]);
  const [phaseCounts, setPhaseCounts] = useState({});

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getMyApplications();
        setApplications(data);

        const counts = {
          submitted: 0,
          reviewing: 0,
          interview: 0,
          accepted: 0,
          rejected: 0,
        };

        data.forEach(app => {
          const phase = app.status || 'submitted';
          if (counts.hasOwnProperty(phase)) {
            counts[phase]++;
          }
        });

        setPhaseCounts(counts);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    };

    fetchApplications();
  }, []);

  const totalJobsApplied = applications.length;
  const chartData = [
    { label: 'Submitted', color: '#9e9e9e', value: phaseCounts.submitted || 0 },
    { label: 'Reviewing', color: '#ffeb3b', value: phaseCounts.reviewing || 0 },
    { label: 'Interview', color: '#2196f3', value: phaseCounts.interview || 0 },
    { label: 'Accepted', color: '#4caf50', value: phaseCounts.accepted || 0 },
    { label: 'Rejected', color: '#f44336', value: phaseCounts.rejected || 0 },
  ];
  const total = chartData.reduce((acc, p) => acc + p.value, 0);

  return (
    <Box sx={{ mt: 10, px: 3 }}>
      <Box sx={{ mb: 6 }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#25324B' }}>
          Good morning, {firstName}
        </Typography>
        <Typography variant="body2" sx={{ color: '#6B7280' }}>
          Here is what’s happening with your job applications.
        </Typography>
      </Box>

      <Grid container spacing={6} justifyContent="center" alignItems="flex-start">
        {/* Stats Cards - Two Columns */}
        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Total Jobs Applied
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {totalJobsApplied}
                </Typography>
                <Box sx={{ bgcolor: '#E8F0FE', p: 1.5, borderRadius: 2 }}>
                  <WorkOutlineIcon sx={{ fontSize: 28, color: '#055F08' }} />
                </Box>
              </Box>
            </Card>

            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Submitted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1}}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {phaseCounts.submitted || 0}
                </Typography>
                <Box sx={{ bgcolor: '#f5f5f5', p: 1.5, borderRadius: 2 }}>
                  <HourglassEmptyIcon sx={{ fontSize: 28, color: '#9e9e9e' }} />
                </Box>
              </Box>
            </Card>

            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Reviewing
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {phaseCounts.reviewing || 0}
                </Typography>
                <Box sx={{ bgcolor: '#FFF9C4', p: 1.5, borderRadius: 2 }}>
                  <HourglassEmptyIcon sx={{ fontSize: 28, color: '#fbc02d' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box display="flex" flexDirection="column" gap={3}>
            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Interview
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {phaseCounts.interview || 0}
                </Typography>
                <Box sx={{ bgcolor: '#BBDEFB', p: 1.5, borderRadius: 2 }}>
                  <QuestionAnswerIcon sx={{ fontSize: 28, color: '#1976d2' }} />
                </Box>
              </Box>
            </Card>
    
            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Accepted
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 6 }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {phaseCounts.accepted || 0}
                </Typography>
                <Box sx={{ bgcolor: '#C8E6C9', p: 1.5, borderRadius: 2 }}>
                  <CheckCircleIcon sx={{ fontSize: 28, color: '#388e3c' }} />
                </Box>
              </Box>
            </Card>

            <Card sx={{ p: 4 }}>
              <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1, textAlign: 'center' }}>
                Rejected
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>
                  {phaseCounts.rejected || 0}
                </Typography>
                <Box sx={{ bgcolor: '#FFCDD2', p: 1.5, borderRadius: 2 }}>
                  <CancelIcon sx={{ fontSize: 28, color: '#d32f2f' }} />
                </Box>
              </Box>
            </Card>
          </Box>
        </Grid>

        {/* Chart Section */}
        <Grid item xs={12} md={10} mt={6}>
          <Card sx={{ p: 5, textAlign: 'center' }}>
            <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 3 }}>
              Application Phase Breakdown
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
              <Box
                sx={{
                  width: 228,
                  height: 228,
                  borderRadius: '50%',
                  background: `conic-gradient(
                    ${chartData.map((d, i) =>
                      `${d.color} ${chartData.slice(0, i).reduce((a, b) => a + (b.value / total) * 100, 0)}% ${chartData.slice(0, i + 1).reduce((a, b) => a + (b.value / total) * 100, 0)}%`
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

            <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 2, mb: 2 }}>
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

            <Link to="/applications" style={{ textDecoration: 'none' }}>
              <Button variant="text" sx={{ color: '#055F08' }}>
                View All Applications
              </Button>
            </Link>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ApplicationStats;
