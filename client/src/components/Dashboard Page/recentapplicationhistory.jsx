import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Avatar,
  IconButton,
  CircularProgress,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getMyApplications, getJobById } from '../../utils/api';
import ApplicationDetailsPopup from '../applicationdetaislpopup';

const RecentApplicationHistory = () => {
  const [applications, setApplications] = useState([]);
  const [openApp, setOpenApp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const appData = await getMyApplications();

        const enrichedApps = await Promise.all(
          appData.map(async (app) => {
            let jobDetails = {};
            let jobId = app.job;

            if (typeof jobId === 'object' && jobId !== null && jobId._id) {
              jobId = jobId._id;
            }

            try {
              jobDetails = await getJobById(jobId);
            } catch (err) {
              console.warn(`Failed to fetch job details for app: ${app._id} (jobId: ${jobId})`, err);
            }

            return {
              ...app,
              jobDetails,
            };
          })
        );

        setApplications(enrichedApps);
      } catch (error) {
        console.error('Error fetching applications:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const phaseColorMap = {
    submitted: '#9e9e9e',       // grey
    reviewing: '#ffeb3b',       // yellow
    interview: '#2196f3',       // blue
    accepted: '#4caf50',        // green
    rejected: '#f44336',        // red
  };

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', border: '2px solid #e0e0e0', marginTop: 4 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#25324B', fontWeight: 'bold' }}>
        Recent Applications History
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        applications.slice(0, 5).map((app, index) => {
          const phase = app.status?.toLowerCase() || 'submitted';
          const backgroundColor = phaseColorMap[phase] || '#999';
          const textColor = ['reviewing', 'interview'].includes(phase) ? '#000' : '#fff';

          return (
            <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
              <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }} data-testid="application-card">
                <Box sx={{ flex: 3, display: 'flex', alignItems: 'center' }}>
                  <Avatar
                    sx={{
                      bgcolor: '#4caf50',
                      mr: 2,
                      width: 40,
                      height: 40,
                    }}
                  >
                    {app.jobDetails?.job_title?.[0]?.toUpperCase() || '?'}
                  </Avatar>
                  <Box>
                    <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000' }}>
                      {app.jobDetails?.job_title || 'Unknown Job'}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#666' }}>
                      {app.jobDetails?.location || 'Unknown Location'} • {app.jobDetails?.work_type || ''}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#999', mt: 0.5 }}>
                      {app.jobDetails?.job_description?.slice(0, 100) || 'No description available'}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ flex: 1, textAlign: 'center' }}>
                  <Typography variant="caption" sx={{ color: '#666' }}>
                    Date Applied
                  </Typography>
                  <Typography variant="body1" sx={{ color: '#000' }}>
                    {new Date(app.application_date).toLocaleDateString()}
                  </Typography>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                  <Button
                    variant="contained"
                    sx={{
                      backgroundColor,
                      color: textColor,
                      borderRadius: '16px',
                      padding: '4px 12px',
                      minWidth: '100px',
                      textTransform: 'capitalize',
                      '&:hover': { backgroundColor },
                    }}
                  >
                    {phase}
                  </Button>
                  <IconButton sx={{ color: '#666' }} onClick={() => setOpenApp(app)}>
                    <MoreVertIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          );
        })
      )}

      <Box sx={{ textAlign: 'center' }}>
        <Link to="/applications" style={{ textDecoration: 'none' }}>
          <Button
            variant="text"
            sx={{ color: '#4caf50', textTransform: 'none' }}
            endIcon={<ArrowForwardIcon />}
          >
            View all applications history
          </Button>
        </Link>
      </Box>

      {openApp && (
        <ApplicationDetailsPopup
          open={Boolean(openApp)}
          onClose={() => setOpenApp(null)}
          application={openApp}
        />
      )}
    </Box>
  );
};

export default RecentApplicationHistory;
