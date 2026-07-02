"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, PlayCircle, Coins, Wallet, Users, 
  ArrowRightLeft, BarChart3, Bell, ShieldAlert, Settings,
  LogOut, Hexagon, X, ClipboardList
} from "lucide-react";
import { useRouter } from "next/navigation";

const NAV_ITEMS = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Live Rounds", href: "/admin/rounds", icon: PlayCircle },
  { name: "Bets", href: "/admin/bets", icon: Coins },
  { name: "Wallets", href: "/admin/wallet", icon: Wallet },
  { name: "Users", href: "/admin/users", icon: Users },
  { name: "Transactions", href: "/admin/transactions", icon: ArrowRightLeft },
  { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { name: "Notifications", href: "/admin/notifications", icon: Bell },
  { name: "Admin Controls", href: "/admin/controls", icon: ShieldAlert },
  { name: "Audit Logs", href: "/admin/audit-logs", icon: ClipboardList },
  { name: "Settings", href: "/admin/settings", icon: Settings },
];

export function Sidebar({ onCloseMobile }: { onCloseMobile?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <aside className="w-64 flex flex-col bg-black/80 backdrop-blur-xl border-r border-white/5 h-screen sticky top-0">
      <div className="h-16 flex items-center justify-between px-6 border-b border-white/5 shrink-0">
        <Link href="/" className="flex items-center gap-2 group">
          <Hexagon className="w-8 h-8 text-neon-blue group-hover:text-neon-purple transition-colors drop-shadow-[0_0_8px_var(--color-neon-blue)]" />
          <span className="font-black text-xl tracking-widest text-white">CMD<span className="text-neon-blue">CTR</span></span>
        </Link>
        {onCloseMobile && (
          <button onClick={onCloseMobile} className="md:hidden p-2 -mr-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 ${
                isActive 
                  ? "bg-neon-blue/10 text-neon-blue border border-neon-blue/20 shadow-[inset_0_0_10px_rgba(0,243,255,0.1)]" 
                  : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <item.icon className={`w-5 h-5 ${isActive ? "text-neon-blue" : ""}`} />
              <span className="font-medium text-sm">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5 shrink-0">
        <button 
          onClick={() => {
            localStorage.removeItem("adminToken");
            localStorage.removeItem("adminUser");
            router.push("/admin/login");
          }}
          className="flex items-center gap-3 w-full px-3 py-2 text-gray-400 hover:text-red-400 transition-colors rounded-lg hover:bg-red-500/10"
        >
          <LogOut className="w-5 h-5" />
          <span className="font-medium text-sm">Logout</span>
        </button>
      </div>
    </aside>
  );
}
