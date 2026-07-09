"use client";

import { useEffect, useState } from "react";
import { Clock, CheckCircle2, XCircle, Search } from "lucide-react";

interface GameBet {
  id: string;
  user: string;
  game: string;
  amount: number;
  multiplier: string;
  status: string;
  time: string;
}

export function GameBetsTable({ gameType, title = "Live Bets" }: { gameType: string, title?: string }) {
  const [bets, setBets] = useState<GameBet[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchBets = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`/api-proxy/admin/games/${gameType}/bets?limit=50`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setBets(data || []);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} bets:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets();
    const interval = setInterval(fetchBets, 3000); // auto-refresh every 3s
    return () => clearInterval(interval);
  }, [gameType]);

  const filteredBets = bets.filter(b => 
    b.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.user.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-black/40 backdrop-blur-md border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
      <div className="p-6 border-b border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neon-blue/10 border border-neon-blue/20 flex items-center justify-center">
            <Clock className="w-5 h-5 text-neon-blue" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-wide">{title}</h2>
            <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider">Latest 50 actions</p>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-500 group-focus-within:text-neon-blue transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Search TxID or User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Bet ID</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">User</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Amount</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider">Multiplier</th>
              <th className="p-4 text-xs font-semibold text-gray-400 uppercase tracking-wider text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {loading && bets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  <div className="flex justify-center mb-2">
                    <div className="w-6 h-6 border-2 border-neon-blue border-t-transparent rounded-full animate-spin"></div>
                  </div>
                  Loading data...
                </td>
              </tr>
            ) : filteredBets.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500 font-medium">No bets found.</td>
              </tr>
            ) : (
              filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4">
                    <span className="text-sm font-medium text-gray-300 group-hover:text-neon-blue transition-colors">
                      {bet.id}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="inline-flex items-center gap-2 text-sm text-gray-200">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                        {bet.user.charAt(0).toUpperCase()}
                      </div>
                      {bet.user}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm font-medium text-white">₹{bet.amount}</span>
                  </td>
                  <td className="p-4 text-sm font-medium text-gray-300">{bet.multiplier}</td>
                  <td className="p-4 text-right">
                    {bet.status === "won" || bet.status === "cashed_out" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-green-500/10 text-green-400 border border-green-500/20 text-xs font-medium uppercase tracking-wider shadow-[0_0_10px_rgba(34,197,94,0.1)]">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Won
                      </span>
                    ) : bet.status === "lost" || bet.status === "busted" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-medium uppercase tracking-wider">
                        <XCircle className="w-3.5 h-3.5" /> Lost
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-xs font-medium uppercase tracking-wider">
                        <Clock className="w-3.5 h-3.5 animate-pulse" /> Pending
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
