"use client";

import { useEffect, useState } from "react";
import { PlayCircle, CheckCircle2, Search, Zap } from "lucide-react";

interface GameRound {
  id: string;
  game: string;
  status: string;
  pool: string | number;
  multiplier: string;
  time: string;
}

export function GameRoundsTable({ gameType, title = "Live Rounds" }: { gameType: string, title?: string }) {
  const [rounds, setRounds] = useState<GameRound[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchRounds = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/games/${gameType}/rounds?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setRounds(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} rounds:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRounds();
    const interval = setInterval(fetchRounds, 3000);
    return () => clearInterval(interval);
  }, [gameType]);

  const filteredRounds = rounds.filter(r => r.id.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-purple/10 border border-neon-purple/20 flex items-center justify-center">
            <PlayCircle className="w-5 h-5 text-neon-purple" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Latest 50 events</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-neon-purple transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search Round ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">ID</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Total Pool</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Multiplier</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && rounds.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-neon-purple border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading data...
                </td>
              </tr>
            ) : filteredRounds.length === 0 ? (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-500 font-medium">No rounds found.</td>
              </tr>
            ) : (
              filteredRounds.map((round) => (
                <tr key={round.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-neon-purple transition-colors">
                      {round.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-white">{typeof round.pool === 'number' ? `₹${round.pool}` : round.pool}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-300">{round.multiplier}</td>
                  <td className="p-4 text-right">
                    {round.status === "settled" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium uppercase tracking-wider">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Settled
                      </span>
                    ) : round.status === "active" || round.status === "open" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-neon-purple/10 text-neon-purple border border-neon-purple/20 text-xs font-medium uppercase tracking-wider shadow-[0_0_10px_rgba(187,134,252,0.1)]">
                        <Zap className="w-3.5 h-3.5 animate-pulse" /> Live
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-500/10 text-gray-400 border border-gray-500/20 text-xs font-medium uppercase tracking-wider">
                        {round.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
