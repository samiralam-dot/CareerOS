import { useState ,useContext, useEffect} from 'react';
import { Outlet, Link, useLocation, useNavigate, } from 'react-router-dom';
import{AppContext} from "../context/AppContex"

import NotificationPanel from '@components/NotificationPanel';
import {
    HomeIcon,
    BriefcaseIcon,
    DocumentTextIcon,
    CalendarIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
} from '@heroicons/react/24/outline';
import { use } from 'react';

const navigation = [
    { name: 'Dashboard', href: '/student/dashboard', icon: HomeIcon },
    { name: 'Browse Jobs', href: '/student/jobs', icon: BriefcaseIcon },
    { name: 'My Applications', href: '/student/applications', icon: DocumentTextIcon },
    { name: 'Interviews', href: '/student/interviews', icon: CalendarIcon },
    { name: 'Resume', href: '/student/resume', icon: DocumentTextIcon },
    { name: 'Profile', href: '/student/profile', icon: UserCircleIcon },
];

const StudentLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const location = useLocation();
    const navigate = useNavigate();
    const {getProfile, signOut} = useContext(AppContext);
const [userProfile, setUserProfile,] = useState({
  fullName: "John hello",
  email: "hddhuhueh"
});

useEffect(()=>{


        const fetchUser=async()=>{
            try{
                const res=await getProfile();
                setUserProfile(
                    {fullName: res.user.name,
email: res.user.email,
                    }
                );

            }
            catch(err){
                console.log(err);
            }

        }
        fetchUser();
    },[])



  const handleLogout = async () => {
  try {
    await signOut();
    localStorage.removeItem("token"); 
   navigate('/student/login');
  } catch (err) {
    console.error(err);
  }
};

          

   

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Mobile Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition duration-300 ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>

                <div className="flex flex-col h-full">

                    {/* Logo */}
                    <div className="flex items-center justify-between h-16 px-6 border-b">
                        <Link to="/student/dashboard" className="text-lg font-bold">
                            CareerOS
                        </Link>

                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="lg:hidden"
                        >
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        {navigation.map((item) => {
                            const isActive =
                                location.pathname === item.href ||
                                location.pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex items-center gap-3 px-4 py-2 rounded-lg ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'text-gray-700 hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User Section */}
                    <div className="border-t p-4">
                        <p className="text-sm font-semibold">{userProfile.fullName}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>

                        <button
                            onClick={handleLogout}
                            className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>

                </div>
            </aside>

            {/* Main Section */}
            <div className="lg:pl-64">

                {/* Top Bar */}
                <header className="bg-white shadow-sm p-4 flex justify-between items-center">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden"
                    >
                        <Bars3Icon className="w-6 h-6" />
                    </button>

                    <NotificationPanel />
                </header>

                {/* Page Content */}
                <main className="p-6">
                    <Outlet /> 
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;