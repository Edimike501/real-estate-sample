import { prisma } from "@/lib/prisma";
import { type Property } from "@/types";

export async function getExchangeRates(): Promise<Record<string, number>> {
  const targetCurrencies = ["USD", "GBP", "EUR", "AED"];
  const now = new Date();
  const fourHoursAgo = new Date(now.getTime() - 4 * 60 * 60 * 1000);

  // Check db rates first
  const cachedRates = await prisma.exchangeRate.findMany();

  const isCacheValid =
    cachedRates.length === targetCurrencies.length &&
    cachedRates.every((r) => r.updatedAt >= fourHoursAgo);

  if (isCacheValid) {
    const ratesMap: Record<string, number> = {};
    for (const r of cachedRates) {
      ratesMap[r.currency] = r.rateToNaira;
    }
    return ratesMap;
  }

  // Cache is invalid or missing, fetch from open-exchange provider
  try {
    const response = await fetch("https://open.er-api.com/v6/latest/NGN", {
      next: { revalidate: 0 }
    });
    if (!response.ok) {
      throw new Error(`Failed to fetch exchange rates: ${response.statusText}`);
    }
    const data = (await response.json()) as {
      result: string;
      rates?: Record<string, number>;
    };

    if (data.result !== "success" || !data.rates) {
      throw new Error("Invalid response from exchange rate API");
    }

    const ratesMap: Record<string, number> = {};

    for (const currency of targetCurrencies) {
      const rateFromApi = data.rates[currency];
      if (rateFromApi && rateFromApi > 0) {
        const rateToNaira = 1 / rateFromApi;
        ratesMap[currency] = rateToNaira;

        // Upsert into DB
        await prisma.exchangeRate.upsert({
          where: { currency },
          update: { rateToNaira },
          create: { currency, rateToNaira }
        });
      } else {
        // Fallback to cache if exists
        const existing = cachedRates.find((r) => r.currency === currency);
        if (existing) {
          ratesMap[currency] = existing.rateToNaira;
        } else {
          // Hardcoded safe fallbacks if no database records exist
          const defaults: Record<string, number> = {
            USD: 1500,
            GBP: 1900,
            EUR: 1600,
            AED: 400
          };
          ratesMap[currency] = defaults[currency];
        }
      }
    }

    return ratesMap;
  } catch (error) {
    console.error(
      "Error updating exchange rates, using cached/default fallback:",
      error
    );
    const ratesMap: Record<string, number> = {};
    const defaults: Record<string, number> = {
      USD: 1500,
      GBP: 1900,
      EUR: 1600,
      AED: 400
    };

    for (const currency of targetCurrencies) {
      const existing = cachedRates.find((r) => r.currency === currency);
      ratesMap[currency] = existing ? existing.rateToNaira : defaults[currency];
    }
    return ratesMap;
  }
}

export function formatDiasporaPrices(
  nairaAmount: number,
  rates: Record<string, number>,
  targetCurrency?: string | null
): string {
  const formatValue = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      maximumFractionDigits: 0
    }).format(Math.round(val));
  };

  // Base Naira price string
  const nairaString = `₦${formatValue(nairaAmount)}`;

  // If a specific target currency is selected, format it in brackets
  if (targetCurrency && rates[targetCurrency] && rates[targetCurrency] > 0) {
    const symbols: Record<string, string> = {
      USD: "$",
      GBP: "£",
      EUR: "€",
      AED: "د.إ"
    };
    const symbol = symbols[targetCurrency] || targetCurrency;
    const foreignPrice = `${symbol}${formatValue(nairaAmount / rates[targetCurrency])}`;

    // Returns: ₦18,000,000 ($13,230)
    return `${nairaString} (${foreignPrice})`;
  }

  // Fallback: If no targetCurrency is passed, default to USD in brackets
  const usdRate = rates["USD"];
  if (usdRate && usdRate > 0) {
    const usdPrice = `$${formatValue(nairaAmount / usdRate)}`;
    return `${nairaString} (${usdPrice})`;
  }

  // Absolute fallback if no rates are available at all
  return nairaString;
}

export function getDiasporaDisplayPrice(
  property: Property,
  rates: Record<string, number>,
  targetCurrency?: string | null
): string {
  const baseAmount = property.salePrice || property.rentalPrice;
  if (!baseAmount) return "Contact for price";

  const formattedChain = formatDiasporaPrices(
    baseAmount,
    rates,
    targetCurrency
  );

  if (property.rentalPrice && property.priceFrequency) {
    const freq =
      property.priceFrequency === "PER_YEAR"
        ? " / Year"
        : property.priceFrequency === "PER_MONTH"
          ? " / Month"
          : "";
    return `${formattedChain}${freq}`;
  }

  return formattedChain;
}
