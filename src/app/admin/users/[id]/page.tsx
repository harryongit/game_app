"use client";

import { useState, useEffect, use, useMemo } from "react";
import { fetchAdminUserDetail, blockAdminUser, setAdminUserLimit, addAdminUserBalance } from "@/lib/api";
import { ArrowLeft, User, Phone, Mail, Building2, MapPin, Contact, Calendar, Wallet, Search, ShieldAlert, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function UserDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // For Contacts
  const [contactSearch, setContactSearch] = useState("");
  const [visibleContacts, setVisibleContacts] = useState(50);
  
  // Admin Action States
  const [limitInput, setLimitInput] = useState<string>("");
  const [balanceInput, setBalanceInput] = useState<string>("");
  const [isBlocking, setIsBlocking] = useState(false);
  const [isSavingLimit, setIsSavingLimit] = useState(false);
  const [isSavingBalance, setIsSavingBalance] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

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
        toast.error("Failed to load user details: " + err.message);
        setLoading(false);
      });
  }, [resolvedParams.id]);

  // Set initial limit when user loads
  useEffect(() => {
    if (user && limitInput === "") {
      setLimitInput(user.limit?.toString() || "0");
    }
  }, [user]);

  useEffect(() => {
    const loc = user?.mobile_data?.location;
    if (loc && loc.lat && loc.lng && !address) {
      fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${loc.lat}&lon=${loc.lng}`)
        .then(res => res.json())
        .then(data => {
          if (data && data.display_name) {
            setAddress(data.display_name);
          }
        })
        .catch(err => console.error("Geocoding failed", err));
    }
  }, [user, address]);

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
        {/* Admin Actions */}
        <div className="glass-panel p-6 rounded-xl space-y-4 md:col-span-2 border border-red-500/20 bg-red-500/5">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-red-500" /> Admin Management Actions
          </h3>
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <div className="flex-1">
              <p className="text-sm text-gray-400 mb-2">Block or unblock this user account immediately.</p>
              <button 
                disabled={isBlocking}
                onClick={async () => {
                  try {
                    setIsBlocking(true);
                    const newStatus = !user.is_blocked;
                    await blockAdminUser(user.id, newStatus);
                    setUser({ ...user, is_blocked: newStatus });
                    toast.success(`User successfully ${newStatus ? 'blocked' : 'unblocked'}.`);
                  } catch(e: any) {
                    toast.error("Failed to block/unblock user: " + e.message);
                  } finally {
                    setIsBlocking(false);
                  }
                }}
                className={`px-6 py-2.5 rounded-lg font-bold transition-all flex items-center gap-2 ${user.is_blocked ? 'bg-red-500 text-white shadow-[0_0_15px_rgba(239,68,68,0.4)]' : 'bg-white/10 hover:bg-red-500/20 hover:text-red-500 text-white'} disabled:opacity-50`}
              >
                {isBlocking && <Loader2 className="w-4 h-4 animate-spin" />}
                {user.is_blocked ? "ACCOUNT BLOCKED (Click to Unblock)" : "BLOCK ACCOUNT"}
              </button>
            </div>
            <div className="flex-1 w-full sm:w-auto">
               <p className="text-sm text-gray-400 mb-2">Update User Custom Limit</p>
               <div className="flex gap-2">
                 <input 
                   type="number" 
                   value={limitInput}
                   onChange={(e) => setLimitInput(e.target.value)}
                   className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white flex-1"
                   placeholder="Enter new limit"
                 />
                 <button 
                   disabled={isSavingLimit}
                   onClick={async () => {
                     const val = parseInt(limitInput);
                     if (isNaN(val) || val < 0) return toast.error("Enter a valid positive limit.");
                     try {
                       setIsSavingLimit(true);
                       await setAdminUserLimit(user.id, val);
                       setUser({ ...user, limit: val });
                       toast.success("User limit updated successfully.");
                     } catch(e: any) {
                       toast.error("Failed to update limit: " + e.message);
                     } finally {
                       setIsSavingLimit(false);
                     }
                   }}
                   className="px-4 py-2 bg-neon-blue/20 text-neon-blue font-bold rounded-lg hover:bg-neon-blue/30 transition-colors flex items-center gap-2 disabled:opacity-50"
                 >
                   {isSavingLimit && <Loader2 className="w-4 h-4 animate-spin" />}
                   Save Limit
                 </button>
               </div>
            </div>
          </div>
          
          <div className="mt-6 pt-6 border-t border-red-500/10">
            <p className="text-sm text-gray-400 mb-2">Manually Add or Deduct Balance</p>
            <div className="flex flex-col sm:flex-row gap-2 max-w-md">
              <input 
                type="number" 
                value={balanceInput}
                onChange={(e) => setBalanceInput(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white flex-1"
                placeholder="Amount (e.g. 500 or -500)"
              />
              <button 
                disabled={isSavingBalance}
                onClick={async () => {
                  const amt = parseInt(balanceInput);
                  if (isNaN(amt) || amt === 0) return toast.error("Enter a valid non-zero amount.");
                  
                  try {
                    setIsSavingBalance(true);
                    await addAdminUserBalance(user.id, amt);
                    setUser({ ...user, balance_cached: (user.balance_cached || 0) + amt });
                    setBalanceInput("");
                    toast.success(`Successfully ${amt > 0 ? 'added' : 'deducted'} ₹${Math.abs(amt)}.`);
                  } catch(e: any) {
                    toast.error("Failed to update balance: " + e.message);
                  } finally {
                    setIsSavingBalance(false);
                  }
                }}
                className="px-6 py-2 bg-neon-emerald/20 text-neon-emerald font-bold rounded-lg hover:bg-neon-emerald/30 transition-colors whitespace-nowrap flex items-center gap-2 disabled:opacity-50"
              >
                {isSavingBalance && <Loader2 className="w-4 h-4 animate-spin" />}
                Apply Balance
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-2">Note: This will automatically record a deposit/withdrawal in the system ledger for auditability.</p>
          </div>
        </div>

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
              <span className="text-neon-blue font-bold text-lg">₹{user.balance_cached}</span>
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
                <span className="text-white font-mono">{user.mobile_data.location.lat ?? user.mobile_data.location.latitude}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Longitude</span>
                <span className="text-white font-mono">{user.mobile_data.location.lng ?? user.mobile_data.location.longitude}</span>
              </div>
              <div className="flex justify-between border-b border-white/5 pb-2">
                <span className="text-gray-400">Place (Address)</span>
                <span className="text-white text-right max-w-[60%]">{address ? address : <span className="text-gray-500 animate-pulse">Calculating...</span>}</span>
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
