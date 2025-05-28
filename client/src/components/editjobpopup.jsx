import React, { useState } from 'react';
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, MenuItem, Button, Stack, Snackbar, Alert
} from '@mui/material';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { updateJob } from '../utils/api';

const validationSchema = Yup.object().shape({
  job_title: Yup.string().required('Job title is required'),
  job_description: Yup.string().required('Job description is required'),
  location: Yup.string().required('Location is required'),
  work_type: Yup.string().oneOf(['full-time', 'part-time', 'contract', 'internship']),
  work_mode: Yup.string().oneOf(['remote', 'on-site', 'hybrid']),
  job_category: Yup.string(),
  application_deadline: Yup.date().required('Application deadline is required')
});

const EditJobPopup = ({ open, onClose, job, onUpdated }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      await updateJob(job._id, values);
      setSnackbar({ open: true, message: 'Job updated successfully!', severity: 'success' });
      onUpdated();
      onClose();
    } catch (err) {
      console.error('Failed to update job:', err);
      const message = err.response?.data?.message || 'Something went wrong while updating the job.';
      setSnackbar({ open: true, message, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
        <DialogTitle>Edit Job Posting</DialogTitle>
        <Formik
          initialValues={{
            job_title: job?.job_title || '',
            job_description: job?.job_description || '',
            location: job?.location || '',
            work_type: job?.work_type || '',
            work_mode: job?.work_mode || '',
            job_category: job?.job_category || '',
            application_deadline: job?.application_deadline?.slice(0, 10) || ''
          }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Stack spacing={2}>
                  <TextField
                    label="Job Title"
                    name="job_title"
                    value={values.job_title}
                    onChange={handleChange}
                    error={touched.job_title && Boolean(errors.job_title)}
                    helperText={touched.job_title && errors.job_title}
                    fullWidth
                  />
                  <TextField
                    label="Job Description"
                    name="job_description"
                    multiline
                    rows={4}
                    value={values.job_description}
                    onChange={handleChange}
                    error={touched.job_description && Boolean(errors.job_description)}
                    helperText={touched.job_description && errors.job_description}
                    fullWidth
                  />
                  <TextField
                    label="Location"
                    name="location"
                    value={values.location}
                    onChange={handleChange}
                    error={touched.location && Boolean(errors.location)}
                    helperText={touched.location && errors.location}
                    fullWidth
                  />
                  <TextField
                    select
                    label="Work Type"
                    name="work_type"
                    value={values.work_type}
                    onChange={handleChange}
                    fullWidth
                  >
                    {["full-time", "part-time", "contract", "internship"].map(type => (
                      <MenuItem key={type} value={type}>{type}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    select
                    label="Work Mode"
                    name="work_mode"
                    value={values.work_mode}
                    onChange={handleChange}
                    fullWidth
                  >
                    {["remote", "on-site", "hybrid"].map(mode => (
                      <MenuItem key={mode} value={mode}>{mode}</MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Job Category"
                    name="job_category"
                    value={values.job_category}
                    onChange={handleChange}
                    fullWidth
                  />
                  <TextField
                    type="date"
                    label="Application Deadline"
                    name="application_deadline"
                    InputLabelProps={{ shrink: true }}
                    value={values.application_deadline}
                    onChange={handleChange}
                    error={touched.application_deadline && Boolean(errors.application_deadline)}
                    helperText={touched.application_deadline && errors.application_deadline}
                    fullWidth
                  />
                </Stack>
              </DialogContent>
              <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>Update</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

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

export default EditJobPopup;
