"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useCurrencyRate, DiasporaCurrency, CurrencyRates } from "@/hooks/useCurrencyRate";

type SelectedCurrency = DiasporaCurrency | "NGN";

interface CurrencyContextProps {
  currency: SelectedCurrency;
  setCurrency: (currency: SelectedCurrency) => void;
  rates: Partial<Record<DiasporaCurrency, number>>;
  lastUpdated: string;
  loading: boolean;
  error: boolean;
}

const CurrencyContext = createContext<CurrencyContextProps | undefined>(undefined);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { rates, lastUpdated, loading, error } = useCurrencyRate();
  const [currency, setCurrencyState] = useState<SelectedCurrency>("NGN");

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem("opollo_selected_currency");
      if (saved) {
        setCurrencyState(saved as SelectedCurrency);
      }
    }
  }, []);

  const setCurrency = (curr: SelectedCurrency) => {
    setCurrencyState(curr);
    if (typeof window !== "undefined") {
      window.localStorage.setItem("opollo_selected_currency", curr);
    }
  };

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, rates, lastUpdated, loading, error }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
