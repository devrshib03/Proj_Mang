'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FolderPlus, FileText, Calendar, Loader, Save, ArrowLeft } from 'lucide-react';

export default function ProjectForm() {
  const router = useRouter();
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!projectName.trim()) {
      setError('Project name is required');
      return;
    }
    
    if (!description.trim()) {
      setError('Project description is required');
      return;
    }
    
    if (!dueDate) {
      setError('Due date is required');
      return;
    }

    // Check if due date is in the past
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
      setError('Due date cannot be in the past');
      return;
    }

    setIsLoading(true);

    try {
      const projectData = {
        id: Date.now(), // Simple ID generation for demo
        name: projectName.trim(),
        description: description.trim(),
        dueDate: dueDate,
        priority: priority,
        status: status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Log the project data to console
      console.log('=== PROJECT CREATED ===');
      console.log('Project Data:', projectData);
      console.log('Project Name:', projectData.name);
      console.log('Description:', projectData.description);
      console.log('Due Date:', projectData.dueDate);
      console.log('Priority:', projectData.priority);
      console.log('Status:', projectData.status);
      console.log('Created At:', projectData.createdAt);
      console.log('=====================');

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Show success message
      alert(`Project "${projectData.name}" created successfully! Check the console for details.`);
      
      // Reset form
      setProjectName('');
      setDescription('');
      setDueDate('');
      setPriority('medium');
      setStatus('pending');
      
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Failed to create project. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setProjectName('');
    setDescription('');
    setDueDate('');
    setPriority('medium');
    setStatus('pending');
    setError('');
  };

  const handleGoBack = () => {
    router.back();
  };

  return (
    <div className="flex items-center min-h-screen justify-center bg-gray-900 text-white p-4">
      {/* Back Button */}
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        onClick={handleGoBack}
        className="fixed top-6 left-6 p-3 bg-gray-800 bg-opacity-50 backdrop-blur-xl rounded-xl border border-gray-600 hover:bg-gray-700 hover:bg-opacity-50 transition-all duration-200"
      >
        <ArrowLeft className="w-5 h-5 text-green-400" />
      </motion.button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-gray-800 bg-opacity-50 backdrop-filter rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden border border-gray-700"
      >
        <div className="p-8">
          <motion.h2 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text"
          >
            Create New Project
          </motion.h2>

          <div className="space-y-6">
            {/* Project Name Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Project Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FolderPlus className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                  maxLength={100}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400">{projectName.length}/100</span>
              </div>
            </motion.div>

            {/* Description Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-green-400" />
                <textarea
                  placeholder="Describe your project..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200 resize-none"
                  maxLength={500}
                />
              </div>
              <div className="text-right mt-1">
                <span className="text-xs text-gray-400">{description.length}/500</span>
              </div>
            </motion.div>

            {/* Due Date Input */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Due Date <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
                />
              </div>
            </motion.div>

            {/* Priority Select */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
              >
                <option value="low">🟢 Low Priority</option>
                <option value="medium">🟡 Medium Priority</option>
                <option value="high">🟠 High Priority</option>
                <option value="urgent">🔴 Urgent</option>
              </select>
            </motion.div>

            {/* Status Select */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="relative"
            >
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Initial Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all duration-200"
              >
                <option value="pending">⏳ Pending</option>
                <option value="active">🚀 Active</option>
                <option value="planning">📋 Planning</option>
                <option value="review">👀 Under Review</option>
              </select>
            </motion.div>

            {/* Error Message */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg"
              >
                <p className="text-red-400 text-sm font-medium">{error}</p>
              </motion.div>
            )}
            
            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="flex gap-4 pt-4"
            >
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleSubmit}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader className="w-5 h-5 animate-spin" />
                    Creating...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Save className="w-5 h-5" />
                    Create Project
                  </div>
                )}
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 px-6 bg-gray-600 bg-opacity-50 text-white font-bold rounded-lg shadow-lg hover:bg-gray-500 hover:bg-opacity-60 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={handleCancel}
                disabled={isLoading}
              >
                Clear Form
              </motion.button>
            </motion.div>
          </div>
        </div>  
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="px-8 py-4 bg-gray-900 bg-opacity-50 border-t border-gray-700"
        >
          <p className="text-sm text-gray-400 text-center">
            💡 Project data will be logged to the browser console
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}