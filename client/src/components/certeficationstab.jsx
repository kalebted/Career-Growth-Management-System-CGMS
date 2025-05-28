import React, { useEffect, useRef, useState } from 'react';
import {
  Box, Typography, Button, TextField, Stack, List, ListItem, ListItemText,
  Snackbar, Alert, Tooltip
} from '@mui/material';
import { getCertifications, uploadCertification, deleteCertification } from '../utils/api';
import * as Yup from 'yup';
import { useFormik } from 'formik';

const CertificationsTab = () => {
  const [certs, setCerts] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const fileInputRef = useRef(null);

  const fetchCerts = async () => {
    try {
      const res = await getCertifications();
      setCerts(res);
    } catch (err) {
      console.error('Failed to fetch certifications:', err.message);
    }
  };

  useEffect(() => {
    fetchCerts();
  }, []);

  const validationSchema = Yup.object().shape({
    credential_url: Yup.string().url('Must be a valid URL').nullable()
  });

  const formik = useFormik({
    initialValues: { credential_url: '' },
    validationSchema,
    onSubmit: handleUpload
  });

  const handleFileSelect = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
      if (!allowedTypes.includes(selectedFile.type)) {
        setSnackbar({ open: true, message: 'Only PDF and image files (PNG, JPG) are allowed', severity: 'error' });
        fileInputRef.current.value = null;
        return;
      }

      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  async function handleUpload() {
    if (!file) {
      setSnackbar({ open: true, message: 'Please select a certificate file', severity: 'warning' });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('certificate_file', file, fileName || file.name);
      formData.append('credential_url', formik.values.credential_url || '');

      await uploadCertification(formData);
      setSnackbar({ open: true, message: 'Certification uploaded!', severity: 'success' });

      setFile(null);
      setFileName('');
      formik.resetForm();
      if (fileInputRef.current) fileInputRef.current.value = null;

      fetchCerts();
    } catch (err) {
      setSnackbar({ open: true, message: 'Upload failed', severity: 'error' });
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCertification(id);
      setSnackbar({ open: true, message: 'Certification deleted', severity: 'success' });
      fetchCerts();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box>
      <Typography variant="h6" mb={2}>My Certifications</Typography>

      <form onSubmit={formik.handleSubmit}>
        <Stack spacing={2} direction="row" alignItems="center" mb={3} flexWrap="wrap">
          <TextField
            label="Credential URL (optional)"
            name="credential_url"
            value={formik.values.credential_url}
            onChange={formik.handleChange}
            error={formik.touched.credential_url && Boolean(formik.errors.credential_url)}
            helperText={formik.touched.credential_url && formik.errors.credential_url}
            fullWidth
            sx={{ flex: 1, minWidth: '200px' }}
          />

          <Button variant="outlined" component="label">
            Select File
            <input
              hidden
              type="file"
              accept=".pdf, image/*"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />
          </Button>

          {file && (
            <Tooltip title="Rename file before upload (optional)">
              <TextField
                label="File Name"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                sx={{ width: 200 }}
              />
            </Tooltip>
          )}

          <Button type="submit" variant="contained" disabled={!file}>
            Add
          </Button>
        </Stack>
      </form>

      <List>
        {certs.map((cert) => (
          <ListItem key={cert._id} secondaryAction={
            <Button
              variant="outlined"
              color="error"
              onClick={() => handleDelete(cert._id)}
            >
              Delete
            </Button>
          }>
            <ListItemText
              primary={cert.credential_url || 'No URL'}
              secondary={cert.certificate_file}
            />
          </ListItem>
        ))}
      </List>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CertificationsTab;
