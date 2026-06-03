"use client";

import { Save } from "lucide-react";

export default function SettingsPage() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Settings</h1>
        <p className="text-gray-400">Configure global platform branding and policies.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">General Info</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Platform Name</label>
              <input type="text" defaultValue="BoltPlay" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-400 mb-2">Support Email</label>
              <input type="email" defaultValue="support@boltplay.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Financial Policies</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Withdrawal Fee (%)</label>
              <input type="number" defaultValue="2.5" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-400">Minimum Withdrawal (₹)</label>
              <input type="number" defaultValue="1000" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-neon-blue/50" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button className="px-8 py-3 bg-neon-blue hover:bg-neon-blue/90 text-black font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all">
          <Save className="w-5 h-5" /> Save Changes
        </button>
      </div>
    </div>
  );
}
