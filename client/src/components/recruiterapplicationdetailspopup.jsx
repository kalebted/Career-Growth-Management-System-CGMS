import React, { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Box,
  Divider,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { downloadCV, updateApplicationStatus } from '../utils/api';
import { Viewer, Worker } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const RecruiterApplicationDetailsPopup = ({ open, onClose, application }) => {
  const [cvBlobUrl, setCvBlobUrl] = useState(null);
  const { cover_letter, applied_cv, current_phase, _id } = application || {};
  const [phase, setPhase] = useState(current_phase || '');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    let objectUrl;

    const fetchPDF = async () => {
      if (!applied_cv?._id) return;
      try {
        const blob = await downloadCV(applied_cv._id);
        objectUrl = window.URL.createObjectURL(blob);
        setCvBlobUrl(objectUrl);
      } catch (err) {
        console.error('❌ Failed to fetch PDF blob:', err);
      }
    };

    if (open && applied_cv?._id) fetchPDF();

    return () => {
      if (objectUrl) window.URL.revokeObjectURL(objectUrl);
      setCvBlobUrl(null);
    };
  }, [open, applied_cv]);

  const handleDownload = async () => {
    try {
      const blob = await downloadCV(applied_cv._id);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', applied_cv.file_path.split('/').pop());
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('❌ Failed to download CV:', error);
    }
  };

  const handlePhaseUpdate = async () => {
    try {
      await updateApplicationStatus(_id, phase);
      setSnackbar({ open: true, message: 'Phase updated successfully.', severity: 'success' });
    } catch (err) {
      console.error('❌ Failed to update status:', err);
      setSnackbar({ open: true, message: 'Failed to update phase.', severity: 'error' });
    }
  };

  if (!application) return null;

  const isPhaseChanged = phase !== current_phase;

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle>Application Details</DialogTitle>
        <DialogContent dividers>
          <Typography variant="subtitle1" fontWeight="bold">Cover Letter:</Typography>
          <Typography variant="body2" whiteSpace="pre-wrap" gutterBottom>
            {cover_letter || 'N/A'}
          </Typography>

          <Divider sx={{ my: 2 }} />

          <Typography variant="subtitle1" fontWeight="bold">CV Used:</Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PictureAsPdfIcon color="action" />
            <Typography>{applied_cv?.file_path?.split('/').pop() || 'No file'}</Typography>
            <Button onClick={handleDownload} variant="outlined" size="small">Download</Button>
          </Box>

          <Box sx={{ mt: 2, height: '400px' }}>
            {cvBlobUrl ? (
              <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
                <Viewer fileUrl={cvBlobUrl} />
              </Worker>
            ) : (
              <Typography variant="body2" color="text.secondary">Loading preview...</Typography>
            )}
          </Box>

          <Divider sx={{ my: 3 }} />

          <FormControl fullWidth>
            <InputLabel id="phase-select-label">Application Phase</InputLabel>
            <Select
              labelId="phase-select-label"
              value={phase}
              label="Application Phase"
              onChange={(e) => setPhase(e.target.value)}
            >
              <MenuItem value="reviewing">Reviewing</MenuItem>
              <MenuItem value="interview">Interview</MenuItem>
              <MenuItem value="accepted">Accepted</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={handlePhaseUpdate}
            variant="contained"
            color="primary"
            disabled={!isPhaseChanged}
            sx={{
              ...(isPhaseChanged
                ? {}
                : {
                    backgroundColor: '#e0e0e0 !important',
                    color: '#9e9e9e !important',
                    cursor: 'not-allowed',
                  }),
            }}
          >
            Save Changes
          </Button>
          <Button onClick={onClose} color="secondary">Close</Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
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
    </>
  );
};

export default RecruiterApplicationDetailsPopup;
