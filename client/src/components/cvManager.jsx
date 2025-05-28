// src/components/CVManager.jsx

import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Snackbar, Alert, Stack } from "@mui/material";
import { getMyCVs, uploadCV, deleteCV, downloadCV } from "../utils/api";
import DownloadIcon from '@mui/icons-material/Download';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import DeleteIcon from '@mui/icons-material/Delete';

const CVManager = () => {
  const [mainCV, setMainCV] = useState(null);
  const [file, setFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    fetchCVs();
  }, []);

  const fetchCVs = async () => {
    try {
      const cvs = await getMyCVs();
      const originalCV = cvs.find(cv => cv.for_job == null);
      setMainCV(originalCV || null);
    } catch (error) {
      console.error("Failed to fetch CVs", error);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    try {
      const formData = new FormData();
      formData.append("cvFile", file);
      await uploadCV(formData);
      setSnackbar({ open: true, message: "CV uploaded successfully!", severity: "success" });
      setFile(null);
      fetchCVs();
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: "Upload failed!", severity: "error" });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteCV(mainCV._id);
      setSnackbar({ open: true, message: "CV deleted.", severity: "success" });
      setMainCV(null);
      fetchCVs();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
    try {
      const blob = await downloadCV(mainCV._id);
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'CV.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Failed to download CV", error);
    }
  };

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#25324B' }}>
          My Main CV
        </Typography>

        {mainCV ? (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              sx={{
                borderColor: "#28a745",
                color: "#28a745",
                "&:hover": { borderColor: "#218838", backgroundColor: "#e6f5ea" }
              }}
            >
              Download
            </Button>

            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                borderColor: "#ffc107",
                color: "#ffc107",
                "&:hover": { borderColor: "#e0a800", backgroundColor: "#fff3cd" }
              }}
            >
              Replace
              <input
  type="file"
  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  hidden
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!validTypes.includes(file.type)) {
        setSnackbar({ open: true, message: "Only PDF or DOCX files are allowed", severity: "error" });
        return;
      }
      setFile(file);
    }
  }}
/>

            </Button>

              <Button
                variant="outlined"
                startIcon={<DeleteIcon />}
                color="error"
                onClick={handleDelete}
              >
                Delete
              </Button>

            {file && (
              <Button
                variant="contained"
                onClick={handleUpload}
                sx={{ backgroundColor: "#28a745", "&:hover": { backgroundColor: "#218838" } }}
              >
                Upload Replacement
              </Button>
            )}
          </Stack>
        ) : (
          <Stack direction="row" spacing={2}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadFileIcon />}
              sx={{
                borderColor: "#28a745",
                color: "#28a745",
                "&:hover": { borderColor: "#218838", backgroundColor: "#e6f5ea" }
              }}
            >
              Upload CV
             <input
  type="file"
  accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  hidden
  onChange={(e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = [
        "application/pdf",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      ];
      if (!validTypes.includes(file.type)) {
        setSnackbar({ open: true, message: "Only PDF or DOCX files are allowed", severity: "error" });
        return;
      }
      setFile(file);
    }
  }}
/>

            </Button>

            {file && (
              <Button
                variant="contained"
                onClick={handleUpload}
                sx={{ backgroundColor: "#28a745", "&:hover": { backgroundColor: "#218838" } }}
              >
                Submit
              </Button>
            )}
          </Stack>
        )}
      </Stack>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default CVManager;
