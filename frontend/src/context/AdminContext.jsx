import { createContext, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = ({ children }) => {

  const navigate = (path) => {
    window.location.href = path;
  };

  const searchParams = null;
  const setSearchParams = () => {};


  const [stats, setStats] = useState({
    totalStudents: 0,
    verifiedStudents: 0,
    pendingStudents: 0,
    totalRecruiters: 0,
    verifiedRecruiters: 0,
    pendingRecruiters: 0,
    totalJobs: 0,
    activeJobs: 0,
    pendingJobApprovals: 0,
    totalApplications: 0,
    placedStudents: 0,
  });

  const [users, setUsers] = useState([]);
  const [students, setStudents] = useState([]);
  const [recruiters, setRecruiters] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [bulkActionLoading, setBulkActionLoading] = useState(false);

  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);


  const [filters, setFilters] = useState({
    verificationFilter: "all",
    industryFilter: [],
    sortBy: "newest",

    selectedBranches: [],
    selectedGenders: [],

    cgpaRange: null,
    minCgpa: "",
    maxCgpa: "",

    skillSearch: "",
    profileComplete: "all",
  });

  
  const selectedBranches = filters.selectedBranches;
  const setSelectedBranches = (value) =>
    setFilters((prev) => ({ ...prev, selectedBranches: value }));

  const selectedGenders = filters.selectedGenders;
  const setSelectedGenders = (value) =>
    setFilters((prev) => ({ ...prev, selectedGenders: value }));

  const cgpaRange = filters.cgpaRange;
  const setCgpaRange = (value) =>
    setFilters((prev) => ({ ...prev, cgpaRange: value }));

  const minCgpa = filters.minCgpa;
  const setMinCgpa = (value) =>
    setFilters((prev) => ({ ...prev, minCgpa: value }));

  const maxCgpa = filters.maxCgpa;
  const setMaxCgpa = (value) =>
    setFilters((prev) => ({ ...prev, maxCgpa: value }));

  const skillSearch = filters.skillSearch;
  const setSkillSearch = (value) =>
    setFilters((prev) => ({ ...prev, skillSearch: value }));

  const profileComplete = filters.profileComplete;
  const setProfileComplete = (value) =>
    setFilters((prev) => ({ ...prev, profileComplete: value }));


  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);

  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedRecruiters, setSelectedRecruiters] = useState([]);

  const [recentActivity, setRecentActivity] = useState([]);

  
  const clearSelections = () => {
    setSelectedUser(null);
    setSelectedStudent(null);
    setSelectedRecruiter(null);
    setSelectedJob(null);
    setSelectedStudents([]);
    setSelectedRecruiters([]);
  };

  const resetFilters = () => {
    setFilters({
      verificationFilter: "all",
      industryFilter: [],
      sortBy: "newest",
      selectedBranches: [],
      selectedGenders: [],
      cgpaRange: null,
      minCgpa: "",
      maxCgpa: "",
      skillSearch: "",
      profileComplete: "all",
    });
  };

  return (
    <AdminContext.Provider
      value={{
        navigate,
        searchParams,
        setSearchParams,

        stats,
        setStats,

        users,
        setUsers,
        students,
        setStudents,
        recruiters,
        setRecruiters,
        jobs,
        setJobs,
        applications,
        setApplications,

        loading,
        setLoading,
        actionLoading,
        setActionLoading,
        bulkActionLoading,
        setBulkActionLoading,

        error,
        setError,
        refreshing,
        setRefreshing,

        searchTerm,
        setSearchTerm,
        showFilters,
        setShowFilters,

        filters,
        setFilters,

        selectedUser,
        setSelectedUser,
        selectedStudent,
        setSelectedStudent,
        selectedRecruiter,
        setSelectedRecruiter,
        selectedJob,
        setSelectedJob,

        selectedStudents,
        setSelectedStudents,
        selectedRecruiters,
        setSelectedRecruiters,

        selectedBranches,
        setSelectedBranches,
        selectedGenders,
        setSelectedGenders,
        cgpaRange,
        setCgpaRange,
        minCgpa,
        setMinCgpa,
        maxCgpa,
        setMaxCgpa,
        skillSearch,
        setSkillSearch,
        profileComplete,
        setProfileComplete,

        recentActivity,
        setRecentActivity,

        clearSelections,
        resetFilters,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};