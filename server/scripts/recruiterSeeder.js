import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import User from "../models/User.js";
import RecruiterDetails from "../models/recruiterDetails.js";
import Company from "../models/Company.js";
import JobPosting from "../models/jobPosting.js";

dotenv.config({ path: '../.env' });

const workTypes = ["full-time", "part-time", "contract", "internship"];
const workModes = ["remote", "on-site", "hybrid"];

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log("✅ Connected to MongoDB");

  // Cleanup existing recruiter data
  await User.deleteMany({ role: "recruiter" });
  await RecruiterDetails.deleteMany({});
  await Company.deleteMany({});
  await JobPosting.deleteMany({});

  // Create 10 recruiters (A to J)
  for (let i = 65; i <= 74; i++) { // A (65) to J (74)
    const letter = String.fromCharCode(i);
    const hashedPassword = await bcrypt.hash(`Password${letter}`, 10);

    const user = new User({
      name: `Recruiter ${letter}`,
      email: `recruiter${letter.toLowerCase()}@example.com`,
      username: `recruiter${letter.toLowerCase()}`,
      password: hashedPassword,
      role: "recruiter",
    });
    await user.save();

    const recruiterDetails = new RecruiterDetails({
      user: user._id,
      location: `City ${letter}`,
      contact_info: {
        email: user.email,
        phone: `+1-555-000-${1000 + i}`,
      },
      picture: null,
    });
    await recruiterDetails.save();

    const company = new Company({
      name: `Company of ${user.name}`,
      industry: "Tech",
      profile: "We are an innovative tech company.",
      description: "Specializing in cutting-edge software solutions.",
      contacts: {
        email: user.email,
        phone: recruiterDetails.contact_info.phone,
      },
      locations: `Location ${letter}`,
      website: `https://company${letter.toLowerCase()}.com`,
      founded_date: new Date(2018 + (i % 5), 0, 1),
      employees_count: 50 + (i - 65) * 10, // offset by letter index
      logo: null,
      recruiter: user._id,
    });
    await company.save();

    for (let j = 1; j <= 2; j++) {
      const job = new JobPosting({
        recruiter: user._id,
        job_title: `Software Engineer ${j} at ${company.name}`,
        job_description: `Exciting role for Software Engineer ${j} at ${company.name}.`,
        requirements: ["Proficient in JavaScript", "Team player"],
        required_skills: [],
        location: company.locations,
        application_deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        hiring_process: ["Initial interview", "Technical test", "Final interview"],
        job_category: "Software Development",
        work_type: workTypes[Math.floor(Math.random() * workTypes.length)],
        work_mode: workModes[Math.floor(Math.random() * workModes.length)],
        status: "open",
      });
      await job.save();
    }
  }

  console.log("✅ Recruiters, details, companies, and jobs seeded!");
  mongoose.disconnect();
})
.catch((err) => console.error("❌ Seeder Error:", err));
