"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Wallet, Activity, Star, Award, ShieldCheck, Flame } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Payouts", desc: "Withdraw your winnings instantly. Directly processed to your account with zero delays.", color: "#00f3ff", bg: "rgba(0, 243, 255, 0.1)" },
  { icon: Activity, title: "1000x Multipliers", desc: "Watch rewards multiply in real-time. High-stakes action, legendary returns.", color: "#ff007f", bg: "rgba(255, 0, 127, 0.1)" },
  { icon: Wallet, title: "Daily Gold Chests", desc: "Claim free loyalty coins, bonus spins, and exclusive daily entry passes.", color: "#ffd700", bg: "rgba(255, 215, 0, 0.1)" },
  { icon: ShieldCheck, title: "Provably Fair RNG", desc: "Fully verifiable game fairness backed by state-of-the-art cryptographic proofs.", color: "#00ff66", bg: "rgba(0, 255, 102, 0.1)" },
  { icon: Star, title: "VIP Platinum Club", desc: "Level up your account to unlock private high-stakes tables and dedicated hosts.", color: "#b026ff", bg: "rgba(176, 38, 255, 0.1)" },
  { icon: Flame, title: "24/7 Live Draws", desc: "Non-stop casino floor action. Join thousands of players in real-time rooms.", color: "#e6003a", bg: "rgba(230, 0, 58, 0.1)" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 90 } }
};

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-[#0c0822]/40">
      {/* Decorative backdrop light */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,215,0,0.03)_0%,transparent_75%)] pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        
        {/* Title */}
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 mb-3 px-3 py-1 rounded-full border border-[#b026ff]/30 bg-[#b026ff]/5 text-[#a78bfa] text-xs font-bold uppercase tracking-wider">
            <Award className="w-3.5 h-3.5 text-[#a78bfa]" />
            <span>The Platinum Advantage</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">WHY PLAY ON <span className="neon-text-gold">REALSPINPRO?</span></h2>
          <p className="text-indigo-200/60 text-base md:text-lg">The most rewarding, secure, and transparent gaming environment online.</p>
        </div>

        {/* Features Cards Grid */}
        <motion.div 
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {FEATURES.map((feat, i) => (
            <motion.div 
              key={i} 
              variants={item}
              className="group relative p-8 rounded-3xl luxury-glass border border-white/5 hover:border-casino-gold/30 hover:bg-[#1a103c]/70 transition-all duration-300 hover:shadow-[0_10px_30px_rgba(255,215,0,0.03)]"
            >
              {/* Dynamic hover outer glow ring */}
              <div 
                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" 
                style={{ 
                  boxShadow: `0 0 25px ${feat.color}, inset 0 0 15px ${feat.color}`
                }} 
              />
              
              {/* Icon Container with glowing neon background */}
              <div 
                className="w-14 h-14 rounded-2xl border flex items-center justify-center mb-6 group-hover:scale-108 transition-all duration-300"
                style={{ 
                  color: feat.color,
                  borderColor: `${feat.color}40`,
                  backgroundColor: feat.bg,
                  boxShadow: `0 0 15px ${feat.color}25`
                }}
              >
                <feat.icon className="w-7 h-7" />
              </div>

              {/* Title & Description */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-casino-gold transition-colors font-orbitron tracking-wide">
                {feat.title}
              </h3>
              <p className="text-sm text-indigo-200/60 leading-relaxed group-hover:text-indigo-200/85 transition-colors">
                {feat.desc}
              </p>

            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
