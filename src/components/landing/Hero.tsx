"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div className="container mx-auto px-4 z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
            className="inline-block mb-6 px-4 py-1.5 rounded-full border border-neon-blue/30 bg-neon-blue/10 backdrop-blur-md text-neon-blue text-sm font-semibold tracking-wider uppercase"
          >
            Start Spinning Today
          </motion.div>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold tracking-tight mb-8">
            <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
              SPIN. PLAY.
            </span>{" "}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta animate-pulse-glow">
              WIN REWARDS.
            </span>
          </h1>

          <p className="text-lg md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join thousands of players unlocking amazing daily prizes. Turn your daily spins into massive rewards instantly!
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative group px-8 py-4 rounded-xl font-bold text-white bg-black border border-neon-blue overflow-hidden"
            >
              <div className="absolute inset-0 bg-neon-blue/20 group-hover:bg-neon-blue/40 transition-colors duration-300" />
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.8)_0%,transparent_50%)] blur-md transition-opacity duration-300" />
              <span className="relative z-10 flex items-center gap-2">
                Claim Free Spin <ChevronRight className="w-5 h-5" />
              </span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-colors duration-300"
            >
              Start Playing
            </motion.button>
          </div>
        </motion.div>

        {/* Animated Stats */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="mt-20 grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto"
        >
          <div className="glass-panel rounded-xl p-6 text-center border-t-neon-blue/50">
            <div className="text-3xl font-bold text-white mb-1">12,450</div>
            <div className="text-sm text-neon-blue">Active Spinners</div>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center border-t-neon-purple/50">
            <div className="text-3xl font-bold text-white mb-1">5,000+</div>
            <div className="text-sm text-neon-purple">Daily Free Spins</div>
          </div>
          <div className="glass-panel rounded-xl p-6 text-center border-t-neon-magenta/50 col-span-2 md:col-span-1">
            <div className="text-3xl font-bold text-white mb-1">2.4M</div>
            <div className="text-sm text-neon-magenta">Rewards Given</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
