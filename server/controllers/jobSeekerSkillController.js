import mongoose from "mongoose";
import JobSeekerSkills from "../models/JobSeekerSkills.js";
import Skills from "../models/skills.js";

export const addSkill = async (req, res) => {
  const { skill_id, proficiency_level } = req.body;

  const validLevels = ["beginner", "intermediate", "expert"];
  if (!validLevels.includes(proficiency_level)) {
    return res.status(400).json({
      message: `Invalid proficiency level. Must be one of: ${validLevels.join(", ")}`
    });
  }

  if (!mongoose.Types.ObjectId.isValid(skill_id)) {
    return res.status(400).json({ message: "Invalid skill ID" });
  }

  try {
    const skill = await Skills.findById(skill_id);
    if (!skill) return res.status(404).json({ message: "Skill not found" });

    let userSkills = await JobSeekerSkills.findOne({ user: req.user.id });

    if (!userSkills) {
      userSkills = new JobSeekerSkills({
        user: req.user.id,
        skills: [{ skill: skill._id, proficiency_level }]
      });
    } else {
      const alreadyExists = userSkills.skills.some(
        (s) => s.skill.toString() === skill._id.toString()
      );
      if (alreadyExists) {
        return res.status(409).json({ message: "Skill already added" });
      }

      userSkills.skills.push({ skill: skill._id, proficiency_level });
    }

    await userSkills.save();

    // Populate skill names for response
    const populated = await userSkills.populate("skills.skill", "skill_name");

    res.status(201).json({ message: "Skill added", skills: populated.skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to add skill", error: err.message });
  }
};
export const getMySkills = async (req, res) => {
  try {
    const doc = await JobSeekerSkills.findOne({ user: req.user.id }).populate(
      "skills.skill",
      "skill_name"
    );
    res.json(doc?.skills || []);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills", error: err.message });
  }
};
export const removeSkill = async (req, res) => {
  try {
    const userSkills = await JobSeekerSkills.findOne({ user: req.user.id });
    if (!userSkills) {
      return res.status(404).json({ message: "No skills found for user" });
    }

    const beforeCount = userSkills.skills.length;
    userSkills.skills = userSkills.skills.filter(
      (s) => s.skill.toString() !== req.params.skillId
    );

    if (userSkills.skills.length === beforeCount) {
      return res.status(404).json({ message: "Skill not found" });
    }

    await userSkills.save();
    const populated = await userSkills.populate("skills.skill", "skill_name");

    res.json({ message: "Skill removed", skills: populated.skills });
  } catch (err) {
    res.status(500).json({ message: "Failed to remove skill", error: err.message });
  }
};
