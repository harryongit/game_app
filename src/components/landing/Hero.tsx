"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles, Zap, Download } from "lucide-react";


export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-12 lg:pt-20 lg:pb-0">
      {/* Decorative radial gradients for luxury lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[350px] bg-gradient-to-r from-casino-purple/20 via-neon-pink/15 to-casino-gold/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-pink/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-[300px] h-[300px] bg-casino-purple/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-8">

          {/* Left Column: Text & CTAs */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
            className="flex-1 text-center lg:text-left order-2 lg:order-1 relative z-20"
          >
            {/* Elegant Luxury Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.8, type: "spring" }}
              className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-casino-gold/40 bg-gradient-to-r from-[#22144e] to-[#120b2e] text-casino-gold text-xs md:text-sm font-bold tracking-widest uppercase shadow-[0_0_15px_rgba(255,215,0,0.15)]"
            >
              <Sparkles className="w-4 h-4 text-casino-gold animate-pulse" />
              <span>Premium Anime Casino Floor</span>
            </motion.div>

            {/* Cinematic Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 leading-[1.1] text-white">
              <span className="drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)]">
                SPIN THE ROYAL
              </span>{" "}
              <br />
              <span className="neon-text-gold font-black drop-shadow-[0_0_15px_rgba(255,215,0,0.4)]">
                GOLD WHEEL
              </span>{" "}
              <span className="text-2xl sm:text-3xl lg:text-4xl block sm:inline text-white/95 uppercase font-medium">
                &amp; Win Big
              </span>
            </h1>

            <p className="text-sm sm:text-base md:text-lg text-indigo-200/80 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Step into a high-stakes, anime-infused gaming wonderland. Experience four custom-crafted games with instant payouts, transparent fair-play, and legendary daily jackpots!
            </p>

            {/* Glowing Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 mb-10 w-full sm:w-auto">


              <motion.a
                href="https://github.com/harryongit/game_app/releases/latest/download/realspinpro.apk"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                className="purple-button px-8 py-4 w-full sm:w-auto cursor-pointer flex items-center justify-center gap-2"
              >
                <Download className="w-5 h-5" />
                <span>Download Android App</span>
              </motion.a>
            </div>

            {/* Glassmorphic Live Stats dashboard */}
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="grid grid-cols-3 gap-3 md:gap-4 max-w-lg mx-auto lg:mx-0"
            >
              <div className="luxury-glass rounded-2xl p-3 md:p-4 text-center border-t-2 border-t-casino-gold/60">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 font-orbitron">15K+</div>
                <div className="text-[10px] md:text-xs text-casino-gold font-bold uppercase tracking-wider">Online Players</div>
              </div>
              <div className="luxury-glass rounded-2xl p-3 md:p-4 text-center border-t-2 border-t-neon-pink/60">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 font-orbitron">₹1.5Cr+</div>
                <div className="text-[10px] md:text-xs text-neon-pink font-bold uppercase tracking-wider">Paid Today</div>
              </div>
              <div className="luxury-glass rounded-2xl p-3 md:p-4 text-center border-t-2 border-t-neon-purple/60">
                <div className="text-xl md:text-3xl font-black text-white mb-0.5 font-orbitron">100%</div>
                <div className="text-[10px] md:text-xs text-neon-purple font-bold uppercase tracking-wider">Provably Fair</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
