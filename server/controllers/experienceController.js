import Experience from "../models/Experience.js";

export const addExperience = async (req, res) => {
  try {
    const exp = new Experience({
      user: req.user.id,
      ...req.body
    });
    await exp.save();
    res.status(201).json({ message: "Experience added", exp });
  } catch (err) {
    res.status(500).json({ message: "Failed to add experience", error: err.message });
  }
};

export const getExperiences = async (req, res) => {
  try {
    const experiences = await Experience.find({ user: req.user.id });
    res.json(experiences);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch experience", error: err.message });
  }
};

export const updateExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp || String(exp.user) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    Object.assign(exp, req.body);
    await exp.save();
    res.json({ message: "Experience updated", exp });
  } catch (err) {
    res.status(500).json({ message: "Failed to update", error: err.message });
  }
};

export const deleteExperience = async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp || String(exp.user) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await exp.deleteOne();
    res.json({ message: "Experience deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete", error: err.message });
  }
};
