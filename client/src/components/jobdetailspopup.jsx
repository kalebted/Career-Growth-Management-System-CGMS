import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Typography, List, ListItem, ListItemText, Snackbar, Alert
} from '@mui/material';
import { getApplicationsForJob, updateJobStatus } from '../utils/api';
import RecruiterApplicationDetailsPopup from './recruiterapplicationdetailspopup';

const JobDetailsPopup = ({ open, onClose, job, onEdit }) => {
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (job?._id) {
      const fetchApps = async () => {
        try {
          const apps = await getApplicationsForJob(job._id);
          setApplications(apps);
        } catch (err) {
          console.error('Error loading applications:', err);
        } finally {
          setLoading(false);
        }
      };
      fetchApps();
    }
  }, [job]);

  const handleStatusChange = async () => {
    const newStatus = job.status === 'open' ? 'closed' : 'open';
    try {
      await updateJobStatus(job._id, newStatus);
      job.status = newStatus;
      setSnackbar({
        open: true,
        message: `Job successfully ${newStatus === 'open' ? 'reopened' : 'closed'}.`,
        severity: 'success'
      });
    } catch (err) {
      console.error('Failed to update job status:', err);
      setSnackbar({
        open: true,
        message: 'Failed to update job status.',
        severity: 'error'
      });
    }
  };

  const refreshApplications = async () => {
    try {
      const apps = await getApplicationsForJob(job._id);
      setApplications(apps);
    } catch (err) {
      console.error('Failed to refresh applications:', err);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ pr: 5, position: 'relative' }}>
          Manage Job: {job?.job_title}
          <Button
            onClick={onClose}
            variant="outlined"
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              minWidth: 0,
              width: 28,
              height: 28,
              padding: 0,
              borderRadius: '4px',
              borderColor: '#f44336',
              color: '#f44336',
              fontWeight: 'bold',
              fontSize: '0.85rem',
              lineHeight: 1,
              '&:hover': {
                bgcolor: '#f44336',
                color: '#fff',
                borderColor: '#f44336',
              }
            }}
          >
            X
          </Button>
        </DialogTitle>

        <DialogContent dividers>
          <Typography variant="subtitle2" sx={{ mb: 2 }}>
            Applications ({applications.length})
          </Typography>
          <List>
            {applications.map((app) => (
              <ListItem
                key={app._id}
                alignItems="flex-start"
                sx={{ cursor: 'pointer' }}
                onClick={() => setSelectedApp(app)}
              >
                <ListItemText
                  primary={app.user?.full_name || app.user?.name || 'Anonymous'}
                  secondary={`Phase: ${app.status || 'N/A'}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handleStatusChange}
            variant="outlined"
            color={job?.status === 'open' ? 'error' : 'success'}
          >
            {job?.status === 'open' ? 'Close Job' : 'Reopen Job'}
          </Button>

          <Button onClick={() => onEdit?.(job)} color="primary" variant="outlined">
            Edit Job
          </Button>
        </DialogActions>
      </Dialog>

      {selectedApp && (
        <RecruiterApplicationDetailsPopup
          open={Boolean(selectedApp)}
          onClose={() => {
            setSelectedApp(null);
            refreshApplications();
          }}
          application={selectedApp}
        />
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JobDetailsPopup;
