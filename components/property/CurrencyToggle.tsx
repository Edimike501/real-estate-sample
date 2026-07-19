"use client";

import { DiasporaCurrency } from "@/hooks/useCurrencyRate";

type SelectedCurrency = DiasporaCurrency | "NGN";

interface CurrencyToggleProps {
  selected: SelectedCurrency;
  onChange: (currency: SelectedCurrency) => void;
}

const currencies: SelectedCurrency[] = ["NGN", "USD", "GBP", "CAD", "AED", "EUR"];

export default function CurrencyToggle({ selected, onChange }: CurrencyToggleProps) {
  return (
    <div className="flex flex-col gap-2">
      <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">
        View prices in:
      </span>
      <div className="flex overflow-x-auto pb-1 gap-2 scrollbar-none snap-x -mx-4 px-4 md:mx-0 md:px-0">
        {currencies.map((curr) => {
          const isActive = selected === curr;
          return (
            <button
              key={curr}
              onClick={() => onChange(curr)}
              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200 snap-start shrink-0 cursor-pointer ${
                isActive
                  ? "bg-accent border-accent text-white shadow-sm"
                  : "border-border bg-bg-secondary text-text-secondary hover:text-text-primary hover:border-text-secondary"
              }`}
            >
              {curr}
            </button>
          );
        })}
      </div>
    </div>
  );
}
