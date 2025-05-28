import axios from "axios";
import API from "./axiosInstance";

const API_URL = "http://localhost:3001";

// ----------------------
// AI (via unified API instance)
// ----------------------

export const fetchMyCVs = async () => {
  const res = await API.get("/api/ai/my-cvs");
  return res.data;
};

export const uploadCVtoAI = async (file) => {
  const formData = new FormData();
  formData.append("cv", file);
  const res = await API.post("/api/ai/upload-cv", formData);
  return res.data;
};

export const analyzeCV = async (payload) => {
  const res = await API.post("/api/ai/analyze-cv", payload);
  return res.data;
};

export const recommendCV = async (payload) => {
  const res = await API.post("/api/ai/recommend-cv", payload);
  return res.data;
};

export const recommendForJob = async (payload) => {
  const res = await API.post("/api/ai/recommend-specific-job", payload);
  return res.data;
};

export const rewriteCV = async (payload) => {
  const res = await API.post("/api/ai/rewrite-cv", payload);
  return res.data;
};

export const getCVText = async (cvId) => {
  const res = await API.get(`/api/ai/cv-text/${cvId}`);
  return res.data;
};

// ----------------------
// AUTH
// ----------------------

export const registerUser = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);
  return response.data;
};

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/auth/login`, credentials);
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await API.get(`${API_URL}/users/me`);
  return response.data;
};

// ----------------------
// RECRUITER DETAILS (with optional picture upload)
// ----------------------

export const getRecruiterDetails = async () => {
  const response = await API.get(`${API_URL}/recruiter`);
  return response.data;
};

export const saveRecruiterDetails = async (formData) => {
  const response = await API.post(`${API_URL}/recruiter`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};
// ----------------------
// COMPANY
// ----------------------

export const getAllCompanies = async () => {
  const response = await API.get(`/companies`);
  return response.data;
};

export const getCompanyById = async (companyId) => {
  const response = await API.get(`/companies/${companyId}`);
  return response.data;
};

export const getCompaniesByRecruiter = async () => {
  const res = await API.get(`/companies/recruiter/my`);
  return res.data;
};

export const createCompany = async (data) => {
  const formData = new FormData();

  formData.append("name", data.name ?? "");
  formData.append("industry", data.industry ?? "");
  formData.append("profile", data.profile ?? "");
  formData.append("description", data.description ?? "");
  formData.append("website", data.website ?? "");
  formData.append("founded_date", data.founded_date ?? "");
  formData.append(
    "employees_count",
    data.employees_count ? String(data.employees_count) : ""
  );

  if (data.logo instanceof File) {
    formData.append("logo", data.logo);
  }

  // ✅ Send locations as plain string
  formData.append("locations", data.locations ?? "");

  // ✅ Flatten contacts
  if (data.contacts && typeof data.contacts === "object") {
    for (const key in data.contacts) {
      if (data.contacts[key] !== undefined && data.contacts[key] !== null) {
        formData.append(`contacts[${key}]`, String(data.contacts[key]));
      }
    }
  }

  const response = await API.post(`/companies`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const updateCompany = async (companyId, data) => {
  const response = await API.put(`/companies/${companyId}`, data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteCompany = async (companyId) => {
  const response = await API.delete(`/companies/${companyId}`);
  return response.data;
};

// --- Add this to your utils/api.js ---

export const getMyJobPosts = async () => {
  const response = await API.get("/jobs/my");
  return response.data;
};
// POST New Job
export const createJob = async (jobData) => {
  const response = await API.post("/jobs", jobData);
  return response.data;
};
export const getJobSeekerDetails = async () => {
  const res = await API.get("/job-seeker");
  return res.data;
};

export const uploadJobSeekerDetails = async (formData) => {
  const res = await API.post("/job-seeker", formData);
  return res.data;
};
export const uploadCV = async (formData) => {
  const res = await API.post("/cv/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Get all CVs of the user
export const getMyCVs = async () => {
  const res = await API.get("/cv/me");
  return res.data;
};

// Delete a CV
export const deleteCV = async (cvId) => {
  const res = await API.delete(`/cv/${cvId}`);
  return res.data;
};

// Download a CV
export const downloadCV = async (cvId) => {
  const res = await API.get(`/cv/download/${cvId}`, { responseType: "blob" });
  return res.data;
};
export const searchJobs = async (queryString = "") => {
  const response = await API.get(`/jobs/search?${queryString}`);
  return response.data;
};
export const getAllJobs = async () => {
  const res = await API.get("/jobs");
  return res.data;
};
// utils/api.js

export const applyToJob = async (
  jobId,
  cvId,
  { cover_letter, skills, experience }
) => {
  const body = {
    jobId,
    cvId,
    cover_letter,
    skills,
    experience,
  };

  console.log("📤 Sending to /applications:", body);

  const res = await API.post("/applications", body);
  return res.data;
};

// ✅ Get all experiences
export const getExperiences = async () => {
  const res = await API.get("/job-seeker/experience");
  return res.data;
};

// ✅ Add new experience
export const addExperience = async (experienceData) => {
  const res = await API.post("/job-seeker/experience", experienceData);
  return res.data;
};

// ✅ Update experience by ID
export const updateExperience = async (id, updatedData) => {
  const res = await API.put(`/job-seeker/experience/${id}`, updatedData);
  return res.data;
};

// ✅ Delete experience by ID
export const deleteExperience = async (id) => {
  const res = await API.delete(`/job-seeker/experience/${id}`);
  return res.data;
};
// ✅ Get all skills
export const getMySkills = async () => {
  const res = await API.get("/job-seeker/skills");
  return res.data;
};

// ✅ Add a skill
export const addSkill = async ({ skill_id, proficiency_level }) => {
  const res = await API.post("/job-seeker/skills", {
    skill_id,
    proficiency_level,
  });
  return res.data;
};

// ✅ Remove a skill by ID
export const removeSkill = async (skillId) => {
  const res = await API.delete(`/job-seeker/skills/${skillId}`);
  return res.data;
};
// in utils/api.js
export const getAllSkillOptions = async () => {
  const res = await API.get("/skills");
  return res.data;
};
export const searchSkills = async (query) => {
  const res = await API.get(`/skills`, {
    params: { search: query },
  });
  return res.data;
};
// ✅ Get a job by ID
export const getJobById = async (jobId) => {
  const res = await API.get(`/jobs/${jobId}`);
  return res.data;
};
// ✅ Get all applications for the logged-in job seeker
export const getMyApplications = async () => {
  const res = await API.get("/applications/my");
  return res.data;
};

export const getApplicationsForJob = async (jobId) => {
  const res = await API.get(`/applications/job/${jobId}`);
  return res.data;
};
export const updateJobStatus = async (jobId, status) => {
  const response = await API.put(`/jobs/${jobId}/status`, { status });
  return response.data;
};
export const updateJob = async (jobId, updatedData) => {
  const res = await API.put(`/jobs/${jobId}`, updatedData);
  return res.data;
};
// export const updateApplicationPhase = async (applicationId, phase) => {
//   const res = await API.put(`/applications/${applicationId}/phase`, { phase });
//   return res.data;
// };
export const updateApplicationPhase = async (applicationId, data) => {
  const res = await API.put(`/applications/${applicationId}/phase`, data); // expects { status: ... }
  return res.data;
};

export const updateUserProfile = async (data) => {
  const res = await API.put("/users/me", data);
  return res.data;
};
// Add this anywhere near your user/auth API section
export const deleteAccount = async (password) => {
  const res = await API.delete("/users/me", {
    data: { password },
  });
  return res.data;
};
export const getNotifications = async () => {
  const res = await API.get("/notifications");
  return res.data;
};

// Mark a single notification as read
export const markNotificationAsRead = async (id) => {
  const res = await API.put(`/notifications/${id}/read`);
  return res.data;
};

// Delete a notification
export const deleteNotification = async (id) => {
  const res = await API.delete(`/notifications/${id}`);
  return res.data;
};
export const setGoogleUserRole = async ({ userId, role }) => {
  const res = await API.post("/auth/set-role", { userId, role });
  return res.data;
};

export const updateApplicationStatus = async (applicationId, status) => {
  const res = await API.put(`/applications/${applicationId}/status`, { status });
  return res.data;
};
export const getAdminDashboard = async () => {
  const res = await API.get('/admin/dashboard');
  return res.data;
};
export const getAllUsersByRole = async (role) => {
  const res = await API.get(`/admin/users/${role}`);
  return res.data;
};

export const deleteUserById = async (id) => {
  const res = await API.delete(`/admin/users/${id}`);
  return res.data;
};

export const markAllNotificationsAsRead = async () => {
  const res = await API.patch(`/notifications/mark-all-read`);
  return res.data;
};
export const getCertifications = async () => {
  const res = await API.get('/certifications');
  return res.data;
};

export const uploadCertification = async (formData) => {
  const res = await API.post('/certifications', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteCertification = async (id) => {
  const res = await API.delete(`/certifications/${id}`);
  return res.data;
};
