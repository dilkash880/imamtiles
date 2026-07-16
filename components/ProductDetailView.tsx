"use client";

import { motion } from "motion/react";
import { ProductCarouselSection } from "@/components/ProductCarouselSection";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductSpecifications } from "@/components/ProductSpecifications";
import { RequestQuoteForm } from "@/components/RequestQuoteForm";
import { ShareProductButton } from "@/components/ShareProductButton";
import { ProMaxButton } from "@/components/ui-pro-max";
import type { PublicProduct } from "@/lib/publicProducts";
import { useWishlist } from "@/lib/wishlist";

type ProductDetailViewProps = {
  product: PublicProduct;
  related: PublicProduct[];
  similar: PublicProduct[];
  alsoViewed: PublicProduct[];
};

export function ProductDetailView({ product, related, similar, alsoViewed }: ProductDetailViewProps) {
  const { wishlistIds, message: wishlistMessage, toggleWishlist } = useWishlist();
  const isWishlisted = wishlistIds.has(product.id);

  return (
    <div className="space-y-12">
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]"
      >
        <ProductImageGallery images={product.images} alt={product.name} />

        <div className="space-y-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-indigo-600 dark:text-indigo-300">
              {product.category}
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl dark:text-white">
              {product.name}
            </h1>
            {product.description && (
              <p className="mt-4 text-base leading-7 text-slate-600 dark:text-slate-300">{product.description}</p>
            )}
          </div>

          <ProductSpecifications product={product} />

          {wishlistMessage && (
            <p className="text-sm text-rose-600 dark:text-rose-400">
              {wishlistMessage}{" "}
              <a href="/auth/login" className="underline">
                Sign in
              </a>{" "}
              to save items to your wishlist.
            </p>
          )}

          <div className="flex flex-wrap items-center gap-3">
            <RequestQuoteForm productId={product.id} productName={product.name} />
            <ShareProductButton productName={product.name} />
            <ProMaxButton
              type="button"
              variant={isWishlisted ? "accent" : "secondary"}
              onClick={() => toggleWishlist(product.id)}
            >
              {isWishlisted ? "♥ Wishlisted" : "♡ Add to Wishlist"}
            </ProMaxButton>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <ProMaxButton href="tel:+917996078576" variant="secondary" className="flex-1">
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
      </motion.section>

      <ProductCarouselSection
        eyebrow="You may also like"
        title="Related Products"
        description={`More from our ${product.category} collection.`}
        products={related}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
      />

      <ProductCarouselSection
        eyebrow="Matching your taste"
        title="Similar Products"
        description="Products with a similar material, finish, or color."
        products={similar}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
      />

      <ProductCarouselSection
        eyebrow="Popular picks"
        title="Customers Also Viewed"
        description="Other products our customers are exploring right now."
        products={alsoViewed}
        wishlistIds={wishlistIds}
        onToggleWishlist={toggleWishlist}
      />
    </div>
  );
}
