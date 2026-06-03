"use client";

import { motion } from "framer-motion";
import { Zap, Shield, Wallet, Activity, Bell, Server } from "lucide-react";

const FEATURES = [
  { icon: Zap, title: "Instant Rewards", desc: "Claim your massive spin rewards instantly. No hidden limits, no manual delays.", color: "neon-blue" },
  { icon: Activity, title: "Massive Multipliers", desc: "Watch your spin rewards multiply up to 1000x in real-time. Thrilling action, legendary rewards.", color: "neon-purple" },
  { icon: Wallet, title: "Daily Rewards", desc: "Claim free spins, daily bonuses, and extra points just for playing your favorite wheels.", color: "neon-emerald" },
  { icon: Shield, title: "VIP Benefits", desc: "Level up your account to unlock exclusive VIP spin wheels and luxury rewards.", color: "white" },
  { icon: Server, title: "24/7 Action", desc: "The wheels never stop spinning. Join live rounds every second and keep the adrenaline pumping.", color: "neon-magenta" },
  { icon: Bell, title: "Global Milestones", desc: "Compete against players worldwide for life-changing community reward drops.", color: "neon-blue" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
} as const;

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden bg-black/50">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(176,38,255,0.05)_0%,transparent_70%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">WHY PLAY WITH US?</h2>
          <p className="text-gray-400">The most rewarding, action-packed gaming experience on the planet.</p>
        </div>

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
              className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors"
            >
              {/* Animated Glowing Border Overlay */}
              <div className={`absolute inset-0 rounded-2xl border border-${feat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 shadow-[inset_0_0_20px_var(--color-${feat.color}),0_0_20px_var(--color-${feat.color})] mix-blend-screen pointer-events-none`} style={{ "--color-neon-blue": "#00f3ff", "--color-neon-purple": "#b026ff", "--color-neon-emerald": "#00ff66", "--color-neon-magenta": "#ff00ff", "--color-white": "#ffffff" } as any} />
              
              <div className={`w-14 h-14 rounded-xl bg-${feat.color}/10 border border-${feat.color}/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feat.icon className={`w-7 h-7 text-${feat.color}`} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-400 transition-all">
                {feat.title}
              </h3>
              <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                {feat.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
