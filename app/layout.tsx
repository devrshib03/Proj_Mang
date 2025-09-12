"use client";

import "./globals.css";
import { useState, useEffect } from "react";
import type { ReactNode } from "react";
import Sidebar from "../components/Sidebar"; // <-- import your Sidebar
import { usePathname } from "next/navigation"; // ✅ to detect route
import { Sun, Moon } from "lucide-react";
export default function RootLayout({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">(
    typeof window !== "undefined" &&
      (localStorage.getItem("theme") as "light" | "dark")
      ? (localStorage.getItem("theme") as "light" | "dark")
      : "light"
  );

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Hide sidebar only on login & signup
  const hideSidebar = pathname === "/login" || pathname === "/signup";

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <html lang="en">
      <body className="bg-white dark:bg-gray-900 text-black dark:text-white transition-colors duration-300">
        <div className="flex">
          {/* Sidebar only if not login/signup */}
          {!hideSidebar && <Sidebar />}

          {/* Main content shifts only if sidebar exists */}
          <main
            className={`flex-1 transition-all duration-300 ${
              !hideSidebar ? (sidebarOpen ? "ml-64" : "ml-16") : "ml-0"
            }`}
          >
            {/* Theme toggle button only if sidebar is visible */}
            {!hideSidebar && (
              <button
                onClick={toggleTheme}
                aria-label="Toggle dark mode"
                className="absolute top-3 right-3 z-50 p-2.5 rounded-md bg-gray-200 dark:bg-gray-700  hover:scale-105 transition-transform duration-200 shadow-sm"
              >
                {theme === "light" ? (
                  <Sun className="w-4 h-4 text-black-500" />
                ) : (
                  <Moon className="w-4 h-4 text-gray-200" />
                )}
              </button>
            )}
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
