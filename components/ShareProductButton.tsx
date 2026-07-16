"use client";

import { useState } from "react";
import { ProMaxButton } from "@/components/ui-pro-max";

type ShareProductButtonProps = {
  productName: string;
};

export function ShareProductButton({ productName }: ShareProductButtonProps) {
  const [feedback, setFeedback] = useState<string | null>(null);

  async function handleShare() {
    const url = window.location.href;
    const shareData = {
      title: productName,
      text: `Check out ${productName} from Imam Marble & Tiles`,
      url,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled the share sheet; no feedback needed
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setFeedback("Link copied");
      setTimeout(() => setFeedback(null), 2000);
    } catch {
      setFeedback("Couldn't copy link");
      setTimeout(() => setFeedback(null), 2000);
    }
  }

  return (
    <div className="relative inline-flex">
      <ProMaxButton type="button" variant="secondary" onClick={handleShare}>
        Share Product
      </ProMaxButton>
      {feedback && (
        <span className="absolute -top-9 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-slate-950 px-3 py-1 text-xs font-medium text-white shadow-lg dark:bg-white dark:text-slate-950">
          {feedback}
        </span>
      )}
    </div>
  );
}
