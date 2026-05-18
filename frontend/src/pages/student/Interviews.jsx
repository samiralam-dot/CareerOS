import { useState, useEffect, useContext } from 'react';
import { getProfile } from '../../context/auth';
import { INTERVIEW_STATUS } from '@config/constants';
import InterviewStatusBadge from '@components/InterviewStatusBadge';
import { AppContext } from '../../context/AppContex';
import { StudentContext } from "../../context/StudentContext";

import {
    CalendarIcon,
    ClockIcon,
    BuildingOffice2Icon,
    BriefcaseIcon,
    LinkIcon,
} from '@heroicons/react/24/outline';


const Interviews = () => {
   const {
  interviews,
  setInterviews,
  loading,
  setLoading,
  tab,
  setTab
} = useContext(StudentContext);
    const {getProfile}=useContext(AppContext)

   
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await getProfile();
            

                const allInterviews = [];

                res?.user?.applications?.forEach((app) => {
                    const job = app?.jobId;

                    if (job?.interview?.length) {
                        job.interview.forEach((iv) => {
                            allInterviews.push({
                                ...iv,
                                job,
                                application: app,
                            });
                        });
                    }
                });

                setInterviews(allInterviews);
            } catch (err) {
                console.error("Error:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Helper: safe datetime
const getDateTime = (iv) => {
    if (!iv?.date || !iv?.time) return null;

    try {
        // Extract date only: "2026-05-17"
        const datePart = new Date(iv.date)
            .toISOString()
            .split("T")[0];

        // Combine with time: "2026-05-17 5:30:00 AM"
        const dt = new Date(`${datePart} ${iv.time}`);

        return isNaN(dt.getTime()) ? null : dt;
    } catch {
        return null;
    }
};





    const now = new Date();

    //  Upcoming
    const upcoming = interviews
        .filter((iv) => {
            const active =
                iv.status.toUpperCase() === INTERVIEW_STATUS.SCHEDULED.toUpperCase() ||
                iv.status.toUpperCase() === INTERVIEW_STATUS.RESCHEDULED.toUpperCase();

            const dt = getDateTime(iv);
           
            return active && dt && dt >= now;
        })
        .sort((a, b) => getDateTime(a) - getDateTime(b));
        
    const past = interviews
        .filter((iv) => {
            const dt = getDateTime(iv);
            return !dt || dt < now;
        })
        .sort((a, b) => getDateTime(b) - getDateTime(a));

    const displayed = tab === 'upcoming' ? upcoming : past;

    const fmtDate = (d) => {
        try {
            return new Date(d).toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric',
            });
        } catch {
            return d;
        }
    };

const fmtTime = (dateStr) => {
    try {
        const dt = new Date(dateStr);
     

        return dt.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    } catch {
        return '';
    }
};

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Interviews</h1>
                <p className="text-gray-500 mt-1">
                    View your upcoming and past interviews
                </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 bg-gray-100 rounded-lg p-1 max-w-xs">
                {['upcoming', 'past'].map((t) => (
                    <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`flex-1 text-sm font-medium px-4 py-2 rounded-md capitalize transition ${
                            tab === t
                                ? 'bg-white text-blue-600 shadow'
                                : 'text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        {t} ({t === 'upcoming' ? upcoming.length : past.length})
                    </button>
                ))}
            </div>

            {/* Content */}
            {loading ? (
                <div className="flex justify-center py-16">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
                </div>
            ) : displayed.length === 0 ? (
                <div className="bg-white border rounded-xl p-10 text-center">
                    <CalendarIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">
                        {tab === 'upcoming'
                            ? 'No upcoming interviews'
                            : 'No past interviews'}
                    </p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {displayed.map((iv) => (
                        <div
                            key={iv._id}
                            className="bg-white border rounded-xl p-5 shadow-sm hover:shadow-md transition"
                        >
                            <div className="flex justify-between gap-4">
                                <div className="space-y-2">
                                    {/* Company + Status */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <h3 className="font-semibold text-lg text-gray-900">
                                            {iv?.job?.companyName}
                                        </h3>
                                        <InterviewStatusBadge status={iv.status} />
                                    </div>

                                    {/* Role */}
                                    <p className="flex items-center gap-1 text-gray-600">
                                        <BriefcaseIcon className="w-4 h-4" />
                                        {iv?.job?.title}
                                    </p>

                                    {/* Date & Time */}
                                    <div className="flex gap-4 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <CalendarIcon className="w-4 h-4" />
                                            {fmtDate(iv.date)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <ClockIcon className="w-4 h-4" />
                                            {fmtTime(iv.date)}
                                        </span>
                                    </div>

                                    {/* Meeting link */}
                                    {iv.interviewLink && (
                                        <a
                                            href={iv.interviewLink}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-1 text-blue-600 text-sm hover:underline"
                                        >
                                            <LinkIcon className="w-4 h-4" />
                                            Join Meeting
                                        </a>
                                    )}
                                </div>

                                {/* Icon */}
                                <div className="hidden sm:flex items-center justify-center w-14 h-14 bg-blue-50 rounded-xl">
                                    <BuildingOffice2Icon className="w-6 h-6 text-blue-600" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Interviews;