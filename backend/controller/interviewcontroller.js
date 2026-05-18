import Interview from "../model/Interview.js";
import mongoose from "mongoose";
import User from "../model/user.js";
import Job from "../model/Job.js";
import Application from "../model/Application.js";

// ======================
// CREATE INTERVIEW
// ======================
export const createInterview = async (req, res) => {
  try {
    const { jobId, date, meetingLink ,students} = req.body;
    console.log("Creating interview with data:", {
      jobId,
      date,
      meetingLink,
      students
    });

    if (!jobId   || !date) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }
    const userId=req.user.id;
    const user=await User.findById(userId);
  

    if(user.role!=='recruiter'){
      return res.status(400).json({
        message:"You are not a recruiter",
        user
    
      });
    }

    



    const data = {
      job: jobId,
    recruiter: user,
      date,
      interviewLink: meetingLink,

      time: new Date(date).toLocaleTimeString(),
    };

    const interview = await Interview.create(data);
    const job = await Job.findById(jobId);
    job.interview=[];
    job.interview.push(interview._id);
    await job.save();
    job.status="INTERVIEW";
    await job.save();
const studentIds = students.map(
  id => new mongoose.Types.ObjectId(id)
);
console.log("Student IDs for interview:", studentIds);

const updateApplications = await Application.updateMany(
  {
    _id: { $in: students }   // sirf student/application IDs
  },
  {
    $set: {
      interview: interview._id,
      status: "INTERVIEW"
    }
  }
);



    res.status(201).json({
      message: "Interview scheduled successfully",
      interview,
      user
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




























// ======================
// GET ALL INTERVIEWS
// ======================
export const getAllInterviews = async (req, res) => {
  try {
    const interviews = await Interview.find()
    
   
     
      .populate("recruiter")
      .sort({ createdAt: -1 });
    
      const userId=req.user._id;
    const user=await User.findById(userId);
    
    if(user.role!=='recruiter'){
      return res.status(400).json({
        message:"You are not a recruiter",
        user
    
      });
    }

    res.status(200).json({
      user,
      interviews});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// GET INTERVIEW BY ID
// ======================
export const getInterviewById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    const interview = await Interview.findById(id)
      
      .populate("recruiter");

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json(interview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// UPDATE INTERVIEW
// ======================
export const updateInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const { date, time, meetingLink } = req.body;
    console.log("Update Interview Request:", { id, date, time,interviewLink: meetingLink });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    const updated = await Interview.findByIdAndUpdate(id, { date, time,interviewLink: meetingLink } , {
      
  returnDocument: "after",
  upsert: true

    });

    if (!updated) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({
      message: "Interview updated successfully",
      interview: updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE INTERVIEW
// ======================
export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid interview ID" });
    }

    const interview = await Interview.findByIdAndDelete(id);

    if (!interview) {
      return res.status(404).json({ message: "Interview not found" });
    }

    res.json({
      message: "Interview deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};