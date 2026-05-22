import User from "../model/user.js";
import transporter from "../config/mail.js";
import generateOTP from "../config/otp.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();


const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id  ,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: "2d" }
  );
};


export const signup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      rollNumber,
      branch,
      companyName,
      designation,
    } = req.body;

    // validation
    if (
      !email ||
      !password ||
      !name ||
      !role 
    ) {
      return res.status(400).json({ message: "Please fill in all required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      rollNumber,
      branch,
      companyName,
      designation,
    });

    await newUser.save();

    const token = generateToken(newUser);

  
res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // MUST for Render + Vercel HTTPS
  sameSite: "none",    // MUST for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    return res.status(201).json({
      success: true,
      message: "User created successfully",
      user: newUser,
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const signout = async (req, res) => {
  try {
    res.clearCookie("token", {
  httpOnly: true,
  secure: true,
  sameSite: "none"
})
      .status(200)
      .json({
        success: true,
        message: "Logged out successfully"
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = generateToken(user);

    
   res.cookie("token", token, {
  httpOnly: true,
  secure: true,        // MUST for Render + Vercel HTTPS
  sameSite: "none",    // MUST for cross-site cookies
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

    const { password: _, ...safeUser } = user._doc;

    return res.json({
      success: true,
      user: safeUser,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};




export const getUserByEmail = async (req, res) => {
    try {
        const { email } = req.params;

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .populate("applications")
      .populate("appliedjobs")
      .populate("interviews")
      .populate("createdJobs")
      .populate("profileId");

    res.status(200).json({
      success: true,
      count: users.length,
      users
    });

  } catch (error) {
    console.error("Get All Users Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};




// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;

    const {
      name,
      email,
      password,
      rollNumber,
      branch,
      companyName,
      designation,
      isVerified,
      profileId,
      isRejected,
    } = req.body;

    // 1. Find user
   const updatedUser = await User.findByIdAndUpdate(
  userId,
  {
    ...(name !== undefined && { name }),
    ...(email !== undefined && { email }),
    ...(rollNumber !== undefined && { rollNumber }),
    ...(branch !== undefined && { branch }),
    ...(companyName !== undefined && { companyName }),
    ...(designation !== undefined && { designation }),
    ...(typeof isVerified !== "undefined" && {
      isVerified: isVerified === true || isVerified === "true"
    }),
    ...(typeof isRejected !== "undefined" && {
      isRejected: isRejected === true || isRejected === "true"
    }),
    ...(profileId && mongoose.Types.ObjectId.isValid(profileId) && { profileId }),
    ...(password && { password: await bcrypt.hash(password, 10) })
  },
  { new: true }
);


    if (password) {
      const salt = await bcrypt.genSalt(10);
      updatedUser.password = await bcrypt.hash(password, salt);
    }

    // 4. Save updated user
    const updatedUserss = await updatedUser.save();

    // 5. Remove password before sending response
    updatedUserss.password = undefined;

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUserss
    });

  } catch (error) {
  console.error("Update User Error:", error); // 👈 IMPORTANT

  return res.status(500).json({
    success: false,
    message: error.message,   // 👈 REAL ERROR SHOW KAREGA
  });
}}





