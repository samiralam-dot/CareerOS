import Application from "../model/Application.js";
import User from "../model/user.js";
import Job from "../model/Job.js";

export const createApplication = async (req, res) => {
  try {
    const userId = req.user?.id;

    const {
      jobId,
      cgpa,
      phone,
      skills,
      linkedin,
      portfolio,
      whyInterested,
      coverLetter,
      resumeUrl,
    } = req.body;

    // ✅ Validate
    if (!jobId) {
      return res.status(400).json({
        success: false,
        message: "Job ID is required",
      });
    }

    // ✅ Find user
    const profile = await User.findById(userId);

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // ✅ Find job
    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: "Job not found",
      });
    }

    // ✅ Prevent duplicate apply
    const existingApplication = await Application.findOne({
      jobId,
      studentId: userId,
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: "Already applied",
      });
    }

    // ✅ Format skills safely
    const formattedSkills = skills
      ? Array.isArray(skills)
        ? skills
        : [skills]
      : [];

    // ✅ Create application
    const application = await Application.create({
      jobId,
      studentId: userId,

      fullName: profile.name,
      email: profile.email,
      rollNumber: profile.rollNumber,
      branch: profile.branch,
      resumeUrl:resumeUrl,

      cgpa,
      phone,
      skills: formattedSkills,

      linkedin,
      portfolio,
      whyInterested,
      coverLetter,

      resumeUrl: profile.resume,
    });

    // ✅ Save only IDs
    profile.applications.addToSet(application._id);
    profile.appliedjobs.addToSet(job._id);
    job.applications.addToSet(application._id);
    job.numberOfOpening = job.numberOfOpening - 1;

    await profile.save();
    await job.save();

    return res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      application,
    });

  } catch (error) {
    console.error("Create Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};




export const updateApplication = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params; // application id

    const {
      cgpa,
      phone,
      skills,
      linkedin,
      portfolio,
      whyInterested,
      coverLetter,
      status
    } = req.body;
    console.log("status",status)

    // ✅ Find application
    const application = await Application.findById(id);

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    // ✅ Only owner can update
    

    // ✅ Update fields if provided
    if (cgpa !== undefined) application.cgpa = cgpa;
    if (phone !== undefined) application.phone = phone;
    if (linkedin !== undefined) application.linkedin = linkedin;
    if (portfolio !== undefined) application.portfolio = portfolio;
    if(status!=undefined)application.status=status;
    if (whyInterested !== undefined)
      application.whyInterested = whyInterested;
    if (coverLetter !== undefined)
      application.coverLetter = coverLetter;

    // ✅ Skills format
    if (skills !== undefined) {
      application.skills = Array.isArray(skills)
        ? skills
        : [skills];
    }

    await application.save();

    return res.status(200).json({
      success: true,
      message: "Application updated successfully",
      application,
    });

  } catch (error) {
    console.error("Update Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const { id } = req.params;

    // 🔴 check id
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Application ID is required",
      });
    }

    // 🔥 find application + populate (optional but recommended)
    const application = await Application.findById(id)
      .populate("jobId")       // job details
      .populate("studentId");  // user details

    if (!application) {
      return res.status(404).json({
        success: false,
        message: "Application not found",
      });
    }

    return res.status(200).json({
      success: true,
      application,
    });

  } catch (error) {
    console.error("Get Application Error:", error);

    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
