"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Animation style */
  variant?: "up" | "fade" | "scale" | "left" | "right";
  /** Stagger direct children instead of animating the wrapper as one */
  stagger?: boolean;
  delay?: number;
  duration?: number;
  start?: string;
};

const FROM = {
  up: { opacity: 0, y: 60 },
  fade: { opacity: 0 },
  scale: { opacity: 0, scale: 0.92 },
  left: { opacity: 0, x: -60 },
  right: { opacity: 0, x: 60 },
};

export function Reveal({
  children,
  className,
  variant = "up",
  stagger = false,
  delay = 0,
  duration = 0.9,
  start = "top 85%",
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const targets = stagger ? Array.from(el.children) : el;

      gsap.from(targets, {
        ...FROM[variant],
        duration,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start,
          toggleActions: "play none none reverse",
        },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
