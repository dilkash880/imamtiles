import { FadeInSection } from "@/components/FadeInSection";
import { ProductsBrowser } from "@/components/ProductsBrowser";
import { ProMaxButton, ProMaxPanel } from "@/components/ui-pro-max";
import { getProductFilterOptions, getPublicProducts } from "@/lib/publicProducts";

export default async function ProductsPage() {
  const products = await getPublicProducts();
  const { categories, sizes, finishes, availabilityOptions } = getProductFilterOptions(products);

  return (
    <div className="space-y-8">
      <FadeInSection>
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
        </ProMaxPanel>
      </FadeInSection>

      <ProductsBrowser
        products={products}
        categories={categories}
        sizes={sizes}
        finishes={finishes}
        availabilityOptions={availabilityOptions}
      />
    </div>
  );
}
