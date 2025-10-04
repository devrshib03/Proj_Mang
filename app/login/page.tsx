'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Mail, Lock, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e:any) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        // Authentication successful
        toast.success(data.message);
        localStorage.setItem('user', JSON.stringify(data.user)); 
        console.log('Login successful:', data);
        // Redirect to dashboard
        router.push('/app/dashboard'); 

      } else {
        // Authentication failed
        setError(data.message);
        console.error('Login failed:', data);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Your JSX for the login form goes here
    <div className="flex items-center min-h-screen justify-center rounded-xl dark:bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md min-w-96 w-full dark:bg-zinc-800 bg-opacity-50 backdrop-filter border-blue-600 border-4 rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-blue-500 text-transparent bg-clip-text">
            Login
          </h2>

          <form onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="mb-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-400" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 transition-colors duration-200"
                />
              </div>
            </div>

            {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 w-full py-3 px-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Log In"
              )}
            </motion.button>
          </form>

          <div className="flex items-center my-6">
            <hr className="flex-grow border-gray-600" />
            <span className="mx-3 text-gray-400 text-sm">OR</span>
            <hr className="flex-grow border-gray-600" />
          </div>
          
           <div className="flex gap-3 mt-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
            >
              <img
                src="https://www.svgrepo.com/show/355037/google.svg"
                alt="Google"
                className="w-5 h-5"
              />
              Google
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
            >
              <img
                src="https://www.svgrepo.com/show/512317/github-142.svg"
                alt="GitHub"
                className="w-5 h-5 invert"
              />
              GitHub
            </motion.button>
          </div> 
        </div>  
        
        <div className="px-8 py-4 dark:bg-gray-950 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Don't have an account?{" "}
            <button type="button" onClick={() => router.push('/signup')} className="text-blue-400 hover:underline">
              Sign Up
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}