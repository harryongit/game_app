"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Hexagon, Lock, User, AlertCircle } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Simulate slight delay for effect
    await new Promise((resolve) => setTimeout(resolve, 500));

    if (username === "admin" && password === "admin") {
      // Set cookie (valid for 1 day)
      document.cookie = "admin_session=true; path=/; max-age=86400; SameSite=Strict";
      router.push("/admin");
    } else {
      setError("Invalid username or password.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Ambient Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-neon-blue/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-neon-purple/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10">
        <div className="glass-panel p-8 rounded-2xl border border-white/5 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex flex-col items-center justify-center mb-8">
            <Hexagon className="w-16 h-16 text-neon-blue mb-4 drop-shadow-[0_0_15px_var(--color-neon-blue)]" />
            <h1 className="text-3xl font-black text-white tracking-widest text-center">
              CMD<span className="text-neon-blue">CTR</span>
            </h1>
            <p className="text-gray-400 mt-2 text-sm text-center">Secure Admin Portal Authentication</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm font-medium">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider pl-1">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-purple/50 focus:ring-1 focus:ring-neon-purple/50 transition-all"
                  placeholder="Enter password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-gradient-to-r from-neon-blue to-neon-purple text-white rounded-xl font-bold tracking-wide hover:opacity-90 transition-opacity flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,243,255,0.3)] mt-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                "ACCESS TERMINAL"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
