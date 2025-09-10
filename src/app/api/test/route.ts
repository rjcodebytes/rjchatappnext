import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";

export async function GET() {
  try {
    await dbConnect(); // try to connect
    return NextResponse.json({ connected: true });
  } catch (err) {
    const error = err as Error;
    console.error("MongoDB connection error:", error.message);
    return NextResponse.json(
      { connected: false, error: error.message },
      { status: 500 }
    );
  }
}
