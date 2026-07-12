export type Product = {
  id: number;
  name: string;
  category: string;
  size: string;
  finish: string;
  availability: "In Stock" | "Limited" | "Pre-order";
  image: string;
  description: string;
};

export const products: Product[] = [
  {
    id: 1,
    name: "Aurora Marble Tile",
    category: "Marble Finish Tiles",
    size: "600x600 mm",
    finish: "Polished",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=900&q=80",
    description: "Premium marble-look tile with rich veining and a luxurious finish.",
  },
  {
    id: 2,
    name: "Luxe Wood Plank",
    category: "Wooden Finish Tiles",
    size: "1200x300 mm",
    finish: "Matte",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Warm wooden texture with the durability of porcelain tiles.",
  },
  {
    id: 3,
    name: "Mist Granite Slab",
    category: "Granite",
    size: "800x800 mm",
    finish: "Satin",
    availability: "Limited",
    image:
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    description: "Elegant granite surface ideal for premium flooring and countertops.",
  },
  {
    id: 4,
    name: "Cielo Wall Tile",
    category: "Wall Tiles",
    size: "300x600 mm",
    finish: "Gloss",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    description: "Bright and refined wall tile for contemporary interiors.",
  },
  {
    id: 5,
    name: "Terra Outdoor Paver",
    category: "Outdoor Tiles",
    size: "600x600 mm",
    finish: "Textured",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=900&q=80",
    description: "Slip-resistant pavers designed for patios and terraces.",
  },
  {
    id: 6,
    name: "Opal Sanitary Set",
    category: "Sanitary Ware",
    size: "Compact",
    finish: "Gloss White",
    availability: "Pre-order",
    image:
      "https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=900&q=80",
    description: "Compact sanitary ware collection for modern bathrooms.",
  },
  {
    id: 7,
    name: "Halo Wash Basin",
    category: "Wash Basins",
    size: "550x400 mm",
    finish: "Matte",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80",
    description: "Sculptural vanity basin crafted for premium bathroom styling.",
  },
  {
    id: 8,
    name: "Aurelia Faucet",
    category: "Faucets",
    size: "Single Lever",
    finish: "Brushed Gold",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
    description: "Luxury faucet with smooth operation and striking detailing.",
  },
  {
    id: 9,
    name: "Nero Bathroom Accessory Kit",
    category: "Bathroom Accessories",
    size: "Complete Set",
    finish: "Matte Black",
    availability: "Limited",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    description: "Cohesive accessories package for a refined bathroom upgrade.",
  },
  {
    id: 10,
    name: "Siena Floor Tile",
    category: "Floor Tiles",
    size: "800x800 mm",
    finish: "Natural",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Durable floor tile with a timeless stone-inspired look.",
  },
  {
    id: 11,
    name: "Velvet Bathroom Tile",
    category: "Bathroom Tiles",
    size: "300x600 mm",
    finish: "Gloss",
    availability: "In Stock",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    description: "Water-ready bathroom tile with subtle shimmer and clean lines.",
  },
  {
    id: 12,
    name: "Atelier Kitchen Tile",
    category: "Kitchen Tiles",
    size: "600x600 mm",
    finish: "Satin",
    availability: "Limited",
    image:
      "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    description: "Elegant countertop and backsplash tile for contemporary kitchens.",
  },
];

export const categories = [
  "All",
  "Floor Tiles",
  "Wall Tiles",
  "Bathroom Tiles",
  "Kitchen Tiles",
  "Outdoor Tiles",
  "Marble Finish Tiles",
  "Wooden Finish Tiles",
  "Granite",
  "Sanitary Ware",
  "Wash Basins",
  "Faucets",
  "Bathroom Accessories",
];

export const sizes = ["All", ...Array.from(new Set(products.map((product) => product.size)))];
export const finishes = ["All", ...Array.from(new Set(products.map((product) => product.finish)))];
export const availabilityOptions = ["All", ...Array.from(new Set(products.map((product) => product.availability)))];
