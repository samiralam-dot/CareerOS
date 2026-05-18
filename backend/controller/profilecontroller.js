import profile from "../model/profile.js";
import Profile from "../model/profile.js";
import User from "../model/user.js";
import Job from "../model/Job.js"
import Application from "../model/Application.js";
import Notification from "../model/Notification.js";
export const createOrUpdateProfile = async (req, res) => {
  try {
 const {
  name,
  email,
  role,
  rollNumber,
  branch,
  companyName,
  designation,

  // profile fields
  ImageUrl,
  resume,
  resumeMeta,
  skills,
  aboutMe,
  cgpa,
  projects,
  achievement,

  // recruiter/company fields
  companyLogoUrl,
  companyWebsite,
  contactNumber,
  location,
  industry,
  companySize,
  teamSize,
  founded,
  headquarters,
  description,
  aboutCompany,
  benefits,
  linkedIn,
} = req.body;

   
    const userId = req.user.id;

    const existingUser = await User.findById(userId);

    if (!existingUser) {
      return res.status(404).json({ message: req.user});
    }

    const profileId = existingUser.profileId;

    // ======================
    // UPDATE PROFILE
    // ======================
    if (profileId) {
const updateData = {
  name,
  email,
  role,
  rollNumber,
  branch,
  companyName,
  designation,

  // student fields
  ImageUrl,
  skills,
  aboutMe,
  cgpa,
  projects,
  achievement,
  resume,
  resumeMeta,

  // recruiter/company fields
  companyLogoUrl,
  companyWebsite,
  contactNumber,
  location,
  industry,
  companySize,
  teamSize,
  foundedYear:founded,
  headquarters,
  description,
  aboutCompany,
  benefits,
  linkedIn,
};
    console.log(updateData);









      const updatedProfile = await Profile.findByIdAndUpdate(
        profileId,
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );
      console.log(updatedProfile)

      const updatedUser = await User.findByIdAndUpdate(
        existingUser._id,
        updateData,
        {
          returnDocument: "after",
          runValidators: true,
        }
      );

      return res.json({
        message: "Profile updated successfully",
        user: {
          ...updatedUser._doc,
          profile: updatedProfile,
        },
      });
    }

    // ======================
    // CREATE PROFILE
    // ======================
    const newProfile = await Profile.create({
      name,
      email,
      role,
      rollNumber,
      branch,
      companyName,
      designation,
      ImageUrl,
    });

    // attach profile to user
    existingUser.profileId = newProfile._id;
    await existingUser.save();

    const updatedUser = await User.findById(existingUser._id);

    return res.status(201).json({
      message: "Profile created successfully",
      user: {
        ...updatedUser._doc,
        profile: newProfile,
      },
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {

    const userId = req.user.id;

    let user = await User.findById(userId)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // check profile
    if (user.profileId) {

      const profileExists =
        await profile.findById(user.profileId);

      if (!profileExists) {

        user.profileId = undefined;

        await user.save();
      }
    }

    // validate applications
    if (user.applications?.length > 0) {

      const validApplications =
        await Application.find({
          _id: { $in: user.applications },
        }).select("_id");

      user.applications =
        validApplications.map(app => app._id);

      await user.save();
    }

    // cleanup nulls
    await User.findByIdAndUpdate(userId, {
      $pull: {
        createdJobs: null,
        applications: null,
        Notifications: null,
      }
    });

    // fetch populated user
    user = await User.findById(userId)

      .select("-password")

      .populate("profileId")

      .populate("Notifications")

      .populate({
        path: "createdJobs",

        populate: [
          {
            path: "applications",

            populate: [
              {
                path: "studentId",
              },
              {
                path: "jobId",
              }
            ]
          },

          {
            path: "interview",

            populate: [
              {
                path: "job",
              },
              {
                path: "recruiter",
              }
            ]
          }
        ]
      })

      .populate({
        path: "applications",

        populate: [
          {
            path: "jobId",

            populate: [
              {
                path: "interview",
              },
              {
                path: "applications",
              }
            ]
          },

          {
            path: "studentId",
          }
        ]
      });

    // remove nulls
    user.createdJobs =
      user.createdJobs?.filter(Boolean);

    user.Notifications =
      user.Notifications?.filter(Boolean);

    user.applications =
      user.applications?.filter(Boolean);

    user.createdJobs?.forEach(job => {

      job.applications =
        job.applications?.filter(Boolean);

      job.interview =
        job.interview?.filter(Boolean);

    });

    return res.status(200).json({
      success: true,
      user,
      findprofile: user.profileId || null,
    });

  } catch (err) {

    console.log("Get Profile Error:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


export const getProfileById = async (req, res) => {
  try {
    const {id} = req.params; // ✅ now works
    console.log(id)

    
    const findprofile=await profile.findById(id)
    
    res.json({
      success: true,
     
      
      findprofile


      
    });

  } catch (err) {
    res.status(500).json({ message: "Error fetching profile" });
  }
};