// src/components/JobApplyPopup.jsx

import React, { useEffect, useState, useRef } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, MenuItem, Select, Typography, TextField,
  CircularProgress, Box, Snackbar, Alert
} from '@mui/material';
import { getMyCVs, applyToJob, uploadCV } from '../utils/api';

const MAX_WORDS = 300;

const JobApplyPopup = ({ open, onClose, jobId }) => {
  const [cvs, setCvs] = useState([]);
  const [selectedCv, setSelectedCv] = useState('');
  const [newCvFile, setNewCvFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (open) fetchData();
  }, [open]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const cvData = await getMyCVs();
      setCvs(cvData);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load CVs', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!validTypes.includes(file.type)) {
        setSnackbar({ open: true, message: "Only PDF or DOCX files are allowed", severity: "error" });
        if (fileInputRef.current) fileInputRef.current.value = null;
        return;
      }
      setNewCvFile(file);
      setSelectedCv('');
    }
  };

  const countWords = (text) => text.trim().split(/\s+/).filter(Boolean).length;

  const handleApply = async () => {
    const wordCount = countWords(coverLetter);

    if (!selectedCv && !newCvFile) {
      setSnackbar({ open: true, message: 'Please select or upload a CV.', severity: 'error' });
      return;
    }

    if (wordCount > MAX_WORDS) {
      setSnackbar({
        open: true,
        message: `Cover letter exceeds ${MAX_WORDS} word limit.`,
        severity: 'error'
      });
      return;
    }

    setSubmitting(true);
    try {
      let finalCvId = selectedCv;

      if (newCvFile) {
        const formData = new FormData();
        formData.append('cvFile', newCvFile); // 🔥 Ensure backend expects 'cvFile' key
        formData.append('for_job', jobId);

        const uploadResponse = await uploadCV(formData);
        finalCvId = uploadResponse._id;
        setNewCvFile(null);
        if (fileInputRef.current) fileInputRef.current.value = null;
      }

      await applyToJob(jobId, finalCvId, {
        cover_letter: coverLetter,
        skills: [],
        experience: []
      });

      setSnackbar({ open: true, message: 'Successfully applied!', severity: 'success' });
      setTimeout(onClose, 1200);
    } catch (err) {
      console.error('❌ Application failed', err);
      setSnackbar({ open: true, message: 'Failed to apply', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Apply for this Job</DialogTitle>
        <DialogContent>
          {loading ? (
            <Box textAlign="center"><CircularProgress /></Box>
          ) : (
            <>
              <Typography variant="subtitle2" mt={2}>Select Existing CV</Typography>
              <Select
                fullWidth
                value={selectedCv}
                onChange={(e) => {
                  setSelectedCv(e.target.value);
                  setNewCvFile(null);
                  if (fileInputRef.current) fileInputRef.current.value = null;
                }}
                displayEmpty
                sx={{ mb: 2 }}
              >
                <MenuItem value="" disabled>Select a CV</MenuItem>
                {cvs.map((cv) => (
                  <MenuItem key={cv._id} value={cv._id}>
                    {cv.file_path?.split('/').pop() || 'CV'}
                  </MenuItem>
                ))}
              </Select>

              <Typography variant="subtitle2">Or Upload a New CV (PDF/DOCX)</Typography>
              <input
                type="file"
                accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ marginBottom: '1rem' }}
              />
              {newCvFile && (
                <Typography variant="body2" color="text.secondary" mb={2}>
                  Selected file: {newCvFile.name}
                </Typography>
              )}

              <Typography variant="subtitle2" sx={{ mt: 2 }}>
                Cover Letter (Max {MAX_WORDS} words)
              </Typography>
              <TextField
                fullWidth
                multiline
                minRows={4}
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                error={countWords(coverLetter) > MAX_WORDS}
                helperText={
                  countWords(coverLetter) > MAX_WORDS
                    ? `Word limit exceeded by ${countWords(coverLetter) - MAX_WORDS} words`
                    : `${countWords(coverLetter)} / ${MAX_WORDS} words`
                }
              />
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleApply}
            disabled={(!selectedCv && !newCvFile) || submitting}
            sx={{ bgcolor: '#055F08', '&:hover': { bgcolor: '#034c06' } }}
          >
            {submitting ? 'Applying...' : 'Submit Application'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default JobApplyPopup;
