import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid, Paper, Chip, Link, Avatar, Snackbar, Alert } from '@mui/material';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { useNavigate } from 'react-router-dom';
import { getAllJobs, getJobSeekerDetails } from '../../utils/api';
import { useAuth } from '../../utils/authcontext'; // Added
import JobApplyPopup from '../jobapply_popup';

const styles = {
  container: {
    padding: { xs: '2rem 0.5rem', sm: '3rem 1rem' },
    backgroundColor: 'white',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    mb: '1.5rem',
  },
  title: {
    fontWeight: 'bold',
    fontSize: { xs: '1.25rem', sm: '1.5rem' },
    color: '#1a3c5e',
    textTransform: 'uppercase',
  },
  link: {
    display: 'flex',
    alignItems: 'center',
    color: '#1e7c2e',
    fontWeight: 500,
    textDecoration: 'none',
    fontSize: { xs: '0.9rem', sm: '1rem' },
    '&:hover': { textDecoration: 'underline' },
  },
  paper: {
    p: '19px',
    width: '219px',
    height: '226px',
    border: '1px solid #D6DDEB',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    '&:hover': {
      boxShadow: '0 8px 24px rgba(0, 0, 0, 0.1)',
      transform: 'translateY(-5px)',
    },
  },
  avatar: { width: '38px', height: '38px', background: '#C4C4C4' },
  chip: {
    p: '3px 10px',
    height: '27px',
    border: '1px solid #055F08',
    '& .MuiChip-label': {
      fontFamily: "'Epilogue', sans-serif",
      fontSize: '13px',
      color: '#055F08',
    },
  },
  position: {
    fontFamily: "'Epilogue', sans-serif",
    fontWeight: 600,
    fontSize: '14px',
    color: '#25324B',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  meta: {
    fontFamily: "'Epilogue', sans-serif",
    fontSize: '13px',
    color: '#515B6F',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  description: {
    fontFamily: "'Inter', sans-serif",
    fontSize: '13px',
    color: '#7C8493',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical',
  },
  categoryChip: {
    p: '3px 13px',
    height: '24px',
    borderRadius: '80px',
    '& .MuiChip-label': {
      fontFamily: "'Epilogue', sans-serif",
      fontWeight: 600,
      fontSize: '11px',
    },
  },
};

const FeaturedJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth(); // Added
  const [jobs, setJobs] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'error' });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await getAllJobs();
        setJobs(data.slice(0, 8)); // limit to 8
      } catch (err) {
        console.error('Error fetching jobs:', err.message);
      }
    };
    fetchJobs();
  }, []);

  const handleJobClick = async (jobId) => {
    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please log in to apply for jobs.',
        severity: 'error',
      });
      return;
    }

    try {
      await getJobSeekerDetails(); // Check if user has filled in details
      setSelectedJobId(jobId);
      setShowPopup(true);
    } catch {
      setSnackbar({
        open: true,
        message: 'Please complete your job seeker profile before applying.',
        severity: 'warning',
      });
    }
  };

  return (
    <Box sx={styles.container}>
      <Box sx={styles.header}>
        <Typography variant="h5" sx={styles.title}>
          Latest jobs
        </Typography>
        <Link component="button" onClick={() => navigate('/find_jobs')} sx={styles.link}>
          Show all jobs
          <ArrowForwardIcon sx={{ fontSize: '1rem', ml: '0.5rem' }} />
        </Link>
      </Box>

      <Grid container spacing={2} justifyContent="center">
        {jobs.map((job, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{ display: 'flex', justifyContent: 'center' }}>
            <Paper sx={styles.paper} onClick={() => handleJobClick(job._id)}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: '13px' }}>
                <Avatar src="/default-logo.png" alt={job.recruiter?.name || 'Company'} sx={styles.avatar} />
                <Chip label={job.work_type} sx={styles.chip} />
              </Box>
              <Typography sx={styles.position}>{job.job_title}</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Typography sx={styles.meta}>{job.recruiter?.name || 'Unknown'}</Typography>
                <Box sx={{ width: '3px', height: '3px', background: '#515B6F', opacity: 0.3, borderRadius: '50%' }} />
                <Typography sx={styles.meta}>{job.location}</Typography>
              </Box>
              <Typography sx={styles.description}>{job.job_description}</Typography>
              <Box sx={{ display: 'flex', gap: '6px', mt: '13px' }}>
                {job.required_skills?.slice(0, 2).map((s, idx) => (
                  <Chip
                    key={idx}
                    label={s.skill?.skill_name || 'N/A'}
                    sx={{
                      ...styles.categoryChip,
                      background: idx === 0 ? 'rgba(235, 133, 51, 0.1)' : 'rgba(86, 205, 173, 0.1)',
                      '& .MuiChip-label': {
                        color: idx === 0 ? '#FFB836' : '#56CDAD',
                      },
                    }}
                  />
                ))}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <JobApplyPopup
        open={showPopup}
        jobId={selectedJobId}
        onClose={() => setShowPopup(false)}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default FeaturedJobs;
