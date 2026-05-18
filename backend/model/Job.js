import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    jobDescriptionPDFUrl: {
      type: String,
    },

    companyBrochureUrl: {
      type: String,
    },

    jobType: {
      type: String,
      enum: ["FULL_TIME", "PART_TIME", "INTERNSHIP", "CONTRACT"],
      default: "FULL_TIME",
    },

    workmode: {
      type: String,
      enum: ["ON_SITE", "REMOTE", "HYBRID"],
      default: "ON_SITE",
    },

    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    location: {
      type: String,
      required: true,
    },

    numberofOpenings: {
      type: Number,
      required: true,
    },

    position: [{
      type: String,
      required: true,
    }],

    salaryType: {
      type: String,
      enum: ["monthly", "yearly", "stipend"], // fixed typo
      default: "ANNUAL",
    },

    bonous: {
      type: Number,
    },

    salary: {
      type: Number,
      required: true,
    },

    experience: {
      type: String,
    },

    roleOverview: {
      type: String,
      required: true, 
    },

    keyResponsibilities: {
      type: String,
      required: true, // fixed
    },

    requiredSkills: [
      {
        type: String,
      },
    ],

    preferredSkills: [
      {
        type: String,
      },
    ],

    techStack: [
      {
        type: String,
      },
    ],
    
    createdBy:[
     { type: mongoose.Schema.Types.ObjectId,
        ref: "User",}

    ],
    
    isAdminVerified:{
      type:Boolean,
      default:false
    },

    qualifications: {
      type: String,
      // fixed
    },

    applicationDeadline: {
      type: Date,
    },

    selectionProcess: [
      {
        type: String,
      },
    ],

    interview: [
     {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Interview",
      },
    ],

    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],

    isActive: {
      type: Boolean,
      default: true,
    },

    minCGPA:{
      type:String,

    },
    passingYear:{
      type:String

    },
    eligibleBranches:[
      {
        type:String
      }
    ],
    resume:{
      type:Boolean,
      default:false,

    },
    coverLetter:{
      type:Boolean,
      default:false,

    },
    workflowStages:[{
      type:String
    }],
    ppoAvailable: {
  type: Boolean,
  default: false,
},
backelog:{
  type:Boolean,
  default:false
}
,
portfolioRequired:{
  type:Boolean,
  default:false,
},
status:{
  type:String,
  default:"created"
  
},
approved:{
  type:Boolean,
  default:false

},

  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);