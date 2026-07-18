'use client';

import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxCard, ProMaxPanel } from "@/components/ui-pro-max";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1658804611830-435a78038870?auto=format&fit=crop&w=900&q=80",
    alt: "Marble staircase with glass railing showcasing premium natural stone",
    className: "md:col-span-2 md:row-span-2",
    fill: true,
  },
  {
    src: "https://images.unsplash.com/photo-1628977614615-f5f4068361ed?auto=format&fit=crop&w=900&q=80",
    alt: "Polished granite slab surface detail",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1656646523907-97b094c7e63a?auto=format&fit=crop&w=900&q=80",
    alt: "Premium bathroom wall and floor tiling",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1706629506571-a6d86798916b?auto=format&fit=crop&w=900&q=80",
    alt: "Commercial space finished with polished marble flooring",
    className: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1580398562556-d33329a0f29b?auto=format&fit=crop&w=900&q=80",
    alt: "Luxury textured porcelain tile design",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1556911220-bff31c812dba?auto=format&fit=crop&w=900&q=80",
    alt: "Kitchen counter and backsplash in premium marble",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1780572160856-fa59bd2fbf46?auto=format&fit=crop&w=900&q=80",
    alt: "Classic black and white marble flooring pattern",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1765766601592-ac2936aa87e0?auto=format&fit=crop&w=900&q=80",
    alt: "Modern living room with elegant marble tile flooring",
    className: "md:col-span-2",
  },
];

export default function GalleryPage() {
  return (
    <div className="space-y-8">
      <motion.section initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <ProMaxPanel>
          <SectionHeading
            eyebrow="Gallery"
            title="A visual glimpse of premium materials and refined interiors"
            description="From marble-inspired flooring to elegant sanitary ware details, explore our curated visual collection."
          />
        </ProMaxPanel>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {galleryImages.map((image, index) => (
          <motion.div
            key={image.alt}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.35, delay: index * 0.05 }}
            className={image.className}
          >
            <ProMaxCard className={`overflow-hidden p-0 ${image.fill ? "h-full" : ""}`}>
              <motion.img
                src={image.src}
                alt={image.alt}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className={`w-full object-cover ${image.fill ? "h-full" : "h-72"}`}
              />
            </ProMaxCard>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
