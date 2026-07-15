import { HomeContent } from "@/components/HomeContent";
import { getPublicProducts } from "@/lib/publicProducts";

export default async function HomePage() {
  const products = await getPublicProducts();
  const featured = products.filter((product) => product.featured);
  const preview = (featured.length > 0 ? featured : products).slice(0, 3);

  return <HomeContent featuredProducts={preview} />;
}
