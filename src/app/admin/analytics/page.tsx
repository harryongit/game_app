"use client";

import { BarChart3, TrendingUp, Users, DollarSign } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, PieChart, Pie, Cell, CartesianGrid } from "recharts";

const REVENUE_DATA = [
  { name: "Mon", value: 4000 },
  { name: "Tue", value: 3000 },
  { name: "Wed", value: 5000 },
  { name: "Thu", value: 2780 },
  { name: "Fri", value: 8900 },
  { name: "Sat", value: 12000 },
  { name: "Sun", value: 14000 },
];

const GAME_DATA = [
  { name: "Neon Crash", value: 45 },
  { name: "Cyber Roulette", value: 25 },
  { name: "Holo Dice", value: 20 },
  { name: "Dragon Wheel", value: 10 },
];

const COLORS = ["#00f3ff", "#b026ff", "#10b981", "#fbbf24"];

export default function AnalyticsPage() {
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
          <div className="text-3xl font-bold text-white mb-2">₹14.2M</div>
          <div className="flex items-center text-neon-emerald text-sm font-bold gap-1">
            <TrendingUp className="w-4 h-4" /> +24.5%
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-blue/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Active Players</div>
          <div className="text-3xl font-bold text-white mb-2">12,450</div>
          <div className="flex items-center text-neon-blue text-sm font-bold gap-1">
            <TrendingUp className="w-4 h-4" /> +12.1%
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-neon-purple/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Total Bets</div>
          <div className="text-3xl font-bold text-white mb-2">145K</div>
          <div className="flex items-center text-neon-purple text-sm font-bold gap-1">
            <TrendingUp className="w-4 h-4" /> +8.4%
          </div>
        </div>
        <div className="glass-panel p-6 rounded-2xl border border-white/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500/10 rounded-full blur-2xl -mr-8 -mt-8" />
          <div className="text-gray-400 text-sm font-medium mb-1">Avg. Return (RTP)</div>
          <div className="text-3xl font-bold text-white mb-2">96.4%</div>
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
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00f3ff" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00f3ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff50" axisLine={false} tickLine={false} />
                <YAxis stroke="#ffffff50" axisLine={false} tickLine={false} tickFormatter={(val) => `₹${val/1000}k`} />
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
                  data={GAME_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {GAME_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#050505', borderColor: '#ffffff20', borderRadius: '8px' }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="w-full mt-4 flex justify-center gap-4 flex-wrap">
              {GAME_DATA.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2 text-xs text-gray-400">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  {entry.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
