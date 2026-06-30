"use client";

import { motion } from "framer-motion";
import { MessageCircle, Globe, Code } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative bg-[#020202] pt-24 pb-12 overflow-hidden border-t border-white/5">
      {/* Cyber Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16 gap-8 text-center md:text-left">
          <div className="max-w-md">
            <h2 className="text-4xl font-black tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-neon-blue to-neon-purple drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
              ProfitKing
            </h2>
            <p className="text-gray-400">
              The ultimate next-generation gaming and betting platform. Provably fair, lightning fast, and ultra-secure.
            </p>
          </div>
          
          <div className="flex gap-4">
            {[Globe, MessageCircle, Code].map((Icon, i) => (
              <motion.a
                key={i}
                href="#"
                whileHover={{ scale: 1.1, y: -2 }}
                className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:text-white hover:border-neon-blue transition-colors hover:shadow-[0_0_15px_rgba(0,243,255,0.3)]"
              >
                <Icon className="w-5 h-5" />
              </motion.a>
            ))}
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>© 2026 ProfitKing Inc. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Provably Fair</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
