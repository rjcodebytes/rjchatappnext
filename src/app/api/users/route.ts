// /app/api/users/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "../../../../models/User";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, { username: 1, _id: 0 }); // only username
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
