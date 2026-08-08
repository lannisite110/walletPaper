"use client";

import { useEffect } from "react";

export type ClientErrorEntry = {
  id: string;
  at: string;
  type: "error" | "unhandledrejection";
  message: string;
  source?: string;
  line?: number;
  column?: number;
  stack?: string;
  href?: string;
};

const STORAGE_KEY = "wallet-paper-client-errors";
const MAX_ENTRIES = 40;

function readEntries(): ClientErrorEntry[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ClientErrorEntry[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeEntries(entries: ClientErrorEntry[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(entries.slice(0, MAX_ENTRIES)));
    window.dispatchEvent(new CustomEvent("wallet-paper-errors-updated"));
  } catch {
    // ignore quota / private mode
  }
}

function pushEntry(entry: Omit<ClientErrorEntry, "id" | "at" | "href">) {
  const next: ClientErrorEntry = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    at: new Date().toISOString(),
    href: window.location.href,
    ...entry,
  };
  writeEntries([next, ...readEntries()]);
}

export function clearClientErrors() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
    window.dispatchEvent(new CustomEvent("wallet-paper-errors-updated"));
  } catch {
    // ignore
  }
}

export function getClientErrors(): ClientErrorEntry[] {
  if (typeof window === "undefined") return [];
  return readEntries();
}

/** Captures window errors into localStorage for /status. */
export function ClientErrorCapture() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      pushEntry({
        type: "error",
        message: event.message || "Unknown error",
        source: event.filename,
        line: event.lineno,
        column: event.colno,
        stack: event.error instanceof Error ? event.error.stack : undefined,
      });
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "Unhandled promise rejection";
      pushEntry({
        type: "unhandledrejection",
        message,
        stack: reason instanceof Error ? reason.stack : undefined,
      });
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
