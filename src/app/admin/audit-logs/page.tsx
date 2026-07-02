"use client";

import { useEffect, useState } from "react";
import { fetchAdminAuditLogs } from "@/lib/api";
import { Loader2, ClipboardList, Clock, User, Info } from "lucide-react";
import { format } from "date-fns";

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      const data = await fetchAdminAuditLogs();
      setLogs(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <ClipboardList className="w-8 h-8 text-neon-blue" />
            Audit Logs
          </h1>
          <p className="text-gray-400 mt-1">Detailed history of admin actions</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
          <h2 className="font-medium text-white flex items-center gap-2">
            <Info className="w-4 h-4 text-gray-400" />
            Recent Activity
          </h2>
          <span className="text-xs font-medium px-2.5 py-1 bg-white/10 text-gray-300 rounded-full">
            Top 100
          </span>
        </div>
        
        {loading ? (
          <div className="p-12 flex justify-center">
            <Loader2 className="w-8 h-8 text-neon-blue animate-spin" />
          </div>
        ) : error ? (
          <div className="p-12 text-center text-red-400">
            {error}
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            No audit logs found.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-300">
              <thead className="text-xs text-gray-400 uppercase bg-black/40 border-b border-white/10">
                <tr>
                  <th className="px-6 py-4">ID</th>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Action</th>
                  <th className="px-6 py-4">Details</th>
                  <th className="px-6 py-4 text-right">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs text-gray-500">#{log.id}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-neon-purple" />
                        <span className="font-medium text-white">{log.admin_username}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 rounded-md text-xs font-medium bg-neon-blue/10 text-neon-blue border border-neon-blue/20">
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <pre className="text-[10px] font-mono text-gray-400 bg-black/40 p-2 rounded-lg max-w-xs overflow-x-auto">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5 text-gray-400">
                        <Clock className="w-3.5 h-3.5" />
                        {format(new Date(log.created_at), "dd MMM yyyy, hh:mm a")}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
