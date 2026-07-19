import { NextResponse } from "next/server";
import { submitToIndexNow } from "@/lib/indexnow";

export async function POST(request: Request) {
  try {
    const { urls } = await request.json();

    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json({ error: "Invalid URLs payload" }, { status: 400 });
    }

    const result = await submitToIndexNow(urls);

    if (result.success) {
      return NextResponse.json({ success: true, message: result.message });
    } else {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }
  } catch (error) {
    console.error("IndexNow API route error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
