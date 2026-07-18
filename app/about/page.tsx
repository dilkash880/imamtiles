'use client';

import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxCard, ProMaxPanel } from "@/components/ui-pro-max";

const highlights = [
  "Luxury tile sourcing for homes, villas, offices, and hospitality projects",
  "End-to-end consultation for surface selection, sizing, and finish matching",
  "Reliable delivery support with direct communication for pricing and availability",
];

export default function AboutPage() {
  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ProMaxPanel>
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">About Imam Marble & Tiles</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                A trusted partner for elegant surfaces and lasting quality.
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Imam Marble & Tiles brings together premium tile design, sanitary ware excellence, and personalized service for clients who value sophistication and craftsmanship.
              </p>
            </div>
            <img
              src="https://images.unsplash.com/photo-1698889670683-a40e1be44e46?auto=format&fit=crop&w=1200&q=80"
              alt="Marble and tile slabs displayed in our showroom and stone yard"
              className="h-[320px] w-full rounded-[1.5rem] object-cover"
            />
          </div>
        </ProMaxPanel>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <ProMaxPanel className="bg-gradient-to-br from-indigo-500/10 via-white/70 to-cyan-400/10 dark:bg-gradient-to-br dark:from-indigo-500/15 dark:via-slate-900/60 dark:to-cyan-400/10">
          <SectionHeading
            eyebrow="Our promise"
            title="Built around detail, trust, and premium execution"
            description="Every selection is curated to suit your lifestyle, project scale, and design vision."
          />
          <div className="mt-6 space-y-4">
            {highlights.map((item) => (
              <div key={item} className="rounded-2xl border border-white/70 bg-white/70 px-4 py-3 text-sm leading-7 text-slate-600 backdrop-blur dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-300">
                {item}
              </div>
            ))}
          </div>
        </ProMaxPanel>
        <ProMaxCard>
          <img
            src="https://images.unsplash.com/photo-1701251786408-d0320ecaad8d?auto=format&fit=crop&w=1200&q=80"
            alt="Luxury bathroom finished with premium marble walls and flooring"
            className="h-72 w-full rounded-[1.4rem] object-cover"
          />
          <p className="mt-5 text-lg leading-8 text-slate-600 dark:text-slate-300">
            Whether you are building a new home or upgrading a commercial space, our team helps you choose materials that feel elevated and last beautifully over time.
          </p>
        </ProMaxCard>
      </section>
    </div>
  );
}
