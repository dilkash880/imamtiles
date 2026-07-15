"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";

type ProMaxButtonProps = {
  children: ReactNode;
  href?: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost" | "accent";
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  onClick?: () => void;
};

export function ProMaxButton({
  children,
  href,
  className = "",
  variant = "primary",
  type = 'button',
  disabled = false,
  onClick,
}: ProMaxButtonProps) {
  const base =
    "relative inline-flex items-center justify-center overflow-hidden rounded-full px-5 py-3 text-sm font-semibold";

  const variants = {
    primary:
      "bg-slate-950 text-white shadow-lg shadow-slate-900/15 dark:bg-white dark:text-slate-950",
    secondary:
      "border border-slate-300 bg-white/80 text-slate-700 backdrop-blur dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200",
    ghost:
      "bg-white/70 text-slate-700 backdrop-blur dark:bg-slate-900/70 dark:text-slate-200",
    accent:
      "bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/25",
  };

  const classes = `${base} ${variants[variant]} ${className}`.trim();

  if (href) {
    return (
      <motion.a
        href={href}
        whileHover={{ scale: 1.03, y: -2, boxShadow: "0 18px 35px -18px rgba(15, 23, 42, 0.4)" }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
        className={classes}
      >
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.03, y: disabled ? 0 : -2, boxShadow: disabled ? 'none' : '0 18px 35px -18px rgba(15, 23, 42, 0.4)' }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={classes}
    >
      {children}
    </motion.button>
  );
}
