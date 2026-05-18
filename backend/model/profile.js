import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
{
  // 👤 Common / student
  skills: [{ type: String }],

  aboutMe: { type: String },

  ImageUrl: { type: String },
  resume: { type: String },
  
  resumeMeta: {
  publicId: { type: String },
  name: { type: String },
  size: { type: Number },
  type: { type: String },
},

  cgpa: {
    type: Number,
    default: 5,
    min: 0,
    max: 10,
  },

  projects: [
    {
      title: { type: String, required: true },
      link: { type: String },
      desc: { type: String },
    },
  ],

  achievement: [
    {
      title: { type: String, required: true },
      date: { type: String },
      desc: { type: String },
    },
  ],

  // 🏢 Company / recruiter fields (ADDED)
  companyName: { type: String },
  companyLogoUrl: { type: String },
  companyWebsite: { type: String },
  contactNumber: { type: String },
  location: { type: String },
  industry: { type: String },

  companySize: { type: String },   // e.g. "1-10", "50-100"
  teamSize: { type: Number },

  foundedYear: {
    type: Number,
    min: 1900,
    max: new Date().getFullYear(),
  },

  headquarters: { type: String },

  description: { type: String },     // company description
  aboutCompany: { type: String },    // optional long text

  benefits: { type: String },        // perks

  linkedIn: { type: String },

},
{ timestamps: true }
);

export default mongoose.model("Profile", profileSchema);