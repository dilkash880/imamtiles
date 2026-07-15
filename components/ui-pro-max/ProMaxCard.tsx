"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type ProMaxCardProps = {
  children: ReactNode;
  className?: string;
};

export function ProMaxCard({ children, className = "" }: ProMaxCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.01, boxShadow: "0 28px 65px -30px rgba(15, 23, 42, 0.4)" }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-[1.6rem] border border-white/70 bg-white/80 p-6 shadow-[0_20px_60px_-25px_rgba(15,23,42,0.35)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
