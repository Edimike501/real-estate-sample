"use client";

import { ChevronDown, DollarSign } from "lucide-react";
import { useState } from "react";

import { useDiasporaLocation } from "@/hooks/useDiasporaLocation";
import { formatNGN } from "@/lib/utils";
import { type Property } from "@/types";

type PriceDropdownProps = {
  property: Property;
};

type PriceCurrency = "NGN" | "USD" | "GBP" | "EUR" | "AED";

type PriceOption = {
  currency: PriceCurrency;
  symbol: string;
  value: number;
};

export function PriceDropdown({ property }: PriceDropdownProps) {
  const { currency, CURRENCY_SYMBOLS, isNigerian } = useDiasporaLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState<PriceCurrency>(
    () => {
      return currency === "USD" ||
        currency === "GBP" ||
        currency === "EUR" ||
        currency === "AED"
        ? currency
        : "USD";
    }
  );

  const baseAmount = property.salePrice || property.rentalPrice;
  if (!baseAmount) {
    return <p className="text-2xl font-bold text-accent">Contact for price</p>;
  }

  // Calculate prices for all currencies
  const rates: Record<string, number> = {
    USD: 1500,
    GBP: 1900,
    EUR: 1600,
    AED: 400
  };

  const formatValue = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  const prices: PriceOption[] = [
    { currency: "NGN", symbol: "₦", value: baseAmount },
    { currency: "USD", symbol: "$", value: baseAmount / rates.USD },
    { currency: "GBP", symbol: "£", value: baseAmount / rates.GBP },
    { currency: "EUR", symbol: "€", value: baseAmount / rates.EUR },
    { currency: "AED", symbol: "د.إ", value: baseAmount / rates.AED }
  ];

  const selectedPrice =
    prices.find((p) => p.currency === selectedCurrency) || prices[0];
  const frequency =
    property.priceFrequency === "PER_YEAR"
      ? "/ Year"
      : property.priceFrequency === "PER_MONTH"
        ? "/ Month"
        : "";

  // If user is Nigerian, show only NGN price (hide dropdown)
  if (isNigerian) {
    return (
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-accent">
          {formatNGN(baseAmount)}
        </span>
        {frequency && (
          <span className="text-lg text-text-secondary">{frequency}</span>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Main Naira Price - Always Prominent */}
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold text-accent">
          {formatNGN(baseAmount)}
        </span>
        {frequency && (
          <span className="text-lg text-text-secondary">{frequency}</span>
        )}
      </div>

      {/* Currency Dropdown */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 rounded-md border border-border bg-bg-secondary px-4 py-2 text-sm font-medium text-text-primary hover:bg-bg-tertiary transition">
          <DollarSign className="w-4 h-4" />
          <span>
            {selectedPrice.symbol}
            {formatValue(selectedPrice.value)}
            {frequency}
          </span>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 mt-2 w-full rounded-md border border-border bg-bg-secondary shadow-lg">
            {prices.map((price) => (
              <button
                key={price.currency}
                type="button"
                onClick={() => {
                  setSelectedCurrency(price.currency);
                  setIsOpen(false);
                }}
                className={`w-full px-4 py-2 text-left text-sm transition ${
                  selectedCurrency === price.currency
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-text-primary hover:bg-bg-tertiary"
                }`}>
                <span className="font-medium">{price.symbol}</span>
                <span className="ml-1">{formatValue(price.value)}</span>
                {frequency && (
                  <span className="ml-1 text-text-secondary">{frequency}</span>
                )}
                {price.currency === (currency || "USD") && (
                  <span className="ml-2 rounded-full bg-accent/20 px-2 py-0.5 text-xs text-accent">
                    Your location
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
