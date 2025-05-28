import RecruiterDetails from "../models/recruiterDetails.js";

export const createOrUpdateRecruiterDetails = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({ message: "Only recruiters can update this info" });
    }

    const existing = await RecruiterDetails.findOne({ user: req.user.id });
    const picturePath = req.file ? `/assets/images/${req.file.filename}` : undefined;

    const contactInfo = {
      email: req.body.email || "",
      phone: req.body.phone || "",
    };

    if (existing) {
      existing.location = req.body.location || existing.location;
      existing.contact_info = {
        email: contactInfo.email || existing.contact_info?.email || "",
        phone: contactInfo.phone || existing.contact_info?.phone || "",
      };

      if (picturePath) existing.picture = picturePath;

      await existing.save();
      return res.json(existing);
    }

    const newDetails = new RecruiterDetails({
      user: req.user.id,
      location: req.body.location || "",
      contact_info: contactInfo,
      picture: picturePath || null,
    });

    await newDetails.save();
    res.status(201).json(newDetails);
  } catch (err) {
    console.error("Error saving recruiter details:", err);
    res.status(500).json({ message: "Failed to save recruiter details", error: err.message });
  }
};

export const getMyRecruiterDetails = async (req, res) => {
  try {
    const details = await RecruiterDetails.findOne({ user: req.user.id });
    if (!details) return res.status(404).json({ message: "No recruiter profile found" });
    res.json(details);
  } catch (err) {
    res.status(500).json({ message: "Error fetching recruiter profile", error: err.message });
  }
};
