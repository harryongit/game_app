"use client";

import { Download } from "lucide-react";
import { motion } from "framer-motion";

const DOWNLOAD_URL =
  "https://github.com/harryongit/game_app/releases/latest/download/realspinpro.apk";

type Props = {
  className?: string;
  size?: "md" | "lg";
  label?: string;
};

export function DownloadButton({
  className = "",
  size = "md",
  label = "Download Android App",
}: Props) {
  const padding = size === "lg" ? "px-8 py-4 text-base" : "px-6 py-3 text-sm";
  return (
    <motion.a
      href={DOWNLOAD_URL}
      whileHover={{ scale: 1.04 }}
      whileTap={{ scale: 0.96 }}
      className={`purple-button inline-flex items-center justify-center gap-2 cursor-pointer ${padding} ${className}`}
    >
      <Download className="w-5 h-5" />
      <span>{label}</span>
    </motion.a>
  );
}
