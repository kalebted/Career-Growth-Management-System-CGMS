import User from "../models/User.js";
import JobPosting from "../models/jobPosting.js";

export const getAdminDashboard = async (req, res) => {
  try {
    const totalJobs = await JobPosting.countDocuments();
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobSeekers = await User.countDocuments({ role: "job_seeker" });

    res.json({ totalJobs, totalRecruiters, totalJobSeekers });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch dashboard stats", error: err.message });
  }
};

export const getAllUsersByRole = async (req, res) => {
  try {
    const { role } = req.params;

    if (!["recruiter", "job_seeker"].includes(role)) {
      return res.status(400).json({ message: "Invalid role specified." });
    }

    const users = await User.find({ role }).select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users", error: err.message });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete user", error: err.message });
  }
};
