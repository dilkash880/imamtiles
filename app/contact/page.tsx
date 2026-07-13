'use client';

import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxButton, ProMaxCard, ProMaxPanel } from "@/components/ui-pro-max";

export default function ContactPage() {
  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ProMaxPanel>
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">Contact us</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                Visit our showroom or connect directly for a quick quote.
              </h1>
              <ProMaxCard className="mt-6 space-y-4 p-5 text-sm text-slate-600 dark:text-slate-300">
                <p><span className="font-semibold text-slate-950 dark:text-white">Phone:</span> +91 7996078576</p>
                <p><span className="font-semibold text-slate-950 dark:text-white">Location:</span> Vill - Kairibirpur</p>
                <p><span className="font-semibold text-slate-950 dark:text-white">Working Hours:</span> Mon-Sat • 9:30 AM to 7:30 PM</p>
                <div className="flex flex-wrap gap-3 pt-2">
                  <ProMaxButton href="tel:+917996078576" variant="primary">Call Now</ProMaxButton>
                  <ProMaxButton href="https://wa.me/917996078576" variant="accent">WhatsApp</ProMaxButton>
                  <ProMaxButton href="https://www.google.com/maps/search/?api=1&query=Vill+-+Kairibirpur" variant="secondary">Get Directions</ProMaxButton>
                </div>
              </ProMaxCard>
            </div>

            <div className="rounded-[1.6rem] border border-slate-200/70 bg-slate-50/70 p-4 dark:border-white/10 dark:bg-slate-800/70">
              <iframe
                title="Imam Marble & Tiles location"
                src="https://www.google.com/maps?q=Vill%20-%20Kairibirpur&output=embed"
                className="h-72 w-full rounded-[1.1rem] border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        </ProMaxPanel>
      </motion.section>

      <section className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <ProMaxPanel className="bg-gradient-to-br from-indigo-500/10 via-white/70 to-cyan-400/10 dark:bg-gradient-to-br dark:from-indigo-500/15 dark:via-slate-900/60 dark:to-cyan-400/10">
          <SectionHeading
            eyebrow="Need a quick response?"
            title="Reach out for product availability, quotes, and project support"
            description="We are happy to help with design suggestions, showroom visits, and custom requirements."
          />
        </ProMaxPanel>
        <ProMaxPanel>
          <form className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <label className="text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block font-medium">Name</span>
                <input className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70" placeholder="Your name" />
              </label>
              <label className="text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block font-medium">Phone</span>
                <input className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70" placeholder="Your phone" />
              </label>
            </div>
            <label className="block text-sm text-slate-600 dark:text-slate-300">
              <span className="mb-2 block font-medium">Your requirement</span>
              <textarea className="min-h-32 w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70" placeholder="Tell us what you need" />
            </label>
            <ProMaxButton href="/contact" variant="primary">
              Send enquiry
            </ProMaxButton>
          </form>
        </ProMaxPanel>
      </section>
    </div>
  );
}
