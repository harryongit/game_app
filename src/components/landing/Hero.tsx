"use client";

import { motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import Image from "next/image";

export function Hero() {
  return (
    <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden pt-24 pb-8 lg:pt-20 lg:pb-0">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 lg:gap-12">
          
          {/* Left Side: Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left order-2 lg:order-1"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="inline-block mb-4 px-3 py-1 rounded-full border border-neon-blue/30 bg-neon-blue/10 backdrop-blur-md text-neon-blue text-xs md:text-sm font-semibold tracking-wider uppercase"
            >
              Play 4 Exhilarating Games
            </motion.div>
            
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 md:mb-6 leading-tight">
              <span className="text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.5)]">
                EXPERIENCE. PLAY.
              </span>{" "}
              <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon-blue via-neon-purple to-neon-magenta animate-pulse-glow">
                WIN REWARDS.
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-gray-400 mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
              Join thousands of players unlocking amazing daily prizes. Turn your daily spins and tosses into massive rewards instantly!
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 lg:gap-4 mb-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="relative group px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-white bg-black border border-neon-blue overflow-hidden w-full sm:w-auto"
              >
                <div className="absolute inset-0 bg-neon-blue/20 group-hover:bg-neon-blue/40 transition-colors duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-[radial-gradient(circle_at_center,rgba(0,243,255,0.8)_0%,transparent_50%)] blur-md transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  Claim Free Spin <ChevronRight className="w-5 h-5" />
                </span>
              </motion.button>
              <motion.a
                href="https://github.com/harryongit/game_app/releases/latest/download/realspinpro.apk"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-6 py-3 md:px-8 md:py-4 rounded-xl font-bold text-white bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 backdrop-blur-sm transition-colors duration-300 flex items-center justify-center w-full sm:w-auto"
              >
                Download App
              </motion.a>
            </div>

            {/* Stats Integrated into left column */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="grid grid-cols-3 gap-2 md:gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="glass-panel rounded-lg p-2 md:p-4 text-center border-t-neon-blue/50">
                <div className="text-base md:text-2xl font-bold text-white mb-0.5">12K+</div>
                <div className="text-[9px] md:text-xs text-neon-blue uppercase">Active</div>
              </div>
              <div className="glass-panel rounded-lg p-2 md:p-4 text-center border-t-neon-purple/50">
                <div className="text-base md:text-2xl font-bold text-white mb-0.5">5K+</div>
                <div className="text-[9px] md:text-xs text-neon-purple uppercase">Daily Spins</div>
              </div>
              <div className="glass-panel rounded-lg p-2 md:p-4 text-center border-t-neon-magenta/50">
                <div className="text-base md:text-2xl font-bold text-white mb-0.5">2.4M</div>
                <div className="text-[9px] md:text-xs text-neon-magenta uppercase">Rewards</div>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Side: Logo & Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            className="flex-1 flex justify-center lg:justify-end order-1 lg:order-2 w-full max-w-[200px] sm:max-w-xs lg:max-w-none mx-auto"
          >
            <div className="relative w-40 h-40 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-[450px] lg:h-[450px]">
              <div className="absolute inset-0 bg-neon-blue/20 blur-[50px] lg:blur-[100px] rounded-full pointer-events-none" />
              <Image 
                src="/logosplash.png" 
                alt="RealSpinPro Logo" 
                fill 
                className="object-contain drop-shadow-[0_0_20px_rgba(0,243,255,0.3)] lg:drop-shadow-[0_0_30px_rgba(0,243,255,0.4)] animate-float"
                priority
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
