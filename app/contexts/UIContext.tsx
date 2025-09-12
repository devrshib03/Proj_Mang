'use client';

import { useRouter } from 'next/navigation';
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Define the shape of the user profile data
interface UserProfile {
  name: string;
  email: string;
  role: string;
  team: string;
}

// The context will now handle a null profile for when no one is logged in
interface UIContextType {
  profile: UserProfile | null;
  loading: boolean;
  updateProfile: (newProfileData: Partial<UserProfile>) => Promise<void>;
  logout: () => void;
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  view: string;
  setView: (view: string) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export function useUI() {
  const context = useContext(UIContext);
  if (!context) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
}

export function UIProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true); // Start in a loading state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [view, setView] = useState('dashboard');
  const router = useRouter();

  // This effect runs when the app loads to fetch the current user.
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('/api/auth/me');
        if (response.ok) {
          const { user } = await response.json();
          setProfile(user); // Set the profile with data from MongoDB
        } else {
          // If no user is authenticated, clear the profile
          setProfile(null);
        }
      } catch (error) {
        console.error('Failed to fetch user:', error);
        setProfile(null);
      } finally {
        setLoading(false); // End loading state
      }
    };

    fetchCurrentUser();
  }, []);

  const updateProfile = async (newProfileData: Partial<UserProfile>) => {
    // This function will call the API route you have in the Canvas
    try {
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newProfileData),
        });

        if (response.ok) {
            const { user } = await response.json();
            setProfile(user); // Update the local state with the new data from the DB
        } else {
            console.error("Failed to update profile");
        }
    } catch (error) {
        console.error("Error updating profile:", error);
    }
  };

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setProfile(null); // Clear the profile state
    router.push('/login'); // Redirect to login page
  };
  
  const toggleSidebar = () => setSidebarOpen(prev => !prev);

  const value = {
    profile,
    loading,
    updateProfile,
    logout,
    sidebarOpen,
    toggleSidebar,
    view,
    setView,
  };

  return (
    <UIContext.Provider value={value}>
      {children}
    </UIContext.Provider>
  );
}

