"use client";

import { motion } from "motion/react";

type ProMaxStatProps = {
  value: string;
  label: string;
};

export function ProMaxStat({ value, label }: ProMaxStatProps) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="rounded-[1.35rem] border border-white/70 bg-white/75 p-5 shadow-[0_20px_50px_-28px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
    >
      <p className="text-3xl font-semibold text-slate-950 dark:text-white">{value}</p>
      <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{label}</p>
    </motion.div>
  );
}
