import { notFound } from "next/navigation";
import { ProductDetailView } from "@/components/ProductDetailView";
import {
  getAlsoViewedProducts,
  getProductById,
  getRelatedProducts,
  getSimilarProducts,
} from "@/lib/publicProducts";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function ProductDetailPage({ params }: Props) {
  const { id } = await params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) notFound();

  const product = await getProductById(productId);
  if (!product) notFound();

  const related = await getRelatedProducts(product.categoryId, product.id);
  const similar = await getSimilarProducts(product, [product.id, ...related.map((item) => item.id)]);
  const alsoViewed = await getAlsoViewedProducts([
    product.id,
    ...related.map((item) => item.id),
    ...similar.map((item) => item.id),
  ]);

  return <ProductDetailView product={product} related={related} similar={similar} alsoViewed={alsoViewed} />;
}
