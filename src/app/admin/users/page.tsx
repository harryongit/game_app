"use client";

import { Search, Filter, MoreHorizontal, ShieldCheck, ShieldAlert, Ban } from "lucide-react";

const USERS = [
  { id: "USR-001", name: "CryptoKing99", email: "king@crypto.com", balance: "$12,450.00", kyc: "verified", status: "active" },
  { id: "USR-002", name: "NeonSamurai", email: "neo@cyber.net", balance: "$8,900.50", kyc: "pending", status: "active" },
  { id: "USR-003", name: "HoloTrader", email: "holo@trade.io", balance: "$45,200.00", kyc: "verified", status: "active" },
  { id: "USR-004", name: "BadActor", email: "bad@actor.com", balance: "$0.00", kyc: "rejected", status: "banned" },
  { id: "USR-005", name: "NewPlayerX", email: "new@player.xyz", balance: "$150.00", kyc: "unverified", status: "active" },
];

export default function UsersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight">User Management</h1>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input type="text" placeholder="Search users..." className="pl-9 pr-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm focus:outline-none focus:border-neon-blue/50 text-white w-64" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-black/50 border border-white/10 text-sm text-gray-300 hover:text-white transition-colors">
            <Filter className="w-4 h-4" /> Filters
          </button>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">User ID</th>
                <th className="px-6 py-4">Username / Email</th>
                <th className="px-6 py-4">Wallet Balance</th>
                <th className="px-6 py-4">KYC Status</th>
                <th className="px-6 py-4">Account Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {USERS.map((user) => (
                <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 font-mono text-gray-500">{user.id}</td>
                  <td className="px-6 py-4">
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-xs text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 font-mono text-neon-blue group-hover:drop-shadow-[0_0_5px_var(--color-neon-blue)] transition-all">{user.balance}</td>
                  <td className="px-6 py-4">
                    {user.kyc === 'verified' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-neon-emerald/10 text-neon-emerald border border-neon-emerald/20"><ShieldCheck className="w-3 h-3" /> Verified</span>}
                    {user.kyc === 'pending' && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-500/10 text-yellow-500 border border-yellow-500/20"><ShieldAlert className="w-3 h-3" /> Pending</span>}
                    {(user.kyc === 'rejected' || user.kyc === 'unverified') && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-500/10 text-gray-400 border border-gray-500/20">Unverified</span>}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-bold ${user.status === 'active' ? 'text-neon-emerald' : 'text-red-500 bg-red-500/10'}`}>
                      {user.status === 'active' ? (
                        <><span className="w-1.5 h-1.5 rounded-full bg-neon-emerald mr-1.5" /> Active</>
                      ) : (
                        <><Ban className="w-3 h-3 mr-1.5" /> Banned</>
                      )}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 text-gray-500 hover:text-white transition-colors"><MoreHorizontal className="w-5 h-5" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
