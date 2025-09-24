"use client";

import "./globals.css";
import { useState, useEffect, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";
import { Toaster } from "react-hot-toast";

export default function RootLayout({ children }: { children: ReactNode }) {
  // State for managing the theme. It's good to keep this in the root
  // layout as it applies to the whole application (<html> tag).
  const [theme, setTheme] = useState<"light" | "dark">("light");

  // Effect to apply the theme class to the document and save to localStorage.
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    if (savedTheme) {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Function to toggle the theme
  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        {/* The theme toggle can live here, accessible on all pages */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
          className="absolute top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          {theme === "light" ? (
            <Sun className="w-5 h-5 text-gray-800" />
          ) : (
            <Moon className="w-5 h-5 text-gray-200" />
          )}
        </button>
        {/* The children will be either your public pages or the layout with the sidebar */}
        {children}
        
        {/* Toast notifications */}
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: theme === 'dark' ? '#374151' : '#ffffff',
              color: theme === 'dark' ? '#f9fafb' : '#111827',
              border: theme === 'dark' ? '1px solid #4b5563' : '1px solid #e5e7eb',
            },
          }}
        />
      </body>
    </html>
  );
}

