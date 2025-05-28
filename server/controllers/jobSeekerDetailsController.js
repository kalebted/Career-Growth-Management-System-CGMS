import JobSeekerDetails from "../models/JobSeekerDetails.js";

export const createOrUpdateDetails = async (req, res) => {
  try {
    if (req.user.role !== "job_seeker") {
      return res.status(403).json({ message: "Only job seekers can update this info" });
    }

    const existing = await JobSeekerDetails.findOne({ user: req.user.id });

    const picturePath = req.file ? `/assets/images/${req.file.filename}` : undefined;

    if (existing) {
      existing.full_name = req.body.full_name || existing.full_name;
      existing.address = req.body.address || existing.address;
      existing.phone_number = req.body.phone_number || existing.phone_number;
      existing.job_field = req.body.job_field || existing.job_field;
      if (picturePath) existing.picture = picturePath;

      await existing.save();
      return res.json({ message: "Details updated", details: existing });
    }

    const newDetails = new JobSeekerDetails({
      user: req.user.id,
      full_name: req.body.full_name || "",
      address: req.body.address || "",
      phone_number: req.body.phone_number || "",
      job_field: req.body.job_field || "",
      picture: picturePath || null
    });

    await newDetails.save();
    res.status(201).json({ message: "Details saved", details: newDetails });
  } catch (err) {
    res.status(500).json({ message: "Failed to save job seeker details", error: err.message });
  }
};

export const getMyDetails = async (req, res) => {
  try {
    const details = await JobSeekerDetails.findOne({ user: req.user.id });

    if (!details) return res.status(404).json({ message: "No details found" });

    res.json(details);
  } catch (err) {
    res.status(500).json({ message: "Error fetching details", error: err.message });
  }
};
