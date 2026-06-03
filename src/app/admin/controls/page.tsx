"use client";

import { ShieldAlert, Power, Sliders, AlertOctagon } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/api";

export default function ControlsPage() {
  const [maintenance, setMaintenance] = useState(false);
  const [globalRtp, setGlobalRtp] = useState(96);
  const [killSwitch, setKillSwitch] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminSettings().then((data) => {
      if (data.maintenance_mode === "true") setMaintenance(true);
      if (data.global_rtp) setGlobalRtp(parseInt(data.global_rtp));
      if (data.kill_switch === "true") setKillSwitch(true);
      setLoading(false);
    }).catch((err) => {
      console.error(err);
      setLoading(false);
    });
  }, []);

  const handleMaintenanceToggle = async () => {
    const newVal = !maintenance;
    setMaintenance(newVal);
    await updateAdminSettings({ maintenance_mode: newVal ? "true" : "false" });
  };

  const handleRtpChange = async (val: number) => {
    setGlobalRtp(val);
    await updateAdminSettings({ global_rtp: val.toString() });
  };

  const handleKillSwitchToggle = async () => {
    const newVal = !killSwitch;
    setKillSwitch(newVal);
    await updateAdminSettings({ kill_switch: newVal ? "true" : "false" });
  };

  if (loading) {
    return <div className="text-white">Loading controls...</div>;
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <ShieldAlert className="w-8 h-8 text-red-500" /> Admin Controls
        </h1>
        <p className="text-gray-400">High-level emergency controls and global parameters.</p>
      </div>

      <div className="grid gap-6">
        {/* Maintenance Mode */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-yellow-500/10 text-yellow-500 rounded-xl">
              <AlertOctagon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Maintenance Mode</h3>
              <p className="text-sm text-gray-400 max-w-md">Suspend all non-admin logins and display a maintenance page. Active games will be gracefully concluded.</p>
            </div>
          </div>
          <button 
            onClick={handleMaintenanceToggle}
            className={`px-6 py-3 rounded-xl font-bold transition-all ${maintenance ? 'bg-yellow-500 text-black shadow-[0_0_15px_rgba(234,179,8,0.5)]' : 'bg-white/5 text-gray-400 hover:bg-white/10'}`}
          >
            {maintenance ? "Active" : "Enable"}
          </button>
        </div>

        {/* Global RTP Control */}
        <div className="glass-panel p-6 rounded-2xl border border-white/5">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-neon-blue/10 text-neon-blue rounded-xl">
              <Sliders className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-1">Global Target RTP</h3>
              <p className="text-sm text-gray-400">Adjust the target Return-To-Player across all house games.</p>
            </div>
          </div>
          <div className="flex items-center gap-6 px-16">
            <span className="text-gray-500 font-mono">90%</span>
            <input 
              type="range" 
              min="90" max="99" 
              value={globalRtp} 
              onChange={(e) => setGlobalRtp(parseInt(e.target.value))}
              onMouseUp={() => handleRtpChange(globalRtp)}
              onTouchEnd={() => handleRtpChange(globalRtp)}
              className="flex-1 accent-neon-blue h-2 bg-white/10 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-2xl font-black text-neon-blue">{globalRtp}%</span>
          </div>
        </div>

        {/* Emergency Kill Switch */}
        <div className={`glass-panel p-6 rounded-2xl border transition-colors ${killSwitch ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-red-500/20'}`}>
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-xl transition-colors ${killSwitch ? 'bg-red-500 text-white animate-pulse' : 'bg-red-500/10 text-red-500'}`}>
              <Power className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-red-400 mb-1">Emergency Kill Switch</h3>
              <p className="text-sm text-red-500/70 mb-4 max-w-md">Instantly terminates all active games, halts all deposits/withdrawals, and freezes all balances. Use only in severe emergencies.</p>
              <button 
                onClick={handleKillSwitchToggle}
                className={`px-8 py-4 rounded-xl font-black text-lg transition-all ${killSwitch ? 'bg-transparent border border-red-500 text-red-500' : 'bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.4)]'}`}
              >
                {killSwitch ? "DEACTIVATE KILL SWITCH" : "ENGAGE KILL SWITCH"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
