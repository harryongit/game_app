"use client";

import { useState, useEffect } from "react";
import { Bomb, Gem, TrendingUp, Users, DollarSign, RefreshCw, ShieldOff, ArrowUpRight, ArrowDownRight } from "lucide-react";

const API_BASE = "/api-proxy";

function getAdminHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken");
    if (token) headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

function formatIST(dateStr: string) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function BoomMineAdminPage() {
  const [sessions, setSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    setError(null);
    try {
      // Use the dedicated BoomMine admin API endpoint
      const res = await fetch(`${API_BASE}/admin/boommine/sessions?limit=100`, {
        headers: getAdminHeaders(),
      });
      if (!res.ok) {
        setError("Failed to load sessions");
        return;
      }
      const data = await res.json();
      setSessions(data || []);
    } catch (e: any) {
      setError(e.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Compute stats from sessions
  const totalGames = sessions.length;
  const totalBet = sessions.reduce((s, r) => s + (parseInt(r.bet_amount) || 0), 0);
  const totalPayout = sessions.reduce((s, r) => s + (parseInt(r.payout) || 0), 0);
  const houseProfit = totalBet - totalPayout;
  const wins = sessions.filter(r => r.status === "cashed_out" || r.status === "won").length;
  const losses = sessions.filter(r => r.status === "lost").length;
  const active = sessions.filter(r => r.status === "active").length;
  const winRate = totalGames > 0 ? ((wins / totalGames) * 100).toFixed(1) : "0.0";
  const houseEdgePct = totalBet > 0 ? ((houseProfit / totalBet) * 100).toFixed(1) : "0.0";

  const statCards = [
    { label: "Total Games",    value: totalGames,                           icon: Bomb,        color: "text-red-400",           border: "border-red-500/20",    bg: "bg-red-500/10" },
    { label: "Total Wagered",  value: `₹${totalBet.toLocaleString()}`,      icon: DollarSign,  color: "text-neon-blue",          border: "border-neon-blue/20",  bg: "bg-neon-blue/10" },
    { label: "Total Payouts",  value: `₹${totalPayout.toLocaleString()}`,   icon: TrendingUp,  color: "text-neon-purple",        border: "border-neon-purple/20",bg: "bg-neon-purple/10" },
    { label: "House Profit",   value: `₹${houseProfit.toLocaleString()}`,   icon: Gem,         color: "text-neon-emerald",       border: "border-neon-emerald/20",bg: "bg-neon-emerald/10" },
    { label: "Player Win Rate",value: `${winRate}%`,                        icon: Users,       color: "text-yellow-400",         border: "border-yellow-500/20", bg: "bg-yellow-500/10" },
    { label: "House Edge",     value: `${houseEdgePct}%`,                   icon: ShieldOff,   color: "text-neon-magenta",       border: "border-neon-magenta/20",bg: "bg-neon-magenta/10" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <Bomb className="w-7 h-7 text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            BoomMine Sessions
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Completely isolated from SpinWheel — own tables: <code className="text-neon-blue text-xs">boommine_sessions</code> · <code className="text-neon-blue text-xs">boommine_ledger</code>
          </p>
        </div>
        <button onClick={load} disabled={loading} className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors disabled:opacity-50">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} /> Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-red-400 text-sm">{error}</div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {statCards.map(card => (
          <div key={card.label} className={`glass-panel p-4 rounded-xl border ${card.border} ${card.bg}`}>
            <card.icon className={`w-5 h-5 ${card.color} mb-2`} />
            <div className="text-xs text-gray-400 mb-1">{card.label}</div>
            <div className={`text-lg font-black ${card.color}`}>{card.value}</div>
          </div>
        ))}
      </div>

      {/* Active games banner */}
      {active > 0 && (
        <div className="bg-neon-blue/10 border border-neon-blue/30 rounded-xl px-4 py-3 flex items-center gap-3">
          <div className="w-2 h-2 bg-neon-blue rounded-full animate-pulse" />
          <span className="text-neon-blue font-bold">{active}</span>
          <span className="text-gray-300 text-sm">game{active > 1 ? "s" : ""} currently active</span>
        </div>
      )}

      {/* W/L summary */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-panel rounded-xl border border-neon-emerald/20 bg-neon-emerald/5 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-neon-emerald/20 flex items-center justify-center">
            <ArrowUpRight className="w-5 h-5 text-neon-emerald" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Players Won (cashed out)</div>
            <div className="text-2xl font-black text-neon-emerald">{wins}</div>
          </div>
        </div>
        <div className="glass-panel rounded-xl border border-red-500/20 bg-red-500/5 p-4 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
            <ArrowDownRight className="w-5 h-5 text-red-400" />
          </div>
          <div>
            <div className="text-xs text-gray-400">Players Lost (hit mine)</div>
            <div className="text-2xl font-black text-red-400">{losses}</div>
          </div>
        </div>
      </div>

      {/* Sessions Table */}
      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10 font-bold text-white flex items-center justify-between">
          <span>Recent Sessions <span className="text-gray-500 text-sm font-normal ml-2">({sessions.length} records)</span></span>
          <span className="text-xs text-gray-500 font-normal">Source: boommine_sessions table only</span>
        </div>
        <div className="overflow-x-auto">
          {loading ? (
            <div className="p-8 text-center text-gray-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin" /> Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div className="p-12 text-center">
              <Bomb className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">No BoomMine sessions yet.</p>
              <p className="text-gray-600 text-sm mt-1">Sessions will appear here once players start a game.</p>
            </div>
          ) : (
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-4 py-3">Session</th>
                  <th className="px-4 py-3">Player</th>
                  <th className="px-4 py-3">Bet</th>
                  <th className="px-4 py-3">Mines</th>
                  <th className="px-4 py-3">Gems</th>
                  <th className="px-4 py-3">Multiplier</th>
                  <th className="px-4 py-3">Payout</th>
                  <th className="px-4 py-3">P&L</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sessions.map((row: any, i: number) => {
                  const statusMap: Record<string, string> = {
                    cashed_out: "text-neon-emerald bg-neon-emerald/10",
                    won:        "text-neon-emerald bg-neon-emerald/10",
                    lost:       "text-red-400 bg-red-500/10",
                    active:     "text-neon-blue bg-neon-blue/10",
                  };
                  const statusColor = statusMap[row.status] || "text-gray-400 bg-white/5";
                  const profit = parseInt(row.profit) || 0;
                  return (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-4 py-3 font-mono text-gray-500 text-xs">#{row.id}</td>
                      <td className="px-4 py-3 text-gray-300 font-medium">{row.username || row.user_id}</td>
                      <td className="px-4 py-3 font-mono text-neon-blue">₹{parseInt(row.bet_amount).toLocaleString()}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-red-400">
                          <Bomb className="w-3 h-3" /> {row.mine_count}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center gap-1 text-neon-emerald">
                          <Gem className="w-3 h-3" /> {row.gems_found}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-white">x{parseFloat(row.multiplier || "1").toFixed(2)}</td>
                      <td className="px-4 py-3 font-mono text-neon-emerald">
                        {parseInt(row.payout) > 0 ? `₹${parseInt(row.payout).toLocaleString()}` : "-"}
                      </td>
                      <td className={`px-4 py-3 font-mono font-bold ${profit >= 0 ? "text-neon-emerald" : "text-red-400"}`}>
                        {profit >= 0 ? "+" : ""}₹{profit.toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor}`}>{row.status}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">{formatIST(row.created_at)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
