-- Product detail page features: links enquiries to a specific product (for
-- "Request Quote"), and seeds a demo catalog across the requested material
-- categories so the storefront isn't empty before real inventory is
-- uploaded via the admin panel.
--
-- Run once in the Supabase SQL editor after 001-005.

alter table enquiries
  add column if not exists product_id int references products(id);

insert into categories (name, slug) values
  ('Marble', 'marble'),
  ('Granite', 'granite'),
  ('Floor Tiles', 'floor-tiles'),
  ('Wall Tiles', 'wall-tiles'),
  ('Bathroom Tiles', 'bathroom-tiles'),
  ('Kitchen Tiles', 'kitchen-tiles'),
  ('Parking Tiles', 'parking-tiles'),
  ('Outdoor Tiles', 'outdoor-tiles'),
  ('Wooden Tiles', 'wooden-tiles'),
  ('GVT', 'gvt'),
  ('PGVT', 'pgvt'),
  ('Sanitary Ware', 'sanitary-ware')
on conflict (name) do nothing;

insert into brands (name) values ('Imam Signature Collection')
on conflict (name) do nothing;

-- Demo products + images, seeded only on a still-empty catalog (first run).
-- Images are hot-linked, verified royalty-free Unsplash photos standing in
-- for real product photography until it's uploaded via the admin panel.
do $$
declare
  brand_id_var int;
  cat_id int;
  prod_id int;
begin
  if exists (select 1 from products) then
    return;
  end if;

  select id into brand_id_var from brands where name = 'Imam Signature Collection';

  -- Marble
  select id into cat_id from categories where slug = 'marble';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Statuario White Marble Slab', cat_id, brand_id_var, '2400 x 1200 mm', 'Polished', 'White', 'Marble', 'Elegant Italian-style white marble with soft grey veining, ideal for flooring and feature walls.', 285.00, 40, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1566041510394-cf7c8fe21800?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Emerald Green Marble Slab', cat_id, brand_id_var, '2400 x 1200 mm', 'Polished', 'Green', 'Marble', 'Rich green marble with dramatic veining, a striking choice for statement countertops and accent walls.', 320.00, 18, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1532644440111-bc94f97955c1?auto=format&fit=crop&w=1600&q=80', true);

  -- Granite
  select id into cat_id from categories where slug = 'granite';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Steel Grey Granite Slab', cat_id, brand_id_var, '2400 x 1200 mm', 'Polished', 'Grey', 'Granite', 'Durable steel-grey granite with fine speckled texture, popular for kitchen countertops and flooring.', 210.00, 55, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1733085097233-66441dedba94?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Tan Brown Granite Slab', cat_id, brand_id_var, '2400 x 1200 mm', 'Polished', 'Brown', 'Granite', 'Warm tan-brown granite with natural mineral flecking, a classic choice for countertops and cladding.', 195.00, 60, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1628977614615-f5f4068361ed?auto=format&fit=crop&w=1600&q=80', true);

  -- Floor Tiles
  select id into cat_id from categories where slug = 'floor-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Ivory Matte Floor Tile', cat_id, brand_id_var, '800 x 800 mm', 'Matte', 'Ivory', 'Vitrified', 'Large-format ivory floor tile with a soft matte finish, suited to living and dining spaces.', 45.00, 320, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1610552836390-9516d4ab88c2?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1678921902437-dc7803a337b0?auto=format&fit=crop&w=1600&q=80', false);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Slate Grey Floor Tile', cat_id, brand_id_var, '600 x 600 mm', 'Matte', 'Grey', 'Vitrified', 'Slate-grey floor tile with a subtle texture, a versatile everyday flooring option.', 38.00, 410, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1529926106606-a13043f59b06?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1678921902437-dc7803a337b0?auto=format&fit=crop&w=1600&q=80', false);

  -- Wall Tiles
  select id into cat_id from categories where slug = 'wall-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Onyx Black Wall Tile', cat_id, brand_id_var, '300 x 600 mm', 'Glossy', 'Black', 'Ceramic', 'Deep black glossy wall tile that adds a bold contemporary accent to any wall.', 32.00, 500, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1675612703673-af71e558d827?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Mosaic Pattern Wall Tile', cat_id, brand_id_var, '300 x 300 mm', 'Glossy', 'Multicolor', 'Ceramic', 'Vibrant mosaic-pattern wall tile, perfect for feature walls and splashbacks.', 55.00, 150, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1760544137582-85c3300b794d?auto=format&fit=crop&w=1600&q=80', true);

  -- Bathroom Tiles
  select id into cat_id from categories where slug = 'bathroom-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Arctic White Bathroom Tile', cat_id, brand_id_var, '300 x 450 mm', 'Glossy', 'White', 'Ceramic', 'Bright white glossy tile that keeps bathrooms feeling fresh, clean, and spacious.', 28.00, 600, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1721825154931-573ba7aee6bb?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1722152632135-65bbeb4651a2?auto=format&fit=crop&w=1600&q=80', false);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Pearl Grey Bathroom Tile', cat_id, brand_id_var, '300 x 450 mm', 'Glossy', 'Grey', 'Ceramic', 'Soft pearl-grey bathroom tile with subtle sheen, pairs well with most fixtures.', 30.00, 480, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1656646523907-97b094c7e63a?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1722152632135-65bbeb4651a2?auto=format&fit=crop&w=1600&q=80', false);

  -- Kitchen Tiles
  select id into cat_id from categories where slug = 'kitchen-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Classic Subway Kitchen Tile', cat_id, brand_id_var, '100 x 300 mm', 'Glossy', 'White', 'Ceramic', 'Timeless white subway tile, a kitchen backsplash staple that suits any decor.', 22.00, 700, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1523413307857-ef24c53571ae?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Warm Beige Kitchen Backsplash Tile', cat_id, brand_id_var, '200 x 300 mm', 'Matte', 'Beige', 'Ceramic', 'Warm beige backsplash tile that brings a cozy, textured look to kitchen walls.', 26.00, 380, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1662986787347-52ebbf223519?auto=format&fit=crop&w=1600&q=80', true);

  -- Parking Tiles
  select id into cat_id from categories where slug = 'parking-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Heavy-Duty Grey Parking Tile', cat_id, brand_id_var, '400 x 400 mm', 'Anti-skid', 'Grey', 'Vitrified', 'High-strength anti-skid tile engineered for driveways and parking areas.', 34.00, 900, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1698222491864-6c174537885f?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1722507157933-dc2aa9fa404e?auto=format&fit=crop&w=1600&q=80', false);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Charcoal Textured Parking Tile', cat_id, brand_id_var, '400 x 400 mm', 'Anti-skid', 'Charcoal', 'Vitrified', 'Charcoal-toned textured tile built for heavy vehicle traffic and outdoor exposure.', 36.00, 620, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1749871615219-9c259798699f?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1722507157933-dc2aa9fa404e?auto=format&fit=crop&w=1600&q=80', false);

  -- Outdoor Tiles
  select id into cat_id from categories where slug = 'outdoor-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Sandstone Outdoor Patio Tile', cat_id, brand_id_var, '600 x 600 mm', 'Textured', 'Sand', 'Vitrified', 'Weather-resistant sandstone-look tile for patios, walkways, and garden paths.', 40.00, 300, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1740823189945-926fb0faaf47?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Terracotta Poolside Tile', cat_id, brand_id_var, '300 x 300 mm', 'Anti-skid', 'Terracotta', 'Ceramic', 'Slip-resistant terracotta tile designed for poolside decks and outdoor entertaining areas.', 33.00, 250, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1759854909332-b73cdb19b705?auto=format&fit=crop&w=1600&q=80', true);

  -- Wooden Tiles
  select id into cat_id from categories where slug = 'wooden-tiles';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Natural Oak Wood-Finish Tile', cat_id, brand_id_var, '200 x 1200 mm', 'Matte', 'Oak Brown', 'Vitrified', 'Wood-look vitrified tile with the warmth of natural oak and none of the upkeep.', 58.00, 210, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1635603498472-bd44fd7b0735?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1642503219003-c541c58de147?auto=format&fit=crop&w=1600&q=80', false);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Walnut Dark Wood-Finish Tile', cat_id, brand_id_var, '200 x 1200 mm', 'Matte', 'Walnut', 'Vitrified', 'Rich walnut-toned wood-finish tile for a warm, upscale interior look.', 62.00, 175, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1522173096622-763cc9d35a3e?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1642503219003-c541c58de147?auto=format&fit=crop&w=1600&q=80', false);

  -- GVT (Glazed Vitrified Tile)
  select id into cat_id from categories where slug = 'gvt';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Glossy Ivory GVT Tile', cat_id, brand_id_var, '600 x 1200 mm', 'Glazed', 'Ivory', 'GVT', 'Glazed vitrified tile with a smooth reflective ivory surface, ideal for showrooms and living areas.', 65.00, 240, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1565376901308-37344a4b06ea?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Glossy Charcoal GVT Tile', cat_id, brand_id_var, '600 x 1200 mm', 'Glazed', 'Charcoal', 'GVT', 'Deep charcoal glazed vitrified tile that lends a sleek, modern finish to any floor.', 68.00, 190, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1489843608652-0058d31170f6?auto=format&fit=crop&w=1600&q=80', true);

  -- PGVT (Polished Glazed Vitrified Tile)
  select id into cat_id from categories where slug = 'pgvt';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('High-Gloss White PGVT Tile', cat_id, brand_id_var, '800 x 1600 mm', 'Polished Glazed', 'White', 'PGVT', 'Mirror-polish glazed vitrified tile in bright white, a premium large-format flooring choice.', 95.00, 130, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1678921902437-dc7803a337b0?auto=format&fit=crop&w=1600&q=80', true);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('High-Gloss Grey PGVT Tile', cat_id, brand_id_var, '800 x 1600 mm', 'Polished Glazed', 'Grey', 'PGVT', 'High-gloss grey PGVT tile with a marble-like sheen for luxury interiors.', 98.00, 110, false, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1764670281751-8b7874d2d85f?auto=format&fit=crop&w=1600&q=80', true);

  -- Sanitary Ware
  select id into cat_id from categories where slug = 'sanitary-ware';

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('Modern Wall-Hung Washbasin', cat_id, brand_id_var, 'Standard', 'Glossy', 'White', 'Vitreous China', 'Space-saving wall-hung washbasin with a smooth glossy finish for modern bathrooms.', 85.00, 45, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/photo-1721901945499-8fd5c1446b21?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1563204719-44395a035bb6?auto=format&fit=crop&w=1600&q=80', false);

  insert into products (name, category_id, brand_id, size, finish, color, material, description, price, stock, featured, status)
    values ('One-Piece Western Toilet', cat_id, brand_id_var, 'Standard', 'Glossy', 'White', 'Vitreous China', 'Seamless one-piece western toilet designed for easy cleaning and a streamlined look.', 150.00, 30, true, 'active')
    returning id into prod_id;
  insert into product_images (product_id, storage_path, is_primary) values
    (prod_id, 'https://images.unsplash.com/flagged/photo-1556438758-84625859c6b6?auto=format&fit=crop&w=1600&q=80', true),
    (prod_id, 'https://images.unsplash.com/photo-1563204719-44395a035bb6?auto=format&fit=crop&w=1600&q=80', false);

end $$;
