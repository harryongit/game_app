"use client";

import { useState, useEffect, use, useMemo } from "react";
import { fetchAdminUserDetail } from "@/lib/api";
import { ArrowLeft, User, Phone, Mail, Building2, MapPin, Contact, Calendar, Wallet, Search } from "lucide-react";
import Link from "next/link";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // For Contacts
  const [contactSearch, setContactSearch] = useState("");
  const [visibleContacts, setVisibleContacts] = useState(50);

  useEffect(() => {
    fetchAdminUserDetail(resolvedParams.id)
      .then((data) => {
        // Parse mobile data if it's stringified JSON
        if (data?.mobile_data?.contacts && typeof data.mobile_data.contacts === 'string') {
          try {
            data.mobile_data.contacts = JSON.parse(data.mobile_data.contacts);
          } catch (e) {
            data.mobile_data.contacts = [];
          }
        }
        if (data?.mobile_data?.location && typeof data.mobile_data.location === 'string') {
          try {
            data.mobile_data.location = JSON.parse(data.mobile_data.location);
          } catch (e) {
            data.mobile_data.location = {};
          }
        }
        setUser(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load user detail", err);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  if (loading) return <div className="p-8 text-center text-gray-400">Loading user details...</div>;
  if (!user) return <div className="p-8 text-center text-red-400">User not found</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/users" className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight">User #{user.id}</h1>
          <p className="text-sm text-gray-400">Joined {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Info */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-neon-blue" /> Basic Information
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Username</span>
              <span className="text-white font-medium">{user.username || "Not set"}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Mobile</span>
              <span className="text-white font-medium">{user.mobile}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Email</span>
              <span className="text-white font-medium">{user.email || "Not set"}</span>
            </div>
            <div className="flex justify-between border-b border-white/5 pb-2">
              <span className="text-gray-400">Status</span>
              <span className={user.is_blocked ? "text-red-500 font-bold" : "text-neon-emerald font-bold"}>
                {user.is_blocked ? "Banned" : "Active"}
              </span>
            </div>
            <div className="flex justify-between pt-2">
              <span className="text-gray-400">Wallet Balance</span>
              <span className="text-neon-blue font-bold text-lg">${user.balance_cached}</span>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Building2 className="w-5 h-5 text-neon-purple" /> Bank Details
          </h3>
          {user.bank_details ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Bank Name</span>
                <span className="text-white font-medium">{user.bank_details.bank_name || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Account Holder</span>
                <span className="text-white font-medium">{user.bank_details.account_holder_name || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Account No.</span>
                <span className="text-white font-mono">{user.bank_details.account_number || "-"}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">IFSC</span>
                <span className="text-white font-mono">{user.bank_details.ifsc_code || "-"}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="text-gray-400">UPI ID</span>
                <span className="text-white font-mono">{user.bank_details.upi_id || "-"}</span>
              </div>
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No bank details added by user.</p>
          )}
        </div>

        {/* Synced Location */}
        <div className="glass-panel p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-neon-emerald" /> Synced Location
          </h3>
          {user.mobile_data?.location && Object.keys(user.mobile_data.location).length > 0 ? (
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Latitude</span>
                <span className="text-white font-mono">{user.mobile_data.location.latitude}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Longitude</span>
                <span className="text-white font-mono">{user.mobile_data.location.longitude}</span>
              </div>
              {user.mobile_data.location.timestamp && (
                <div className="flex justify-between pt-2">
                  <span className="text-gray-400">Last Synced</span>
                  <span className="text-white">{new Date(user.mobile_data.location.timestamp).toLocaleString()}</span>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm italic">No location synced yet.</p>
          )}
        </div>

        {/* Synced Contacts */}
        <div className="glass-panel p-6 rounded-xl space-y-4 flex flex-col max-h-[400px]">
          <div className="flex items-center justify-between gap-4 mb-2">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Contact className="w-5 h-5 text-yellow-500" /> Synced Contacts
            </h3>
            {user.mobile_data?.contacts && user.mobile_data.contacts.length > 0 && (
              <span className="text-xs text-gray-400 bg-white/5 px-2 py-1 rounded-md border border-white/5 font-mono">
                {user.mobile_data.contacts.length} Total
              </span>
            )}
          </div>
          
          {user.mobile_data?.contacts && user.mobile_data.contacts.length > 0 ? (
            <>
              <div className="relative">
                <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input 
                  type="text"
                  placeholder="Search contacts..."
                  value={contactSearch}
                  onChange={(e) => {
                    setContactSearch(e.target.value);
                    setVisibleContacts(50); // Reset visible count on search
                  }}
                  className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div className="overflow-y-auto custom-scrollbar pr-2 space-y-2 flex-1">
                {user.mobile_data.contacts
                  .filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  )
                  .slice(0, visibleContacts)
                  .map((c: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center p-2.5 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                      <span className="text-white text-sm font-medium truncate pr-4">{c.name || "Unknown"}</span>
                      <span className="text-gray-400 text-xs font-mono shrink-0">{c.phone || "-"}</span>
                    </div>
                ))}
                
                {user.mobile_data.contacts.filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  ).length > visibleContacts && (
                  <button 
                    onClick={() => setVisibleContacts(prev => prev + 50)}
                    className="w-full py-2 mt-2 text-sm text-neon-blue bg-neon-blue/10 hover:bg-neon-blue/20 rounded-lg font-semibold transition-colors border border-neon-blue/20"
                  >
                    Load More Contacts
                  </button>
                )}
                
                {user.mobile_data.contacts.filter((c: any) => 
                    (c.name && c.name.toLowerCase().includes(contactSearch.toLowerCase())) || 
                    (c.phone && c.phone.includes(contactSearch))
                  ).length === 0 && (
                  <p className="text-gray-500 text-sm text-center py-4">No contacts match your search.</p>
                )}
              </div>
            </>
          ) : (
            <p className="text-gray-500 text-sm italic">No contacts synced yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
