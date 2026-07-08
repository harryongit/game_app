import type { Metadata } from "next";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "BoomMine | ProfitKing — Mines Game",
  description: "Navigate the minefield. Reveal gems, multiply your winnings, and cash out before hitting a bomb.",
};

export default function BoomMineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050505]">
      {/* Background grid */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
      {/* Ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-red-600/5 blur-[120px] pointer-events-none" />
      <Toaster position="top-right" theme="dark" richColors />
      <div className="relative z-10 p-4 md:p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}
