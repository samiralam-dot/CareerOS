import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    // 🔥 Job reference
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

    // 🔥 Student reference
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // change if your model is "Student"
      required: true,
    },

    // 🔹 Snapshot of student (for fast UI)
    fullName: String,
    email: String,
    rollNumber: String,
    branch: String,
    cgpa: Number,
    phone: String,

    skills: [{ type: String, trim: true }],
    linkedin: String,
    portfolio: String,

    whyInterested: String,
    coverLetter: { type: String, default: "" },
    resumeUrl: String,

    // 🔹 Snapshot of job (optional but recommended)
    jobTitle: String,
    companyName: String,
    location: String,
    salary: String,

    status: {
      type: String,
      enum: ["APPLIED", "SHORTLISTED", "REJECTED", "HIRED","INTERVIEW"],
    default: "APPLIED",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);