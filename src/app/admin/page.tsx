"use client";

import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Users, DollarSign, Activity, Database, Server, Zap, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAdminStats, fetchAdminFeed, fetchGatewayBalance } from "@/lib/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [liveFeed, setLiveFeed] = useState<any[]>([]);
  const [gatewayBalance, setGatewayBalance] = useState<string>("0.00");

  useEffect(() => {
    const loadData = async () => {
      try {
        const statsData = await fetchAdminStats();
        setStats(statsData);

        const feedData = await fetchAdminFeed();
        setLiveFeed(feedData || []);

        const gatewayData = await fetchGatewayBalance();
        if (gatewayData?.balance) {
          setGatewayBalance(gatewayData.balance);
        }
      } catch (err) {
        console.error("Error loading dashboard data", err);
      }
    };

    loadData();
    const interval = setInterval(loadData, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  const kpis = [
    { label: "Total Bets Volume", value: `₹${(stats?.total_bets || 0).toLocaleString()}`, icon: Activity, color: "neon-purple" },
    { label: "Total Payout", value: `₹${(stats?.total_payout || 0).toLocaleString()}`, icon: DollarSign, color: "neon-emerald" },
    { label: "Net Profit", value: `₹${(stats?.profit || 0).toLocaleString()}`, icon: DollarSign, color: "neon-magenta" },
    { label: "PayFromUPI Balance", value: `₹${gatewayBalance}`, icon: Database, color: "neon-blue" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">Overview</h1>
        <div className="flex gap-2">
          <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors">24h</button>
          <button className="px-3 py-1.5 rounded-md bg-white/5 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors">7d</button>
          <button className="px-3 py-1.5 rounded-md bg-neon-blue/20 border border-neon-blue/50 text-sm text-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.2)]">30d</button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="p-6 rounded-xl glass-panel relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${kpi.color}/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:bg-${kpi.color}/20 transition-colors`} />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 rounded-lg bg-${kpi.color}/10 border border-${kpi.color}/20 text-${kpi.color}`}>
                <kpi.icon className="w-5 h-5" />
              </div>
            </div>
            <p className="text-sm text-gray-400 mb-1">{kpi.label}</p>
            <h3 className="text-2xl font-bold text-white tracking-tight">{kpi.value}</h3>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="p-6 rounded-xl glass-panel lg:col-span-2">
          <h3 className="text-lg font-semibold text-white mb-6">Revenue Analytics</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats?.revenue_history || []} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="time" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#333', borderRadius: '8px' }}
                  itemStyle={{ color: '#00f3ff' }}
                />
                <Area type="monotone" dataKey="value" stroke="#00f3ff" strokeWidth={2} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Live Feed */}
        <div className="space-y-6 flex flex-col">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="p-6 rounded-xl glass-panel flex-1">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-white">Live Activity</h3>
              <div className="w-2 h-2 rounded-full bg-neon-blue animate-ping" />
            </div>
            <div className="space-y-4 max-h-72 overflow-y-auto pr-2 custom-scrollbar">
              {liveFeed.length === 0 ? (
                <p className="text-sm text-gray-500">No recent activity.</p>
              ) : (
                liveFeed.map((feed, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-white/5 border border-white/10 ${feed.action === 'win' ? 'text-neon-emerald' : feed.action === 'bet' ? 'text-neon-purple' : 'text-neon-blue'}`}>
                        <Activity className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-gray-300 font-medium">{feed.user}</p>
                        <p className="text-xs text-gray-500">{feed.action} on {feed.game}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-mono font-semibold ${feed.action === 'win' ? 'text-neon-emerald' : feed.action === 'bet' ? 'text-neon-purple' : 'text-white'}`}>
                        ₹{feed.amount.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(feed.time).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
