"use client";

import { useState, useEffect } from "react";
import { BarChart3, TrendingUp, Users, DollarSign, Activity } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";
import { fetchAdminStats } from "@/lib/api";

const COLORS = ["#00f3ff", "#b026ff", "#10b981", "#fbbf24"];

export default function AnalyticsPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats().then(data => {
      setStats(data);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading analytics...</div>;
  }

  const revenueData = stats?.revenue_history || [];
  const totalRevenue7d = revenueData.reduce((acc: number, item: any) => acc + (item.value || 0), 0);
  
  const rtp = stats?.total_bets > 0 ? ((stats.total_payout / stats.total_bets) * 100).toFixed(1) : "0.0";

  const gameData = stats?.game_stats?.map((g: any) => ({
    name: g.name === 'spinwheel' ? 'Spinwheel' : (g.name === 'spinwheelpro' ? 'Spinwheel Pro' : g.name),
    value: g.total_bets_count,
  })) || [{ name: "Spinwheel", value: 100 }]; // fallback if no data

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Analytics</h1>
        <p className="text-gray-400">Platform performance and revenue metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-emerald/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Total Revenue (7d)</div>
          <div className="text-3xl font-bold text-white mb-2">₹{totalRevenue7d.toLocaleString()}</div>
          <div className="flex items-center text-neon-emerald text-sm font-bold gap-1">
            <Activity className="w-4 h-4" /> Live
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Active Players (7d)</div>
          <div className="text-3xl font-bold text-white mb-2">{stats?.active_players || 0}</div>
          <div className="flex items-center text-neon-blue text-sm font-bold gap-1">
            <Users className="w-4 h-4" /> Active
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Total Bets</div>
          <div className="text-3xl font-bold text-white mb-2">{stats?.total_bets_count?.toLocaleString() || 0}</div>
          <div className="flex items-center text-neon-purple text-sm font-bold gap-1">
            <Activity className="w-4 h-4" /> All-time
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Avg. Return (RTP)</div>
          <div className="text-3xl font-bold text-white mb-2">{rtp}%</div>
          <div className="flex items-center text-yellow-500 text-sm font-bold gap-1">
            Stable
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-2xl border border-white/5 lg:col-span-2">
          <h2 className="text-xl font-bold text-white mb-6">Revenue Overview</h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="time" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <h2 className="text-xl font-bold text-white mb-6">Popular Games</h2>
          <div className="h-[300px] w-full flex flex-col items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={gameData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {gameData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 flex justify-center gap-4 flex-wrap">
              {gameData.map((entry: any, i: number) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {entry.name} ({entry.value} bets)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
