"use client";

import { ArrowUpRight, ArrowDownRight, Wallet } from "lucide-react";

const LEDGER = [
  { id: "TX-9981", user: "CryptoKing99", type: "deposit", method: "Bitcoin (BTC)", amount: "+ $5,000.00", date: "2026-05-22 14:32:10" },
  { id: "TX-9980", user: "NeonSamurai", type: "withdrawal", method: "Ethereum (ETH)", amount: "- $1,200.00", date: "2026-05-22 14:15:00" },
  { id: "TX-9979", user: "HoloTrader", type: "deposit", method: "USDT (TRC20)", amount: "+ $10,000.00", date: "2026-05-22 13:45:22" },
  { id: "TX-9978", user: "Anon8472", type: "withdrawal", method: "Solana (SOL)", amount: "- $450.00", date: "2026-05-22 13:10:05" },
];

export default function WalletPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-3">
          <Wallet className="w-6 h-6 text-neon-emerald drop-shadow-[0_0_8px_var(--color-neon-emerald)]" />
          Treasury & Wallets
        </h1>
        <button className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-sm text-white hover:bg-white/10 transition-colors">
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-6 rounded-xl glass-panel border-t border-neon-emerald/50">
          <p className="text-sm text-gray-400 mb-1">Total System Liquidity</p>
          <h3 className="text-3xl font-black text-white">$1,245,000.00</h3>
        </div>
        <div className="p-6 rounded-xl glass-panel border-t border-neon-blue/50">
          <p className="text-sm text-gray-400 mb-1">24h Deposits</p>
          <h3 className="text-3xl font-black text-white text-neon-blue">+$45,200.00</h3>
        </div>
        <div className="p-6 rounded-xl glass-panel border-t border-neon-magenta/50">
          <p className="text-sm text-gray-400 mb-1">24h Withdrawals</p>
          <h3 className="text-3xl font-black text-white text-neon-magenta">-$12,850.00</h3>
        </div>
      </div>

      <div className="glass-panel rounded-xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">Ledger Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-white/5 border-b border-white/10 text-gray-300 uppercase font-semibold text-xs">
              <tr>
                <th className="px-6 py-4">TXID</th>
                <th className="px-6 py-4">User</th>
                <th className="px-6 py-4">Type</th>
                <th className="px-6 py-4">Method</th>
                <th className="px-6 py-4 text-right">Amount</th>
                <th className="px-6 py-4 text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {LEDGER.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 font-mono text-gray-500">{tx.id}</td>
                  <td className="px-6 py-4 font-medium text-white">{tx.user}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {tx.type === 'deposit' ? <ArrowDownRight className="w-4 h-4 text-neon-emerald" /> : <ArrowUpRight className="w-4 h-4 text-neon-magenta" />}
                      <span className="capitalize">{tx.type}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{tx.method}</td>
                  <td className={`px-6 py-4 text-right font-mono font-bold ${tx.type === 'deposit' ? 'text-neon-emerald' : 'text-neon-magenta'}`}>
                    {tx.amount}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-500">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
