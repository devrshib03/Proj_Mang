"use client";

import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 text-center">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Task Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Organize your work and increase productivity
          </p>
        </div>
        
        <div className="space-y-4">
          <Link
            href="/login"
            className="w-full block px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors duration-200"
          >
            Login
          </Link>
          
          <Link
            href="/signup"
            className="w-full block px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white font-semibold rounded-lg shadow-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
          >
            Sign Up
          </Link>
          
          <div className="pt-4 border-t border-gray-200 dark:border-gray-600">
            <Link
              href="/app/homeSide"
              className="w-full block px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-md hover:bg-green-700 transition-colors duration-200"
            >
              Demo Dashboard
            </Link>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              Skip login and go directly to dashboard
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
