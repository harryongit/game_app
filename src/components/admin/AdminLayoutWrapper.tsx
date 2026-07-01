"use client";

import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Navbar } from "./Navbar";

export function AdminLayoutWrapper({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] flex">
      {/* Background Grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar with mobile toggle classes */}
      <div className={`fixed inset-y-0 left-0 z-50 md:sticky md:top-0 transition-transform duration-300 transform ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}>
        <Sidebar onCloseMobile={() => setIsMobileMenuOpen(false)} />
      </div>

      <div className="flex-1 flex flex-col min-w-0 relative z-10 w-full overflow-hidden">
        <Navbar onMenuClick={() => setIsMobileMenuOpen(true)} />
        <main className="flex-1 p-4 md:p-6 overflow-x-hidden w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
