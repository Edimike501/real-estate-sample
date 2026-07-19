import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const lat = searchParams.get("lat");
    const lon = searchParams.get("lon");

    if (q) {
      // Forward geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          q
        )}&format=json&limit=5&addressdetails=1`,
        {
          headers: {
            "User-Agent": "OpolloLuxuriesRealEstate/1.0 (contact@opollo.com)",
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Nominatim search returned ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else if (lat && lon) {
      // Reverse geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${encodeURIComponent(
          lat
        )}&lon=${encodeURIComponent(lon)}`,
        {
          headers: {
            "User-Agent": "OpolloLuxuriesRealEstate/1.0 (contact@opollo.com)",
            "Accept-Language": "en",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Nominatim reverse returned ${response.status}`);
      }

      const data = await response.json();
      return NextResponse.json(data);
    } else {
      return NextResponse.json(
        { error: "Missing query parameter 'q' or 'lat' and 'lon'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Geocoding API proxy error:", error);
    return NextResponse.json(
      { error: "Failed to perform geocoding operation" },
      { status: 500 }
    );
  }
}
