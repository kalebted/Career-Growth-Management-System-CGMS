import Certification from "../models/Certification.js";

// Upload certification
export const addCertification = async (req, res) => {
  try {
    const { credential_url } = req.body;
    const uploadedCert = req.file;

    const cert = new Certification({
      user: req.user.id,
      credential_url,
      certificate_file: uploadedCert?.filename
    });

    await cert.save();
    res.status(201).json({ message: "Certification uploaded", cert });
  } catch (err) {
    res.status(500).json({ message: "Upload failed", error: err.message });
  }
};

// Get all certifications for user
export const getCertifications = async (req, res) => {
  try {
    const certs = await Certification.find({ user: req.user.id });
    res.json(certs);
  } catch (err) {
    res.status(500).json({ message: "Fetch failed", error: err.message });
  }
};

// Delete a certification
export const deleteCertification = async (req, res) => {
  try {
    const cert = await Certification.findById(req.params.id);
    if (!cert || String(cert.user) !== req.user.id) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await cert.deleteOne();
    res.json({ message: "Certification deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed", error: err.message });
  }
};
