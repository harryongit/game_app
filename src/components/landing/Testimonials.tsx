"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const REVIEWS = [
  { name: "Rahul K.", text: "The app is super fast. Zero delay on my bets and results are instant.", role: "High Roller", color: "neon-blue" },
  { name: "Vikram S.", text: "Best UI I've seen in gaming. Withdrawals are processed immediately to my bank.", role: "Pro Bettor", color: "neon-purple" },
  { name: "Pooja M.", text: "100% trusted platform. Tested the withdrawal myself and it was flawless.", role: "Daily Player", color: "neon-emerald" }
];

export function Testimonials() {
  return (
    <section className="py-24 relative bg-black/60 overflow-hidden">
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl font-bold mb-16 text-center">PLAYER VERIFIED</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="glass-panel p-8 rounded-2xl relative group"
            >
              <Quote className={`absolute top-6 right-6 w-12 h-12 text-${r.color}/10 group-hover:text-${r.color}/20 transition-colors`} />
              <p className="text-gray-300 italic mb-6 relative z-10">"{r.text}"</p>
              <div className="flex items-center gap-4 mt-auto relative z-10">
                <div className={`w-12 h-12 rounded-full bg-gradient-to-br from-${r.color} to-black p-0.5 shadow-[0_0_10px_var(--color-${r.color})]`} style={{ "--color-neon-blue": "#00f3ff", "--color-neon-purple": "#b026ff", "--color-neon-emerald": "#00ff66", "--color-neon-magenta": "#ff00ff" } as any}>
                  <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs font-bold text-white">
                    {r.name.substring(0, 2).toUpperCase()}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-white">{r.name}</h4>
                  <p className={`text-xs text-${r.color}`}>{r.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
