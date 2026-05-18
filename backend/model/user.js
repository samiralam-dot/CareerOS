

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: function() {
      return this.role === 'student'|| this.role === 'recruiter';
    }
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
    role:{
    type:String,
    enum: ['student', 'recruiter',"admin"],
    required: true
  },

  isRejected:{
    type:Boolean,
    default:false

  },

  rollNumber: {
    type: String,
    required:function() {
      return this.role === 'student';
    }
  },
  branch: {
    type: String,
    required:function() { 
        return this.role === 'student';}
    },
    
    applications:[
      {
         type: mongoose.Schema.Types.ObjectId,
    ref: 'Application'

      }
    ],
    
    companyName: {
    type: String,
    
  },
  
  designation: {
    type: String,
   
  },
 
  isVerified: {
    type: Boolean,
    default: false
  },
  appliedjobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],

  interviews:[ 
       {
       type: mongoose.Schema.Types.ObjectId,
       ref: 'Interview'
       }
  ],

  createdJobs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Job'
  }],

  profileId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    default: null
  },

  Notifications: [{
    type:mongoose.Schema.Types.ObjectId ,
    ref:"Notification"
  }],

  
  
 
});
const User = mongoose.model('User', userSchema);
export default User;