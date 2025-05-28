import mongoose from 'mongoose';

const jobSeekerDetailsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  full_name: String,
  address: String,
  phone_number: String,
  picture: String,
  job_field: {
    type: String,
    default: '',
    trim: true
  } // ✅ the general field/discipline the job seeker belongs to
});

export default mongoose.models.JobSeekerDetails || mongoose.model("JobSeekerDetails", jobSeekerDetailsSchema);
