import React, { useState } from 'react';
import {
  Box, Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Typography, MenuItem, Chip, Stack, Snackbar, Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useAuth } from '../../utils/authcontext';
import { createJob, searchSkills } from '../../utils/api';
import Autocomplete from '@mui/material/Autocomplete';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  job_title: Yup.string().required('Job title is required'),
  job_description: Yup.string().required('Job description is required'),
  location: Yup.string().required('Location is required'),
  work_type: Yup.string().oneOf(['full-time', 'part-time', 'contract', 'internship'], 'Invalid work type'),
  work_mode: Yup.string().oneOf(['remote', 'on-site', 'hybrid'], 'Invalid work mode'),
  job_category: Yup.string(),
  application_deadline: Yup.date()
  .required('Application deadline is required')
  .min(new Date(Date.now() + 86400000), 'Deadline must be a future date')

});

const PostJobs = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [requirementInput, setRequirementInput] = useState('');
  const [requirements, setRequirements] = useState([]);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [skills, setSkills] = useState([]);
  const [skillOptions, setSkillOptions] = useState([]);
  const [loadingSkills, setLoadingSkills] = useState(false);
  const [proficiencyInput, setProficiencyInput] = useState('beginner');

  const initialValues = {
    job_title: '',
    job_description: '',
    location: '',
    work_type: '',
    work_mode: '',
    job_category: '',
    application_deadline: ''
  };

  const handleSkillSearch = async (query) => {
    if (!query.trim()) return;
    try {
      setLoadingSkills(true);
      const results = await searchSkills(query);
      setSkillOptions(results);
    } catch (err) {
      console.error('Skill search failed', err);
    } finally {
      setLoadingSkills(false);
    }
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setRequirements(prev => [...prev, requirementInput.trim()]);
      setRequirementInput('');
    }
  };

  const handleAddSkill = () => {
    if (selectedSkill) {
      setSkills(prev => [...prev, {
        skill: selectedSkill._id,
        name: selectedSkill.skill_name,
        proficiency_level: proficiencyInput
      }]);
      setSelectedSkill(null);
      setProficiencyInput('beginner');
    }
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const jobData = {
        ...values,
        requirements,
        required_skills: skills.map(skill => ({
          skill: skill.skill,
          proficiency_level: skill.proficiency_level
        })),
        hiring_process: []
      };

      await createJob(jobData);
      setSnackbar({ open: true, message: 'Job posted successfully!', severity: 'success' });
      setRequirements([]);
      setSkills([]);
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to post job.', severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 8 }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#25324B' }}>Post a Job</Typography>
        <Button variant="outlined" startIcon={<AddIcon />} onClick={() => setOpen(true)}>Create New Job</Button>
      </Box>

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>Create a New Job Posting</DialogTitle>
        <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
          {({ values, handleChange, errors, touched, isSubmitting }) => (
            <Form>
              <DialogContent sx={{ mt: 2 }}>
                <TextField name="job_title" label="Job Title" fullWidth sx={{ mb: 2 }} value={values.job_title} onChange={handleChange} error={touched.job_title && Boolean(errors.job_title)} helperText={touched.job_title && errors.job_title} />
                <TextField name="job_description" label="Job Description" multiline rows={4} fullWidth sx={{ mb: 2 }} value={values.job_description} onChange={handleChange} error={touched.job_description && Boolean(errors.job_description)} helperText={touched.job_description && errors.job_description} />
                <TextField name="location" label="Location" fullWidth sx={{ mb: 2 }} value={values.location} onChange={handleChange} error={touched.location && Boolean(errors.location)} helperText={touched.location && errors.location} />
                <TextField select name="work_type" label="Work Type" fullWidth sx={{ mb: 2 }} value={values.work_type} onChange={handleChange} error={touched.work_type && Boolean(errors.work_type)} helperText={touched.work_type && errors.work_type}>
                  {["full-time", "part-time", "contract", "internship"].map(type => <MenuItem key={type} value={type}>{type}</MenuItem>)}
                </TextField>
                <TextField select name="work_mode" label="Work Mode" fullWidth sx={{ mb: 2 }} value={values.work_mode} onChange={handleChange} error={touched.work_mode && Boolean(errors.work_mode)} helperText={touched.work_mode && errors.work_mode}>
                  {["remote", "on-site", "hybrid"].map(mode => <MenuItem key={mode} value={mode}>{mode}</MenuItem>)}
                </TextField>
                <TextField name="job_category" label="Job Category" fullWidth sx={{ mb: 2 }} value={values.job_category} onChange={handleChange} />
                <TextField name="application_deadline" type="date" label="Application Deadline" fullWidth InputLabelProps={{ shrink: true }} sx={{ mb: 2 }} value={values.application_deadline} onChange={handleChange} error={touched.application_deadline && Boolean(errors.application_deadline)} helperText={touched.application_deadline && errors.application_deadline} />

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 3 }}>Requirements</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <TextField label="Add Requirement" value={requirementInput} onChange={(e) => setRequirementInput(e.target.value)} sx={{ flex: 1 }} />
                  <Button variant="contained" onClick={handleAddRequirement}>Add</Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                  {requirements.map((req, index) => (
                    <Chip key={index} label={req} onDelete={() => setRequirements(requirements.filter((_, i) => i !== index))} color="primary" />
                  ))}
                </Stack>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold', mt: 4 }}>Required Skills</Typography>
                <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                  <Autocomplete
                    options={skillOptions}
                    loading={loadingSkills}
                    getOptionLabel={(option) => option.skill_name || ''}
                    value={selectedSkill}
                    onInputChange={(e, val) => handleSkillSearch(val)}
                    onChange={(e, val) => setSelectedSkill(val)}
                    renderInput={(params) => <TextField {...params} label="Search Skill" sx={{ width: '300px' }} />}
                  />
                  <TextField select label="Proficiency" value={proficiencyInput} onChange={(e) => setProficiencyInput(e.target.value)} sx={{ width: 150 }}>
                    {["beginner", "intermediate", "expert"].map(level => <MenuItem key={level} value={level}>{level}</MenuItem>)}
                  </TextField>
                  <Button variant="contained" onClick={handleAddSkill}>Add</Button>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ mt: 2, flexWrap: 'wrap' }}>
                  {skills.map((skill, index) => (
                    <Chip key={index} label={`${skill.name} (${skill.proficiency_level})`} onDelete={() => setSkills(skills.filter((_, i) => i !== index))} color="secondary" />
                  ))}
                </Stack>
              </DialogContent>
              <DialogActions sx={{ p: 2 }}>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>Post Job</Button>
              </DialogActions>
            </Form>
          )}
        </Formik>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default PostJobs;
