import { ProductCard } from "@/components/ProductCard";
import { SectionHeading } from "@/components/SectionHeading";
import type { PublicProduct } from "@/lib/publicProducts";

type ProductCarouselSectionProps = {
  eyebrow: string;
  title: string;
  description: string;
  products: PublicProduct[];
  wishlistIds: Set<number>;
  onToggleWishlist: (productId: number) => void;
};

export function ProductCarouselSection({
  eyebrow,
  title,
  description,
  products,
  wishlistIds,
  onToggleWishlist,
}: ProductCarouselSectionProps) {
  if (products.length === 0) return null;

  return (
    <section className="space-y-4">
      <SectionHeading eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            isWishlisted={wishlistIds.has(product.id)}
            onToggleWishlist={onToggleWishlist}
          />
        ))}
      </div>
    </section>
  );
}
