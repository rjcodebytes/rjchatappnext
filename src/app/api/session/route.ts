// /app/api/session/route.ts
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const cookieHeader = req.headers.get("cookie");
  const cookies = Object.fromEntries(
    (cookieHeader || "")
      .split(";")
      .map((c) => c.trim().split("="))
      .map(([k, v]) => [k, decodeURIComponent(v || "")])
  );

  const username = cookies["session_user"];

  if (username) {
    return NextResponse.json({ loggedIn: true, username });
  }

  return NextResponse.json({ loggedIn: false });
}
