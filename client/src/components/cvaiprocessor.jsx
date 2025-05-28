// src/components/cvaiprocessor/CVAIProcessor.jsx

import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Button,
  Stack,
  TextField,
  MenuItem,
} from "@mui/material";
import {
  Search,
  TipsAndUpdates,
  Work,
  EditDocument,
  UploadFile,
} from "@mui/icons-material";

import {
  fetchMyCVs,
  uploadCVtoAI,
  analyzeCV,
  recommendCV,
  recommendForJob,
  rewriteCV,
} from "../utils/api";

const CVAIProcessor = () => {
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);
  const [results, setResults] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [statusIndex, setStatusIndex] = useState(0);
  const [colorIndex, setColorIndex] = useState(0);
  const [actionType, setActionType] = useState("");


  useEffect(() => {
    const statusTimer = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % 5);
    }, 10000); // every 10 seconds

    const colorTimer = setInterval(() => {
      setColorIndex((prev) => (prev + 1) % 5);
    }, 5000); // every 5 seconds

    return () => {
      clearInterval(statusTimer);
      clearInterval(colorTimer);
    };
  }, []);


  useEffect(() => {
    const loadCVs = async () => {
      try {
        const data = await fetchMyCVs();
        setCvs(data?.cvs || data);
      } catch (err) {
        console.error("❌ Failed to load CVs:", err.message);
      }
    };
    loadCVs();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
    setLoading(true);
    try {
      const result = await uploadCVtoAI(selectedFile);

      // ✅ Construct consistent CV object for frontend
      const newCV = {
        _id: result.cvId,
        extractedText: result.extractedText,
        originalFileName: selectedFile.name,
        createdAt: new Date().toISOString(),
      };

      setCvs((prev) => [...prev, newCV]);
      setSelectedCV(newCV);
      setSelectedFile(null);
    } catch (err) {
      console.error("❌ Upload error:", err.message);
      setResults({ error: "Failed to upload CV" });
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (type) => {
  if (!selectedCV || !selectedCV._id || !selectedCV.extractedText) {
    setResults({ error: "Please select a valid CV first." });
    return;
  }

  setLoading(true);
  setActionType(type); // Track which action triggered this request

  const payload = {
    cvText: selectedCV.extractedText,
    cvId: selectedCV._id,
    jobDescription: jobDescription.trim(),
  };

  try {
    let res;
    if (type === "analyze") res = await analyzeCV(payload);
    else if (type === "recommend") res = await recommendCV(payload);
    else if (type === "recommendJob") res = await recommendForJob(payload);
    else if (type === "rewrite") res = await rewriteCV(payload);
    setResults(res);
  } catch (err) {
    setResults({ error: err?.response?.data?.error || err.message });
  } finally {
    setLoading(false);
  }
};


  return (
    <Box className="p-6 space-y-6 max-w-5xl mx-auto">
      <Typography variant="h5" className="font-bold text-gray-800">
        🎯 CV AI Toolkit
      </Typography>

      {/* Upload CV */}
      <Stack spacing={2}>
        <TextField
          type="file"
          inputProps={{ accept: ".pdf,.doc,.docx" }}
          onChange={handleFileChange}
        />
        <Button
          variant="outlined"
          startIcon={<UploadFile />}
          onClick={handleUpload}
          disabled={!selectedFile || loading}
        >
          Upload
        </Button>
      </Stack>

      {/* Select CV */}
      <TextField
        select
        fullWidth
        label="Select an Uploaded CV"
        value={selectedCV?._id || ""}
        onChange={(e) => {
          const selected = cvs.find((cv) => cv._id === e.target.value);
          setSelectedCV(selected);
        }}
        sx={{ mt: 3 }}
      >
        <MenuItem value="">-- Choose CV --</MenuItem>
        {cvs.map((cv) => (
          <MenuItem key={cv._id} value={cv._id}>
            {cv.originalFileName || cv._id}
          </MenuItem>
        ))}
      </TextField>

      {/* AI Buttons */}
      <Stack direction="row" spacing={2} flexWrap="wrap" rowGap={2} mt={3}>
        <Button
          variant="outlined"
          startIcon={<Search />}
          onClick={() => handleAction("analyze")}
          disabled={loading}
        >
          Analyze CV
        </Button>
        <Button
          variant="outlined"
          startIcon={<TipsAndUpdates />}
          onClick={() => handleAction("recommend")}
          disabled={loading}
          sx={{
            borderColor: "#ffc107",
            color: "#ffc107",
            "&:hover": {
              borderColor: "#e0a800",
              backgroundColor: "#fff3cd",
            },
          }}
        >
          General Tips
        </Button>
        <Button
          variant="outlined"
          startIcon={<EditDocument />}
          onClick={() => handleAction("rewrite")}
          disabled={loading}
          sx={{
            borderColor: "#28a745",
            color: "#28a745",
            "&:hover": {
              borderColor: "#218838",
              backgroundColor: "#e6f5ea",
            },
          }}
        >
          Rewrite CV
        </Button>
      </Stack>

      {/* Job-Specific Tips */}
      <TextField
        label="Job Description (for tailored tips)"
        multiline
        rows={3}
        fullWidth
        value={jobDescription}
        onChange={(e) => setJobDescription(e.target.value)}
        sx={{ mt: 3 }}
      />
      <Button
        variant="outlined"
        startIcon={<Work />}
        onClick={() => handleAction("recommendJob")}
        disabled={!jobDescription.trim() || loading}
      >
        Job-Specific Tips
      </Button>

      {/* Loading Spinner */}
      {loading && (
        <Box className="flex justify-center items-center flex-col my-6 space-y-3">
          <CircularProgress
            size={40}
            sx={{
              color: ["#f44336", "#ff9800", "#4caf50", "#2196f3", "#9c27b0"][colorIndex],
              transition: "color 0.3s ease",
            }}
          />
          <Typography className="text-sm font-medium text-gray-700">
            {[
              "⏳ Extracting...",
              "⌛ Analysing...",
              "🕰️ Synthesising...",
              "🔄 Compiling...",
              "🟡 Extracting..."
            ][statusIndex]}
          </Typography>
        </Box>
      )}



      {/* Result Display */}
      {results && (
        <Box className="bg-white border p-4 rounded shadow text-sm whitespace-pre-wrap mt-4">
          {results.error ? (
            <Typography className="text-red-600 font-medium">
              ⚠️ {results.error}
            </Typography>
          ) : results?.result?.sections ? (
            <>
              <Typography variant="subtitle1" className="font-bold mb-2">
                🛠 Skills
              </Typography>
              <ul className="list-disc pl-5 mb-4">
                {results.result.sections.skills?.map((skill, i) => (
                  <li key={i}>{skill}</li>
                ))}
              </ul>

              <Typography variant="subtitle1" className="font-bold mb-2">
                🎓 Education
              </Typography>
              <p className="mb-4">{results.result.sections.education}</p>

              <Typography variant="subtitle1" className="font-bold mb-2">
                💼 Experience Summary
              </Typography>
              <p>{results.result.sections.experienceSummary}</p>

              <Typography variant="subtitle1" className="font-bold mb-2 mt-4">
                🧰 Tech Stack
              </Typography>
              <ul className="list-disc pl-5">
                {results.result.sections.techStack?.map((tech, i) => (
                  <li key={i}>{tech}</li>
                ))}
              </ul>
            </>
          ) : results?.result?.recommendations ? (
            <>
              <Typography variant="subtitle1" className="font-bold mb-2">
                💡 {actionType === "recommendJob" ? "Job-Specific Recommendations" : "General Recommendations"}
              </Typography>

              <ul className="list-disc pl-5">
                {results.result.recommendations.map((rec, idx) => (
                  <li key={idx}>
                    <strong>{rec.type.replace(/_/g, " ").toUpperCase()}:</strong>{" "}
                    {rec.message}
                  </li>
                ))}
              </ul>
            </>
          ) : results?.result?.rewrittenSections ? (
            <>
              <Typography variant="subtitle1" className="font-bold mb-2">
                ✍️ Rewritten Summary
              </Typography>
              <p className="mb-4">{results.result.rewrittenSections.summary}</p>

              <Typography variant="subtitle1" className="font-bold mb-2">
                💼 Rewritten Experience
              </Typography>
              <pre className="whitespace-pre-wrap break-words">
                {(() => {
                  try {
                    const experience = JSON.parse(results.result.rewrittenSections.experience);
                    return experience.map((exp, idx) => (
                      <div key={idx} className="mb-2">
                        <strong>{exp.title}</strong> at {exp.company} ({exp.location})
                      </div>
                    ));
                  } catch {
                    return <span>{results.result.rewrittenSections.experience}</span>;
                  }
                })()}
              </pre>
            </>
          ) : (
            <pre>{JSON.stringify(results, null, 2)}</pre>
          )}
        </Box>
      )}





    </Box>
  );
};

export default CVAIProcessor;
