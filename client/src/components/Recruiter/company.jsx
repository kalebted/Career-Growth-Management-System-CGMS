import React, { useEffect, useState } from 'react';
import {
  Box, Typography, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
  Card, CardContent, Avatar, CircularProgress, Snackbar, Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useAuth } from '../../utils/authcontext';
import { getCompaniesByRecruiter, createCompany, updateCompany } from '../../utils/api';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

// ✅ Updated Validation Schema
const CompanySchema = Yup.object().shape({
  name: Yup.string()
    .required('Required')
    .matches(/^[A-Za-z\s]+$/, 'Name must not contain numbers'),
  industry: Yup.string()
    .required('Required')
    .matches(/^[A-Za-z\s]+$/, 'Industry must not contain numbers'),
  profile: Yup.string()
    .matches(/^[A-Za-z\s]*$/, 'Profile must not contain numbers'),
  description: Yup.string(),
  website: Yup.string().url('Invalid URL'),
  locations: Yup.string(),
  founded_date: Yup.date().nullable(),
  employees_count: Yup.number().typeError('Must be a number').nullable(),
  contacts: Yup.object().shape({
    email: Yup.string().email('Invalid email'),
    phone: Yup.string(),
    linkedin: Yup.string()
      .matches(
        /^https?:\/\/(www\.)?linkedin\.com\/.*$/i,
        'Must be a valid LinkedIn URL (e.g., https://linkedin.com/in/username)'
      )
      .nullable(),
    other: Yup.string(),
  })
});

const Company = () => {
  const { user } = useAuth();
  const [company, setCompany] = useState(null);
  const [companyId, setCompanyId] = useState(null);
  const [previewLogo, setPreviewLogo] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchCompany = async () => {
      try {
        const companies = await getCompaniesByRecruiter();
        if (companies.length > 0) {
          const companyData = companies[0];
          setCompany(companyData);
          setCompanyId(companyData._id);
          setPreviewLogo(`http://localhost:3001${companyData.logo}`);
        }
      } catch (err) {
        console.error('Error loading company data:', err);
        setSnackbar({ open: true, message: 'Error loading company data.', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchCompany();
  }, []);

  const handleLogoUpload = (event, setFieldValue) => {
    const file = event.target.files[0];
    if (file) {
      setFieldValue('logo', file);
      setPreviewLogo(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      if (values.contacts.linkedin && !values.contacts.linkedin.startsWith('http')) {
        values.contacts.linkedin = `https://${values.contacts.linkedin}`;
      }

      const formData = new FormData();
      for (const [key, val] of Object.entries(values)) {
        if (key === 'contacts') {
          for (const [cKey, cVal] of Object.entries(val)) {
            formData.append(`contacts[${cKey}]`, cVal || '');
          }
        } else if (key === 'logo' && val instanceof File) {
          formData.append('logo', val);
        } else {
          formData.append(key, val || '');
        }
      }

      let response;
      if (companyId) {
        response = await updateCompany(companyId, formData);
      } else {
        response = await createCompany(values);
        setCompanyId(response._id);
      }

      setCompany(response.company || response);
      setSnackbar({ open: true, message: 'Company saved! 🎉', severity: 'success' });
      setOpen(false);
    } catch (err) {
      console.error('❌ Submission error:', err);
      const errorMessage =
        err.response?.data?.message ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(' | ')
          : 'Failed to save company.');
      setSnackbar({ open: true, message: errorMessage, severity: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box p={2} sx={{ bgcolor: '#fff', borderRadius: 2, boxShadow: 1, mt: 8 }}>
      <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#25324B', mb: 2 }}>
        Company Profile
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={5}>
          <CircularProgress color="secondary" />
          <Typography mt={2}>Fetching company details...</Typography>
        </Box>
      ) : company ? (
        <Card variant="outlined" sx={{ display: 'flex', alignItems: 'center', p: 3 }}>
          <Avatar src={previewLogo} sx={{ width: 64, height: 64, mr: 2 }} />
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography variant="h6">{company.name}</Typography>
            <Typography variant="body2" color="text.secondary">{company.industry}</Typography>
          </CardContent>
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setOpen(true)}
            sx={{
              borderColor: "#1976d2",
              color: "#1976d2",
              "&:hover": {
                borderColor: "#1565c0",
                backgroundColor: "#e3f2fd",
              },
            }}
          >
            Edit
          </Button>
        </Card>
      ) : (
        <Box textAlign="center" mt={4}>
          <Typography>No company associated yet.</Typography>
          <Button variant="contained" onClick={() => setOpen(true)}>Add Company</Button>
        </Box>
      )}

      <Dialog open={open} onClose={() => setOpen(false)} fullWidth maxWidth="md">
        <DialogTitle>{company ? 'Edit Company' : 'Add Company'}</DialogTitle>
        <Formik
          initialValues={{
            name: company?.name || '',
            industry: company?.industry || '',
            profile: company?.profile || '',
            description: company?.description || '',
            website: company?.website || '',
            founded_date: company?.founded_date?.slice(0, 10) || '',
            employees_count: company?.employees_count || '',
            locations: company?.locations || '',
            logo: null,
            contacts: {
              email: company?.contacts?.email || '',
              phone: company?.contacts?.phone || '',
              linkedin: company?.contacts?.linkedin || '',
              other: company?.contacts?.other || ''
            }
          }}
          validationSchema={CompanySchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, handleChange, setFieldValue, isSubmitting }) => (
            <Form>
              <DialogContent>
                <Box textAlign="center" mb={3}>
                  <Avatar src={previewLogo} sx={{ width: 80, height: 80, mb: 2 }} />
                  <Button variant="outlined" component="label">
                    Upload Company Logo
                    <input hidden type="file" accept="image/*" onChange={e => handleLogoUpload(e, setFieldValue)} />
                  </Button>
                </Box>

                {[
                  ['name', 'Name'],
                  ['industry', 'Industry'],
                  ['profile', 'Profile'],
                  ['description', 'Description', true],
                  ['website', 'Website'],
                  ['locations', 'Locations (comma-separated)'],
                  ['founded_date', 'Founded Date', false, 'date'],
                  ['employees_count', 'Employees Count', false, 'number'],
                ].map(([name, label, multiline = false, type = 'text']) => (
                  <TextField
                    key={name}
                    fullWidth
                    name={name}
                    label={label}
                    value={values[name]}
                    onChange={handleChange}
                    error={touched[name] && Boolean(errors[name])}
                    helperText={touched[name] && errors[name]}
                    multiline={multiline}
                    rows={multiline ? 3 : undefined}
                    type={type}
                    sx={{ mt: 2 }}
                    InputLabelProps={type === 'date' ? { shrink: true } : undefined}
                  />
                ))}

                {['email', 'phone', 'linkedin', 'other'].map(field => (
                  <TextField
                    key={field}
                    fullWidth
                    name={`contacts.${field}`}
                    label={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={values.contacts[field]}
                    onChange={handleChange}
                    error={touched.contacts?.[field] && Boolean(errors.contacts?.[field])}
                    helperText={touched.contacts?.[field] && errors.contacts?.[field]}
                    sx={{ mt: 2 }}
                  />
                ))}
              </DialogContent>
              <DialogActions>
                <Button onClick={() => setOpen(false)}>Cancel</Button>
                <Button type="submit" variant="contained" disabled={isSubmitting}>
                  {company ? 'Update' : 'Create'}
                </Button>
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

export default Company;
