// app.js

import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

// Routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/userRoutes.js";
import cvRoutes from "./routes/cvRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import jobSkillRoutes from "./routes/jobSkillRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import jobSeekerRoutes from "./routes/jobSeekerRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import jobSeekerSkillRoutes from "./routes/jobSeekerSkillRoutes.js";
import experienceRoutes from "./routes/experienceRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import jobSearchRoutes from "./routes/jobSearchRoutes.js";
import skillRoutes from "./routes/skillRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";
import adminRoutes from "./routes/admin.js";
import certificationRoutes from "./routes/certificationRoutes.js";

// Path resolution
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize app
const app = express();

// Middleware
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL during development
    credentials: true, // allows cookies, auth headers if used
  })
);
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use(morgan("common"));

// Static file serving
app.use("/uploads", express.static(path.resolve("uploads")));
app.use("/assets", express.static(path.join(__dirname, "public/assets")));

// API Routes
app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/jobs", jobRoutes);
app.use("/cv", cvRoutes);
app.use("/job-skills", jobSkillRoutes);
app.use("/skills", skillRoutes);
app.use("/applications", applicationRoutes);
app.use("/job-seeker", jobSeekerRoutes);
app.use("/recruiter", recruiterRoutes);
app.use("/job-seeker/skills", jobSeekerSkillRoutes);
app.use("/job-seeker/experience", experienceRoutes);
app.use("/notifications", notificationRoutes);
app.use("/companies", companyRoutes);
app.use("/job-search", jobSearchRoutes); // renamed to avoid conflict with /jobs
app.use("/api/ai", aiRoutes);
app.use("/admin", adminRoutes);
app.use("/certifications", certificationRoutes);

// Default route
app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

export default app;
