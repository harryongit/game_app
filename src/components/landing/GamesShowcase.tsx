"use client";

import { motion } from "framer-motion";
import { PlayCircle } from "lucide-react";
import Image from "next/image";

const GAMES = [
  { id: 1, name: "Boommine", image: "/boommine.png", description: "Navigate the minefield and multiply your winnings.", color: "neon-blue", shadowColor: "rgba(0,243,255,0.5)" },
  { id: 2, name: "Pro Spin", image: "/prospin.png", description: "The ultimate high-stakes spinning experience.", color: "neon-purple", shadowColor: "rgba(176,38,255,0.5)" },
  { id: 3, name: "Spin Wheel", image: "/spin.png", description: "Spin the classic wheel for daily rewards.", color: "neon-magenta", shadowColor: "rgba(255,0,255,0.5)" },
  { id: 4, name: "Toss Toss", image: "/toss.png", description: "Flip the coin and test your luck.", color: "neon-emerald", shadowColor: "rgba(0,255,102,0.5)" },
];

export function GamesShowcase() {
  return (
    <section className="py-16 md:py-24 lg:py-32 relative overflow-hidden">
      {/* Background glowing orbs */}
      <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-neon-blue/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 w-96 h-96 bg-neon-purple/10 rounded-full blur-[100px] -translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
        <div className="text-center mb-10 md:mb-16">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-tight"
          >
            PLAY <span className="neon-text">REAL GAMES</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 max-w-2xl mx-auto text-lg"
          >
            Experience the thrill of our 4 custom-designed games. High stakes, massive rewards, and perfect animations.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {GAMES.map((game, i) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.6, type: "spring", bounce: 0.4 }}
              className="group relative"
            >

              <div
                className="glass-panel rounded-3xl p-6 h-full flex flex-col items-center text-center relative overflow-hidden transition-all duration-500 group-hover:-translate-y-2"
                style={{ boxShadow: `0 0 0 0 ${game.shadowColor}` }}
              >
                {/* Dynamic glow effect on hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-700 pointer-events-none"
                  style={{ background: `radial-gradient(circle at 50% 50%, ${game.shadowColor}, transparent 70%)` }} />

                {/* Image container with floating animation */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}
                  className="relative w-32 h-32 md:w-48 md:h-48 mb-4 md:mb-6 mt-2 md:mt-4"
                >
                  <Image
                    src={game.image}
                    alt={game.name}
                    fill
                    className="object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)] group-hover:scale-110 transition-transform duration-500"
                  />
                </motion.div>

                <h3 className="text-2xl font-bold text-white mb-2 font-orbitron">{game.name}</h3>
                <p className="text-sm text-gray-400 mb-8 flex-grow">{game.description}</p>


              </div>

            </motion.div>
          ))}
        </div>
      </div>
    </section >
  );
}
