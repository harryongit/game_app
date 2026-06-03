"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function AnimatedCounter({ end, prefix = "", suffix = "", duration = 2 }: { end: number, prefix?: string, suffix?: string, duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      let animationFrame: number;

      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = (timestamp - startTime) / (duration * 1000);

        if (progress < 1) {
          setCount(Math.floor(end * progress));
          animationFrame = requestAnimationFrame(animate);
        } else {
          setCount(end);
        }
      };

      animationFrame = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(animationFrame);
    }
  }, [end, duration, isInView]);

  return <span ref={ref}>{prefix}{count.toLocaleString()}{suffix}</span>;
}

export function Stats() {
  return (
    <section className="py-24 border-y border-white/5 relative overflow-hidden">
      {/* Glow lines */}
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-purple to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-neon-blue to-transparent opacity-50" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 text-center">
          <div>
            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              <AnimatedCounter end={150} suffix="M+" />
            </div>
            <div className="text-sm font-semibold text-neon-blue uppercase tracking-widest">Spins Played</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              <AnimatedCounter end={45} suffix="K+" />
            </div>
            <div className="text-sm font-semibold text-neon-purple uppercase tracking-widest">Daily Players</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              <AnimatedCounter end={3500} suffix="/s" />
            </div>
            <div className="text-sm font-semibold text-neon-magenta uppercase tracking-widest">Prizes Claimed</div>
          </div>
          <div>
            <div className="text-4xl md:text-5xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] mb-2">
              <AnimatedCounter end={99} suffix=".99%" />
            </div>
            <div className="text-sm font-semibold text-neon-emerald uppercase tracking-widest">Uptime</div>
          </div>
        </div>
      </div>
    </section>
  );
}
