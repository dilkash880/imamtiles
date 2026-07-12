"use client";

import { motion } from "motion/react";

type FeatureItem = {
  title: string;
  description: string;
  icon: string;
};

type ProMaxFeatureGridProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  items: FeatureItem[];
  className?: string;
};

export function ProMaxFeatureGrid({
  eyebrow,
  title,
  description,
  items,
  className = "",
}: ProMaxFeatureGridProps) {
  return (
    <div className={className.trim()}>
      {(eyebrow || title || description) && (
        <div className="max-w-2xl">
          {eyebrow && (
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">
              {eyebrow}
            </p>
          )}
          {title && (
            <h3 className="mt-3 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl dark:text-white">
              {title}
            </h3>
          )}
          {description && <p className="mt-3 text-base leading-8 text-slate-600 dark:text-slate-300">{description}</p>}
        </div>
      )}

      <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {items.map((item, index) => (
          <motion.article
            key={item.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.06 }}
            whileHover={{ y: -6, scale: 1.01 }}
            className="group rounded-[1.4rem] border border-white/70 bg-white/75 p-5 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.35)] backdrop-blur dark:border-white/10 dark:bg-slate-900/70"
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/15 via-violet-500/10 to-cyan-400/20 text-xl shadow-inner">
              {item.icon}
            </div>
            <h4 className="mt-4 text-lg font-semibold text-slate-950 dark:text-white">{item.title}</h4>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
          </motion.article>
        ))}
      </div>
    </div>
  );
}
