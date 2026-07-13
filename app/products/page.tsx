'use client';

import { motion } from "motion/react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxButton, ProMaxPanel } from "@/components/ui-pro-max";
import { availabilityOptions, categories, finishes, products, sizes } from "@/lib/products";

export default function ProductsPage() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedFinish, setSelectedFinish] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState("All");

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.size} ${product.finish}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSize = selectedSize === "All" || product.size === selectedSize;
      const matchesFinish = selectedFinish === "All" || product.finish === selectedFinish;
      const matchesAvailability = selectedAvailability === "All" || product.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesSize && matchesFinish && matchesAvailability;
    });
  }, [search, selectedCategory, selectedSize, selectedFinish, selectedAvailability]);

  return (
    <div className="space-y-8">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <ProMaxPanel>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">Our catalog</p>
              <h1 className="mt-3 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl dark:text-white">
                Search, filter, and discover premium tiles and sanitary ware.
              </h1>
              <p className="mt-4 text-lg leading-8 text-slate-600 dark:text-slate-300">
                Browse floor tiles, wall tiles, bathroom collections, sanitary ware, faucets, and more with direct inquiry support.
              </p>
            </div>
            <ProMaxButton href="tel:+917996078576" variant="primary">
              Call for expert advice
            </ProMaxButton>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-4">
            <label className="rounded-[1rem] border border-slate-200/70 bg-slate-50/70 p-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="mb-2 block text-slate-500 dark:text-slate-400">Search</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search products"
                className="w-full bg-transparent outline-none text-slate-900 dark:text-white"
              />
            </label>
            <label className="rounded-[1rem] border border-slate-200/70 bg-slate-50/70 p-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="mb-2 block text-slate-500 dark:text-slate-400">Category</span>
              <select value={selectedCategory} onChange={(event) => setSelectedCategory(event.target.value)} className="w-full bg-transparent outline-none text-slate-900 dark:text-white">
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
            <label className="rounded-[1rem] border border-slate-200/70 bg-slate-50/70 p-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="mb-2 block text-slate-500 dark:text-slate-400">Size</span>
              <select value={selectedSize} onChange={(event) => setSelectedSize(event.target.value)} className="w-full bg-transparent outline-none text-slate-900 dark:text-white">
                {sizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </label>
            <label className="rounded-[1rem] border border-slate-200/70 bg-slate-50/70 p-3 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="mb-2 block text-slate-500 dark:text-slate-400">Finish</span>
              <select value={selectedFinish} onChange={(event) => setSelectedFinish(event.target.value)} className="w-full bg-transparent outline-none text-slate-900 dark:text-white">
                {finishes.map((finish) => (
                  <option key={finish} value={finish}>
                    {finish}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <label className="rounded-full border border-slate-200/70 bg-slate-50/70 px-3 py-2 text-sm dark:border-white/10 dark:bg-slate-800/70">
              <span className="mr-2 text-slate-500 dark:text-slate-400">Availability</span>
              <select value={selectedAvailability} onChange={(event) => setSelectedAvailability(event.target.value)} className="bg-transparent outline-none text-slate-900 dark:text-white">
                {availabilityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </ProMaxPanel>
      </motion.section>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Available now"
          title={`${filteredProducts.length} premium options ready for your next project`}
          description="Every product card includes size, finish, availability, and direct contact action buttons for quick inquiry."
        />
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
}
