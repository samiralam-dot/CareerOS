import { useState, useEffect ,useContext} from 'react';
import { Link } from 'react-router-dom';

import { AppContext } from '../../context/AppContex';
import {AdminContext} from '../../context/AdminContext'

import {
    ArrowLeftIcon,
    ShieldCheckIcon,
    XMarkIcon,
    CheckIcon,
    EnvelopeIcon,
    BuildingOfficeIcon,
    ClockIcon,
    MagnifyingGlassIcon,
    EyeIcon,
    BriefcaseIcon,
    MapPinIcon,
    PhoneIcon,
    GlobeAltIcon,
    CheckBadgeIcon,
} from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const RecruiterVerification = () => {
    const {
  recruiters,
  setRecruiters,
  loading,
  setLoading,
  searchTerm,
  setSearchTerm,
  actionLoading,
  setActionLoading,
  selectedRecruiter,
  setSelectedRecruiter,
} = useContext(AdminContext);
     const {getAllUser,updateUser,createNotification,sendOtpMail}=useContext(AppContext)

   useEffect(() => {
    const fetchRecruiters = async () => {
        try {
            setLoading(true);

            
            const res = await getAllUser();
            const users=res.users
          

            // Filter recruiters only
            const recruiters = users
                .filter((user) => user.role === 'recruiter')
                .map((user) => ({
                    id: user._id,
                    fullName: user.name || 'Unknown',
                    email: user.email || '',
                    companyName: user.profileId?.companyName ||user.companyName|| '',
                    designation: user.designation || '',
                    companyWebsite: user.profileId?.companyWebsite || '',
                    companySize: user.profileId?.companySize || '',
                    industry: user.profileId?.industry || '',
                    companyLogoUrl: user.profileId?.companyLogoUrl || '',
                    description: user.profileId?.description || '',
                    location: user.profileId?.location || '',
                    contactNumber: user.profileId?.contactNumber || '',
                    isAdminVerified: user.isVerified ?? true,
                    createdAt: user.createdAt || '',
                }));
              

            // Sort latest first
            recruiters.sort((a, b) =>
                (b.createdAt || '').localeCompare(a.createdAt || '')
            );

            setRecruiters(recruiters);
        } catch (error) {
            console.error('Error fetching recruiters:', error);
            toast.error('Failed to load recruiters');
        } finally {
            setLoading(false);
        }
    };

    fetchRecruiters();
}, []);

    const handleVerify = async (recruiterId, companyName) => {
    setActionLoading(recruiterId);

    try {
      
       
        await updateUser(recruiterId, {
            isVerified: true,
            updatedAt: new Date().toISOString(),
        });

        
        const user = recruiters.find((r) => r.id === recruiterId);
   
        
     if (user) {
  await createNotification(
    "Account Verified",
    `Congratulations! Your account has been verified successfully.`,
    user.id
  );

  if (user.email) {
    await sendOtpMail(
      user.email,
      "Account Verified",
      `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:green;">Account Verified</h2>

          <p>
            Hello ${
              user.fullName || user.companyName || "Recruiter"
            },
          </p>

          <p>
            Your account has been
            <strong style="color:green;">verified successfully</strong>.
          </p>

          <p>
            You can now access all features of the platform.
          </p>

          <hr />

          <p>Thank you for using our platform.</p>
        </div>
      `
    );
  }
}

       
        setRecruiters((prev) =>
            prev.map((r) =>
                r.id === recruiterId
                    ? { ...r, isAdminVerified: true }
                    : r
            )
        );


      

       


        toast.success(`${companyName} has been verified`);
    } catch (error) {
        console.error("Error verifying recruiter:", error);
        toast.error("Failed to verify recruiter");
    } finally {
        setActionLoading(null);
    }
};

  const handleReject = async (recruiterId, companyName) => {
    setActionLoading(recruiterId);

    try {
        
        await updateUser(recruiterId, {
            isAdminVerified: false,
            updatedAt: new Date().toISOString(),
        });

        
        await createNotification(
            "Verification Rejected",
            `Your company "${companyName}" verification was rejected by admin.`,
            recruiterId
        );

       
        const recruiter = recruiters.find(r => r.id === recruiterId);

        if (recruiter?.email) {
            await sendOtpMail(
                recruiter.email,
                "Verification Rejected",
                `
                <div style="font-family: Arial; padding:20px;">
                    <h2 style="color:red;">Verification Rejected</h2>

                    <p>
                        Hello ${recruiter.fullName || "User"},
                    </p>

                    <p>
                        Your company <strong>${companyName}</strong> verification has been
                        <strong style="color:red;">rejected</strong> by admin.
                    </p>

                    <p>
                        Please update your profile or contact admin for more details.
                    </p>

                    <hr />

                    <p>Thank you.</p>
                </div>
                `
            );
        }

        
        setRecruiters((prev) =>
            prev.map((r) =>
                r.id === recruiterId
                    ? { ...r, isAdminVerified: false }
                    : r
            )
        );

        toast.success(`${companyName}'s verification was rejected`);
    } catch (error) {
        console.error("Error rejecting recruiter:", error);
        toast.error("Failed to reject recruiter");
    } finally {
        setActionLoading(null);
    }
};



    const filtered = recruiters.filter((r) => {
        const matchSearch =
            !searchTerm.trim() ||
            (r.fullName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.companyName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.designation || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (r.location || '').toLowerCase().includes(searchTerm.toLowerCase());
        return r.isAdminVerified === false && matchSearch;
    });

    const pendingCount = recruiters.filter((r) => r.isAdminVerified === false).length;

    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        try {
            return new Date(dateStr).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
            });
        } catch {
            return dateStr;
        }
    };

    const getInitial = (name) => (name || 'C').charAt(0).toUpperCase();

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto" />
                    <p className="mt-4 text-gray-600">Loading verification requests...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/recruiters"
                        className="p-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <ArrowLeftIcon className="w-5 h-5 text-gray-600" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                            <ShieldCheckIcon className="w-7 h-7 text-emerald-600" />
                            Recruiter Verification
                        </h1>
                        <p className="text-sm text-gray-500 mt-0.5">
                            Review and approve recruiter account requests
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-xl border border-gray-200 p-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center flex-shrink-0">
                        <ClockIcon className="w-6 h-6 text-amber-600" />
                    </div>
                    <div>
                        <p className="text-3xl font-bold text-gray-900">{pendingCount}</p>
                        <p className="text-sm text-gray-500">Pending Verification Requests</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                    type="text"
                    placeholder="Search pending recruiters..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-100"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Recruiter List */}
            {filtered.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckIcon className="w-8 h-8 text-gray-300" />
                    </div>
                    <h3 className="text-base font-semibold text-gray-900 mb-1">
                        No pending requests
                    </h3>
                    <p className="text-sm text-gray-500">
                        All recruiter accounts have been reviewed.
                    </p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((recruiter) => {
                        const initial = getInitial(recruiter.companyName || recruiter.fullName);
                        const isProcessing = actionLoading === recruiter.id;

                        return (
                            <div
                                key={recruiter.id}
                                className="bg-white rounded-xl border border-amber-200 bg-amber-50/30 p-4 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    {/* Company Logo */}
                                    {recruiter.companyLogoUrl ? (
                                        <img
                                            src={recruiter.companyLogoUrl}
                                            alt={recruiter.companyName}
                                            className="w-12 h-12 rounded-xl object-cover border border-gray-200 flex-shrink-0"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center flex-shrink-0">
                                            <span className="text-lg font-bold text-white">{initial}</span>
                                        </div>
                                    )}

                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">{recruiter.companyName || 'Unknown Company'}</h3>
                                            <span className="flex-shrink-0 inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-700 border border-amber-200">
                                                <ClockIcon className="w-3 h-3" />
                                                Pending
                                            </span>
                                        </div>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                                            <span className="text-xs text-gray-600 font-medium">{recruiter.fullName}</span>
                                            {recruiter.email && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <EnvelopeIcon className="w-3 h-3" />
                                                    {recruiter.email}
                                                </span>
                                            )}
                                            {recruiter.designation && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <BriefcaseIcon className="w-3 h-3" />
                                                    {recruiter.designation}
                                                </span>
                                            )}
                                            {recruiter.location && (
                                                <span className="flex items-center gap-1 text-xs text-gray-500">
                                                    <MapPinIcon className="w-3 h-3" />
                                                    {recruiter.location}
                                                </span>
                                            )}
                                            {recruiter.createdAt && (
                                                <span className="text-xs text-gray-400">
                                                    Registered {formatDate(recruiter.createdAt)}
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex items-center gap-2 flex-shrink-0">
                                        <button
                                            onClick={() => setSelectedRecruiter(recruiter)}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                                        >
                                            <EyeIcon className="w-3.5 h-3.5" />
                                            View
                                        </button>
                                        <button
                                            onClick={() => handleVerify(recruiter.id, recruiter.companyName)}
                                            disabled={isProcessing}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
                                        >
                                            {isProcessing ? (
                                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white" />
                                            ) : (
                                                <CheckIcon className="w-3.5 h-3.5" />
                                            )}
                                            Approve
                                        </button>
                                        <button
                                            onClick={() => handleReject(recruiter.id, recruiter.companyName)}
                                            disabled={isProcessing}
                                            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 disabled:opacity-50 transition-colors"
                                        >
                                            <XMarkIcon className="w-3.5 h-3.5" />
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Profile Modal */}
            {selectedRecruiter && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={() => setSelectedRecruiter(null)}>
                    <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
                    <div
                        className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-hidden animate-[modalIn_0.25s_ease-out]"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative h-28 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 flex-shrink-0">
                            <div className="absolute inset-0 opacity-15">
                                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                                    <defs>
                                        <pattern id="modal-grid" width="24" height="24" patternUnits="userSpaceOnUse">
                                            <path d="M 24 0 L 0 0 0 24" fill="none" stroke="white" strokeWidth="0.5" />
                                        </pattern>
                                    </defs>
                                    <rect width="100%" height="100%" fill="url(#modal-grid)" />
                                </svg>
                            </div>
                            <button
                                onClick={() => setSelectedRecruiter(null)}
                                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/15 backdrop-blur-sm hover:bg-white/30 flex items-center justify-center transition-colors"
                            >
                                <XMarkIcon className="w-5 h-5 text-white" />
                            </button>
                            <div className="absolute top-3 left-4">
                                {selectedRecruiter.isAdminVerified === false ? (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-400/20 text-amber-100 border border-amber-300/30 backdrop-blur-sm">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        Pending Verification
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-green-400/20 text-green-100 border border-green-300/30 backdrop-blur-sm">
                                        <CheckBadgeIcon className="w-3.5 h-3.5" />
                                        Verified
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* Company Logo */}
                        <div className="px-6 -mt-10 relative z-10">
                            {selectedRecruiter.companyLogoUrl ? (
                                <img
                                    src={selectedRecruiter.companyLogoUrl}
                                    alt={selectedRecruiter.companyName}
                                    className="w-20 h-20 rounded-xl object-cover border-4 border-white shadow-lg bg-white"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 border-4 border-white shadow-lg flex items-center justify-center">
                                    <span className="text-2xl font-bold text-white">{getInitial(selectedRecruiter.companyName || selectedRecruiter.fullName)}</span>
                                </div>
                            )}
                        </div>

                        {/* Scrollable Content */}
                        <div className="px-6 pt-3 pb-6 overflow-y-auto max-h-[calc(85vh-10rem)]">
                            <h2 className="text-xl font-bold text-gray-900">{selectedRecruiter.companyName || 'Unknown Company'}</h2>
                            <p className="text-sm text-gray-600 mt-0.5">{selectedRecruiter.fullName}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                {selectedRecruiter.industry && (
                                    <span className="text-xs text-purple-600 font-medium bg-purple-50 px-2.5 py-0.5 rounded-md">
                                        {selectedRecruiter.industry}
                                    </span>
                                )}
                                {selectedRecruiter.companySize && (
                                    <span className="text-xs text-gray-500 bg-gray-100 px-2.5 py-0.5 rounded-md">
                                        {selectedRecruiter.companySize}
                                    </span>
                                )}
                            </div>

                            {/* Contact Info */}
                            <div className="mt-4 space-y-2">
                                {selectedRecruiter.designation && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <BriefcaseIcon className="w-3.5 h-3.5" />
                                        {selectedRecruiter.designation}
                                    </div>
                                )}
                                {selectedRecruiter.email && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <EnvelopeIcon className="w-3.5 h-3.5" />
                                        {selectedRecruiter.email}
                                    </div>
                                )}
                                {selectedRecruiter.contactNumber && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <PhoneIcon className="w-3.5 h-3.5" />
                                        {selectedRecruiter.contactNumber}
                                    </div>
                                )}
                                {selectedRecruiter.location && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <MapPinIcon className="w-3.5 h-3.5" />
                                        {selectedRecruiter.location}
                                    </div>
                                )}
                                {selectedRecruiter.companyWebsite && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <GlobeAltIcon className="w-3.5 h-3.5" />
                                        <a
                                            href={selectedRecruiter.companyWebsite}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-purple-600 hover:underline"
                                        >
                                            {selectedRecruiter.companyWebsite}
                                        </a>
                                    </div>
                                )}
                                {selectedRecruiter.createdAt && (
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <ClockIcon className="w-3.5 h-3.5" />
                                        Registered {formatDate(selectedRecruiter.createdAt)}
                                    </div>
                                )}
                            </div>

                            <hr className="my-4 border-gray-100" />

                            {/* Description */}
                            {selectedRecruiter.description && (
                                <div className="mb-4">
                                    <h4 className="text-xs font-semibold text-gray-900 mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                                        <BuildingOfficeIcon className="w-3.5 h-3.5 text-purple-500" />
                                        About Company
                                    </h4>
                                    <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{selectedRecruiter.description}</p>
                                </div>
                            )}

                            {!selectedRecruiter.description && (
                                <div className="text-center py-6">
                                    <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <BuildingOfficeIcon className="w-7 h-7 text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-400">No company description available.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                @keyframes modalIn {
                    from { opacity: 0; transform: scale(0.95) translateY(10px); }
                    to { opacity: 1; transform: scale(1) translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default RecruiterVerification;
