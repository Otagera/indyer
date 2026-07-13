import { useState } from "react";

type ShareStatus = "idle" | "loading" | "success" | "error";

export function ShareButton() {
  const [status, setStatus] = useState<ShareStatus>("idle");

  const handleShare = async () => {
    setStatus("loading");
    try {
      const res = await fetch("/api/share/card", { credentials: "include" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();

      const shareUrl = "https://indyer.otagera.xyz";
      // Share sheets concatenate text and url, so the domain lives only in url;
      // the clipboard fallbacks below have no url field and keep it in the text.
      const shareText = "Play Indyer at indyer.otagera.xyz";

      if (navigator.share && navigator.canShare?.({ files: [new File([blob], "indyer.png", { type: "image/png" })] })) {
        await navigator.share({
          files: [new File([blob], "indyer.png", { type: "image/png" })],
          url: shareUrl,
          text: "Play Indyer",
        });
        setStatus("success");
        return;
      }

      if (navigator.clipboard?.write) {
        await navigator.clipboard.write([
          new ClipboardItem({ "image/png": blob }),
          new ClipboardItem({ "text/plain": new Blob([shareText], { type: "text/plain" }) }),
        ]);
        setStatus("success");
        return;
      }

      await navigator.clipboard.writeText(shareText);
      setStatus("success");
    } catch {
      setStatus("error");
    }

    setTimeout(() => setStatus("idle"), 2000);
  };

  const label = status === "loading" ? "Generating…"
    : status === "success" ? "Copied!" as const
    : status === "error" ? "Failed" as const
    : "Share" as const;

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={status === "loading"}
      className="w-full font-shouty uppercase tracking-[0.08em] text-sm py-3 border-2 border-ink text-ink shadow-[4px_4px_0_#141210] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all mb-2 disabled:opacity-50"
    >
      {label}
    </button>
  );
}
