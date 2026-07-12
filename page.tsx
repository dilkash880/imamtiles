'use client';

import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxButton, ProMaxCard, ProMaxFeatureGrid, ProMaxPanel, ProMaxStat } from "@/components/ui-pro-max";
import { products } from "@/lib/products";

const logos = ["Marble House", "Luxe Living", "Studio Casa", "Aura Design", "Noble Spaces"];
const testimonials = [
  {
    quote: "Their craftsmanship and finish quality are unmatched. Every space feels premium.",
    author: "Aarav S.",
    role: "Interior Designer",
  },
  {
    quote: "We found the perfect tiles for our villa project, and the service exceeded expectations.",
    author: "Meera P.",
    role: "Homeowner",
  },
];

const stats = [
  { value: "15+", label: "Years of excellence" },
  { value: "3000+", label: "Projects delivered" },
  { value: "98%", label: "Customer satisfaction" },
];

export default function HomePage() {
  return (
    <div className="space-y-8">
      <ProMaxPanel className="relative overflow-hidden p-6 sm:p-8 lg:p-12">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 60, 0], y: [0, -30, 0], scale: [1, 1.06, 1] }}
            transition={{ duration: 12, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute left-[-8%] top-[-8%] h-52 w-52 rounded-full bg-indigo-500/30 blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -40, 0], y: [0, 30, 0], scale: [1, 1.02, 1] }}
            transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            className="absolute bottom-[-10%] right-[-6%] h-64 w-64 rounded-full bg-cyan-400/30 blur-3xl"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.44),_transparent_45%)] dark:bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.12),_transparent_45%)]" />
        </div>

        <div className="relative grid items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }} className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-sm text-indigo-600 dark:text-indigo-300">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
              Premium tiles & sanitary ware • Crafted for luxury spaces
            </div>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl dark:text-white">
              Elevate every room with timeless design and premium finish.
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              Explore a curated collection of floor, wall, bathroom, and sanitary ware solutions that blend artistry, durability, and flawless execution.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <ProMaxButton href="/products" className="sm:min-w-[160px]">
                View Products
              </ProMaxButton>
              <ProMaxButton href="tel:+917996078576" variant="secondary" className="sm:min-w-[160px]">
                Call Now
              </ProMaxButton>
            </div>
            <div className="mt-8 flex flex-wrap gap-5 text-sm text-slate-600 dark:text-slate-400">
              <span>✓ Fast delivery</span>
              <span>✓ Expert guidance</span>
              <span>✓ Custom quotes</span>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.55, delay: 0.1 }} className="rounded-[1.8rem] border border-white/70 bg-slate-950/95 p-4 text-white shadow-2xl shadow-indigo-500/20 dark:border-white/10">
            <div className="rounded-[1.4rem] border border-white/10 bg-gradient-to-br from-indigo-500/25 via-violet-500/18 to-cyan-400/20 p-4">
              <div className="rounded-[1.1rem] border border-white/10 bg-black/25 p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Latest collection</p>
                    <p className="text-xl font-semibold">Signature Marble Line</p>
                  </div>
                  <span className="rounded-full bg-emerald-500/20 px-3 py-1 text-sm text-emerald-300">New arrival</span>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80"
                  alt="Luxury tile collection"
                  className="h-64 w-full rounded-[1rem] object-cover"
                />
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-sm text-slate-400">Material</p>
                    <p className="font-semibold">Porcelain Premium</p>
                  </div>
                  <div className="rounded-2xl bg-white/10 p-3">
                    <p className="text-sm text-slate-400">Finish</p>
                    <p className="font-semibold">Polished & Matt</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </ProMaxPanel>

      <section className="grid gap-4 md:grid-cols-3">
        {stats.map((stat) => (
          <ProMaxStat key={stat.label} value={stat.value} label={stat.label} />
        ))}
      </section>

      <ProMaxPanel>
        <SectionHeading
          eyebrow="Trusted by leading designers"
          title="Premium brands and bespoke collections"
          description="We source architectural-grade materials that balance beauty, resilience, and timeless sophistication."
          align="center"
        />
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {logos.map((logo) => (
            <div key={logo} className="rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-5 text-center text-sm font-semibold uppercase tracking-[0.24em] text-slate-700 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-200">
              {logo}
            </div>
          ))}
        </div>
      </ProMaxPanel>

      <section className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <ProMaxPanel className="bg-gradient-to-br from-indigo-500/10 via-white/70 to-cyan-400/10 dark:bg-gradient-to-br dark:from-indigo-500/15 dark:via-slate-900/60 dark:to-cyan-400/10">
          <ProMaxFeatureGrid
            eyebrow="Why choose us"
            title="A refined experience from selection to installation"
            description="We make it easy to choose materials that feel luxurious and perform beautifully in everyday life."
            items={[
              {
                title: "Curated collections",
                description: "Premium finishes and architectural-grade materials chosen for timeless impact.",
                icon: "✦",
              },
              {
                title: "Project guidance",
                description: "Responsive support for villas, interiors, hotels, and commercial spaces.",
                icon: "🛋",
              },
              {
                title: "Transparent quoting",
                description: "Clear pricing, availability updates, and direct communication for every inquiry.",
                icon: "📐",
              },
              {
                title: "Showroom support",
                description: "Personalized assistance from idea selection through design execution.",
                icon: "✨",
              },
            ]}
          />
        </ProMaxPanel>

        <div className="space-y-4">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.author}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.35, delay: index * 0.08 }}
            >
              <ProMaxCard>
                <p className="text-lg leading-8 text-slate-700 dark:text-slate-300">“{testimonial.quote}”</p>
                <div className="mt-4">
                  <p className="font-semibold text-slate-950 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </ProMaxCard>
            </motion.div>
          ))}
        </div>
      </section>

      <ProMaxPanel className="bg-slate-950 p-8 text-white shadow-[0_30px_80px_-30px_rgba(15,23,42,0.8)] dark:border-white/10">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-cyan-300">Browse our catalog</p>
            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">See the latest selections in tiles and sanitary ware.</h2>
          </div>
          <ProMaxButton href="/products" variant="secondary" className="bg-white text-slate-950 hover:bg-slate-100">
            Explore Products
          </ProMaxButton>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {products.slice(0, 3).map((product) => (
            <div key={product.id} className="rounded-[1.2rem] border border-white/10 bg-white/10 p-4 backdrop-blur">
              <img src={product.image} alt={product.name} className="h-36 w-full rounded-[0.8rem] object-cover" />
              <p className="mt-3 font-semibold">{product.name}</p>
              <p className="mt-1 text-sm text-slate-300">{product.category}</p>
            </div>
          ))}
        </div>
      </ProMaxPanel>
    </div>
  );
}
