// // src/pages/ai-tools.jsx
// import React, { useState, useEffect } from "react";
// import CVUploader from "../components/CVUploader";
// import CVSelector from "../components/CVSelector";
// import CVOptions from "../components/CVOptions";
// import CVResults from "../components/CVResults";
// import { fetchMyCVs, uploadCVtoAI, analyzeCV, recommendCV, recommendForJob, rewriteCV } from "../utils/api";

// const CVToolsPage = () => {
//   const [cvs, setCvs] = useState([]);
//   const [selectedCV, setSelectedCV] = useState(null);
//   const [results, setResults] = useState(null);

//   useEffect(() => {
//     const loadCVs = async () => {
//       const data = await fetchMyCVs();
//       setCvs(data);
//     };
//     loadCVs();
//   }, []);

//   const handleUpload = async (file) => {
//     const result = await uploadCVtoAI(file);
//     setCvs((prev) => [...prev, result]);
//     setSelectedCV(result);
//   };

//   const handleAction = async (type, jobDescription = "") => {
//     if (!selectedCV) return;
//     const payload = { cvText: selectedCV.extractedText, cvId: selectedCV._id, jobDescription };

//     if (type === "analyze") {
//       const res = await analyzeCV(payload);
//       setResults(res);
//     } else if (type === "recommend") {
//       const res = await recommendCV(payload);
//       setResults(res);
//     } else if (type === "recommendJob") {
//       const res = await recommendForJob(payload);
//       setResults(res);
//     } else if (type === "rewrite") {
//       const res = await rewriteCV(payload);
//       setResults(res);
//     }
//   };

//   return (
//     <div className="p-6 max-w-5xl mx-auto space-y-6">
//       <h1 className="text-2xl font-bold">CV AI Toolkit</h1>
//       <CVUploader onUpload={handleUpload} />
//       <CVSelector cvs={cvs} onSelect={setSelectedCV} selectedCV={selectedCV} />
//       <CVOptions onAction={handleAction} />
//       <CVResults results={results} />
//     </div>
//   );
// };

// export default CVToolsPage;
