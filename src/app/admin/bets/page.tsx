"use client";

import { useState } from "react";
import { Search, Filter, Coins, CheckCircle, XCircle, Clock } from "lucide-react";

const MOCK_BETS = Array.from({ length: 20 }).map((_, i) => ({
  id: `BET-${1000 + i}`,
  user: ["RahulM", "Sneha_99", "AkashP", "PriyaWin", "VikramX"][Math.floor(Math.random() * 5)],
  game: ["Neon Crash", "Cyber Roulette", "Holo Dice", "Dragon Wheel"][Math.floor(Math.random() * 4)],
  amount: Math.floor(Math.random() * 50000 + 500),
  multiplier: (Math.random() * 10 + 1).toFixed(2),
  status: ["won", "lost", "pending"][Math.floor(Math.random() * 3)],
  time: new Date(Date.now() - Math.random() * 86400000).toLocaleTimeString(),
}));

export default function BetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredBets = MOCK_BETS.filter(bet => {
    const matchesSearch = bet.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          bet.user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bet.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Live Bets</h1>
          <p className="text-gray-400">Monitor all platform betting activity in real-time.</p>
        </div>
        <div className="px-4 py-2 bg-neon-blue/10 border border-neon-blue/30 rounded-xl text-neon-blue font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" />
          Live Feed Active
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by Bet ID or User..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "won", "lost", "pending"].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                statusFilter === status 
                  ? "bg-white/10 text-white border border-white/20" 
                  : "bg-transparent text-gray-400 border border-transparent hover:bg-white/5"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">Bet ID</th>
                <th className="p-4 text-sm font-semibold text-gray-400">User</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Game</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Amount (₹)</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Multiplier</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredBets.map((bet) => (
                <tr key={bet.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-300">{bet.id}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center text-[10px] font-bold text-white">
                        {bet.user.charAt(0)}
                      </div>
                      <span className="font-medium text-white">{bet.user}</span>
                    </div>
                  </td>
                  <td className="p-4 text-gray-300">{bet.game}</td>
                  <td className="p-4 font-medium text-white">₹{bet.amount.toLocaleString()}</td>
                  <td className="p-4">
                    <span className="text-neon-purple font-bold">{bet.multiplier}x</span>
                  </td>
                  <td className="p-4">
                    {bet.status === "won" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-emerald/10 text-neon-emerald text-xs font-bold border border-neon-emerald/20"><CheckCircle className="w-3 h-3" /> Won</span>}
                    {bet.status === "lost" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20"><XCircle className="w-3 h-3" /> Lost</span>}
                    {bet.status === "pending" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20"><Clock className="w-3 h-3" /> Pending</span>}
                  </td>
                  <td className="p-4 text-sm text-gray-500">{bet.time}</td>
                </tr>
              ))}
              {filteredBets.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500">
                    No bets found matching your criteria.
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
