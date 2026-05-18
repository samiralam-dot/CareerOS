import { createContext, useState, useRef } from "react";

export const RecruiterContext = createContext();

export const RecruiterProvider = ({ children }) => {

 
  const navigate = (path) => {
    window.location.href = path;
  };

  const searchParams = null;
  const setSearchParams = () => {};

  
  const [userProfile, setUserProfile] = useState({ name: "samir" });
  const [profileData, setProfileData] = useState(null);
  const [profileLoading, setProfileLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const [formData, setFormData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState({ jd: false, brochure: false });
  const [attachments, setAttachments] = useState({
    jobDescriptionPDF: null,
    companyBrochure: null,
  });
  const [previewFile, setPreviewFile] = useState(null);

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [activeJobs, setActiveJobs] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);
  const [closedJobs, setClosedJobs] = useState(0);

  const [totalApplications, setTotalApplications] = useState(0);
  const [appliedCount, setAppliedCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);
  const [interviewCount, setInterviewCount] = useState(0);
  const [selectedCount, setSelectedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);

  const [recentApplications, setRecentApplications] = useState([]);

 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [deleteModal, setDeleteModal] = useState({ open: false, job: null });
  const [deleting, setDeleting] = useState(false);

  const [filter, setFilter] = useState("all");

  const [editModal, setEditModal] = useState({ open: false, job: null });
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null);
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);

  const [shortlistMode, setShortlistMode] = useState(false);
const [selectedIds, setSelectedIds] = useState([]);
  const [shortlisting, setShortlisting] = useState(false);
  const [showShortlistWarning, setShowShortlistWarning] = useState(false);

  const [showShortlistedView, setShowShortlistedView] = useState(false);
  const [finalSelectionMode, setFinalSelectionMode] = useState(false);
  const [finalSelectedIds, setFinalSelectedIds] = useState(new Set());
  const [completingRecruitment, setCompletingRecruitment] = useState(false);
  const [showFinalPlacementWarning, setShowFinalPlacementWarning] = useState(false);

  const [appCounts, setAppCounts] = useState({});
  const appCountUnsubRef = useRef(null);

 
  const [selectedJobId, setSelectedJobId] = useState("");
  const [candidates, setCandidates] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loadingCandidates, setLoadingCandidates] = useState(false);


  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [meetingLink, setMeetingLink] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [interviews, setInterviews] = useState([]);
  const [loadingInterviews, setLoadingInterviews] = useState(false);

  const [studentNames, setStudentNames] = useState({});
  const studentNamesRef = useRef(studentNames);


  const [rescheduleModal, setRescheduleModal] = useState({
    open: false,
    interview: null,
  });

  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [rescheduleMeetingLink, setRescheduleMeetingLink] = useState("");
  const [rescheduling, setRescheduling] = useState(false);

  return (
    <RecruiterContext.Provider value={{
      navigate,
      searchParams,
      setSearchParams,

      userProfile,
      setUserProfile,
      profileData,
      setProfileData,
      profileLoading,
      setProfileLoading,
      isEditMode,
      setIsEditMode,
      logoUploading,
      setLogoUploading,
      showSuccessAnimation,
      setShowSuccessAnimation,

      formData,
      setFormData,
      isSubmitting,
      setIsSubmitting,
      submitError,
      setSubmitError,
      submitSuccess,
      setSubmitSuccess,

      isUploading,
      setIsUploading,
      uploadProgress,
      setUploadProgress,
      attachments,
      setAttachments,
      previewFile,
      setPreviewFile,

      jobs,
      setJobs,
      applications,
      setApplications,

      activeJobs,
      setActiveJobs,
      totalJobs,
      setTotalJobs,
      closedJobs,
      setClosedJobs,

      totalApplications,
      setTotalApplications,
      appliedCount,
      setAppliedCount,
      shortlistedCount,
      setShortlistedCount,
      interviewCount,
      setInterviewCount,
      selectedCount,
      setSelectedCount,
      rejectedCount,
      setRejectedCount,

      recentApplications,
      setRecentApplications,

   
      loading,
      setLoading,
      error,
      setError,
      deleteModal,
      setDeleteModal,
      deleting,
      setDeleting,
      filter,
      setFilter,
      editModal,
      setEditModal,
      editForm,
      setEditForm,
      saving,
      setSaving,
      selectedJob,
      setSelectedJob,
      applicants,
      setApplicants,
      loadingApplicants,
      setLoadingApplicants,
      selectedApplicant,
      setSelectedApplicant,
      shortlistMode,
      setShortlistMode,
      selectedIds,
      setSelectedIds,
      shortlisting,
      setShortlisting,
      showShortlistWarning,
      setShowShortlistWarning,
      showShortlistedView,
      setShowShortlistedView,
      finalSelectionMode,
      setFinalSelectionMode,
      finalSelectedIds,
      setFinalSelectedIds,
      completingRecruitment,
      setCompletingRecruitment,
      showFinalPlacementWarning,
      setShowFinalPlacementWarning,
      appCounts,
      setAppCounts,
      appCountUnsubRef,

      selectedJobId,
      setSelectedJobId,
      candidates,
      setCandidates,
      selectedStudents,
      setSelectedStudents,
      loadingCandidates,
      setLoadingCandidates,

      date,
      setDate,
      time,
      setTime,
      meetingLink,
      setMeetingLink,
      submitting,
      setSubmitting,
      showForm,
      setShowForm,
      interviews,
      setInterviews,
      loadingInterviews,
      setLoadingInterviews,
      studentNames,
      setStudentNames,
      studentNamesRef,

      rescheduleModal,
      setRescheduleModal,
      rescheduleDate,
      setRescheduleDate,
      rescheduleTime,
      setRescheduleTime,
      rescheduleMeetingLink,
      setRescheduleMeetingLink,
      rescheduling,
      setRescheduling,
    }}>
      {children}
    </RecruiterContext.Provider>
  );
};