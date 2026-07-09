"use client";

import { useEffect, useState } from "react";
import { Coins, HandCoins, TrendingUp, Users, Activity } from "lucide-react";

interface GameStats {
  total_wagered: number;
  total_payout: number;
  total_profit: number;
  total_players: number;
  active_rounds: number;
}

export function GameStatsCards({ gameType }: { gameType: string }) {
  const [stats, setStats] = useState<GameStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      const res = await fetch(`http://localhost:8080/admin/games/${gameType}/stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (error) {
      console.error(`Error fetching ${gameType} stats:`, error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 5000); // 5s refresh for stats
    return () => clearInterval(interval);
  }, [gameType]);

  const cards = [
    {
      title: "Total Wagered",
      value: stats ? `₹${stats.total_wagered.toLocaleString()}` : "...",
      icon: Coins,
      color: "text-blue-400",
      bg: "bg-blue-400/10 border-blue-400/20"
    },
    {
      title: "Total Payout",
      value: stats ? `₹${stats.total_payout.toLocaleString()}` : "...",
      icon: HandCoins,
      color: "text-red-400",
      bg: "bg-red-400/10 border-red-400/20"
    },
    {
      title: "House Profit",
      value: stats ? `₹${stats.total_profit.toLocaleString()}` : "...",
      icon: TrendingUp,
      color: "text-green-400",
      bg: "bg-green-400/10 border-green-400/20 shadow-[0_0_15px_rgba(74,222,128,0.1)]"
    },
    {
      title: "Unique Players",
      value: stats ? stats.total_players.toLocaleString() : "...",
      icon: Users,
      color: "text-purple-400",
      bg: "bg-purple-400/10 border-purple-400/20"
    },
    {
      title: "Active Sessions",
      value: stats ? stats.active_rounds.toLocaleString() : "...",
      icon: Activity,
      color: "text-yellow-400",
      bg: "bg-yellow-400/10 border-yellow-400/20"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {cards.map((card, idx) => (
        <div key={idx} className={`rounded-2xl p-6 border backdrop-blur-md relative overflow-hidden group ${card.bg}`}>
          <div className="flex justify-between items-start relative z-10">
            <div>
              <p className="text-gray-400 text-sm font-medium tracking-wider uppercase mb-2">{card.title}</p>
              {loading && !stats ? (
                <div className="h-8 w-24 bg-white/10 rounded animate-pulse"></div>
              ) : (
                <h3 className="text-2xl font-black text-white tracking-tight">{card.value}</h3>
              )}
            </div>
            <div className={`p-3 rounded-xl bg-black/50 border border-white/5 ${card.color}`}>
              <card.icon className="w-5 h-5" />
            </div>
          </div>
          <div className={`absolute -bottom-6 -right-6 w-24 h-24 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-500 ${card.color.replace('text-', 'bg-')}`}></div>
        </div>
      ))}
    </div>
  );
}
