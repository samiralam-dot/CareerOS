import { createContext, useState } from "react";

export const StudentContext = createContext();

export const StudentProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const [applications, setApplications] = useState([]);


  const [jobs, setJobs] = useState([]);
  const [job, setJob] = useState(null);
  const [jobsCount, setJobsCount] = useState(0);


  const [interviews, setInterviews] = useState([]);

  const [notifications, setNotifications] = useState([]);


  // Loading states
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [loadingJob, setLoadingJob] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Filters & UI controls
  const [activeFilter, setActiveFilter] = useState("all");
  const [filters, setFilters] = useState({
    jobType: "",
    workMode: "",
    search: "",
  });

  // Modals
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [jobDescModal, setJobDescModal] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // Application states
  const [applying, setApplying] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);

  // Profile editing
  const [profileData, setProfileData] = useState(null);
  const [skillInput, setSkillInput] = useState("");
  const [projectInput, setProjectInput] = useState({
    title: "",
    description: "",
    link: "",
  });
  const [achievementInput, setAchievementInput] = useState({
    title: "",
    description: "",
    date: "",
  });

  const [formData, setFormData] = useState({
    fullName: "",
    rollNumber: "",
    branch: "",
    cgpa: 0,
    skills: [],
    profilePhoto: "",
    aboutMe: "",
    projects: [],
    achievements: [],
  });

  const [editFormData, setEditFormData] = useState(null);

  // Resume system
  const [resumeData, setResumeData] = useState({
    url: "",
    publicId: "",
    resourceType: "",
    fileName: "",
    type: "",
    size: 0,
  });
  

  const [resumeScore, setResumeScore] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [profileForResume, setProfileForResume] = useState(null);
  const resumeTemplateRef = null;

const [isEditMode, setIsEditMode] = useState(false);
const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Photo editor
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [showPhotoAdjust, setShowPhotoAdjust] = useState(false);
  const [photoZoom, setPhotoZoom] = useState(1);
  const [photoPosition, setPhotoPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Misc
  const [tab, setTab] = useState("upcoming");
  const [searchParams, setSearchParams] = useState(null);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  return (
    <StudentContext.Provider
      value={{
       
        user,
        setUser,
        userProfile,
        setUserProfile,

        applications,
        setApplications,

        
        jobs,
        setJobs,
        job,
        setJob,
        jobsCount,
        setJobsCount,

       
        interviews,
        setInterviews,

     
        notifications,
        setNotifications,

       
        loading,
        setLoading,
        profileLoading,
        setProfileLoading,
        loadingJob,
        setLoadingJob,
        uploading,
        setUploading,
  activeFilter,
        setActiveFilter,
        filters,
        setFilters,

        
        showProfileModal,
        setShowProfileModal,
        jobDescModal,
        setJobDescModal,
        showApplicationForm,
        setShowApplicationForm,
        showEditModal,
        setShowEditModal,
        showPreview,
        setShowPreview,

        
        applying,
        setApplying,
        hasApplied,
        setHasApplied,
        applicationSuccess,
        setApplicationSuccess,

        // profile editing
        profileData,
        setProfileData,
        skillInput,
        setSkillInput,
        projectInput,
        setProjectInput,
        achievementInput,
        setAchievementInput,

        formData,
        setFormData,
        editFormData,
        setEditFormData,

        // resume
        resumeData,
        setResumeData,
        resumeScore,
        setResumeScore,
        generating,
        setGenerating,
        profileForResume,
        setProfileForResume,

        // photo
        profilePhoto,
        setProfilePhoto,
        photoPreview,
        setPhotoPreview,
        showPhotoAdjust,
        setShowPhotoAdjust,
        photoZoom,
        setPhotoZoom,
        photoPosition,
        setPhotoPosition,
        isDragging,
        setIsDragging,
        dragStart,
        setDragStart,

        // misc
        tab,
        setTab,
        searchParams,
        setSearchParams,
        error,
        setError,
        count,
        setCount,



  isEditMode,
  setIsEditMode,

  showSuccessAnimation,
  setShowSuccessAnimation,
      }}
    >
      {children}
    </StudentContext.Provider>
  );
};