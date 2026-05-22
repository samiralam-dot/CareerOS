import { Routes, Route, Navigate } from 'react-router-dom';


// Layouts
import PublicLayout from '@layouts/PublicLayout';
import StudentLayout from '@layouts/StudentLayout';
import RecruiterLayout from '@layouts/RecruiterLayout';
import AdminLayout from '@layouts/AdminLayout';
import ProtectedRoute from '@components/ProtectedRoute';

// Public Pages
import LandingPage from '@pages/public/LandingPage';
import LoginPage from '@pages/auth/LoginPage';
import RegisterPage from '@pages/auth/RegisterPage';
import ForgotPasswordPage from '@pages/auth/ForgotPasswordPage';
import VerifyOTP from '@pages/auth/VerifyOTP';
import AdminLoginPage from '@pages/auth/AdminLoginPage';
import StudentLoginPage from '@pages/auth/StudentLoginPage';
import RecruiterLoginPage from '@pages/auth/RecruiterLoginPage';
import StudentRegisterPage from '@pages/auth/StudentRegisterPage';
import RecruiterRegisterPage from '@pages/auth/RecruiterRegisterPage';

// Student Pages
import StudentDashboard from '@pages/student/Dashboard';
import StudentProfile from '@pages/student/Profile';
import JobsList from '@pages/student/JobsList';
import JobDetails from '@pages/student/JobDetails';
import Applications from '@pages/student/Applications';
import Interviews from '@pages/student/Interviews';
import Resume from '@pages/student/Resume';


// Recruiter Pages
import RecruiterDashboard from '@pages/recruiter/Dashboard';
import RecruiterProfile from '@pages/recruiter/Profile';
import PostJob from '@pages/recruiter/PostJob';
import ManageJobs from '@pages/recruiter/ManageJobs';
import Candidates from '@pages/recruiter/Candidates';
import RecruiterAnalytics from '@pages/recruiter/Analytics';
import ScheduleInterview from '@pages/recruiter/ScheduleInterview';

// Admin Pages
import AdminDashboard from '@pages/admin/Dashboard';
import ManageStudents from '@pages/admin/ManageStudents';
import StudentProfiles from '@pages/admin/StudentProfiles';
import StudentVerification from '@pages/admin/StudentVerification';
import ManageRecruiters from '@pages/admin/ManageRecruiters';
import RecruiterProfiles from '@pages/admin/RecruiterProfiles';
import RecruiterVerification from '@pages/admin/RecruiterVerification';
import PlacementAnalytics from '@pages/admin/PlacementAnalytics';
import JobApprovals from '@pages/admin/JobApprovals';
import Reports from '@pages/admin/Reports';


function App() {
    
    // Show loading state while checking authentication
   
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route
                    path="/login"
                    element={ <LoginPage />}
                />
                <Route
                    path="/register"
                    element={<RegisterPage />}
                />
                <Route path="/admin/login" element={ <AdminLoginPage />} />
                <Route path="/student/login" element={ <StudentLoginPage />} />
                <Route path="/student/register" element={ <StudentRegisterPage />} />
                <Route path="/recruiter/login" element={ <RecruiterLoginPage />} />
                <Route path="/recruiter/register" element={ <RecruiterRegisterPage />} />
                  <Route path="/forgotpassword" element={<ForgotPasswordPage />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
            </Route>

        
         
   {/* Student Routes */}
<Route element={<ProtectedRoute role="student" />}>
  <Route path="/student" element={<StudentLayout />}>
    <Route path="dashboard" element={<StudentDashboard />} />
    <Route path="profile" element={<StudentProfile />} />
    <Route path="jobs" element={<JobsList />} />
    <Route path="jobs/:jobId/:userId" element={<JobDetails />} />
    <Route path="applications" element={<Applications />} />
    <Route path="interviews" element={<Interviews />} />
    <Route path="resume" element={<Resume />} />
  </Route>
</Route>


{/* Recruiter Routes */}
<Route element={<ProtectedRoute role="recruiter" />}>
  <Route path="/recruiter" element={<RecruiterLayout />}>
    <Route path="dashboard" element={<RecruiterDashboard />} />
    <Route path="profile" element={<RecruiterProfile />} />
    <Route path="post-job" element={<PostJob />} />
    <Route path="jobs" element={<ManageJobs />} />
    <Route path="jobs/:jobId/edit" element={<PostJob />} />
    <Route path="jobs/:jobId/candidates" element={<Candidates />} />
    <Route path="analytics" element={<RecruiterAnalytics />} />
    <Route path="interviews" element={<ScheduleInterview />} />
  </Route>
</Route>


{/* Admin Routes */}
<Route element={<ProtectedRoute role="admin" />}>
  <Route path="/admin" element={<AdminLayout />}>
    <Route path="dashboard" element={<AdminDashboard />} />
    <Route path="students" element={<ManageStudents />} />
    <Route path="students/profiles" element={<StudentProfiles />} />
    <Route path="students/verification" element={<StudentVerification />} />
    <Route path="recruiters" element={<ManageRecruiters />} />
    <Route path="recruiters/profiles" element={<RecruiterProfiles />} />
    <Route path="recruiters/verification" element={<RecruiterVerification />} />
    <Route path="jobs/approvals" element={<JobApprovals />} />
    <Route path="analytics" element={<PlacementAnalytics />} />
    <Route path="reports" element={<Reports />} />
  </Route>
</Route>

            {/* Fallback Routes */}
            <Route path="/unauthorized" element={<div className="flex items-center justify-center min-h-screen"><h1 className="text-2xl font-bold">Unauthorized Access</h1></div>} />
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}

export default App;
