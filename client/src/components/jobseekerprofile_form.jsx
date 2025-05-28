import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Stack, Avatar, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { uploadJobSeekerDetails, getJobSeekerDetails } from "../utils/api";

const validationSchema = Yup.object({
  full_name: Yup.string().required("Full name is required"),
  address: Yup.string().required("Address is required"),
  phone_number: Yup.string()
    .required("Phone number is required")
    .matches(/^[+]?[0-9\s-]{7,15}$/, "Invalid phone number"),
  job_field: Yup.string().required("Job field is required"),
});

const MyProfileForm = () => {
  const [initialValues, setInitialValues] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(true);
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getJobSeekerDetails();
        setInitialValues({
          full_name: res.full_name || "",
          address: res.address || "",
          phone_number: res.phone_number || "",
          job_field: res.job_field || "",
        });
        if (res.picture) {
          setFilePreview(`http://localhost:3001${res.picture}`);
        }
      } catch (err) {
        if (err.response?.status === 404) {
          const empty = {
            full_name: "",
            address: "",
            phone_number: "",
            job_field: "",
          };
          setInitialValues(empty);
        } else {
          console.error("Failed to load profile:", err);
          setSnackbar({ open: true, message: "Failed to load profile.", severity: "error" });
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, []);

  const handleSubmit = async (values) => {
    try {
      const formData = new FormData();
      formData.append("full_name", values.full_name);
      formData.append("address", values.address);
      formData.append("phone_number", values.phone_number);
      formData.append("job_field", values.job_field);
      if (file) formData.append("picture", file);

      const res = await uploadJobSeekerDetails(formData);
      setSnackbar({ open: true, message: "Profile updated successfully!", severity: "success" });
      if (res.details.picture) {
        setFilePreview(`http://localhost:3001${res.details.picture}`);
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Failed to update profile.", severity: "error" });
    }
  };

  if (loading || !initialValues) {
    return (
      <Box textAlign="center" mt={5}>
        <CircularProgress thickness={4} color="secondary" />
        <Typography mt={2} variant="body2" color="text.secondary">
          Loading profile...
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ fontWeight: "bold", color: "#25324B", mb: 3 }}>
        My Profile
      </Typography>

      <Box textAlign="center" mb={3}>
        <Avatar src={filePreview} sx={{ width: 100, height: 100, margin: "auto", mb: 2 }} />
        <Button variant="outlined" component="label">
          Upload Picture
          <input
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => {
              const f = e.target.files[0];
              setFile(f);
              setFilePreview(URL.createObjectURL(f));
            }}
          />
        </Button>
      </Box>

      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, handleChange, handleBlur, errors, touched }) => (
          <Form>
            <Stack spacing={3}>
              <TextField
                label="Full Name"
                name="full_name"
                value={values.full_name}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.full_name && Boolean(errors.full_name)}
                helperText={touched.full_name && errors.full_name}
                fullWidth
              />
              <TextField
                label="Address"
                name="address"
                value={values.address}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.address && Boolean(errors.address)}
                helperText={touched.address && errors.address}
                fullWidth
              />
              <TextField
                label="Phone Number"
                name="phone_number"
                value={values.phone_number}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.phone_number && Boolean(errors.phone_number)}
                helperText={touched.phone_number && errors.phone_number}
                fullWidth
              />
              <TextField
                label="Job Field"
                name="job_field"
                value={values.job_field}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.job_field && Boolean(errors.job_field)}
                helperText={touched.job_field && errors.job_field}
                fullWidth
              />
            </Stack>

            <Box textAlign="right" mt={4}>
              <Button variant="contained" type="submit">
                Save Changes
              </Button>
            </Box>
          </Form>
        )}
      </Formik>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MyProfileForm;
