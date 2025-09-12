'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, Settings, X, Edit } from 'lucide-react';
import { useUI } from '@/contexts/UIContext';
import Profileform from './Profileform';

function ProfileSkeleton() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 animate-pulse"></div>
      <div className="text-left">
        <div className="h-4 w-20 bg-gray-300 dark:bg-gray-700 rounded animate-pulse mb-1"></div>
        <div className="h-3 w-28 bg-gray-300 dark:bg-gray-700 rounded animate-pulse"></div>
      </div>
    </div>
  );
}

export default function Sidebar() {
  const { sidebarOpen, toggleSidebar, setView, profile, loading, logout } = useUI();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !profile) {
      router.push('/login');
    }
  }, [loading, profile, router]);

  const handleLogout = async () => {
    setProfileMenuOpen(false);
    await logout();
  };

  const handleProfileSaveSuccess = () => {
    setIsEditProfileModalOpen(false);
  };

  const menuItems = [
    { name: 'Home', view: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Tasks', view: 'kanban', icon: <Briefcase size={20} /> },
    { name: 'Members', view: 'team', icon: <Users size={20} /> },
    { name: 'Settings', view: 'settings', icon: <Settings size={20} /> },
  ];

  const profileMenuItems = [
    { name: 'Profile' },
    { name: 'Billing', view: 'billing' },
    { name: 'Notifications', view: 'notifications' },
  ];
  
  if (loading) {
      return (
        <aside className={`fixed left-0 top-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 transition-all duration-300 ease-in-out ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col z-40`}>
            {/* Optional: Add a more detailed sidebar skeleton here */}
        </aside>
      )
  }

  return (
    <>
      <aside
        className={`fixed left-0 top-0 h-screen 
                   bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                   border-r border-gray-200 dark:border-gray-700 
                   transition-all duration-300 ease-in-out 
                   ${sidebarOpen ? 'w-64' : 'w-16'} flex flex-col z-40`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-white font-bold text-lg">
                L
                </div>
                {sidebarOpen && <span className="font-semibold text-sm">Codewave</span>}
            </div>
            <button
                onClick={toggleSidebar}
                className="text-sm p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                aria-label="Toggle sidebar"
            >
                {sidebarOpen ? '«' : '»'}
            </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto p-2">
            <div className="mb-4">
                {sidebarOpen && <div className="text-xs uppercase mb-2 opacity-60">Menu</div>}
                <ul className="space-y-1">
                {menuItems.map((item) => (
                    <li
                    key={item.name}
                    onClick={() => setView(item.view as any)}
                    className={`px-2 py-2 rounded cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${!sidebarOpen ? 'flex justify-center' : 'flex items-center gap-3'}`}
                    >
                    {item.icon}
                    {sidebarOpen && item.name}
                    </li>
                ))}
                </ul>
            </div>
        </nav>

        {/* Footer / Profile */}
        <div className="mt-auto p-2 border-t border-gray-200 dark:border-gray-700">
            <div className="relative">
                <button
                    className="w-full flex items-center justify-between gap-2 p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    onClick={() => setProfileMenuOpen((v) => !v)}
                >
                    {profile ? (
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                            {sidebarOpen && (
                                <div className="text-left">
                                <p className="text-sm font-medium">{profile.name}</p>
                                <p className="text-xs text-gray-500">{profile.email}</p>
                                </div>
                            )}
                        </div>
                    ) : (
                        <ProfileSkeleton />
                    )}
                </button>
                <AnimatePresence>
                    {profileMenuOpen && sidebarOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                        >
                            <ul className="p-2 space-y-1">
                                {profileMenuItems.map((item) => (
                                    <li key={item.name} onClick={() => { if (item.name === 'Profile') { setIsProfileModalOpen(true); } else { setView(item.view as any); } setProfileMenuOpen(false); }} className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                                        {item.name}
                                    </li>
                                ))}
                                <li onClick={handleLogout} className="px-3 py-2 rounded-md cursor-pointer text-red-500 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors">
                                    Logout
                                </li>
                            </ul>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
      </aside>

      {/* Modals */}
      <AnimatePresence>
        {isProfileModalOpen && profile && (
            <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={() => setIsProfileModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <motion.div className="w-full max-w-md bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl relative flex flex-col items-center" onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
                    <button onClick={() => setIsProfileModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={24} /></button>
                    <div className="w-24 h-24 mb-4 rounded-full bg-gradient-to-tr from-green-500 to-emerald-600 flex items-center justify-center text-4xl font-bold text-white">
                        {profile.name.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.name}</h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{profile.email}</p>
                    <div className="w-full text-left space-y-4 mb-8">
                        <div><label className="text-xs font-semibold text-gray-400 uppercase">Role</label><p className="text-gray-800 dark:text-gray-200">{profile.role}</p></div>
                        <div><label className="text-xs font-semibold text-gray-400 uppercase">Team</label><p className="text-gray-800 dark:text-gray-200">{profile.team}</p></div>
                    </div>
                    <button onClick={() => { setIsProfileModalOpen(false); setIsEditProfileModalOpen(true); }} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg text-white font-semibold transition-colors"><Edit size={18}/>Edit Profile</button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {isEditProfileModalOpen && (
          <motion.div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50" onClick={() => setIsEditProfileModalOpen(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <motion.div className="w-full max-w-2xl bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-2xl relative" onClick={(e) => e.stopPropagation()} initial={{ y: -50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }}>
              <button onClick={() => setIsEditProfileModalOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-white"><X size={24} /></button>
              <Profileform onSaveSuccess={handleProfileSaveSuccess} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

