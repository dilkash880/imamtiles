"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type ProMaxPanelProps = {
  children: ReactNode;
  className?: string;
};

export function ProMaxPanel({ children, className = "" }: ProMaxPanelProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      whileHover={{ y: -4, scale: 1.005 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className={`rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_22px_70px_-28px_rgba(15,23,42,0.38)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/70 sm:p-8 ${className}`.trim()}
    >
      {children}
    </motion.div>
  );
}
