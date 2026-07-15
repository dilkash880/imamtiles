'use client';

import { useEffect, useMemo, useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxPanel } from "@/components/ui-pro-max";
import type { ProductAvailability, PublicProduct } from "@/lib/publicProducts";
import { getWishlistProductIds, toggleWishlist } from "@/lib/wishlist";

type ProductsBrowserProps = {
  products: PublicProduct[];
  categories: string[];
  sizes: string[];
  finishes: string[];
  availabilityOptions: Array<'All' | ProductAvailability>;
};

export function ProductsBrowser({ products, categories, sizes, finishes, availabilityOptions }: ProductsBrowserProps) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSize, setSelectedSize] = useState("All");
  const [selectedFinish, setSelectedFinish] = useState("All");
  const [selectedAvailability, setSelectedAvailability] = useState<'All' | ProductAvailability>("All");
  const [wishlistIds, setWishlistIds] = useState<Set<number>>(new Set());
  const [wishlistMessage, setWishlistMessage] = useState<string | null>(null);

  useEffect(() => {
    getWishlistProductIds()
      .then(setWishlistIds)
      .catch(() => setWishlistIds(new Set()));
  }, []);

  async function handleToggleWishlist(productId: number) {
    const wasWishlisted = wishlistIds.has(productId);
    setWishlistIds((prev) => {
      const next = new Set(prev);
      if (wasWishlisted) next.delete(productId);
      else next.add(productId);
      return next;
    });

    try {
      await toggleWishlist(productId);
      setWishlistMessage(null);
    } catch (err: any) {
      setWishlistIds((prev) => {
        const next = new Set(prev);
        if (wasWishlisted) next.add(productId);
        else next.delete(productId);
        return next;
      });
      setWishlistMessage(err.message || 'Failed to update wishlist');
    }
  }

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = `${product.name} ${product.category} ${product.size ?? ''} ${product.finish ?? ''}`
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
      const matchesSize = selectedSize === "All" || product.size === selectedSize;
      const matchesFinish = selectedFinish === "All" || product.finish === selectedFinish;
      const matchesAvailability = selectedAvailability === "All" || product.availability === selectedAvailability;

      return matchesSearch && matchesCategory && matchesSize && matchesFinish && matchesAvailability;
    });
  }, [products, search, selectedCategory, selectedSize, selectedFinish, selectedAvailability]);

  return (
    <>
      <ProMaxPanel>
        <div className="grid gap-4 lg:grid-cols-4">
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
            <select
              value={selectedAvailability}
              onChange={(event) => setSelectedAvailability(event.target.value as 'All' | ProductAvailability)}
              className="bg-transparent outline-none text-slate-900 dark:text-white"
            >
              {availabilityOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>
      </ProMaxPanel>

      <section className="space-y-4">
        <SectionHeading
          eyebrow="Available now"
          title={
            products.length === 0
              ? "Catalog coming soon"
              : `${filteredProducts.length} premium options ready for your next project`
          }
          description="Every product card includes size, finish, availability, and direct contact action buttons for quick inquiry."
        />
        {wishlistMessage && (
          <p className="text-sm text-rose-600 dark:text-rose-400">
            {wishlistMessage}{' '}
            <a href="/auth/login" className="underline">
              Sign in
            </a>{' '}
            to save items to your wishlist.
          </p>
        )}
        {products.length === 0 ? (
          <ProMaxPanel className="text-center text-sm text-slate-600 dark:text-slate-300">
            We're adding our showroom inventory now — check back shortly, or call us and we'll help you find what you need today.
          </ProMaxPanel>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                isWishlisted={wishlistIds.has(product.id)}
                onToggleWishlist={handleToggleWishlist}
              />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
