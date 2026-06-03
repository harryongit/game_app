"use client";

import { motion } from "framer-motion";
import { Clock, PlayCircle } from "lucide-react";
import { useState, useEffect } from "react";

const MOCK_WHEELS = [
  { id: 1, name: "Mega Spin Wheel", multiplier: "Up to 10x", status: "live", prizePool: "10M Points", color: "neon-blue" },
  { id: 2, name: "Daily Free Spin", multiplier: "Guaranteed Reward", status: "starting", time: "00:12", prizePool: "1M Points", color: "neon-purple" },
  { id: 3, name: "VIP Fortune Wheel", multiplier: "Up to 100x", status: "live", prizePool: "Exclusive Rewards", color: "neon-emerald" },
];

export function SpinWheelShowcase() {
  const [pulse, setPulse] = useState(false);

  // Simulate pulse for live wheels
  useEffect(() => {
    const interval = setInterval(() => {
      setPulse((p) => !p);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-24 relative">
      <div className="container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="text-4xl font-bold mb-2 flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-neon-blue animate-pulse shadow-[0_0_10px_rgba(0,243,255,0.8)]" />
              SPIN & WIN
            </h2>
            <p className="text-gray-400">Choose your wheel and claim your rewards</p>
          </div>
          <button className="text-neon-blue hover:text-neon-purple transition-colors font-semibold">
            View All Wheels &rarr;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {MOCK_WHEELS.map((wheel, i) => (
            <motion.div
              key={wheel.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass-panel rounded-2xl p-6 relative overflow-hidden group border-t border-l border-${wheel.color}/40`}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 bg-${wheel.color}/10 rounded-full blur-3xl -mr-10 -mt-10 group-hover:bg-${wheel.color}/30 transition-all duration-500`} />
              
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">{wheel.name}</h3>
                  <div className="text-sm text-gray-400">Total Prizes: <span className="text-white">{wheel.prizePool}</span></div>
                </div>
                {wheel.status === 'live' ? (
                  <div className="px-3 py-1 rounded-full bg-neon-blue/20 text-neon-blue text-xs font-bold border border-neon-blue/30 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-blue animate-ping" /> ACTIVE
                  </div>
                ) : (
                  <div className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-400 text-xs font-bold border border-blue-500/30 flex items-center gap-1.5">
                    <Clock className="w-3 h-3" /> {wheel.time}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-8">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500 mb-1">Top Reward</span>
                  <motion.span 
                    key={pulse ? "on" : "off"}
                    initial={{ scale: 1.05, color: "#fff" }}
                    animate={{ scale: 1, color: `var(--color-${wheel.color})` }}
                    className={`text-2xl font-black text-${wheel.color} drop-shadow-[0_0_8px_currentColor]`}
                  >
                    {wheel.multiplier}
                  </motion.span>
                </div>
                <button className={`w-12 h-12 rounded-full flex items-center justify-center bg-${wheel.color}/20 text-${wheel.color} border border-${wheel.color}/50 hover:bg-${wheel.color} hover:text-black transition-all group-hover:shadow-[0_0_15px_currentColor]`}>
                  <PlayCircle className="w-6 h-6" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
