-- Fix: 002_rls.sql enabled RLS on product_images but never added a SELECT
-- policy for it (only `products` got one). The storefront reads products
-- with the anon key, so the product_images join was silently returning zero
-- rows for every visitor, making every product look image-less regardless
-- of what's actually in the table.

drop policy if exists "public_select_product_images" on product_images;
create policy "public_select_product_images" on product_images
  for select using (true);
