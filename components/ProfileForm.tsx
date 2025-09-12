'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { useUI } from '../app/contexts/UIContext'; // Corrected relative path
import { toast } from 'react-hot-toast';

// Define the shape of the form data, including optional password fields
interface ProfileFormData {
  name: string;
  email: string;
  role: string;
  team: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// Define the props that the component will accept
interface ProfileformProps {
  onSaveSuccess: () => void;
}

export default function Profileform({ onSaveSuccess }: ProfileformProps) {
  const { profile, updateProfile: updateProfileInContext } = useUI();
  const [formData, setFormData] = useState<ProfileFormData>({
    name: '', email: '', role: '', team: '',
    currentPassword: '', newPassword: '', confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  // When the profile data from the context is loaded, populate the form
  useEffect(() => {
    if (profile) {
      setFormData(prev => ({
        ...prev,
        name: profile.name,
        email: profile.email,
        role: profile.role,
        team: profile.team,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
    }
  }, [profile]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { name, email, role, team, currentPassword, newPassword, confirmPassword } = formData;
    
    let anySuccess = false;

    // --- 1. Update Profile Details ---
    const profileHasChanged = name !== profile?.name || email !== profile?.email || role !== profile?.role || team !== profile?.team;
    if (profileHasChanged) {
        try {
            const profileDetailsPayload = { name, email, role, team };
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(profileDetailsPayload),
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Failed to update profile.');
            }
            
            updateProfileInContext(data.user);
            toast.success('Profile details updated!');
            anySuccess = true;

        } catch (error) {
            toast.error((error as Error).message);
        }
    }

    // --- 2. Change Password ---
    const passwordFieldsArePartiallyFilled = currentPassword || newPassword || confirmPassword;
    const passwordFieldsAreFullyFilled = currentPassword && newPassword && confirmPassword;

    if (passwordFieldsArePartiallyFilled) {
      if (!passwordFieldsAreFullyFilled) {
        toast.error('Please fill all password fields to make a change.');
      } else if (newPassword !== confirmPassword) {
        toast.error('New passwords do not match.');
      } else {
          try {
            const response = await fetch('/api/profile/change-password', {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ currentPassword, newPassword }),
            });

            const data = await response.json();
            if (!response.ok) {
              throw new Error(data.message || 'Failed to change password.');
            }
            
            toast.success('Password changed successfully!');
            setFormData(prev => ({ ...prev, currentPassword: '', newPassword: '', confirmPassword: '' }));
            anySuccess = true;
          } catch (error) {
             toast.error((error as Error).message);
          }
      }
    }

    // --- 3. Final Action: Close Modal ---
    // If there were no changes attempted, OR if any part of the process was successful, close the modal.
    if ((!profileHasChanged && !passwordFieldsArePartiallyFilled) || anySuccess) {
        onSaveSuccess();
    }
    
    setIsLoading(false);
  };

  if (!profile) return <div>Loading...</div>;

  return (
     <div className="p-4 space-y-6">
       <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Profile Information</h3>
       </div>
       <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
         Make changes to your profile here. Click save when you're done.
       </p>
       <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Fields: Name, Email, Role, Team */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg"/>
          </div>
          <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
              <select name="role" id="role" value={formData.role} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <option>Admin</option>
                  <option>Manager</option>
                  <option>Team Member</option>
              </select>
          </div>
          <div>
              <label htmlFor="team" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Team</label>
              <select name="team" id="team" value={formData.team} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg">
                  <option>Default Team</option>
                  <option>Codewave</option>
              </select>
          </div>
        </div>
        
        {/* Change Password Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
            <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Change Password</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Current Password</label>
                    <input type="password" name="currentPassword" id="currentPassword" value={formData.currentPassword} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                </div>
                <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">New Password</label>
                    <input type="password" name="newPassword" id="newPassword" value={formData.newPassword} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                </div>
                <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Confirm Password</label>
                    <input type="password" name="confirmPassword" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg" />
                </div>
            </div>
        </div>

        <div className="flex justify-end mt-6">
          <motion.button
            type="submit"
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg text-white font-semibold flex items-center gap-2 shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </motion.button>
        </div>
       </form>
     </div>
  );
}

