'use client';

import { motion } from "motion/react";
import { SectionHeading } from "@/components/SectionHeading";
import { ProMaxCard, ProMaxPanel } from "@/components/ui-pro-max";

const galleryImages = [
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    alt: "Luxury tile interior",
    className: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=900&q=80",
    alt: "Modern kitchen with premium tiles",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80",
    alt: "Elegant granite texture",
    className: "",
  },
  {
    src: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=80",
    alt: "Bathroom accessory showcase",
    className: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80",
    alt: "Handcrafted tile finish",
    className: "",
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
            <ProMaxCard className="overflow-hidden p-0">
              <motion.img
                src={image.src}
                alt={image.alt}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
                className="h-72 w-full object-cover"
              />
            </ProMaxCard>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
