import React from "react";
import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import Sidebar from "../components/common/sidebar";
import AppBarComponent from "../components/common/appbarcomp";

const faqs = [
  {
    title: "How do I upload a CV?",
    content:
      "Go to the CV AI Toolkit page, choose a PDF or DOCX file, and click the Upload button."
  },
  {
    title: "What file formats are supported?",
    content: "You can upload .pdf, .doc, or .docx files up to 5MB in size."
  },
  {
    title: "What does Analyze CV do?",
    content:
      "It uses AI to extract content from your CV and give you insights into its quality and structure."
  },
  {
    title: "What are General vs Job-Specific Tips?",
    content:
      "General tips improve your CV overall. Job-specific tips tailor your CV based on a job description you provide."
  },
  {
    title: "What does Rewrite CV do?",
    content:
      "This feature rewrites your CV using AI to improve clarity, relevance, and formatting."
  },
  {
    title: "How do I apply to a job?",
    content:
      "Go to Find Jobs, select a job posting, and click Apply. You’ll be able to select a CV, add a cover letter, and choose relevant skills."
  },
  {
    title: "Is my data private?",
    content:
      "Yes. Only you and authorized recruiters can view your uploaded CVs. All files are securely stored."
  },
];

const HelpPage = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "#fafafa",
          ml: "0px",
          width: "calc(100% - 240px)",
          backgroundColor: "white",
          minHeight: "100vh",
        }}
      >
        <AppBarComponent />

        <Box className="p-6 max-w-5xl mx-auto space-y-6">
          <Typography variant="h4" gutterBottom className="font-bold text-gray-800">
            🆘 Help Center
          </Typography>
          <Typography variant="body1" className="text-gray-600">
            Get answers to common questions and learn how to use the CV AI tools and job application features effectively.
          </Typography>

          <Divider />

          <Box mt={4}>
            {faqs.map((faq, idx) => (
              <Accordion key={idx} className="mb-2">
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Typography className="font-medium">{faq.title}</Typography>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography variant="body2">{faq.content}</Typography>
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>

          <Box mt={8} textAlign="center">
            <Typography variant="body2">
              Still need help? Contact us at{" "}
              <strong className="text-blue-600">support@example.com</strong>
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default HelpPage;
