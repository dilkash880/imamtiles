'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { ProMaxButton } from "@/components/ui-pro-max";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Wishlist", href: "/wishlist" },
];

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const pathname = usePathname();

  useEffect(() => {
    const storedTheme = window.localStorage.getItem("theme") as "dark" | "light" | null;
    const initialTheme =
      storedTheme ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <div className="min-h-screen bg-transparent text-slate-900 transition-colors dark:text-slate-100">
      <header className="sticky top-0 z-50 border-b border-slate-200/60 bg-white/70 shadow-[0_12px_50px_-25px_rgba(15,23,42,0.28)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 text-sm font-semibold uppercase tracking-[0.25em] text-slate-700 dark:text-slate-200">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 text-lg shadow-lg">
              ✦
            </span>
            <span className="hidden sm:inline">Imam Marble & Tiles</span>
          </Link>
          <nav className="hidden items-center gap-2 text-sm font-medium text-slate-600 md:flex dark:text-slate-300">
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <motion.div key={item.href} whileHover={{ y: -1, scale: 1.02 }}>
                  <Link
                    href={item.href}
                    className={`rounded-full px-3 py-2 transition ${isActive ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "hover:bg-slate-100 hover:text-indigo-600 dark:hover:bg-slate-800"}`}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <ProMaxButton href="tel:+917996078576" variant="primary" className="hidden px-4 py-2 sm:inline-flex">
              Call Now
            </ProMaxButton>
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full border border-slate-300 bg-white/80 p-2.5 text-sm shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/80"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? "☀️" : "🌙"}
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>

      <footer className="border-t border-slate-200/70 bg-white/70 px-4 py-10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/70">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-3 lg:gap-4">
          <div>
            <p className="text-lg font-semibold text-slate-950 dark:text-white">Imam Marble & Tiles</p>
            <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Premium tiles and sanitary ware for luxury homes, hotels, and modern interiors.
            </p>
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">Quick Links</p>
            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-600 dark:text-slate-300">
              {navItems.map((item) => (
                <Link key={item.href} href={item.href} className="transition hover:text-indigo-500">
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="font-semibold text-slate-950 dark:text-white">Contact</p>
            <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
              <p>Phone: +91 7996078576</p>
              <p>Address: Vill - Kairibirpur</p>
              <a href="https://wa.me/917996078576" target="_blank" rel="noreferrer" className="inline-flex text-indigo-600 dark:text-indigo-300">
                WhatsApp us
              </a>
            </div>
          </div>
        </div>
      </footer>

      <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
        <motion.a
          href="https://wa.me/917996078576"
          target="_blank"
          rel="noreferrer"
          whileHover={{ scale: 1.05 }}
          className="flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-500/25"
        >
          <span className="text-base">💬</span>
          WhatsApp
        </motion.a>
        <ProMaxButton href="tel:+917996078576" variant="primary" className="flex items-center gap-2 px-4 py-3">
          <span className="text-base">📞</span>
          Call Now
        </ProMaxButton>
      </div>
    </div>
  );
}
