"use client";

import { useEffect } from "react";

// Global safety net: ensure no fetch in the app can hang forever.
// Wraps window.fetch to inject a default AbortSignal timeout unless one is provided.
export function FetchTimeoutGuard() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const nativeFetch = window.fetch.bind(window);
    const TIMEOUT = 15000;

    window.fetch = (input: RequestInfo | URL, init?: RequestInit) => {
      if (!init?.signal && typeof AbortSignal !== "undefined" && "timeout" in AbortSignal) {
        try {
          init = { ...init, signal: AbortSignal.timeout(TIMEOUT) };
        } catch {
          // If timeout signal can't be created, fall back to the native fetch without it.
        }
      }
      return nativeFetch(input, init);
    };

    return () => {
      window.fetch = nativeFetch;
    };
  }, []);

  return null;
}
