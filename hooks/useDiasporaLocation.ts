"use client";

import { useState } from "react";

export type DiasporaCurrency = "USD" | "GBP" | "EUR" | "AED" | null;

const COUNTRY_TO_CURRENCY: Record<string, DiasporaCurrency> = {
  US: "USD",
  GB: "GBP",
  AE: "AED",
  CA: "USD",
  NG: null
};

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  GBP: "£",
  EUR: "€",
  AED: "د.إ",
  NGN: "₦"
};

// Helper function to safely detect the initial currency on the client
const getInitialCurrency = (): DiasporaCurrency => {
  if (typeof window === "undefined") return null;

  // 1. Try local storage
  const savedCurrency = localStorage.getItem(
    "diasporaCurrency"
  ) as DiasporaCurrency;
  if (savedCurrency) return savedCurrency;

  // 2. Try browser locale detection
  const browserLocale = navigator.language || navigator.languages?.[0];
  if (browserLocale) {
    const countryCode = browserLocale.split("-")[1]?.toUpperCase();
    const detectedCurrency = COUNTRY_TO_CURRENCY[countryCode];
    if (detectedCurrency !== undefined) {
      // Check if key exists in our map
      if (detectedCurrency) {
        localStorage.setItem("diasporaCurrency", detectedCurrency);
      }
      return detectedCurrency;
    }
  }

  // 3. Fallback default
  localStorage.setItem("diasporaCurrency", "USD");
  return "USD";
};

export function useDiasporaLocation() {
  // Initialize state once on mount. No useEffect required!
  const [currency, setCurrency] = useState<DiasporaCurrency>(() =>
    getInitialCurrency()
  );

  // Since we determine currency instantly on mount, we are never "loading" on the client
  const [isLoading, setIsLoading] = useState(false);

  const setDiasporaCurrency = (newCurrency: DiasporaCurrency) => {
    setCurrency(newCurrency);
    if (newCurrency) {
      localStorage.setItem("diasporaCurrency", newCurrency);
    } else {
      localStorage.removeItem("diasporaCurrency");
    }
  };

  return { currency, isLoading, setDiasporaCurrency, CURRENCY_SYMBOLS };
}
