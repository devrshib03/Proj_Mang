"use client";

import { motion } from "framer-motion";
import FloatingShape from "./FloatingShape";

export default function PageWrapper({ children }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-emerald-900 flex items-center justify-center relative overflow-hidden">
      {/* Floating shapes */}
      <FloatingShape color="bg-green-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
      <FloatingShape color="bg-green-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
      <FloatingShape color="bg-green-500" size="w-32 h-32" top="40%" left="-10%" delay={2} />

      {/* Page content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}
