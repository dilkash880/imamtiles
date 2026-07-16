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

const footerContactLinkClass =
  "group flex cursor-pointer items-center gap-2.5 rounded-lg transition hover:text-indigo-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:hover:text-indigo-300 dark:focus-visible:ring-offset-slate-950";

const footerIconClass =
  "h-4 w-4 flex-shrink-0 text-indigo-500 transition group-hover:scale-110 dark:text-indigo-300";

function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 5.5C3 14.06 9.94 21 18.5 21c.41 0 .78-.28.89-.68l.9-3.3a.9.9 0 0 0-.46-1.03l-3.6-1.73a.9.9 0 0 0-1.05.19l-1.27 1.4a11.5 11.5 0 0 1-5.26-5.26l1.4-1.27a.9.9 0 0 0 .19-1.05L8.51 4.67a.9.9 0 0 0-1.03-.46l-3.3.9a.9.9 0 0 0-.68.89Z" />
    </svg>
  );
}

function MailIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.75h16.5v12.5H3.75z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="m4 6 8 7 8-7" />
    </svg>
  );
}

function MapPinIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21s-7-6.1-7-11.5A7 7 0 0 1 19 9.5C19 14.9 12 21 12 21Z" />
      <circle cx="12" cy="9.5" r="2.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.5a8.5 8.5 0 0 1-12.36 7.58L3 20l1.02-5.4A8.5 8.5 0 1 1 21 11.5Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.5 9.5c0-.5.4-1.5.9-1.5s.8.9.9 1.3c.1.4-.4.7-.3 1.1.2.9 1.4 2.1 2.3 2.3.4.1.7-.4 1.1-.3.4.1 1.3.4 1.3.9s-1 .9-1.5.9c-1.4 0-4.2-2.8-4.2-4.2Z" />
    </svg>
  );
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

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
            <button
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white/80 text-slate-700 shadow-sm backdrop-blur md:hidden dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-200"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              <span className="relative flex h-4 w-5 flex-col justify-between">
                <span className={`h-0.5 w-full rounded-full bg-current transition ${mobileMenuOpen ? "translate-y-[7px] rotate-45" : ""}`} />
                <span className={`h-0.5 w-full rounded-full bg-current transition ${mobileMenuOpen ? "opacity-0" : ""}`} />
                <span className={`h-0.5 w-full rounded-full bg-current transition ${mobileMenuOpen ? "-translate-y-[7px] -rotate-45" : ""}`} />
              </span>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <nav className="border-t border-slate-200/60 bg-white/95 px-4 py-3 backdrop-blur-xl md:hidden dark:border-white/10 dark:bg-slate-950/95">
            <div className="mx-auto flex max-w-7xl flex-col gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`rounded-xl px-3 py-2.5 text-sm font-medium transition ${isActive ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-300" : "text-slate-600 hover:bg-slate-100 hover:text-indigo-600 dark:text-slate-300 dark:hover:bg-slate-800"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <ProMaxButton href="tel:+917996078576" variant="primary" className="mt-2 inline-flex justify-center px-4 py-2 sm:hidden">
                Call Now
              </ProMaxButton>
            </div>
          </nav>
        )}
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
            <div className="mt-3 space-y-2.5 text-sm text-slate-600 dark:text-slate-300">
              <a href="tel:+917996078576" aria-label="Call Imam Marble & Tiles at +91 79960 78576" className={footerContactLinkClass}>
                <PhoneIcon className={footerIconClass} />
                <span>+91 7996078576</span>
              </a>
              <a href="mailto:info.dilkashimam@gmail.com" aria-label="Email Imam Marble & Tiles at info.dilkashimam@gmail.com" className={footerContactLinkClass}>
                <MailIcon className={footerIconClass} />
                <span>info.dilkashimam@gmail.com</span>
              </a>
              <a
                href="https://www.google.com/maps/search/?api=1&query=Vill+-+Kairibirpur"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Open Imam Marble & Tiles location, Vill - Kairibirpur, in Google Maps (opens in a new tab)"
                className={footerContactLinkClass}
              >
                <MapPinIcon className={footerIconClass} />
                <span>Vill - Kairibirpur</span>
              </a>
              <a
                href="https://wa.me/917996078576"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with Imam Marble & Tiles on WhatsApp (opens in a new tab)"
                className={footerContactLinkClass}
              >
                <WhatsAppIcon className={footerIconClass} />
                <span>WhatsApp us</span>
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
