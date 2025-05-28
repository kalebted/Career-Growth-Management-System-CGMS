import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Card, CardContent, Stack, Snackbar, Alert, CircularProgress
} from "@mui/material";
import { getMyCVs, deleteCV, downloadCV, getJobById } from "../utils/api";

const CVHistory = () => {
  const [cvs, setCVs] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    setLoading(true);
    try {
      const rawCVs = await getMyCVs();
      const filtered = rawCVs.filter(cv => cv.for_job != null);

      const enrichedCVs = await Promise.all(filtered.map(async (cv) => {
        try {
          const job = await getJobById(cv.for_job);
          return { ...cv, job_title: job.job_title || "Unknown Job" };
        } catch (err) {
          console.error("Error fetching job title", err);
          return { ...cv, job_title: "Unknown Job" };
        }
      }));

      setCVs(enrichedCVs);
    } catch (error) {
      console.error("Failed to fetch CVs", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (cvId) => {
    try {
      const blob = await downloadCV(cvId);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed", error);
    }
  };

  const handleDelete = async (cvId) => {
    try {
      await deleteCV(cvId);
      setSnackbar({ open: true, message: "CV deleted.", severity: "success" });
      fetchCVs();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        CV History
      </Typography>

      {loading ? (
        <Box textAlign="center" mt={4}>
          <CircularProgress color="secondary" />
        </Box>
      ) : cvs.length === 0 ? (
        <Typography>No previous CVs uploaded for jobs yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {cvs.map((cv) => (
            <Card key={cv._id} variant="outlined">
              <CardContent sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box>
                  <Typography variant="subtitle1">
                    Uploaded: {new Date(cv.created_at).toLocaleDateString()}
                  </Typography>
                  <Typography variant="body2">
                    For Job: {cv.job_title}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={2}>
                  <Button variant="outlined" onClick={() => handleDownload(cv._id)}>Download</Button>
                  <Button variant="outlined" color="error" onClick={() => handleDelete(cv._id)}>Delete</Button>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CVHistory;
