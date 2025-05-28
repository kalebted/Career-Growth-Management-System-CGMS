import JobSkills from "../models/jobSkills.js";
import JobPosting from "../models/JobPosting.js";

export const addSkillToJob = async (req, res) => {
  const { jobId } = req.params;
  const { skillId, required_proficiency } = req.body;

  try {
    const job = await JobPosting.findById(jobId);
    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const newJobSkill = new JobSkills({
      job: jobId,
      skill: skillId,
      required_proficiency
    });

    await newJobSkill.save();
    res.status(201).json({ message: "Skill added to job", jobSkill: newJobSkill });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({ message: "Skill already added to this job" });
    }
    res.status(500).json({ message: "Error adding skill", error: err.message });
  }
};

export const removeSkillFromJob = async (req, res) => {
  const { jobId, skillId } = req.params;

  try {
    const job = await JobPosting.findById(jobId);
    if (!job || String(job.recruiter) !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this job" });
    }

    const deleted = await JobSkills.findOneAndDelete({ job: jobId, skill: skillId });
    if (!deleted) return res.status(404).json({ message: "Skill not found in job" });

    res.json({ message: "Skill removed from job" });
  } catch (err) {
    res.status(500).json({ message: "Error removing skill", error: err.message });
  }
};

export const getSkillsForJob = async (req, res) => {
  const { jobId } = req.params;

  try {
    const skills = await JobSkills.find({ job: jobId }).populate("skill");
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Error fetching skills for job", error: err.message });
  }
};
