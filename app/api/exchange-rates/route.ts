import { NextResponse } from "next/server";
import { getExchangeRates } from "@/lib/currency";

export async function GET() {
  try {
    const rates = await getExchangeRates();
    return NextResponse.json({
      rates,
      lastUpdated: new Date().toISOString()
    });
  } catch (error) {
    console.error("Exchange rates API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch exchange rates" },
      { status: 500 }
    );
  }
}
