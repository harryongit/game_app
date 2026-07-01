"use client";

import { motion } from "framer-motion";
import { Trophy, TrendingUp, Medal } from "lucide-react";

const WINNERS = [
  { rank: 1, user: "Rahul K.", game: "Kalyan Matka", multiplier: "1,250x", payout: "₹1,25,000", color: "neon-blue" },
  { rank: 2, user: "Vikram S.", game: "Milan Day", multiplier: "850x", payout: "₹85,000", color: "neon-purple" },
  { rank: 3, user: "Pooja M.", game: "Rajdhani Night", multiplier: "500x", payout: "₹50,000", color: "neon-emerald" },
  { rank: 4, user: "Amit D.", game: "Kalyan Night", multiplier: "250x", payout: "₹25,000", color: "white" },
  { rank: 5, user: "Suresh P.", game: "Main Bazar", multiplier: "100x", payout: "₹10,000", color: "white" },
];

export function TopWinners() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-96 bg-neon-purple/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 max-w-5xl">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/5 border border-white/10">
            <Trophy className="w-5 h-5 text-yellow-500" />
            <span className="text-sm font-bold tracking-widest text-white uppercase">Hall of Fame</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-4">RECENT HUGE REWARDS</h2>
          <p className="text-gray-400 text-lg">Real players hitting life-changing multipliers. Are you next?</p>
        </div>

        <div className="glass-panel rounded-2xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(176,38,255,0.1)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 border-b border-white/10 text-gray-400 text-sm font-semibold uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4">Rank</th>
                  <th className="px-6 py-4">Player</th>
                  <th className="px-6 py-4">Game</th>
                  <th className="px-6 py-4">Multiplier</th>
                  <th className="px-6 py-4 text-right">Reward</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {WINNERS.map((winner, i) => (
                  <motion.tr 
                    key={winner.rank}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2">
                        {winner.rank <= 3 ? (
                          <Medal className={`w-6 h-6 text-${winner.rank === 1 ? 'yellow-400' : winner.rank === 2 ? 'gray-300' : 'yellow-700'}`} />
                        ) : (
                          <span className="w-6 text-center text-gray-500 font-bold">#{winner.rank}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 font-bold text-white flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full bg-gradient-to-br from-${winner.color} to-black p-0.5`} style={{ "--color-neon-blue": "#00f3ff", "--color-neon-purple": "#b026ff", "--color-neon-emerald": "#00ff66" } as any}>
                        <div className="w-full h-full bg-black rounded-full flex items-center justify-center text-xs">
                          {winner.user.substring(0,2).toUpperCase()}
                        </div>
                      </div>
                      {winner.user}
                    </td>
                    <td className="px-6 py-5 text-gray-400">{winner.game}</td>
                    <td className="px-6 py-5">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-neon-purple/10 text-neon-purple font-black border border-neon-purple/20 shadow-[0_0_10px_rgba(176,38,255,0.2)] group-hover:scale-110 transition-transform">
                        <TrendingUp className="w-3 h-3" />
                        {winner.multiplier}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right font-black text-xl text-neon-emerald drop-shadow-[0_0_5px_rgba(0,255,102,0.3)]">
                      {winner.payout}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
