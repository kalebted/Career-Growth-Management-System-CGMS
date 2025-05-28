import React, { useEffect, useState } from "react";
import {
  Box, Typography, TextField, Button, Stack, Avatar,
  Snackbar, Alert, CircularProgress
} from "@mui/material";
import { getRecruiterDetails, saveRecruiterDetails } from "../../utils/api";
import * as Yup from "yup";

const recruiterSchema = Yup.object().shape({
  location: Yup.string().required("Location is required"),
  contact_info: Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    phone: Yup.string()
      .matches(/^(\+251|0)?9\d{8}$/, "Phone must be a valid mobile number")
      .nullable(),
  }),
});

const RecruiterDetails = () => {
  const [form, setForm] = useState({
    location: "",
    contact_info: { email: "", phone: "" },
    picture: null,
  });
  const [initialForm, setInitialForm] = useState(null);
  const [isDirty, setIsDirty] = useState(false);
  const [filePreview, setFilePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await getRecruiterDetails();
        const safe = {
          location: res.location || "",
          contact_info: res.contact_info || { email: "", phone: "" },
          picture: res.picture || null,
        };
        setForm(safe);
        setInitialForm(safe);
        if (safe.picture) {
          setFilePreview(`http://localhost:3001${safe.picture}`);
        }
      } catch (err) {
        console.error("❌ Fetch recruiter details error:", err);
        const fallback = {
          location: "",
          contact_info: { email: "", phone: "" },
          picture: null,
        };
        setForm(fallback);
        setInitialForm(fallback);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    let updatedForm = { ...form };

    if (name === "picture" && files?.length > 0) {
      const file = files[0];
      updatedForm.picture = file;
      setFilePreview(URL.createObjectURL(file));
    } else if (name.startsWith("contact_info.")) {
      const key = name.split(".")[1];
      updatedForm.contact_info = { ...form.contact_info, [key]: value.trim() };
    } else {
      updatedForm[name] = value;
    }

    setForm(updatedForm);
    setIsDirty(JSON.stringify(updatedForm) !== JSON.stringify(initialForm));
  };

  const handleSubmit = async () => {
    try {
      await recruiterSchema.validate(form, { abortEarly: false });

      const formData = new FormData();
      formData.append("location", form.location || "");
      formData.append("email", form.contact_info.email || "");
      formData.append("phone", form.contact_info.phone || "");
      if (form.picture instanceof File) {
        formData.append("picture", form.picture);
      }

      const res = await saveRecruiterDetails(formData);
      const updated = {
        location: res.location || "",
        contact_info: res.contact_info || { email: "", phone: "" },
        picture: res.picture || null,
      };
      setForm(updated);
      setInitialForm(updated);
      setIsDirty(false);
      setFilePreview(updated.picture ? `http://localhost:3001${updated.picture}` : null);

      setSnackbar({
        open: true,
        message: "Profile updated!",
        severity: "success",
      });
    } catch (err) {
      console.error("❌ Save error:", err);
      const message =
        err.response?.data?.message ||
        (err.errors ? err.errors.join(" | ") : "Failed to update profile.");
      setSnackbar({
        open: true,
        message,
        severity: "error",
      });
    }
  };

  if (loading) {
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
        Recruiter Profile
      </Typography>

      <Box textAlign="center" mb={3}>
        <Avatar src={filePreview} sx={{ width: 100, height: 100, margin: "auto", mb: 2 }} />
        <Button variant="outlined" component="label">
          Upload Picture
          <input type="file" hidden name="picture" accept="image/*" onChange={handleChange} />
        </Button>
      </Box>

      <Stack spacing={3}>
        <TextField
          label="Location"
          name="location"
          value={form.location}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Email"
          name="contact_info.email"
          value={form.contact_info.email}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Phone"
          name="contact_info.phone"
          value={form.contact_info.phone}
          onChange={handleChange}
          fullWidth
        />
      </Stack>

      <Box textAlign="right" mt={4}>
        <Button variant="contained" onClick={handleSubmit} disabled={!isDirty}>
          Save Changes
        </Button>
      </Box>

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

export default RecruiterDetails;
