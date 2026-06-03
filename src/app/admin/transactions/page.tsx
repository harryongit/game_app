"use client";

import { useState } from "react";
import { ArrowUpRight, ArrowDownLeft, Search, Filter, RefreshCw, CheckCircle, XCircle } from "lucide-react";

const MOCK_TX = Array.from({ length: 15 }).map((_, i) => ({
  id: `TX-${9000 + i}`,
  user: ["AmanD", "RohanK", "ZaraS", "Neha22", "Karan_007"][Math.floor(Math.random() * 5)],
  type: ["deposit", "withdrawal"][Math.floor(Math.random() * 2)],
  method: ["UPI", "Bitcoin", "Ethereum", "Bank Transfer", "USDT"][Math.floor(Math.random() * 5)],
  amount: Math.floor(Math.random() * 100000 + 1000),
  status: ["completed", "pending", "failed"][Math.floor(Math.random() * 3)],
  date: new Date(Date.now() - Math.random() * 86400000 * 2).toLocaleDateString(),
}));

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  const filteredTx = MOCK_TX.filter(tx => {
    const matchesSearch = tx.user.toLowerCase().includes(searchTerm.toLowerCase()) || tx.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === "all" || tx.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">Transactions</h1>
          <p className="text-gray-400">Manage user deposits and withdrawal requests.</p>
        </div>
        <div className="flex gap-3">
          <button className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-medium flex items-center gap-2 transition-colors">
            <RefreshCw className="w-4 h-4" /> Export CSV
          </button>
        </div>
      </div>

      <div className="glass-panel p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input 
            type="text"
            placeholder="Search TX ID or User..."
            className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-10 pr-4 text-white focus:outline-none focus:border-neon-blue/50 transition-colors"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {["all", "deposit", "withdrawal"].map((type) => (
            <button
              key={type}
              onClick={() => setTypeFilter(type)}
              className={`px-4 py-2.5 rounded-xl text-sm font-semibold capitalize transition-colors ${
                typeFilter === type 
                  ? "bg-white/10 text-white border border-white/20" 
                  : "bg-transparent text-gray-400 border border-transparent hover:bg-white/5"
              }`}
            >
              {type}s
            </button>
          ))}
        </div>
      </div>

      <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="p-4 text-sm font-semibold text-gray-400">Type</th>
                <th className="p-4 text-sm font-semibold text-gray-400">TX ID</th>
                <th className="p-4 text-sm font-semibold text-gray-400">User</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Amount</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Method</th>
                <th className="p-4 text-sm font-semibold text-gray-400">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-400 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTx.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-4">
                    {tx.type === "deposit" ? (
                      <div className="flex items-center gap-2 text-neon-emerald">
                        <div className="w-8 h-8 rounded-full bg-neon-emerald/10 flex items-center justify-center">
                          <ArrowDownLeft className="w-4 h-4" />
                        </div>
                        <span className="font-semibold capitalize">Deposit</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 text-neon-purple">
                        <div className="w-8 h-8 rounded-full bg-neon-purple/10 flex items-center justify-center">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                        <span className="font-semibold capitalize">Withdrawal</span>
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-mono text-sm text-gray-400">{tx.id}</td>
                  <td className="p-4 font-medium text-white">{tx.user}</td>
                  <td className="p-4 font-bold text-white">₹{tx.amount.toLocaleString()}</td>
                  <td className="p-4 text-gray-300">{tx.method}</td>
                  <td className="p-4">
                    {tx.status === "completed" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neon-emerald/10 text-neon-emerald text-xs font-bold border border-neon-emerald/20"><CheckCircle className="w-3 h-3" /> Done</span>}
                    {tx.status === "failed" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20"><XCircle className="w-3 h-3" /> Failed</span>}
                    {tx.status === "pending" && <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-yellow-500/10 text-yellow-500 text-xs font-bold border border-yellow-500/20"><RefreshCw className="w-3 h-3 animate-spin" /> Pending</span>}
                  </td>
                  <td className="p-4 text-right">
                    {tx.status === "pending" && tx.type === "withdrawal" ? (
                      <div className="flex justify-end gap-2">
                        <button className="p-2 bg-neon-emerald/10 hover:bg-neon-emerald/20 text-neon-emerald rounded-lg transition-colors border border-neon-emerald/20">
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-lg transition-colors border border-red-500/20">
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm">{tx.date}</span>
                    )}
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
