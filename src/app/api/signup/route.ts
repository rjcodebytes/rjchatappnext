// /app/api/signup/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    await dbConnect();
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "All fields required" }, { status: 400 });
    }

    // Save user
    const newUser = new User({ username, password });
    await newUser.save();

    return NextResponse.json({ success: true, user: newUser });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({}, { username: 1, _id: 0 }); // only username
    return NextResponse.json({ success: true, users });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}