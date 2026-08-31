"use client";

import { useEffect, useState } from "react";

export type DiasporaCurrency = "GBP" | "USD" | "CAD" | "AED" | "EUR";

export type CurrencyRates = {
  rates: Partial<Record<DiasporaCurrency, number>>;
  lastUpdated: string;
  loading: boolean;
  error: boolean;
};

const CACHE_KEY = "aura_fx_rates";
const TTL_MS = 6 * 60 * 60 * 1000; // 6 hours

interface CachedData {
  rates: Partial<Record<DiasporaCurrency, number>>;
  lastUpdated: string;
  timestamp: number;
}

export function useCurrencyRate(): CurrencyRates {
  const [data, setData] = useState<CurrencyRates>({
    rates: {},
    lastUpdated: "",
    loading: true,
    error: false
  });

  useEffect(() => {
    let active = true;
    let cachedData: CachedData | null = null;

    async function fetchRates() {
      // 1. Try local cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          cachedData = JSON.parse(cached);
          const now = Date.now();
          if (cachedData && now - cachedData.timestamp < TTL_MS) {
            if (active) {
              setData({
                rates: cachedData.rates,
                lastUpdated: cachedData.lastUpdated,
                loading: false,
                error: false
              });
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error reading cached rates", e);
      }

      // 2. Fetch fresh rates from our API proxy
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await fetch("/api/exchange-rates", {
          signal: controller.signal
        });
        clearTimeout(timeoutId);

        if (!res.ok) {
          throw new Error(`Failed to fetch exchange rates: ${res.status}`);
        }

        const json = await res.json() as {
          rates: Record<string, number>;
          lastUpdated: string;
        };

        // Server returns rates keyed by currency (e.g. { USD: 1500, GBP: 1900 })
        const rates: Partial<Record<DiasporaCurrency, number>> = {
          GBP: json.rates.GBP,
          USD: json.rates.USD,
          CAD: json.rates.CAD,
          AED: json.rates.AED,
          EUR: json.rates.EUR
        };

        const lastUpdated = new Date(json.lastUpdated).toLocaleDateString(
          "en-US",
          {
            month: "short",
            day: "numeric",
            year: "numeric"
          }
        );

        const cacheObj: CachedData = {
          rates,
          lastUpdated,
          timestamp: Date.now()
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));

        if (active) {
          setData({
            rates,
            lastUpdated,
            loading: false,
            error: false
          });
        }
      } catch (err) {
        console.error("Error fetching exchange rates:", err);

        // Fallback to expired cache if available
        if (cachedData && active) {
          setData({
            rates: cachedData.rates,
            lastUpdated: cachedData.lastUpdated,
            loading: false,
            error: true // Still mark as error to indicate data might be stale
          });
        } else if (active) {
          setData({
            rates: {},
            lastUpdated: "",
            loading: false,
            error: true
          });
        }
      }
    }

    fetchRates();

    return () => {
      active = false;
    };
  }, []);

  return data;
}
