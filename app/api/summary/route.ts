import { NextResponse } from "next/server";
import { generateSummary } from "@/lib/summary";

export async function POST(req: Request) {
  try {
    const { input, result } = await req.json();
    if (!input || !result) {
      return NextResponse.json({ error: "Missing payload" }, { status: 400 });
    }

    const summary = await generateSummary(input, result);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error("Summary API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
