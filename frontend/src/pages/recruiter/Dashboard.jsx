import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../../context/AppContex";
import { RecruiterContext } from "../../context/RecruiterContext";

const RecruiterDashboard = () => {
  const navigate = useNavigate();

  const {
    jobs,
    setJobs,
    applications,
    setApplications,

    activeJobs,
    setActiveJobs,

    totalJobs,
    setTotalJobs,

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
    loading,
    setLoading,

    recentApplications,
    setRecentApplications,
  } = useContext(RecruiterContext);

  const { getProfile } = useContext(AppContext);

  useEffect(() => {
    const fetchProfile = async () => {
        setLoading(true);
      try {
        const result = await getProfile();

        const alljobs = result.user.createdJobs || [];
        setJobs(alljobs);

        const activeOnly = alljobs.filter(job => job.isActive);

        const allApplications = alljobs.flatMap(
          job => job.applications || []
        );
      

        setTotalApplications(allApplications.length);

        setAppliedCount(
          allApplications.filter(a => a.status === "APPLIED").length
        );

        setShortlistedCount(
  allApplications.filter(
    a => a.status === "SHORTLISTED"
  ).length
);


        setSelectedCount(
          allApplications.filter(a => a.status?.toUpperCase() === "SELECTED").length
        );
        
        setInterviewCount(
          allApplications.filter(a => a.status?.toUpperCase() === "INTERVIEW").length
        );

        setRejectedCount(
          allApplications.filter(a => a.status?.trim().toUpperCase() === "REJECTED").length
        );

        setActiveJobs(activeOnly.length);
        setTotalJobs(alljobs.length);

        const recentApp = [...allApplications].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setRecentApplications(recentApp);
   
      } catch (err) {
        console.log(err);
      }
      finally {
            setLoading(false);
        }
    };

    fetchProfile();
  }, []);

  const topJobs = (jobs || [])
    .map(job => ({
      ...job,
      liveAppCount: job.applications?.length || 0,
    }))
    .sort((a, b) => b.liveAppCount - a.liveAppCount)
    .slice(0, 5);

  const formatDate = (date) =>
    new Date(date).toLocaleDateString();

  const postJob = () => {
    navigate("/recruiter/post-job");
  };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }
 

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <button onClick={postJob} className="bg-blue-600 text-white px-4 py-2 rounded">
          Post Job
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-white shadow rounded">Active Jobs: {activeJobs}</div>
        <div className="p-4 bg-white shadow rounded">Total Jobs: {totalJobs}</div>
        <div className="p-4 bg-white shadow rounded">Applications: {totalApplications}</div>
        <div className="p-4 bg-white shadow rounded">Selected: {selectedCount}</div>
      </div>

      {/* Pipeline */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Pipeline</h2>
        <div className="flex gap-3 flex-wrap">
          <span>Applied: {appliedCount}</span>
          <span>Shortlisted: {shortlistedCount}</span>
          <span>Interview: {interviewCount}</span>
          <span>Selected: {selectedCount}</span>
          <span>Rejected: {rejectedCount}</span>
        </div>
      </div>

      {/* Recent Applications */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="font-semibold mb-3">Recent Applications</h2>
        {recentApplications.map(app => {
          const job = jobs.find(j => j.id === app.jobId);
          return (
            <div key={app._id} className="flex justify-between border-b py-2">
              <span>{app.fullName}</span>
              <span>{app.jobId?.title}</span>
              <span>{app.status}</span>
              <span>{formatDate(app.createdAt)}</span>
            </div>
          );
        })}
      </div>

      {/* Top Jobs */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-3">Top Jobs</h2>
        {topJobs.map(job => (
          <div key={job.id||job._id} className="flex justify-between border-b py-2">
            <span>{job.title}</span>
            <span>{job.liveAppCount} apps</span>
            <span>{job.status}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecruiterDashboard;