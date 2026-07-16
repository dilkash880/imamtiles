"use client";

import { useState } from "react";
import { ProMaxButton, ProMaxPanel } from "@/components/ui-pro-max";

type RequestQuoteFormProps = {
  productId: number;
  productName: string;
};

export function RequestQuoteForm({ productId, productName }: RequestQuoteFormProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(`I'm interested in ${productName}. Please share pricing and availability.`);
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");
    setFeedback(null);

    const formData = new FormData();
    formData.append("name", name.trim());
    formData.append("email", email.trim());
    formData.append("phone", phone.trim());
    formData.append("type", "quote");
    formData.append("message", message.trim());
    formData.append("product_id", String(productId));
    formData.append("product_name", productName);

    try {
      const response = await fetch("/api/enquiries", { method: "POST", body: formData });
      const payload = await response.json();

      if (!response.ok) {
        setStatus("error");
        setFeedback(payload.error || "Failed to send your quote request.");
        return;
      }

      setStatus("success");
      setFeedback("Your quote request has been submitted. Our team will reply soon.");
      setName("");
      setEmail("");
      setPhone("");
    } catch (error: any) {
      setStatus("error");
      setFeedback(error?.message || "Something went wrong. Please try again.");
    }
  }

  if (!open) {
    return (
      <ProMaxButton type="button" variant="primary" onClick={() => setOpen(true)}>
        Request a Quote
      </ProMaxButton>
    );
  }

  return (
    <ProMaxPanel>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-slate-950 dark:text-white">Request a Quote</h2>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Close quote form"
          className="text-sm text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white"
        >
          ✕
        </button>
      </div>

      <form className="mt-4 space-y-4" onSubmit={handleSubmit}>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="text-sm text-slate-600 dark:text-slate-300">
            <span className="mb-2 block font-medium">Name</span>
            <input
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70"
              placeholder="Your name"
            />
          </label>
          <label className="text-sm text-slate-600 dark:text-slate-300">
            <span className="mb-2 block font-medium">Phone</span>
            <input
              required
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70"
              placeholder="Your phone"
            />
          </label>
        </div>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          <span className="mb-2 block font-medium">Email</span>
          <input
            required
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70"
            placeholder="Your email"
          />
        </label>

        <label className="block text-sm text-slate-600 dark:text-slate-300">
          <span className="mb-2 block font-medium">Message</span>
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            className="min-h-24 w-full rounded-2xl border border-slate-200/70 bg-slate-50/70 px-4 py-3 outline-none dark:border-white/10 dark:bg-slate-800/70"
          />
        </label>

        {feedback && (
          <p className={`text-sm ${status === "error" ? "text-rose-600" : "text-emerald-600"}`}>{feedback}</p>
        )}

        <ProMaxButton type="submit" disabled={status === "submitting"} variant="primary">
          {status === "submitting" ? "Sending…" : "Send Quote Request"}
        </ProMaxButton>
      </form>
    </ProMaxPanel>
  );
}
