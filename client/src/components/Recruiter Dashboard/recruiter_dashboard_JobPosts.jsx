import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Card, CardContent, Button, Avatar, IconButton, CircularProgress
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { getMyJobPosts, getRecruiterDetails, getCompanyById } from '../../utils/api';
import JobDetailsPopup from '../jobdetailspopup';
import EditJobPopup from '../editjobpopup'; // ✅ Make sure this is correctly imported
import { Link } from 'react-router-dom';

const RecentJobPosts = () => {
  const [jobs, setJobs] = useState([]);
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [editJob, setEditJob] = useState(null); // ✅ edit modal state

  const fetchJobsAndCompany = async () => {
    try {
      const recruiter = await getRecruiterDetails();
      if (recruiter?.company) {
        const companyId = typeof recruiter.company === 'object' ? recruiter.company._id : recruiter.company;
        const companyData = await getCompanyById(companyId);
        setCompany(companyData);
      }
      const jobPosts = await getMyJobPosts();
      setJobs(jobPosts);
    } catch (err) {
      console.error('Failed to fetch jobs or company', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobsAndCompany();
  }, []);

  return (
    <Box sx={{ p: 3, bgcolor: '#fff', border: '2px solid #e0e0e0', marginTop: 4, borderRadius: 2 }}>
      <Typography variant="h6" sx={{ mb: 2, color: '#25324B', fontWeight: 'bold' }}>
        Recent Job Posts
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress thickness={4} color="secondary" />
          <Typography mt={2} variant="body2" color="text.secondary">
            Loading jobs, please wait...
          </Typography>
        </Box>
      ) : jobs.length > 0 ? (
        jobs.slice(0, 5).map((job, index) => (
          <Card key={index} sx={{ mb: 2, boxShadow: 1 }}>
            <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ flex: 3, display: 'flex', alignItems: 'center' }}>
                <Avatar
                  src={company?.logo ? `http://localhost:3001${company.logo}` : undefined}
                  alt={company?.name || "Company"}
                  sx={{ width: 40, height: 40, mr: 2 }}
                >
                  {!company?.logo && company?.name?.[0]}
                </Avatar>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: '#000' }}>
                    {job.job_title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666' }}>
                    {company?.name} • {job.location} • {job.work_type}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ flex: 1, textAlign: 'center' }}>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  Date Posted
                </Typography>
                <Typography variant="body1" sx={{ color: '#000' }}>
                  {new Date(job.posting_date).toLocaleDateString()}
                </Typography>
              </Box>
              <Box sx={{ flex: 1, display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 1 }}>
                <Box
                  sx={{
                    display: 'inline-block',
                    backgroundColor: job.status === 'open' ? '#4caf50' : '#f44336',
                    color: '#fff',
                    borderRadius: '16px',
                    padding: '5px 10px',
                    minWidth: '80px',
                    textAlign: 'center',
                    textTransform: 'capitalize',
                    fontSize: '0.75rem'
                  }}
                >
                  {job.status}
                </Box>
                <IconButton sx={{ color: '#666' }} onClick={() => setSelectedJob(job)}>
                  <MoreVertIcon />
                </IconButton>
              </Box>
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary" textAlign="center" mt={3}>
          No job posts yet.
        </Typography>
      )}

      <Box sx={{ textAlign: 'center', mt: 2 }}>
        <Link to="/jop_posts" style={{ textDecoration: 'none' }}>
          <Button variant="text" sx={{ color: '#4caf50', textTransform: 'none' }} endIcon={<ArrowForwardIcon />}>
            View all Job Posts
          </Button>
        </Link>
      </Box>

      {/* 🔽 Popups */}
      <JobDetailsPopup
        open={Boolean(selectedJob)}
        job={selectedJob}
        onClose={() => setSelectedJob(null)}
        onEdit={(job) => {
          setEditJob(job);
          setSelectedJob(null);
        }}
      />

      <EditJobPopup
        open={Boolean(editJob)}
        job={editJob}
        onClose={() => setEditJob(null)}
        onUpdated={fetchJobsAndCompany}
      />
    </Box>
  );
};

export default RecentJobPosts;
