import { useState, useEffect, useRef } from 'react';
import { BellIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { BellAlertIcon } from '@heroicons/react/24/solid';
import React from 'react';
import {getProfile,updateNotification} from "../context/auth";

const typeConfig = {
    application_status: { color: 'bg-blue-500', label: 'Application' },
    interview_scheduled: { color: 'bg-purple-500', label: 'Interview' },
    new_job: { color: 'bg-green-500', label: 'New Job' },
    system: { color: 'bg-gray-500', label: 'System' },
};


const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const seconds = Math.floor((now - timestamp) / 1000);

    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
};

const NotificationPanel = () => {
    const [open, setOpen] = useState(false);
    const panelRef = useRef(null);

  
    const [notifications, setNotifications] = useState([
    ]);

   useEffect(() => {
    const fetchNotifications = async () => {
        try {
            const profile = await getProfile();

        
const notify = (
    profile?.user?.Notifications || []
).filter(notification => !notification.read);


setNotifications(notify);

          
        } catch (error) {
            console.error(
                "Error fetching notifications:",
                error
            );
        }
    };

    fetchNotifications();

}, []);



  const unreadCount = notifications.filter(n => !n.read).length;



    useEffect(() => {
        const handleClickOutside = (e) => {
            if (panelRef.current && !panelRef.current.contains(e.target)) {
                setOpen(false);
            }
        };


        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);





    const handleMarkAsRead = async(id) => {
        try{
            console.log(id)
        await updateNotification(id,
                {read: true}
        );
            
        setNotifications(prev =>
            prev.map(n =>
                n.id === id ? { ...n, read: true } : n||n._id===id ? { ...n, read: true } : n   


            )
          
        );}
        catch(err){
            console.log(err)
        }
    };




    const handleMarkAllAsRead = () => {

        

        setNotifications(prev =>
            prev.map(n => ({ ...n, read: true }))
        );
    };







    return (
        <div className="relative" ref={panelRef}>

            
            <button
                onClick={() => setOpen(!open)}
                className="relative p-2 hover:bg-gray-100 rounded-lg"
            >
                {unreadCount > 0 ? (
                    <BellAlertIcon className="w-6 h-6 text-blue-600" />
                ) : (
                    <BellIcon className="w-6 h-6" />
                )}

                {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>

  
            {open && (
                <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-xl z-50">

                    {/* Header */}
                    <div className="flex justify-between p-3 border-b">
                        <h3 className="font-semibold">Notifications</h3>

                        <div className="flex gap-2">
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllAsRead}
                                    className="text-xs text-blue-600"
                                >
                                    Mark all
                                </button>
                            )}

                            <button onClick={() => setOpen(false)}>
                                <XMarkIcon className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* List */}
                    <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                            <p className="p-4 text-sm text-gray-500 text-center">
                                No notifications
                            </p>
                        ) : (
                            notifications.map((notif) => {
                                const config = typeConfig[notif.type] || typeConfig.system;

                                return (
                                    <div
                                        key={notif._id}
                                        className={`flex gap-3 p-3 border-b cursor-pointer ${
                                            !notif.read ? 'bg-blue-50' : ''
                                        }`}
                                        onClick={() => handleMarkAsRead(notif._id)}
                                    >
                                        <span className={`w-2 h-2 mt-2 rounded-full ${config.color}`} />

                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{notif.title}</p>
                                            <p className="text-xs text-gray-500">{notif.message}</p>
                                            <p className="text-xs text-gray-400">
                                                {formatTimeAgo(notif.createdAt)}
                                            </p>
                                        </div>

                                        {!notif.isRead && (
                                            <CheckIcon className="w-4 h-4 text-green-500" />
                                        )}
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationPanel;