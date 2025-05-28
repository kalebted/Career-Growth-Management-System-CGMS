import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Typography, Button, Box, Divider
} from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { downloadCV } from '../utils/api';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const ApplicationDetailsPopup = ({ open, onClose, application }) => {
  const [cvBlobUrl, setCvBlobUrl] = useState(null);
  const { cover_letter, applied_cv, jobDetails } = application || {};

  useEffect(() => {
    let objectUrl;

    const fetchPDF = async () => {
      if (!applied_cv?._id) return;
      try {
        const blob = await downloadCV(applied_cv._id);
        objectUrl = window.URL.createObjectURL(blob);
        setCvBlobUrl(objectUrl);
      } catch (err) {
        console.error("❌ Failed to load CV preview:", err);
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

  if (!application) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Application Details</DialogTitle>
      <DialogContent dividers>
        <Typography variant="subtitle1" fontWeight="bold">Job Title:</Typography>
        <Typography variant="body1" gutterBottom>{jobDetails?.job_title}</Typography>

        <Divider sx={{ my: 2 }} />

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

        <Box sx={{ mt: 2 }}>
          {cvBlobUrl ? (
            <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js">
              <Viewer fileUrl={cvBlobUrl} />
            </Worker>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Loading preview...
            </Typography>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ApplicationDetailsPopup;
