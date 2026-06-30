"use client";

import { useState, useEffect } from "react";
import { PlayCircle, CheckCircle2, Clock } from "lucide-react";
import { fetchAdminRounds } from "@/lib/api";

export default function LiveRoundsPage() {
  const [rounds, setRounds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadRounds = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminRounds();
      setRounds(data || []);
    } catch (err) {
      console.error("Error loading rounds:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRounds();
    const interval = setInterval(loadRounds, 5000); // Live poll every 5s
    return () => clearInterval(interval);
  }, []);

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
              {loading && rounds.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Loading live rounds...
                  </td>
                </tr>
              ) : rounds.map((round) => (
                <tr key={round.id} className={`hover:bg-white/[0.02] transition-colors ${round.status === 'locked' ? 'bg-red-500/[0.02]' : ''}`}>
                  <td className="px-6 py-4 font-mono text-gray-500">{round.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{round.game}</td>
                  <td className="px-6 py-4">
                    {round.status === 'locked' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/30"><span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" /> Locked</span>}
                    {round.status === 'betting' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30"><Clock className="w-3 h-3" /> Betting</span>}
                    {round.status === 'settled' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/30"><CheckCircle2 className="w-3 h-3" /> Settled</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-white">{round.pool}</td>
                  <td className={`px-6 py-4 font-black text-lg ${round.status === 'locked' ? 'text-neon-blue drop-shadow-[0_0_5px_var(--color-neon-blue)]' : round.status === 'betting' ? 'text-gray-600' : 'text-neon-emerald'}`}>
                    {round.multiplier}
                  </td>
                  <td className="px-6 py-4 text-gray-300">
                    {round.winner || "-"}
                  </td>
                </tr>
              ))}
              {rounds.length === 0 && !loading && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    No rounds found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
