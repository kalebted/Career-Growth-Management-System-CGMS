import JobPosting from "../models/jobPosting.js";
import Skills from "../models/skills.js";
import Company from "../models/Company.js";
import User from "../models/User.js";

// GET /jobs/search?keyword=...&location=...&work_type=...&required_skills=React,Node.js&company_name=...
export const searchJobs = async (req, res) => {
  try {
    const {
      keyword,
      location,
      work_type,
      work_mode,
      required_skills,
      job_category,
      company_name,
    } = req.query;

    const query = {};

    // 1. Keyword search (job title or description)
    if (keyword) {
      query.$or = [
        { job_title: { $regex: keyword, $options: "i" } },
        { job_description: { $regex: keyword, $options: "i" } },
      ];
    }

    // 2. Location
    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    // 3. Work type
    if (work_type) {
      query.work_type = work_type;
    }

    // 4. Work mode
    if (work_mode) {
      query.work_mode = work_mode;
    }

    // 5. Job category
    if (job_category) {
      query.job_category = { $regex: job_category, $options: "i" };
    }

    // 6. Required skills (e.g. React,Node.js)
    if (required_skills) {
      const skillNames = required_skills.split(",").map((s) => s.trim());
      const skillDocs = await Skills.find({ skill_name: { $in: skillNames } });
      const skillIds = skillDocs.map((s) => s._id);

      // Match if job requires ANY of the listed skills
      query["required_skills.skill"] = { $in: skillIds };
    }

    // 7. Company name search (through recruiter.company)
    let recruiterIdsMatchingCompany = null;
    if (company_name) {
      const companies = await Company.find({
        name: { $regex: company_name, $options: "i" },
      });

      if (companies.length > 0) {
        const companyIds = companies.map((c) => c._id);
        const recruiters = await User.find({
          role: "recruiter",
          "recruiterDetails.company": { $in: companyIds },
        });
        recruiterIdsMatchingCompany = recruiters.map((r) => r._id);
        query.recruiter = { $in: recruiterIdsMatchingCompany };
      } else {
        return res.json([]); // no matching companies found
      }
    }

    const jobs = await JobPosting.find(query)
      .populate("recruiter", "name email")
      .populate("required_skills.skill", "skill_name")
      .sort({ posting_date: -1 });

    res.json(jobs);
  } catch (err) {
    console.error("Job search error:", err);
    res
      .status(500)
      .json({ message: "Error performing job search", error: err.message });
  }
};
