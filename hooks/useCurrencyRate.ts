"use client";

import { useState, useEffect } from "react";

export type DiasporaCurrency = "GBP" | "USD" | "CAD" | "AED" | "EUR";

export type CurrencyRates = {
  rates: Partial<Record<DiasporaCurrency, number>>;
  lastUpdated: string;
  loading: boolean;
  error: boolean;
};

const CACHE_KEY = "opollo_fx_rates";
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
    error: false,
  });

  useEffect(() => {
    let active = true;

    async function fetchRates() {
      // 1. Try local cache first
      try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const parsed: CachedData = JSON.parse(cached);
          const now = Date.now();
          if (now - parsed.timestamp < TTL_MS) {
            if (active) {
              setData({
                rates: parsed.rates,
                lastUpdated: parsed.lastUpdated,
                loading: false,
                error: false,
              });
              return;
            }
          }
        }
      } catch (e) {
        console.error("Error reading cached rates", e);
      }

      // 2. Fetch fresh rates
      try {
        const res = await fetch("https://open.er-api.com/v6/latest/NGN");
        if (!res.ok) {
          throw new Error("Failed to fetch exchange rates");
        }
        const json = await res.json();
        
        const rates: Partial<Record<DiasporaCurrency, number>> = {
          GBP: json.rates.GBP,
          USD: json.rates.USD,
          CAD: json.rates.CAD,
          AED: json.rates.AED,
          EUR: json.rates.EUR,
        };

        const lastUpdated = new Date(json.time_last_update_utc).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });

        const cacheObj: CachedData = {
          rates,
          lastUpdated,
          timestamp: Date.now(),
        };

        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheObj));

        if (active) {
          setData({
            rates,
            lastUpdated,
            loading: false,
            error: false,
          });
        }
      } catch (err) {
        console.error(err);
        if (active) {
          setData({
            rates: {},
            lastUpdated: "",
            loading: false,
            error: true,
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
