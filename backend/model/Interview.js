import mongoose from "mongoose";

const interviewSchema = new mongoose.Schema(
  {
   
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },

   

    // Recruiter / Interviewer
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Interview Date
    date: {
      type: Date,
     
    },

    // Interview Time (stored as string or you can merge with date)
    // time: {
    //   type: String,
    //   required: true,
    // },

    // Meeting Link (Zoom / Google Meet etc.)
    interviewLink: {
      type: String,
      default: "",
    },
    time: {
      type: String,
      default: "",
    },

    // Interview Status
    status: {
      type: String,
      enum: ["scheduled", "completed", "cancelled", "rescheduled"],
      default: "scheduled",
    },
    InterviewMode: {
      type: String,
      enum: ["online", "offline"],
      default: "online",
    },

    // Optional notes from recruiter
    
  },
  { timestamps: true }
);

export default mongoose.model("Interview", interviewSchema);