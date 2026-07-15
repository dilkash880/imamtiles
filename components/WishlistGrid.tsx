'use client';

import { useState } from "react";
import { ProductCard } from "@/components/ProductCard";
import { ProMaxPanel } from "@/components/ui-pro-max";
import { toggleWishlist } from "@/lib/wishlist";
import type { PublicProduct } from "@/lib/publicProducts";

type WishlistGridProps = {
  initialProducts: PublicProduct[];
};

export function WishlistGrid({ initialProducts }: WishlistGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [message, setMessage] = useState<string | null>(null);

  async function handleRemove(productId: number) {
    const removed = products.find((product) => product.id === productId);
    setProducts((prev) => prev.filter((product) => product.id !== productId));

    try {
      await toggleWishlist(productId);
    } catch (err: any) {
      if (removed) setProducts((prev) => [...prev, removed]);
      setMessage(err.message || 'Failed to update wishlist');
    }
  }

  if (products.length === 0) {
    return (
      <ProMaxPanel className="text-center text-sm text-slate-600 dark:text-slate-300">
        Your wishlist is empty. Browse the catalog and tap the heart icon on any product to save it here.
      </ProMaxPanel>
    );
  }

  return (
    <div className="space-y-4">
      {message && <p className="text-sm text-rose-600 dark:text-rose-400">{message}</p>}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} isWishlisted onToggleWishlist={handleRemove} />
        ))}
      </div>
    </div>
  );
}
