import { motion } from "motion/react";
import type { PublicProduct } from "@/lib/publicProducts";
import { ProMaxButton, ProMaxCard } from "@/components/ui-pro-max";

type ProductCardProps = {
  product: PublicProduct;
  isWishlisted?: boolean;
  onToggleWishlist?: (productId: number) => void;
};

export function ProductCard({ product, isWishlisted = false, onToggleWishlist }: ProductCardProps) {
  const availabilityClass =
    product.availability === "In Stock"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : product.availability === "Limited"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
        : product.availability === "Out of Stock"
          ? "bg-rose-500/15 text-rose-700 dark:text-rose-300"
          : "bg-slate-500/15 text-slate-700 dark:text-slate-300";

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="group"
    >
      <ProMaxCard className="overflow-hidden p-0">
        <div className="relative h-56 overflow-hidden">
          {product.image ? (
            <motion.img
              src={product.image}
              alt={product.name}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.5 }}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-slate-100 text-sm uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
              No image yet
            </div>
          )}
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass}`}>
            {product.availability}
          </span>
          {onToggleWishlist && (
            <button
              type="button"
              onClick={() => onToggleWishlist(product.id)}
              aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              aria-pressed={isWishlisted}
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-rose-500 shadow-md backdrop-blur transition hover:scale-110 dark:bg-slate-900/90"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isWishlisted ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={2}
                className="h-5 w-5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 20.727c-.4 0-.788-.15-1.086-.42-1.2-1.09-2.36-2.11-3.386-3.02l-.007-.006c-2.98-2.653-5.55-4.943-5.55-8.276 0-2.582 2.019-4.6 4.6-4.6 1.44 0 2.79.66 3.68 1.75l.749.919.749-.919c.89-1.09 2.24-1.75 3.68-1.75 2.581 0 4.6 2.018 4.6 4.6 0 3.333-2.57 5.623-5.55 8.276-1.037.921-2.21 1.955-3.393 3.026-.298.27-.686.42-1.086.42z"
                />
              </svg>
            </button>
          )}
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">
              {product.category}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{product.name}</h3>
            {product.description && (
              <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
            {product.size && <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Size: {product.size}</span>}
            {product.finish && <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Finish: {product.finish}</span>}
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <ProMaxButton href={`tel:+917996078576`} variant="secondary" className="flex-1">
              Call for Price
            </ProMaxButton>
            <ProMaxButton
              href={`https://wa.me/917996078576?text=Hello%20I%20would%20like%20to%20inquire%20about%20${encodeURIComponent(product.name)}`}
              variant="accent"
              className="flex-1"
            >
              WhatsApp Inquiry
            </ProMaxButton>
          </div>
        </div>
      </ProMaxCard>
    </motion.article>
  );
}
