"use client";

import { useState, type FormEvent, type ChangeEvent, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Loader } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';

export default function EmailVerificationPage() {
  const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const handleChange = (index: number, value: string) => {
    const newCode = [...code];

    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split("");
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);

      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex]?.focus();
    } else {
      newCode[index] = value;
      setCode(newCode);

      if (value && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const verifyCode = async (verificationCode: string) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp: verificationCode }),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success("Email verified successfully!");
        setTimeout(() => router.push('/login'), 2000);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
      console.error('API Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    verifyCode(verificationCode);
  };
  
  const handleResend = async () => {
    toast.loading('Resending OTP...');
    setIsResending(true);
    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      if (response.ok) {
        toast.success('A new OTP has been sent to your email.');
        console.log("Check the server console for the new OTP.");
      } else {
        toast.error(`Failed to resend OTP: ${result.message}`);
      }
    } catch (err) {
      toast.error('Error resending OTP.');
      console.error('API Error:', err);
    } finally {
      setIsResending(false);
      toast.dismiss();
    }
  };

  useEffect(() => {
    if (code.every((digit) => digit !== "")) {
      const verificationCode = code.join("");
      verifyCode(verificationCode);
    }
  }, [code]);

  return (
    <div className="flex items-center justify-center rounded-xl bg-gray-900 text-white p-4">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
          Verify Your Email
        </h2>
        <p className="text-center text-gray-300 mb-6">
          Enter the 6-digit code sent to your email address.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
              />
            ))}
          </div>

          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            disabled={isLoading || code.some((digit) => !digit)}
            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
          >
            {isLoading ? "Verifying..." : "Verify Email"}
          </motion.button>
        </form>
        
        <div className="mt-4 text-center">
          <button type="button" onClick={handleResend} className="text-green-400 hover:underline" disabled={isResending}>
            {isResending ? 'Resending...' : 'Resend OTP'}
          </button>
        </div>
      </motion.div>
    </div>
  );
}





// "use client";

// import { useEffect, useRef, useState } from "react";
// import { motion } from "framer-motion";
// import toast from "react-hot-toast";
// import { useRouter } from "next/navigation";

// const EmailVerificationPage = () => {
//   const [code, setCode] = useState<string[]>(["", "", "", "", "", ""]);
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);
//   const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
//   const router = useRouter();

//   const handleChange = (index: number, value: string) => {
//     const newCode = [...code];

//     if (value.length > 1) {
//       // Handle paste
//       const pastedCode = value.slice(0, 6).split("");
//       for (let i = 0; i < 6; i++) {
//         newCode[i] = pastedCode[i] || "";
//       }
//       setCode(newCode);

//       const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
//       const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
//       inputRefs.current[focusIndex]?.focus();
//     } else {
//       newCode[index] = value;
//       setCode(newCode);

//       if (value && index < 5) {
//         inputRefs.current[index + 1]?.focus();
//       }
//     }
//   };

//   const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === "Backspace" && !code[index] && index > 0) {
//       inputRefs.current[index - 1]?.focus();
//     }
//   };

//   const verifyCode = async (verificationCode: string) => {
//     setIsLoading(true);
//     setError("");

//     setTimeout(() => {
//       if (verificationCode === "123456") {
//         toast.success("Email verified successfully");
//         router.push("/");
//       } else {
//         setError("Invalid verification code");
//       }
//       setIsLoading(false);
//     }, 1000);
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     const verificationCode = code.join("");
//     verifyCode(verificationCode);
//   };

//   // Auto submit when all fields are filled
//   useEffect(() => {
//     if (code.every((digit) => digit !== "")) {
//       const verificationCode = code.join("");
//       verifyCode(verificationCode);
//     }
//   }, [code]);

//   return (
//     <div className="max-w-md min-w-96 w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
//       <motion.div
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
//           Verify Your Email
//         </h2>
//         <p className="text-center text-gray-300 mb-6">
//           Enter the 6-digit code sent to your email address.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-6">
//           <div className="flex justify-between">
//             {code.map((digit, index) => (
//               <input
//                 key={index}
//                 ref={(el) => (inputRefs.current[index] = el)}
//                 type="text"
//                 maxLength={1}
//                 value={digit}
//                 onChange={(e) => handleChange(index, e.target.value)}
//                 onKeyDown={(e) => handleKeyDown(index, e)}
//                 className="w-12 h-12 text-center text-2xl font-bold bg-gray-700 text-white border-2 border-gray-600 rounded-lg focus:border-green-500 focus:outline-none"
//               />
//             ))}
//           </div>

//           {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}

//           <motion.button
//             whileHover={{ scale: 1.05 }}
//             whileTap={{ scale: 0.95 }}
//             type="submit"
//             disabled={isLoading || code.some((digit) => !digit)}
//             className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 disabled:opacity-50"
//           >
//             {isLoading ? "Verifying..." : "Verify Email"}
//           </motion.button>
//         </form>
//       </motion.div>
//     </div>
//   );
// };

// export default EmailVerificationPage;