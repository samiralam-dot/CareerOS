import { useState, useEffect, useRef,useContext } from 'react';
import { RecruiterContext } from "../../context/RecruiterContext";
import { AppContext } from '../../context/AppContex';
import InterviewStatusBadge from '@components/InterviewStatusBadge';

import toast from 'react-hot-toast';
import {
    CalendarIcon,
    ClockIcon,
    LinkIcon,
    UserGroupIcon,
    BriefcaseIcon,
    PlusIcon,
    XMarkIcon,
    CheckCircleIcon,
    XCircleIcon,
    ArrowPathIcon,
} from '@heroicons/react/24/outline';

const ScheduleInterview = () => {
   const user={

   };
   const userProfile={};

    // ─── form state ────────────────────────────────────────────
    const {
  jobs,
  setJobs,

  selectedJobId,
  setSelectedJobId,

  candidates,
  setCandidates,

  selectedStudents,
  setSelectedStudents,

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

  loadingCandidates,
  setLoadingCandidates,
} = useContext(RecruiterContext);
       
const { getProfile,createInterview,updateInterview,deleteInterview 
}=useContext(AppContext)

 useEffect(() => {
  const fetchJobs = async () => {
    try {
      const result = await getProfile();
      

      const createdJobs = result?.user?.createdJobs || [];
   const interviews = createdJobs.flatMap(job => job.interview || []);
  
   setInterviews(interviews);
     

      setJobs(createdJobs);
     
    } catch (err) {
      console.log("Error fetching profile:", err);
      setJobs([]);
    }
  };

  fetchJobs();
}, []);


  
  useEffect(() => {
  if (!interviews) return;

  setLoadingInterviews(false);

 
  const allIds = new Set();

  interviews.forEach((iv) =>
    iv.students?.forEach((s) => allIds.add(s))
  );

  allIds.forEach((sid) => {
    if (!studentNamesRef.current[sid]) {
      setStudentNames((prev) => ({
        ...prev,
        [sid]: sid, 
      }));
    }
  });
}, [interviews]);




   
 useEffect(() => {

  if (!selectedJobId) return;


 
  const selectedJob = jobs?.find(
    (job) => job._id === selectedJobId
  );

 
  setCandidates(
  selectedJob?.applications
    .filter(app => app.status === "SHORTLISTED")
    .map((app, index) => ({
      ...app,
      key: app._id || index
    })) || []
);

  setSelectedStudents([]);

}, [selectedJobId, jobs]);

    // ─── handlers ──────────────────────────────────────────────

    const toggleStudent = (sid) => {
        console.log("Toggling student:", sid);
        setSelectedStudents((prev) =>
            prev.includes(sid) ? prev.filter((id) => id !== sid) : [...prev, sid],
        );
    };

    const[seleedJob,setSelectedJob]=useState(null);


 const selectedJob = jobs.find(
  (j) =>
    j.id === selectedJobId &&
    (!j?.interview || j.interview.length === 0)
);
useEffect(() => {
  if (selectedJob) {
    setSelectedJobId(selectedJob._id);
  } 
}, [selectedJob?._id]);


const handleSchedule = async () => {
  console.log("Scheduling interview with:",selectedJobId,jobs

  )
  if (
    !selectedJobId ||
    selectedStudents.length === 0 ||
    !date ||
    !time
  ) {
    toast.error("Please fill all required fields");
    return;
  }

  try {

    setSubmitting((prev) => true);

    const profile = await getProfile();

    const recruiterId = profile?.user?._id;

    console.log("hello");
const response = await createInterview(
  selectedJobId,
  selectedStudents,
  date,
  time,
  meetingLink
);

const newInterview = response?.interview;

setJobs((prevJobs) =>
  prevJobs.map((job) =>
    job._id === selectedJobId
      ? {
          ...job,

          interview: [
            ...(job.interview || []),
            newInterview
          ]
        }
      : job
  )
);

    toast.success("Interview scheduled successfully!");

    resetForm();

  } catch (err) {

    console.error("Schedule Error:", err);

    toast.error(
      err?.message || "Failed to schedule interview"
    );

  } finally {

    setSubmitting((prev) => false);

  }
};

    const resetForm = () => {
        setSelectedJobId('');
        setCandidates([]);
        setSelectedStudents([]);
        setDate('');
        setTime('');
        setMeetingLink('');
        setShowForm(false);
    };

    const openReschedule = (interview) => {
        setRescheduleModal({ open: true, interview });
        setRescheduleDate(interview.date);
        setRescheduleTime(interview.time);
        setRescheduleMeetingLink(interview.meetingLink || '');
    };

  const handleReschedule = async () => {
    if (!rescheduleDate || !rescheduleTime) {
        toast.error('Pick date & time');
        return;
    }

    try {

        const updatedata = {
            date: rescheduleDate,
            time: rescheduleTime,
            meetingLink: rescheduleMeetingLink,
        };

        setRescheduling(true);

        const data = await updateInterview(
            rescheduleModal.interview._id,
            updatedata
        );

        console.log("Reschedule Result:", data);

        setJobs(prevJobs =>
            prevJobs.map(job => ({
                ...job,

                interview: job.interview?.map(iv =>
                    iv._id === rescheduleModal.interview._id
                        ? {
                              ...iv,
                              date: rescheduleDate,
                              time: rescheduleTime,
                              meetingLink: rescheduleMeetingLink,
                          }
                        : iv
                )
            }))
        );

        toast.success('Interview rescheduled');

        setRescheduleModal({
            open: false,
            interview: null
        });

    } catch (err) {
        console.error(err);
        toast.error('Failed to reschedule');

    } finally {
        setRescheduling(false);
    }
};

   const handleCancel = async (id) => {

    if (!window.confirm('Are you sure you want to cancel this interview?')) {
        return;
    }

    try {

        await deleteInterview(id);

        // update frontend state
        setJobs(prevJobs =>
            prevJobs.map(job => ({
                ...job,
                interview: job.interview?.filter(
                    iv => iv._id !== id
                )
            }))
        );

        toast.success("Interview deleted");

    } catch (error) {

        console.log(error);
        toast.error("Failed to delete interview");
    }
};

    const handleComplete = async (id) => {
        try {
            await completeInterview(id);
            toast.success('Interview marked as completed');
        } catch (err) {
            console.error(err);
            toast.error('Failed to update');
        }
    };

    // ─── helpers ───────────────────────────────────────────────

  const fmtDate = (d) => {
    try {
       
        return new Date(d).toLocaleDateString(
            'en-US',
            {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }
        );
    } catch {
        return d;
    }
};


    const fmtTime = (t) => {
        try {
            const [h, m] = t.split(':');
            const hr = parseInt(h, 10);
            return `${hr % 12 || 12}:${m} ${hr >= 12 ? 'PM' : 'AM'}`;
        } catch { return t; }
    };

    // ─── render ────────────────────────────────────────────────

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Interview Scheduling</h1>
                    <p className="text-gray-500 mt-1">Schedule and manage candidate interviews</p>
                </div>
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                    >
                        <PlusIcon className="w-5 h-5" />
                        Schedule Interview
                    </button>
                )}
            </div>

            {/* ─── Schedule Form ─────────────────────────────── */}
            {showForm && (
                <div className="bg-white rounded-xl shadow-sm border p-6 space-y-5">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-gray-900">New Interview</h2>
                        <button onClick={resetForm} className="text-gray-400 hover:text-gray-600">
                            <XMarkIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Job select */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <BriefcaseIcon className="w-4 h-4 inline mr-1" />
                            Select Job Posting
                        </label>
                        <select
                            value={selectedJobId}
                            onChange={(e) => setSelectedJobId(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                            <option value="">— Choose a job —</option>
 {jobs
  ?.filter(
    (j) =>
      (!j?.interview || j.interview.length === 0) &&
      j.status !== "INTERVIEW" &&
      j.isAdminVerified === true
  )
  .map((j) => (
    <option
      key={j.id || j._id}
      value={j.id || j._id}
    >
      {j.title} — {j.companyName}
    </option>
))}                    </select>
                    </div>

                    {/* Candidates */}
                    {selectedJobId && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                <UserGroupIcon className="w-4 h-4 inline mr-1" />
                                Select Candidates ({selectedStudents.length} selected)
                            </label>
                            {loadingCandidates ? (
                                <p className="text-sm text-gray-400">Loading candidates…</p>
                            ) : candidates.length === 0 ? (
                                <p className="text-sm text-gray-400">No shortlisted candidates for this job.</p>
                            ) : (
                                <div className="grid sm:grid-cols-2 gap-2 max-h-60 overflow-y-auto border rounded-lg p-3">
                                    {candidates.map((c,idx) => (
                                        <label
                                            key={c._id || idx}
                                            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedStudents.includes(c._id) ? 'bg-primary-50 border border-primary-300' : 'hover:bg-gray-50 border border-transparent'}`}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={selectedStudents.includes(c._id)}
                                                onChange={() => toggleStudent(c._id)}
                                                className="h-4 w-4 text-primary-600 rounded border-gray-300"
                                            />
                                            <div className="min-w-0">
                                                <p className="text-sm font-medium text-gray-900 truncate">{c.fullName || 'Unknown'}</p>
                                                <p className="text-xs text-gray-500 truncate">{c.email || ''}</p>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Date + Time */}
                    <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <CalendarIcon className="w-4 h-4 inline mr-1" />
                                Date
                            </label>
                            <input
                                type="date"
                                value={date}
                                onChange={(e) => setDate(e.target.value)}
                                min={new Date().toISOString().split('T')[0]}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                <ClockIcon className="w-4 h-4 inline mr-1" />
                                Time
                            </label>
                            <input
                                type="time"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                            />
                        </div>
                    </div>

                    {/* Meeting link */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            <LinkIcon className="w-4 h-4 inline mr-1" />
                            Meeting Link <span className="text-gray-400">(optional)</span>
                        </label>
                        <input
                            type="url"
                            value={meetingLink}
                            onChange={(e) => setMeetingLink(e.target.value)}
                            placeholder="https://meet.google.com/..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button onClick={resetForm} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors">
                            Cancel
                        </button>
                        <button
                            onClick={handleSchedule}
                            disabled={submitting}
                            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 transition-colors"
                        >
                            {submitting ? 'Scheduling…' : 'Schedule Interview'}
                        </button>
                    </div>
                </div>
            )}

            {/* ─── Existing Interviews ──────────────────────── */}
            <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">All Interviews</h2>
                {loadingInterviews ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600" />
                    </div>
              ) : jobs?.filter(job => job?.interview?.length > 0).length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm border p-10 text-center">
                        <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p className="text-gray-500">No interviews scheduled yet</p>
                    </div>
                ) : (
                 <div className="grid gap-4">
    {jobs
         ?.filter(iv => iv?.interview?.length > 0)
         ?.map((iv, idx) => (
        <div key={iv.id || idx} className="bg-white rounded-xl shadow-sm border p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900">{iv?.companyName}</h3>
                        <InterviewStatusBadge status={iv?.interview?.[0]?.status} />
                    </div>

                    <p className="text-sm text-gray-600">{iv?.title}</p>

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                            <CalendarIcon className="w-4 h-4" />
                            {fmtDate(iv?.interview?.[0]?.date)}
                        </span>

                        <span className="flex items-center gap-1">
                            <ClockIcon className="w-4 h-4" />
                            {fmtTime(iv?.interview?.[0]?.time)}
                        </span>
                    </div>

                    {iv?.interview?.[0]?.interviewLink && (
                        <a
                            href={iv?.interview?.[0]?.interviewLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary-600 hover:underline mt-1"
                        >
                            <LinkIcon className="w-4 h-4" />
                            Meeting Link
                        </a>
                    )}

                    <div className="flex flex-wrap gap-1 mt-2">
                        {iv?.applications?.map((sid,idx) => (

                            <span
                                key={sid.studentId?._id || idx}
                                className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
                            >
                                {studentNames[sid.studentId?._id] ||
                                    sid.studentId?._id?.slice(0, 8)}
                            </span>

                        ))}
                    </div>
                </div>

                {/* Actions */}
                {(iv?.interview?.[0]?.status || iv?.status) && (
                    <div className="flex gap-2 shrink-0">

                        <button
                            onClick={() => openReschedule(iv?.interview?.[0])}
                            title="Reschedule"
                            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                        >
                            <ArrowPathIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => handleComplete(iv?.interview?.[0]?._id)}
                            title="Mark Completed"
                            className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                        >
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>

                        <button
                            onClick={() => handleCancel(iv?.interview?.[0]?._id)}
                            title="Cancel"
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <XCircleIcon className="w-5 h-5" />
                        </button>

                    </div>
                )}
            </div>
        </div>
    ))}
</div>
                )}
            </div>

            {/* ─── Reschedule Modal ─────────────────────────── */}
            {rescheduleModal.open && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
                    <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold text-gray-900">Reschedule Interview</h3>
                            <button onClick={() => setRescheduleModal({ open: false, interview: null })} className="text-gray-400 hover:text-gray-600">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Date</label>
                            <input type="date" value={rescheduleDate} onChange={(e) => setRescheduleDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">New Time</label>
                            <input type="time" value={rescheduleTime} onChange={(e) => setRescheduleTime(e.target.value)} className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Link (optional)</label>
                            <input type="url" value={rescheduleMeetingLink} onChange={(e) => setRescheduleMeetingLink(e.target.value)} placeholder="https://meet.google.com/..." className="w-full border border-gray-300 rounded-lg px-3 py-2" />
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <button onClick={() => setRescheduleModal({ open: false, interview: null })} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                            <button onClick={handleReschedule} disabled={rescheduling} className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 disabled:opacity-50">
                                {rescheduling ? 'Saving…' : 'Reschedule'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScheduleInterview;
