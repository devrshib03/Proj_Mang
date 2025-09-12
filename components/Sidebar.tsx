'use client';
import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Briefcase, Users, Settings, LogOut, Moon, Lightbulb } from 'lucide-react';

type SidebarProps = {
  setView: (view: string) => void;
  theme: 'light' | 'dark';
  toggleTheme: () => void;
};

export default function Sidebar({ setView, theme, toggleTheme }: SidebarProps) {
  const [open, setOpen] = useState(true);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const menuItems = [
    { name: 'Home', view: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'My Tasks', view: 'tasks', icon: <Briefcase size={20} /> },
    { name: 'Members', view: 'team', icon: <Users size={20} /> },
    { name: 'Settings', view: 'settings', icon: <Settings size={20} /> },
  ];

  const profileMenuItems = [
    { name: 'Profile', view: 'profile' },
    { name: 'Billing', view: 'billing' },
    { name: 'Notifications', view: 'notifications' },
  ];

  return (
    <aside
      className={`fixed left-0 top-0 h-screen 
                  bg-white dark:bg-gray-800 text-gray-900 dark:text-white 
                  border-r border-gray-200 dark:border-gray-700 
                  transition-all duration-300 ease-in-out 
                  ${open ? 'w-64' : 'w-16'} flex flex-col z-40`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <div
            className="h-9 w-9 rounded-lg 
                       bg-gradient-to-tr from-green-500 to-emerald-600 
                       flex items-center justify-center 
                       text-white font-bold text-lg"
          >
            L
          </div>
          {open && <span className="font-semibold text-sm">Codewave</span>}
        </div>
        <button
          onClick={() => setOpen((v) => !v)}
          className="text-sm p-1 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Toggle sidebar"
        >
          {open ? '«' : '»'}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-2">
        <div className="mb-4">
          {open && (
            <div className="text-xs uppercase mb-2 opacity-60">Menu</div>
          )}
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li
                key={item.name}
                onClick={() => setView(item.view)}
                className={`px-2 py-2 rounded cursor-pointer transition-colors hover:bg-gray-200 dark:hover:bg-gray-700 ${
                  !open ? 'flex justify-center' : 'flex items-center gap-3'
                }`}
              >
                {item.icon}
                {open ? item.name : ''}
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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-sm font-bold text-white">
                C
              </div>
              {open && (
                <div className="text-left">
                  <p className="text-sm font-medium">Test1</p>
                  <p className="text-xs text-gray-500">test1@gmail.com</p>
                </div>
              )}
            </div>
          </button>

          <AnimatePresence>
            {profileMenuOpen && open && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute bottom-full mb-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
              >
                <ul className="p-2 space-y-1">
                  {profileMenuItems.map((item) => (
                    <li
                      key={item.name}
                      onClick={() => {
                        setView(item.view);
                        setProfileMenuOpen(false);
                      }}
                      className="px-3 py-2 rounded-md cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                    >
                      {item.name}
                    </li>
                  ))}
                  <li
                    onClick={() => {
                      alert('Logging out...');
                      setProfileMenuOpen(false);
                    }}
                    className="px-3 py-2 rounded-md cursor-pointer text-red-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    Logout
                  </li>
                </ul>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </aside>
  );
}
