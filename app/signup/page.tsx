"use client";

import { useState, type FormEvent, type ChangeEvent } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Sign up successful! Please check your email for the verification code.");
        await fetch('/api/auth/send-otp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });
        setTimeout(() => router.push(`/login`), 1000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('Sign up failed. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center min-h-screen justify-center rounded-xl bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md min-w-96 w-full bg-gray-800 bg-opacity-50 backdrop-filter rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Create Account
          </h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="email"
                  placeholder="Enter Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-200"
                />
              </div>
            </div>
            <div className="mb-4">
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                <input
                  type="password"
                  placeholder="Enter Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 bg-opacity-50 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors duration-200"
                />
              </div>
            </div>

            {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader className="w-6 h-6 animate-spin mx-auto" />
              ) : (
                "Sign Up"
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
        
        <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
          <p className="text-sm text-gray-400">
            Already have an account?{" "}
            <button type="button" onClick={() => router.push('/login')} className="text-green-400 hover:underline">
              Login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  );
}



// "use client";

// import { motion } from "framer-motion";
// import { useState, type ChangeEvent, type FormEvent } from "react";
// import { User, Mail, Lock, Loader } from "lucide-react";
// import Input from "@/components/Input";
// import PasswordStrengthMeter from "@/components/PasswordStrengthMeter";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// const SignUpPage = () => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");

//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const router = useRouter();

//   const handleSignUp = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setError("");
//     setIsLoading(true);

//     try {
//       // Simulate API signup delay
//       await new Promise((resolve) => setTimeout(resolve, 1500));

//       // Redirect after signup success
//       router.push("/verify-email");
//     } catch (err) {
//       setError("Sign up failed. Please try again.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleGoogleSignUp = () => {
//     console.log("Google sign up clicked");
//     // Add Firebase / OAuth logic here
//   };

//   const handleGithubSignUp = () => {
//     console.log("GitHub sign up clicked");
//     // Add Firebase / OAuth logic here
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="max-w-md min-w-96 w-full bg-gray-800 bg-opacity-50 backdrop-filter rounded-2xl backdrop-blur-xl shadow-xl overflow-hidden"
//     >
//       <div className="p-8">
//         <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
//           Create Account
//         </h2>

//         <form onSubmit={handleSignUp}>
//           <Input
//             icon={User}
//             type="text"
//             placeholder="Full Name"
//             value={name}
//             onChange={(e: ChangeEvent<HTMLInputElement>) =>
//               setName(e.target.value)
//             }
//           />
//           <Input
//             icon={Mail}
//             type="email"
//             placeholder="Enter Email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <Input
//             icon={Lock}
//             type="password"
//             placeholder="Enter Password"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//           />

//           {error && <p className="text-red-500 font-semibold mb-2">{error}</p>}

//           <PasswordStrengthMeter password={password} />

//           <motion.button
//             className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-lg shadow-lg hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:-ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             type="submit"
//           >
//             {isLoading ? (
//               <Loader className="w-6 h-6 animate-spin mx-auto" />
//             ) : (
//               "Sign Up"
//             )}
//           </motion.button>
//         </form>

//         {/* Divider */}
//         <div className="flex items-center my-6">
//           <hr className="flex-grow border-gray-600" />
//           <span className="mx-3 text-gray-400 text-sm">OR</span>
//           <hr className="flex-grow border-gray-600" />
//         </div>

//         {/* Social Sign Up (side by side) */}
//         <div className="flex gap-3 mt-6">
//           {/* Google */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleGoogleSignUp}
//             className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-white text-gray-800 font-semibold rounded-lg shadow-md hover:bg-gray-100 transition"
//           >
//             <img
//               src="https://www.svgrepo.com/show/355037/google.svg"
//               alt="Google"
//               className="w-5 h-5"
//             />
//             Google
//           </motion.button>

//           {/* GitHub */}
//           <motion.button
//             whileHover={{ scale: 1.02 }}
//             whileTap={{ scale: 0.98 }}
//             onClick={handleGithubSignUp}
//             className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-900 text-white font-semibold rounded-lg shadow-md hover:bg-gray-800 transition"
//           >
//             <img
//               src="https://www.svgrepo.com/show/512317/github-142.svg"
//               alt="GitHub"
//               className="w-5 h-5 invert"
//             />
//             GitHub
//           </motion.button>
//         </div>
//       </div>

//       <div className="px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center">
//         <p className="text-sm text-gray-400">
//           Already have an account?{" "}
//           <Link href="/login" className="text-green-400 hover:underline">
//             Login
//           </Link>
//         </p>
//       </div>
//     </motion.div>
//   );
// };

// export default SignUpPage;