"use client";

import { PlayCircle, CheckCircle2, Clock } from "lucide-react";

const ROUNDS = [
  { id: "RND-9842", game: "Neon Crash", status: "live", pool: "$12,450", multiplier: "2.45x", time: "LIVE" },
  { id: "RND-9843", game: "Cyber Roulette", status: "starting", pool: "$8,900", multiplier: "-", time: "00:12" },
  { id: "RND-9841", game: "Neon Crash", status: "finished", pool: "$14,200", multiplier: "1.82x", winner: "House (Crash)" },
  { id: "RND-9840", game: "Holo Dice", status: "finished", pool: "$5,400", multiplier: "3.00x", winner: "CryptoKing99" },
  { id: "RND-9839", game: "Cyber Roulette", status: "finished", pool: "$21,000", multiplier: "14.00x", winner: "NeonSamurai" },
];

export default function LiveRoundsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
          Live Rounds
        </h1>
        <button className="px-4 py-2 rounded-lg bg-neon-purple text-white font-bold text-sm hover:bg-neon-purple/80 transition-colors shadow-[0_0_15px_rgba(176,38,255,0.4)] flex items-center gap-2">
          <PlayCircle className="w-4 h-4" /> Pause Engine
        </button>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">Round ID</th>
                <th className="px-6 py-4">Game</th>
                <th className="px-6 py-4">Status / Time</th>
                <th className="px-6 py-4">Total Pool</th>
                <th className="px-6 py-4">Multiplier Result</th>
                <th className="px-6 py-4">Winner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {ROUNDS.map((round) => (
                <tr key={round.id} className={`hover:bg-white/[0.02] transition-colors ${round.status === 'live' ? 'bg-red-500/[0.02]' : ''}`}>
                  <td className="px-6 py-4 font-mono text-gray-500">{round.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{round.game}</td>
                  <td className="px-6 py-4">
                    {round.status === 'live' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> LIVE</span>}
                    {round.status === 'starting' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><Clock className="w-3 h-3" /> {round.time}</span>}
                    {round.status === 'finished' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30"><CheckCircle2 className="w-3 h-3" /> Finished</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-white">{round.pool}</td>
                  <td className={`px-6 py-4 font-black text-lg ${round.status === 'live' ? 'text-neon-blue drop-shadow-[0_0_5px_var(--color-neon-blue)]' : round.status === 'starting' ? 'text-gray-600' : 'text-neon-emerald'}`}>
                    {round.multiplier}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {round.winner || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
