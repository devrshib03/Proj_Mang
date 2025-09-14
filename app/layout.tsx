"use client";

import "@/globals.css"; // Using path alias for robustness
import { useState, useEffect, type ReactNode } from "react";
import { Sun, Moon } from "lucide-react";

export default function RootLayout({ children }: { children: ReactNode }) {
  // State for managing the theme. It's good to keep this in the root
  // layout as it applies to the whole application (<html> tag).
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  // Hide sidebar only on login & signup
  const hideSidebar = pathname === "/login" || pathname === "/signup" || pathname === "/admin" || pathname === "/";

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
      </body>
    </html>
  );
}

