import Skills from "../models/Skills.js";

export const getAllSkills = async (req, res) => {
  try {
    const skills = await Skills.find().sort({ skill_name: 1 }); // Alphabetical sort
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch skills", error: err.message });
  }
};
export const searchSkills = async (req, res) => {
  const { search } = req.query;
  try {
    const regex = new RegExp(search, "i"); // case-insensitive
    const skills = await Skills.find({ skill_name: { $regex: regex } }).limit(20);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: "Skill search failed", error: err.message });
  }
};
export const searchSkillsByName = async (req, res) => {
  try {
    const query = req.query.search || '';
    const regex = new RegExp(query, 'i'); 

    const skills = await Skills.find({ skill_name: regex }).limit(10);
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: 'Failed to search skills', error: err.message });
  }
};
