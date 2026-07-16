import type { PublicProduct } from "@/lib/publicProducts";
import { ProMaxPanel } from "@/components/ui-pro-max";

type ProductSpecificationsProps = {
  product: PublicProduct;
};

const availabilityClass: Record<PublicProduct["availability"], string> = {
  "In Stock": "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  Limited: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  "Out of Stock": "bg-rose-500/15 text-rose-700 dark:text-rose-300",
  "Pre-order": "bg-slate-500/15 text-slate-700 dark:text-slate-300",
};

export function ProductSpecifications({ product }: ProductSpecificationsProps) {
  const specs: Array<{ label: string; value: string }> = [
    { label: "Category", value: product.category },
    { label: "Brand", value: product.brand ?? "Imam Signature Collection" },
    { label: "Size", value: product.size ?? "Available on request" },
    { label: "Finish", value: product.finish ?? "Available on request" },
    { label: "Color", value: product.color ?? "Available on request" },
    { label: "Material", value: product.material ?? "Available on request" },
  ];

  return (
    <ProMaxPanel>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Specifications</h2>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${availabilityClass[product.availability]}`}>
          {product.availability}
        </span>
      </div>
      <dl className="mt-5 grid gap-4 sm:grid-cols-2">
        {specs.map((spec) => (
          <div
            key={spec.label}
            className="rounded-[1.1rem] border border-slate-200/70 bg-slate-50/70 px-4 py-3 dark:border-white/10 dark:bg-slate-800/70"
          >
            <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              {spec.label}
            </dt>
            <dd className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{spec.value}</dd>
          </div>
        ))}
      </dl>
      <p className="mt-5 text-2xl font-semibold text-slate-950 dark:text-white">
        {product.price ? `₹${product.price.toLocaleString("en-IN")} / unit` : "Call for price"}
      </p>
    </ProMaxPanel>
  );
}
