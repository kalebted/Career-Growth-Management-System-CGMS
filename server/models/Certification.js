import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  credential_url: {
    type: String
  },
  certificate_file: {
    type: String // filename only (e.g. 123456-coursera.pdf)
  }
});

export default mongoose.models.Certification || mongoose.model("Certification", certificationSchema);
