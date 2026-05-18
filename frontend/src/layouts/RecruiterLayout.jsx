import { useState ,useEffect} from 'react';
import { Outlet, Link, useLocation, useNavigate, } from 'react-router-dom';
import { signOut,getProfile } from '../context/auth';
import NotificationPanel from '@components/NotificationPanel';
import {
    HomeIcon,
    BriefcaseIcon,
    PlusCircleIcon,
    ChartBarIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    Bars3Icon,
    XMarkIcon,
    CalendarIcon,
} from '@heroicons/react/24/outline';

const navigation = [
    { name: 'Dashboard', href: '/recruiter/dashboard', icon: HomeIcon },
    { name: 'Post Job', href: '/recruiter/post-job', icon: PlusCircleIcon },
    { name: 'Manage Jobs', href: '/recruiter/jobs', icon: BriefcaseIcon },
    { name: 'Interviews', href: '/recruiter/interviews', icon: CalendarIcon },
    { name: 'Analytics', href: '/recruiter/analytics', icon: ChartBarIcon },
    { name: 'Profile', href: '/recruiter/profile', icon: UserCircleIcon },
];

const RecruiterLayout = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

   const [userProfile, setUserProfile] = useState({
    companyName: "samir",
    email: "xyz",
});


useEffect(()=>{


        const fetchUser=async()=>{
            try{
                const res=await getProfile();
                setUserProfile(
                    {companyName: res.user.companyName,
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


    const handleSignOut = async () => {
        try {
            await signOut();
            navigate('/recruiter/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Sidebar */}
            <aside className={`fixed inset-y-0 left-0 w-64 bg-white shadow transform ${
                sidebarOpen ? 'translate-x-0' : '-translate-x-full'
            } lg:translate-x-0`}>

                <div className="flex flex-col h-full">

                    {/* Logo */}
                    <div className="flex justify-between items-center h-16 px-6 border-b">
                        <Link to="/recruiter/dashboard" className="font-bold text-lg">
                            CareerOS
                        </Link>
                        <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
                            <XMarkIcon className="w-6 h-6" />
                        </button>
                    </div>

                    {/* Nav */}
                    <nav className="flex-1 p-4 space-y-2">
                        {navigation.map((item) => {
                            const isActive =
                                location.pathname === item.href ||
                                location.pathname.startsWith(item.href + '/');

                            return (
                                <Link
                                    key={item.name}
                                    to={item.href}
                                    className={`flex gap-3 px-3 py-2 rounded ${
                                        isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'hover:bg-gray-100'
                                    }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>

                    {/* User */}
                    <div className="p-4 border-t">
                        <p className="font-semibold">{userProfile.companyName}</p>
                        <p className="text-xs text-gray-500">{userProfile.email}</p>

                        <button
                            onClick={handleSignOut}
                            className="mt-3 w-full bg-gray-100 hover:bg-gray-200 py-2 rounded flex justify-center gap-2"
                        >
                            <ArrowRightOnRectangleIcon className="w-5 h-5" />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main */}
            <div className="lg:pl-64">

                {/* Top bar */}
                <header className="bg-white shadow p-4 flex justify-between">
                    <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
                        <Bars3Icon className="w-6 h-6" />
                    </button>
                    <NotificationPanel />
                </header>

                {/* Content */}
                <main className="p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default RecruiterLayout;