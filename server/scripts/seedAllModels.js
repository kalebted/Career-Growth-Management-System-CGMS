import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// Import all models
import User from "../models/User.js";
import Company from "../models/Company.js";
import JobPosting from "../models/jobPosting.js";
import CV from "../models/cv.js";
import Application from "../models/Application.js";
import RecruiterDetails from "../models/recruiterDetails.js";
import JobSeekerDetails from "../models/JobSeekerDetails.js";
import Experience from "../models/Experience.js";
import Skills from "../models/skills.js";
import JobSeekerSkills from "../models/JobSeekerSkills.js";
import Certification from "../models/Certification.js";
import Notification from "../models/Notification.js";
import JobRecommendation from "../models/JobRecommendations.js";
import JobSkills from "../models/jobSkills.js";

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

try {
  // Clear all collections
  await Promise.all([
    User.deleteMany({}),
    Company.deleteMany({}),
    JobPosting.deleteMany({}),
    CV.deleteMany({}),
    Application.deleteMany({}),
    RecruiterDetails.deleteMany({}),
    JobSeekerDetails.deleteMany({}),
    Experience.deleteMany({}),
    Skills.deleteMany({}),
    JobSeekerSkills.deleteMany({}),
    Certification.deleteMany({}),
    Notification.deleteMany({}),
    JobRecommendation.deleteMany({}),
    JobSkills.deleteMany({})
  ]);
  console.log("🚮 Cleared existing data");

  // Now seed dummy data
  const user = await User.create({
    name: "Jane Doe",
    email: "jane@example.com",
    username: "janedoe",
    password: "hashedpass",
    role: "job_seeker",
    birth_date: new Date("1990-05-15")
  });

  const company = await Company.create({
    name: "InnovateX",
    industry: "Technology",
    profile: "Innovative software for hiring.",
    description: "A company focused on AI hiring tools.",
    benefit_offers: ["Remote work", "Stock options"],
    contacts: { email: "contact@innovatex.com", phone: "1234567890" },
    locations: ["New York", "Remote"],
    website: "https://innovatex.com",
    founded_date: new Date("2010-01-01"),
    employees_count: 150
  });

  const recruiter = await User.create({
    name: "Recruiter Rick",
    email: "rick@innovatex.com",
    username: "rickrecruit",
    password: "hashedpass",
    role: "recruiter"
  });

  const recruiterDetails = await RecruiterDetails.create({
    user: recruiter._id,
    company: company._id,
    location: "New York",
    contact_info: {
      email: "rick@innovatex.com",
      phone: "1234567890"
    }
  });

  const job = await JobPosting.create({
    recruiter: recruiter._id,
    job_title: "Backend Developer",
    job_description: "Develop scalable APIs",
    requirements: ["Node.js", "MongoDB"],
    application_deadline: new Date("2025-12-01"),
    hiring_process: ["Resume Screening", "Technical Interview"],
    location: "Remote"
  });

  const skill = await Skills.create({ skill_name: "Node.js" });

  const seekerDetails = await JobSeekerDetails.create({
    user: user._id,
    summary: "Experienced backend developer."
  });

  const experience = await Experience.create({
    user: user._id,
    job_title: "Software Engineer",
    company_name: "TechCorp",
    start_date: new Date("2018-01-01"),
    end_date: null,
    description: "Built APIs for ecommerce"
  });

  const userSkill = await JobSeekerSkills.create({
    user: user._id,
    skill: skill._id,
    proficiency_level: "Expert"
  });

  const cv = await CV.create({
    user: user._id,
    file_path: "cv1.pdf",
    for_job: job._id,
    is_original: true
  });

  const cert = await Certification.create({
    user: user._id,
    credential_url: "https://certify.example.com/jane123",
    certificate_file: "jane_cert.pdf"
  });

  const app = await Application.create({
    job: job._id,
    user: user._id,
    applied_cv: cv._id,
    current_phase: "Resume Screening"
  });

  const notif = await Notification.create({
    user: user._id,
    notification_type: "info",
    notification_content: "You applied for Backend Developer",
    sent_date: new Date(),
    read_status: "unread"
  });

  const recommendation = await JobRecommendation.create({
    job: job._id,
    user: recruiter._id,
    recommendation_date: new Date()
  });

  await JobSkills.create({
    job: job._id,
    skill: skill._id
  });

  console.log("✅ Dummy data seeded successfully");
} catch (err) {
  console.error("❌ Error seeding data:", err.message);
}

await mongoose.disconnect();
