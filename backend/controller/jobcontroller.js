import Job from "../model/Job.js";
import mongoose from "mongoose";
import User from '../model/user.js'
import Interview from '../model/Interview.js'
import Application from "../model/Application.js";

// ======================
// CREATE JOB
// ======================


export const createJob = async (req, res) => {
  try {
  const {
  title,

jobDescriptionPDFUrl
,
  companyBrochureUrl,
  jobType,
  workmode,
  companyName,
  location,
  numberofOpenings,
  position,
  salaryType,
  salary,
  bonous,
  experience,
  roleOverview,
  keyResponsibilities,
  requiredSkills,
  preferredSkills,
  techStack,
  qualifications,
  applicationDeadline,
  selectionProcess,

 interview,
  applicants,
  isActive,
  minCGPA,
  passingYear,
  eligibleBranches,
  resume,
  coverLetter,
  portfolioRequired,
  backelog,


  workflowStages,
  ppoAvailable,
  date,
  interviewLink,
  interviewMode,

} = req.body;
console.log(jobDescriptionPDFUrl,companyBrochureUrl)




const userId=req.user.id;


const recruiter=await User.findById(userId);
console.log(recruiter)
if (!recruiter.isVerified) {
  return res.status(403).json({
    success: false,
    message: "You are not verified yet",
  });
}






  
    if (
      !title ||
      !companyName ||
      !location ||
      !numberofOpenings ||
      !position ||
      !salary ||
      !roleOverview ||
      !keyResponsibilities 
      
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title,
      jobDescriptionPDFUrl,
      companyBrochureUrl,
      jobType,
      workmode,
      companyName,
      location,
      numberofOpenings,
      position,
      salaryType,
      salary,
      bonous,
      experience,
      roleOverview,
      keyResponsibilities,
      requiredSkills,
      preferredSkills,
      techStack,
      qualifications,
      applicationDeadline,
      selectionProcess,
       interview,
  applicants,
  isActive,
  minCGPA,
  passingYear,
  eligibleBranches,
  resume,
  coverLetter,
   workflowStages,
  ppoAvailable,
  portfolioRequired,
  backelog,
  createdBy:recruiter,
   date,
      interviewLink,
      interviewMode,
      recruiter,
    });

const interviewData = {
  date,
  interviewLink,
  interviewMode,
  recruiter,
  job
};





      await User.findByIdAndUpdate(
  userId,
  { $push: { createdJobs: job._id } },
  { new: true }
);


  
    //  Success response
    return res.status(201).json({
      success: true,
      message: "Job created successfully",
      job,
  
     
    });

  } catch (error) {
    console.error("Create Job Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server Error",
      error: error.message,
    });
  }
};

// ======================
// GET ALL JOBS
// ======================
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate({
        path: "createdBy", // first populate createdBy user
        populate: {
          path: "profileId", // then inside user populate profileId
         
        },
      })// fields you want
      .populate("interview") // fields you want
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      jobs,
    });

  } catch (error) {
    console.error("🔥 ERROR:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ======================
// GET JOB BY ID
// ======================
export const getJobById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid job ID" });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ======================
// DELETE JOB
// ======================
export const deleteJob = async (req, res) => {
  try {
    const { id } = req.params;

    const userId = req.user.id;

    const recruiter = await User.findById(userId);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (!recruiter.isVerified && recruiter.role === "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Your access will removed",
      });
    }

    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    await Job.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Job deleted successfully",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export const updateJob = async (req, res) => {
  try {
    const { id } = req.params;


    const job = await Job.findById(id);
    


    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    const {title,location,salary,applicationDeadline,numberofOpenings,isActive,status,isAdminVerified}=req.body


      const userId=req.user.id;


const recruiter=await User.findById(userId);
console.log(recruiter)
if (!recruiter.isVerified&&recruiter.role==="recruiter") {
  return res.status(403).json({
    success: false,
    message: "Your access will removed ",
  });}
  

if (title) job.title = title;
if (location) job.location = location;
if (salary) job.salary = salary;
if (isAdminVerified!=undefined) job.isAdminVerified = isAdminVerified;
if (applicationDeadline) job.applicationDeadline = applicationDeadline;
if (numberofOpenings) job.numberofOpenings = numberofOpenings;
if(isActive!=null)
  if(status!=undefined)job.status=status;
job.isActive=isActive;

await job .save();

   

    await job.save();

    return res.status(200).json({
      success: true,
      message: "Job updated successfully",
      job,
    });

  } catch (error) {
    console.log("Update Job Error:", error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};