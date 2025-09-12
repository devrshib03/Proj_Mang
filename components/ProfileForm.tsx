'use client';

import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Globe, Briefcase, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

// Define the shape of the user profile data
interface UserProfile {
  name: string;
  email: string;
  country: string;
  industry: string;
  role: string;
  bio: string;
}

// Mock data for the select dropdowns
const mockData = {
  countries: ['Ghana', 'USA', 'India', 'UK'],
  industries: ['Technology', 'Finance', 'Healthcare', 'Education'],
  roles: ['Admin', 'Manager', 'Developer'],
};

export default function ProfileForm() {
  const [formData, setFormData] = useState<UserProfile>({
    name: 'Codewave',
    email: 'codewavewithasante@gmail.com',
    country: 'Ghana',
    industry: 'Technology',
    role: 'Developer',
    bio: 'Tell us about yourself...',
  });
  const [isLoading, setIsLoading] = useState(false);

  // Load profile data from localStorage on initial render
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile');
    if (savedProfile) {
      setFormData(JSON.parse(savedProfile));
    }
  }, []);

  // Save profile data to localStorage whenever the state changes
  useEffect(() => {
    localStorage.setItem('userProfile', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    toast.success('Profile updated successfully!');
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
            {/* Back button icon from the screenshot */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
          <h3 className="text-xl font-bold">Profile Information</h3>
        </div>
        <button className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 5L12 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            <path d="M5 12L19 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Make changes to your profile here. Click save when you're done.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Full Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
            <input
              type="text"
              name="name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            />
          </div>
          {/* Email Address */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            />
          </div>
          {/* Country */}
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Country</label>
            <select
              name="country"
              id="country"
              value={formData.country}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            >
              {mockData.countries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          {/* Industry Type */}
          <div>
            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Industry Type</label>
            <select
              name="industry"
              id="industry"
              value={formData.industry}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            >
              {mockData.industries.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
          </div>
          {/* Role in the Organization */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role in the Organization</label>
            <select
              name="role"
              id="role"
              value={formData.role}
              onChange={handleChange}
              className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            >
              {mockData.roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>
        </div>
        {/* Short Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Short Bio</label>
          <textarea
            name="bio"
            id="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
            className="mt-1 w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-green-500 focus:border-green-500 text-black dark:text-white"
            placeholder="Tell us about yourself..."
          />
        </div>
        {/* Buttons */}
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
