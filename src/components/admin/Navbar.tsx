"use client";

import { Bell, Search, Activity, User, Menu } from "lucide-react";

export function Navbar({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 bg-black/80 backdrop-blur-xl border-b border-white/5 sticky top-0 z-30">
      <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto">
        {onMenuClick && (
          <button 
            onClick={onMenuClick}
            className="md:hidden p-2 -ml-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}
        <div className="relative flex-1 md:flex-none">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-9 pr-4 py-1.5 w-full md:w-96 rounded-full bg-white/5 border border-white/10 text-sm focus:outline-none focus:border-neon-blue/50 focus:ring-1 focus:ring-neon-blue/50 transition-all text-white placeholder-gray-500"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* System Status Indicators */}
        <div className="hidden md:flex items-center gap-4 mr-4 px-4 py-1 rounded-full border border-white/10 bg-white/5">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Activity className="w-3 h-3 text-neon-emerald" /> API
          </div>
          <div className="w-px h-3 bg-white/20" />
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <span className="w-2 h-2 rounded-full bg-neon-blue animate-pulse" /> WSS
          </div>
        </div>

        <button className="relative p-2 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neon-purple rounded-full shadow-[0_0_5px_var(--color-neon-purple)]" />
        </button>
        
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-neon-blue to-neon-purple flex items-center justify-center border-2 border-black cursor-pointer">
          <User className="w-4 h-4 text-white" />
        </div>
      </div>
    </header>
  );
}
