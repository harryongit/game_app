"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Wait for 3D assets to theoretically load
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.8, ease: "easeInOut" } }}
          className="fixed inset-0 z-[99999] bg-[#050505] flex flex-col items-center justify-center"
        >
          <div className="relative">
            {/* Outer spinning ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="w-32 h-32 rounded-full border-t-2 border-r-2 border-neon-blue shadow-[0_0_15px_rgba(0,243,255,0.5)]"
            />
            {/* Inner spinning ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-2 rounded-full border-b-2 border-l-2 border-neon-purple shadow-[0_0_15px_rgba(176,38,255,0.5)]"
            />
            {/* Core */}
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-1/4 rounded-full bg-neon-emerald blur-sm shadow-[0_0_20px_rgba(0,255,102,0.8)]"
            />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-8 font-mono text-neon-blue tracking-[0.3em] text-sm animate-pulse"
          >
            INITIALIZING ENGINE...
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
