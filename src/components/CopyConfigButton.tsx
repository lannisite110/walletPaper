"use client";

import { useState } from "react";

type CopyConfigButtonProps = {
  label: string;
  configText: string;
};

export function CopyConfigButton({ label, configText }: CopyConfigButtonProps) {
  const [copied, setCopied] = useState(false);
  const [showFallback, setShowFallback] = useState(false);

  async function copyConfig() {
    try {
      await navigator.clipboard.writeText(configText);
      setCopied(true);
      setShowFallback(false);
    } catch {
      setShowFallback(true);
    }
  }

  return (
    <div className="space-y-3">
      <button
        type="button"
        onClick={copyConfig}
        className="rounded-md bg-[var(--accent)] px-4 py-2 text-sm font-semibold text-[var(--bg)] transition-opacity hover:opacity-90"
      >
        {copied ? "Copied" : label}
      </button>
      {showFallback ? (
        <pre className="overflow-x-auto rounded-md border border-[var(--border)] bg-[var(--bg)] p-4 text-sm text-[var(--text)]">
          {configText}
        </pre>
      ) : null}
    </div>
  );
}
