"use client";

import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

type ProductImageGalleryProps = {
  images: string[];
  alt: string;
};

export function ProductImageGallery({ images, alt }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState("50% 50%");

  useEffect(() => {
    if (!lightboxOpen) return;
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setLightboxOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen]);

  if (images.length === 0) {
    return (
      <div className="flex h-80 w-full items-center justify-center rounded-[1.6rem] bg-slate-100 text-sm uppercase tracking-wide text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        No image yet
      </div>
    );
  }

  function openLightbox(index: number) {
    setActiveIndex(index);
    setZoomed(false);
    setLightboxOpen(true);
  }

  function handleZoomClick(event: React.MouseEvent<HTMLImageElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    setZoomOrigin(`${x}% ${y}%`);
    setZoomed((prev) => !prev);
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={() => openLightbox(activeIndex)}
        className="block w-full cursor-zoom-in overflow-hidden rounded-[1.6rem]"
        aria-label="Open image zoom view"
      >
        <motion.img
          key={images[activeIndex]}
          src={images[activeIndex]}
          alt={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
          className="h-80 w-full object-cover sm:h-96"
        />
      </button>

      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-1">
          {images.map((image, index) => (
            <button
              key={image + index}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-[1rem] border-2 transition ${
                index === activeIndex
                  ? "border-indigo-500"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${index + 1}`}
            >
              <img src={image} alt={`${alt} thumbnail ${index + 1}`} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/90 p-4"
            onClick={() => setLightboxOpen(false)}
          >
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              aria-label="Close zoom view"
              className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20"
            >
              ✕
            </button>
            <div className="max-h-full max-w-4xl overflow-hidden rounded-2xl" onClick={(event) => event.stopPropagation()}>
              <img
                src={images[activeIndex]}
                alt={alt}
                onClick={handleZoomClick}
                style={{ transformOrigin: zoomOrigin }}
                className={`max-h-[80vh] w-full cursor-zoom-in object-contain transition-transform duration-300 ${
                  zoomed ? "scale-[2] cursor-zoom-out" : "scale-100"
                }`}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
