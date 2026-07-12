import { motion } from "motion/react";
import type { Product } from "@/lib/products";
import { ProMaxButton, ProMaxCard } from "@/components/ui-pro-max";

type ProductCardProps = {
  product: Product;
};

export function ProductCard({ product }: ProductCardProps) {
  const availabilityClass =
    product.availability === "In Stock"
      ? "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300"
      : product.availability === "Limited"
        ? "bg-amber-500/15 text-amber-700 dark:text-amber-300"
        : "bg-slate-500/15 text-slate-700 dark:text-slate-300";

  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="group"
    >
      <ProMaxCard className="overflow-hidden p-0">
        <div className="relative h-56 overflow-hidden">
          <motion.img
            src={product.image}
            alt={product.name}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.5 }}
            className="h-full w-full object-cover"
          />
          <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass}`}>
            {product.availability}
          </span>
        </div>
        <div className="space-y-4 p-5">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600 dark:text-indigo-300">
              {product.category}
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-950 dark:text-white">{product.name}</h3>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
          </div>
          <div className="flex flex-wrap gap-2 text-sm text-slate-600 dark:text-slate-300">
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Size: {product.size}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 dark:bg-slate-800">Finish: {product.finish}</span>
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
