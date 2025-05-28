// pages/ai-cv-tools.jsx

import { useState, useEffect } from "react";
import CVUploader from "../components/CVUploader";
import CVSelector from "../components/CVSelector";
import CVOptions from "../components/CVOptions";
import CVResults from "../components/CVResults";
import {
    fetchMyCVs,
    uploadCVtoAI,
    analyzeCV,
    recommendCV,
    recommendForJob,
    rewriteCV,
} from "../utils/api";

export default function AICVToolsPage() {
    const [token, setToken] = useState(""); // Replace with real auth later
    const [cvs, setCvs] = useState([]);
    const [selectedCV, setSelectedCV] = useState(null);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);

    // Get token from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem("authToken");
        if (stored) setToken(stored);
    }, []);

    // Fetch CVs when token is ready
    useEffect(() => {
        const loadCVs = async () => {
            const res = await fetchMyCVs(token);
            setCvs(res.cvs);
        };
        if (token) loadCVs();
    }, [token]);

    const handleUpload = async (file) => {
        setLoading(true);
        try {
            await uploadCVtoAI(file, token);
            const res = await fetchMyCVs(token);
            setCvs(res.cvs);
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async (action, jobDescription = "") => {
        if (!selectedCV) return;
        setLoading(true);
        setResult(null);

        const payload = {
            cvId: selectedCV._id,
            cvText: selectedCV.extractedText,
            ...(jobDescription && { jobDescription }),
        };

        try {
            let res;

            if (action === "analyze") res = await analyzeCV(payload, token);
            if (action === "recommend") res = await recommendCV(payload, token);
            if (action === "jobRecommend") res = await recommendForJob(payload, token);
            if (action === "rewrite") res = await rewriteCV(payload, token);

            console.log("✅ Action Response:", res);

            // Safely set result — fallback to res itself if res.result is undefined
            if (res?.result) {
                setResult(res.result);
            } else if (res?.error) {
                setResult({ error: res.error });
            } else {
                setResult({ error: "Unexpected response format" });
            }

        } catch (err) {
            console.error("🔥 API Call Failed:", err.response?.data || err.message);
            setResult({ error: err.response?.data?.error || err.message });
        } finally {
            setLoading(false);
        }
    };




    return (
        <div className="p-6 space-y-6 max-w-5xl mx-auto">
            <h1 className="text-2xl font-bold">🎯 AI CV Tools</h1>

            {!token ? (
                <div className="flex items-center space-x-4">
                    <input
                        type="text"
                        placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4MGE5ZWIzNWE0MmNiZjI4MWQ2NGVkZCIsInJvbGUiOiJqb2Jfc2Vla2VyIiwiaWF0IjoxNzQ3MDUzOTg1LCJleHAiOjE3NDcwNTc1ODV9.pSLM_7b0TLRynBe2Vk98LgwGKfNONy71J7PBpvocl7w"
                        className="border px-3 py-2 rounded w-full"
                        onChange={(e) => setToken(e.target.value)}
                    />
                </div>
            ) : (
                <>
                    <CVUploader onUpload={handleUpload} loading={loading} />
                    <CVSelector cvs={cvs} onSelect={setSelectedCV} selectedId={selectedCV?._id} />
                    {selectedCV && <CVOptions onAction={handleAction} disabled={loading} />}
                    {result && (
                        <div className="bg-white border p-4 rounded shadow">
                            {result.error ? (
                                <p className="text-red-600 font-medium">⚠️ {result.error}</p>
                            ) : (
                                <pre className="whitespace-pre-wrap text-sm">
                                    {typeof result === "object"
                                        ? JSON.stringify(result, null, 2)
                                        : result}
                                </pre>
                            )}
                        </div>
                    )}

                </>
            )}
        </div>
    );
}
