// /app/api/login/route.ts
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/mongodb";
import User from "../../../../models/User";

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    await dbConnect();

    const user = await User.findOne({ username, password }); // ⚠️ plaintext for now
    if (!user) {
      return NextResponse.json(
        { message: "Invalid username or password" },
        { status: 401 }
      );
    }

    // ✅ Create response
    const res = NextResponse.json({
      message: "Login successful",
      username: user.username,
    });

    // ✅ Set cookie for session
    res.cookies.set("session_user", user.username, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60, // 1 hour
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
