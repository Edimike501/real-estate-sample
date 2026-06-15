"use client";

import { DiasporaCurrency } from "@/hooks/useCurrencyRate";
import { NegotiationStatus, PriceFrequency } from "@/types/enums";

interface PriceDisplayProps {
  ngnAmount: number | null | undefined;
  currency: DiasporaCurrency | "NGN";
  rates: Partial<Record<DiasporaCurrency, number>>;
  frequency?: PriceFrequency | string | null;
  negotiationStatus?: NegotiationStatus | string | null;
  size?: "sm" | "md" | "lg";
  lastUpdated?: string;
}

const currencySymbolMap: Record<DiasporaCurrency | "NGN", string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  CAD: "CA$",
  AED: "AED ",
  EUR: "€"
};

const localeMap: Record<DiasporaCurrency | "NGN", string> = {
  NGN: "en-NG",
  USD: "en-US",
  GBP: "en-GB",
  CAD: "en-CA",
  AED: "en-AE",
  EUR: "de-DE" // or 'en-IE'
};

export default function PriceDisplay({
  ngnAmount,
  currency,
  rates,
  frequency,
  negotiationStatus,
  size = "md",
  lastUpdated
}: PriceDisplayProps) {
  if (
    negotiationStatus === "CONTACT_FOR_PRICE" ||
    negotiationStatus === NegotiationStatus.CONTACT_FOR_PRICE
  ) {
    return (
      <span className="text-accent font-semibold tracking-wide">
        Contact for Price
      </span>
    );
  }

  if (!ngnAmount) {
    return <span className="text-muted-foreground">Price on Request</span>;
  }

  const freqLabel =
    frequency === "PER_MONTH" || frequency === PriceFrequency.PER_MONTH
      ? " / month"
      : frequency === "PER_YEAR" || frequency === PriceFrequency.PER_YEAR
        ? " / year"
        : "";

  const formatNgn = (amount: number) => {
    try {
      return new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "NGN",
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      return `₦${amount.toLocaleString()}`;
    }
  };

  const formatForeign = (amount: number, curr: DiasporaCurrency) => {
    const locale = localeMap[curr] || "en-US";
    try {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: curr,
        maximumFractionDigits: 0
      }).format(amount);
    } catch {
      const symbol = currencySymbolMap[curr] || curr;
      return `${symbol}${amount.toLocaleString()}`;
    }
  };

  const isNgn = currency === "NGN";
  const rate = !isNgn ? rates[currency as DiasporaCurrency] : undefined;

  const sizeClasses = {
    sm: "text-sm font-semibold",
    md: "text-base md:text-lg font-bold",
    lg: "text-2xl md:text-3xl font-extrabold"
  };

  if (isNgn || !rate) {
    return (
      <div className="flex flex-col">
        <span className={`${sizeClasses[size]} text-accent`}>
          {formatNgn(ngnAmount)}
          {freqLabel}
        </span>
      </div>
    );
  }

  // Foreign currency active
  // Rate represents "how many NGN per 1 foreign currency" (e.g., 1500 NGN = 1 USD)
  // So to convert NGN to foreign currency, we DIVIDE by the rate
  const converted = ngnAmount / rate;

  return (
    <div className="flex flex-col gap-0.5">
      <span className={`${sizeClasses[size]} text-accent`}>
        {formatForeign(converted, currency as DiasporaCurrency)}
        {freqLabel}
      </span>
      <span className="text-xs text-muted-foreground font-medium">
        {formatNgn(ngnAmount)} NGN
      </span>
      {lastUpdated && (
        <span className="text-[10px] text-text-muted mt-0.5">
          Rate as of {lastUpdated}. For reference only.
        </span>
      )}
    </div>
  );
}
