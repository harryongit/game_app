"use client";

import { useState, useEffect } from "react";
import { Save, RefreshCw, Settings2, Target, Percent } from "lucide-react";
import { fetchAdminSettings, updateAdminSettings } from "@/lib/api";
import { toast } from "sonner";

export default function GameControlsPage() {
  const [config, setConfig] = useState<any>({
    mode: "profit_driven",
    target_margin: 20,
    multipliers: {
      "1x": 80,
      "2x": 15,
      "3x": 5
    }
  });
  
  // We need to keep track of all settings so we don't overwrite others
  const [allSettings, setAllSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminSettings();
      if (data) {
        setAllSettings(data);
        if (data.spinwheel_config) {
          // It might be a JSON string or already parsed object depending on the API
          const parsed = typeof data.spinwheel_config === 'string' 
            ? JSON.parse(data.spinwheel_config) 
            : data.spinwheel_config;
          setConfig(parsed);
        }
      }
    } catch (err: any) {
      console.error("Failed to fetch settings", err);
      toast.error("Failed to load game configuration.");
    } finally {
      setLoading(false);
    }
  };

  const handleModeChange = (mode: string) => {
    setConfig((prev: any) => ({ ...prev, mode }));
  };

  const handleChange = (key: string, value: string | number) => {
    setConfig((prev: any) => ({ ...prev, [key]: Number(value) }));
  };

  const handleMultiplierChange = (key: string, value: string) => {
    setConfig((prev: any) => ({
      ...prev,
      multipliers: {
        ...prev.multipliers,
        [key]: Number(value)
      }
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Send the spinwheel_config back as a JSON string because the DB schema uses it as JSONB,
      // and our API might expect it stringified depending on how updateAdminSettings handles it.
      // But looking at the existing settings page, it just sends the whole object.
      // We will send just the spinwheel_config update.
      const payload = {
        spinwheel_config: JSON.stringify(config)
      };
      await updateAdminSettings(payload);
      toast.success("Game controls saved successfully!");
    } catch (err: any) {
      console.error("Failed to save", err);
      toast.error("Failed to save controls: " + err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-400">Loading game controls...</div>;
  }

  const totalWeight = (config.multipliers?.["1x"] || 0) + (config.multipliers?.["2x"] || 0) + (config.multipliers?.["3x"] || 0);

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Game Controls & Profit Engine</h1>
        <p className="text-gray-400">Manage the Spin Wheel algorithm, multipliers, and house edge.</p>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center gap-3">
          <Settings2 className="w-5 h-5 text-neon-blue" />
          <h2 className="text-xl font-bold text-white">Algorithm Mode</h2>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => handleModeChange("random")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${config.mode === 'random' ? 'border-neon-blue bg-neon-blue/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${config.mode === 'random' ? 'bg-neon-blue shadow-[0_0_10px_rgba(0,243,255,0.8)]' : 'bg-gray-600'}`} />
                <h3 className="font-bold text-white text-lg">Fair Mode (Pure Random)</h3>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                The spin wheel result is purely random based on the multiplier weights. The house does not intervene, leaving profit to statistical variance.
              </p>
            </div>
            
            <div 
              onClick={() => handleModeChange("profit_driven")}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${config.mode === 'profit_driven' ? 'border-neon-magenta bg-neon-magenta/5' : 'border-white/10 hover:border-white/20'}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded-full ${config.mode === 'profit_driven' ? 'bg-neon-magenta shadow-[0_0_10px_rgba(233,64,218,0.8)]' : 'bg-gray-600'}`} />
                <h3 className="font-bold text-white text-lg">Profit Driven (House Mode)</h3>
              </div>
              <p className="text-sm text-gray-400 ml-7">
                The algorithm mathematically evaluates all user bets before spinning and actively prevents outcomes that would breach the target house margin.
              </p>
            </div>
          </div>
        </div>
      </div>

      {config.mode === 'profit_driven' && (
        <div className="glass-panel rounded-2xl border border-neon-magenta/20 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Target className="w-32 h-32 text-neon-magenta" />
          </div>
          <div className="p-6 border-b border-white/5 relative z-10">
            <h2 className="text-xl font-bold text-white flex items-center gap-3">
              <Percent className="w-5 h-5 text-neon-magenta" />
              Target House Margin (RTP Control)
            </h2>
          </div>
          <div className="p-6 relative z-10">
            <div className="max-w-md space-y-4">
              <label className="block text-sm font-semibold text-gray-400">
                Guaranteed House Margin (%)
              </label>
              <div className="flex items-center gap-4">
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={config.target_margin || 20}
                  onChange={(e) => handleChange("target_margin", e.target.value)}
                  className="w-full accent-neon-magenta"
                />
                <div className="bg-white/10 px-4 py-2 rounded-lg font-bold text-white min-w-[80px] text-center border border-white/10">
                  {config.target_margin}%
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Example: At 20%, the algorithm will ensure that the total payout to users is NEVER more than 80% of the total bets placed in that round.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="p-6 border-b border-white/5">
          <h2 className="text-xl font-bold text-white">Multiplier Probabilities (Weights)</h2>
          <p className="text-sm text-gray-400 mt-1">Configure how often the 2x and 3x multipliers appear on the wheel.</p>
        </div>
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10">
              <label className="block text-sm font-bold text-gray-400 mb-4 text-center">1x Multiplier</label>
              <div className="flex items-center justify-center mb-4">
                <span className="text-3xl font-black text-white">{config.multipliers?.["1x"]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={config.multipliers?.["1x"] || 0}
                onChange={(e) => handleMultiplierChange("1x", e.target.value)}
                className="w-full accent-white"
              />
              <div className="text-center mt-2 text-xs text-gray-500 font-bold">
                {((config.multipliers?.["1x"] / totalWeight) * 100).toFixed(1)}% Chance
              </div>
            </div>
            
            <div className="bg-white/5 p-4 rounded-xl border border-neon-blue/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-neon-blue/5 pointer-events-none" />
              <label className="block text-sm font-bold text-neon-blue mb-4 text-center relative z-10">2x Multiplier</label>
              <div className="flex items-center justify-center mb-4 relative z-10">
                <span className="text-3xl font-black text-white">{config.multipliers?.["2x"]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={config.multipliers?.["2x"] || 0}
                onChange={(e) => handleMultiplierChange("2x", e.target.value)}
                className="w-full accent-neon-blue relative z-10"
              />
              <div className="text-center mt-2 text-xs text-neon-blue/70 font-bold relative z-10">
                {((config.multipliers?.["2x"] / totalWeight) * 100).toFixed(1)}% Chance
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-neon-purple/30 relative overflow-hidden">
              <div className="absolute inset-0 bg-neon-purple/5 pointer-events-none" />
              <label className="block text-sm font-bold text-neon-purple mb-4 text-center relative z-10">3x Multiplier</label>
              <div className="flex items-center justify-center mb-4 relative z-10">
                <span className="text-3xl font-black text-white">{config.multipliers?.["3x"]}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={config.multipliers?.["3x"] || 0}
                onChange={(e) => handleMultiplierChange("3x", e.target.value)}
                className="w-full accent-neon-purple relative z-10"
              />
              <div className="text-center mt-2 text-xs text-neon-purple/70 font-bold relative z-10">
                {((config.multipliers?.["3x"] / totalWeight) * 100).toFixed(1)}% Chance
              </div>
            </div>
          </div>
          
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex gap-3">
            <div className="text-amber-500 font-bold">ℹ️ Note:</div>
            <div className="text-amber-500/80 text-sm">
              Weights are relative. If you set them to 80, 15, and 5, the total is 100. The 3x will appear 5 out of 100 times. If you change them to 8, 1, and 1, the total is 10, meaning 3x will appear 1 out of 10 times (10%).
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-4 bg-neon-blue hover:bg-neon-blue/90 text-black font-bold rounded-xl flex items-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all disabled:opacity-50 text-lg"
        >
          {saving ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          {saving ? "Saving Configuration..." : "Save Game Controls"}
        </button>
      </div>
    </div>
  );
}
