"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ProMaxButton } from "@/components/ui-pro-max";

const WHATSAPP_NUMBER = "917996078576";
const DEFAULT_MESSAGE =
  "Hi Imam Marble & Tiles! I'm interested in your Marble, Granite, Tiles and Sanitary Ware. Could you share more details?";

const CHECKLIST = ["Price", "Availability", "Design Suggestions", "Delivery", "Bulk Orders"];

const QUICK_REPLIES = [
  { label: "💰 Price", text: "Hi! Could you share pricing details for your marble and tiles range?" },
  { label: "📦 Availability", text: "Hi! I'd like to check the current availability of your products." },
  { label: "🚚 Delivery", text: "Hi! Do you deliver, and what are the delivery timelines?" },
];

function WhatsAppGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.01 3C9.38 3 4 8.35 4 14.94c0 2.23.61 4.31 1.68 6.11L4 29l8.2-1.64a13.06 13.06 0 0 0 3.81.57C22.63 27.93 28 22.58 28 15.98 28 9.4 22.63 3 16.01 3Zm0 22.68c-1.24 0-2.46-.24-3.6-.71l-.26-.11-4.87.97.97-4.75-.17-.28a10.7 10.7 0 0 1-1.65-5.66c0-5.5 4.5-9.97 10.03-9.97 5.53 0 10.03 4.48 10.03 9.97-.01 5.5-4.5 9.54-10.48 9.54Zm5.79-7.5c-.32-.16-1.89-.93-2.18-1.03-.29-.11-.5-.16-.72.16-.21.32-.82 1.03-1.01 1.24-.19.21-.37.24-.69.08-.32-.16-1.35-.5-2.57-1.58-.95-.85-1.6-1.9-1.78-2.22-.19-.32-.02-.49.14-.65.14-.14.32-.37.48-.55.16-.19.21-.32.32-.53.11-.21.05-.4-.03-.55-.08-.16-.72-1.74-.99-2.38-.26-.63-.53-.54-.72-.55-.19-.01-.4-.01-.61-.01-.21 0-.55.08-.84.4-.29.32-1.1 1.08-1.1 2.63 0 1.55 1.13 3.05 1.29 3.26.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.44.21 1.99.13.61-.09 1.89-.77 2.15-1.51.27-.74.27-1.38.19-1.51-.08-.14-.29-.21-.61-.37Z" />
    </svg>
  );
}

function CloseGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.25} className={className} aria-hidden="true">
      <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function SendGlyph({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className={className} aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="m3 11 18-8-8 18-2.5-7.5L3 11Z" />
    </svg>
  );
}

export function WhatsAppWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [showPeek, setShowPeek] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const peekIn = setTimeout(() => setShowPeek(true), 1800);
    const peekOut = setTimeout(() => setShowPeek(false), 6200);
    return () => {
      clearTimeout(peekIn);
      clearTimeout(peekOut);
    };
  }, []);

  useEffect(() => {
    function handlePointer(event: MouseEvent) {
      if (open && wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handlePointer);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handlePointer);
      document.removeEventListener("keydown", handleKey);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      setShowPeek(false);
      const focusTimer = setTimeout(() => textareaRef.current?.focus(), 200);
      return () => clearTimeout(focusTimer);
    }
  }, [open]);

  function handleSend() {
    const text = message.trim().length > 0 ? message.trim() : DEFAULT_MESSAGE;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setOpen(false);
  }

  function applyQuickReply(text: string) {
    setMessage(text);
    textareaRef.current?.focus();
  }

  return (
    <div ref={wrapperRef} className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Chat with Imam Marble & Tiles on WhatsApp"
            initial={{ opacity: 0, y: 24, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.94 }}
            transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full right-0 mb-4 w-[min(23rem,calc(100vw-2rem))] origin-bottom-right overflow-hidden rounded-[1.75rem] border border-white/70 bg-white/95 shadow-[0_35px_90px_-28px_rgba(15,23,42,0.55)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95"
          >
            <div className="relative overflow-hidden bg-gradient-to-r from-[#075E54] via-[#0f8f74] to-[#25D366] px-5 pb-5 pt-4">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -right-10 -top-10 h-36 w-36 rounded-full bg-white/10 blur-2xl"
              />
              <div className="relative flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-white/15 text-lg text-white shadow-inner backdrop-blur">
                    ✦
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">Imam Marble &amp; Tiles</p>
                    <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-50/90">
                      <span className="relative flex h-2 w-2">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-300 opacity-75" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-300" />
                      </span>
                      Typically replies within minutes
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close chat"
                  className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                >
                  <CloseGlyph className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="max-h-[calc(100vh-13rem)] overflow-y-auto px-5 py-4">
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600 dark:border-white/10 dark:bg-slate-800/60 dark:text-slate-300">
                <p className="font-semibold text-slate-950 dark:text-white">👋 Welcome to Imam Marble &amp; Tiles.</p>
                <p className="mt-2">
                  We&apos;re happy to help you choose the right Marble, Granite, Tiles and Sanitary Ware.
                </p>
                <p className="mt-2">Tell us what you&apos;re looking for and our team will assist you with:</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {CHECKLIST.map((item) => (
                    <span
                      key={item}
                      className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                    >
                      ✔ {item}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((reply) => (
                  <button
                    key={reply.label}
                    type="button"
                    onClick={() => applyQuickReply(reply.text)}
                    className="rounded-full border border-slate-200/70 bg-white/80 px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:text-emerald-600 dark:border-white/10 dark:bg-slate-800/70 dark:text-slate-300 dark:hover:text-emerald-300"
                  >
                    {reply.label}
                  </button>
                ))}
              </div>

              <label className="mt-4 block text-sm text-slate-600 dark:text-slate-300">
                <span className="mb-2 block font-medium text-slate-950 dark:text-white">Your message</span>
                <textarea
                  ref={textareaRef}
                  value={message}
                  onChange={(event) => setMessage(event.target.value)}
                  rows={3}
                  className="w-full resize-none rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 text-sm outline-none transition focus:border-emerald-400 dark:border-white/10 dark:bg-slate-800/70"
                />
              </label>

              <ProMaxButton
                type="button"
                variant="accent"
                onClick={handleSend}
                className="mt-4 w-full justify-center gap-2 py-3.5"
              >
                Send on WhatsApp
                <SendGlyph className="h-4 w-4" />
              </ProMaxButton>

              <p className="mt-3 text-center text-[11px] text-slate-500 dark:text-slate-400">
                Opens in WhatsApp &middot; We usually reply within minutes
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="group relative">
        <AnimatePresence>
          {!open && showPeek && (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 8 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-2 text-xs font-medium text-white shadow-lg backdrop-blur dark:bg-white/90 dark:text-slate-900"
            >
              Need help? Chat with us
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="pointer-events-none absolute right-full top-1/2 mr-3 -translate-y-1/2 whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-2 text-xs font-medium text-white opacity-0 shadow-lg backdrop-blur transition-opacity duration-200 group-hover:opacity-100 dark:bg-white/90 dark:text-slate-900">
            Need help? Chat with us
          </span>
        )}

        {!open && (
          <motion.span
            aria-hidden="true"
            className="absolute inset-0 rounded-full bg-emerald-400/70"
            animate={{ scale: [1, 1.9], opacity: [0.55, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2.6, ease: "easeOut" }}
          />
        )}

        <motion.button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-label={open ? "Close WhatsApp chat" : "Open WhatsApp chat"}
          aria-expanded={open}
          whileHover={{ scale: 1.06, y: -2 }}
          whileTap={{ scale: 0.96 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="relative flex h-14 w-14 items-center justify-center rounded-full border border-white/40 bg-gradient-to-br from-[#25D366] to-[#128C7E] text-white shadow-lg shadow-emerald-500/35 backdrop-blur-xl"
        >
          <AnimatePresence mode="wait" initial={false}>
            {open ? (
              <motion.span
                key="close"
                initial={{ opacity: 0, rotate: -45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 45 }}
                transition={{ duration: 0.15 }}
              >
                <CloseGlyph className="h-6 w-6" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ opacity: 0, rotate: 45 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -45 }}
                transition={{ duration: 0.15 }}
              >
                <WhatsAppGlyph className="h-7 w-7" />
              </motion.span>
            )}
          </AnimatePresence>
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-400 dark:border-slate-950" />
          )}
        </motion.button>
      </div>
    </div>
  );
}
