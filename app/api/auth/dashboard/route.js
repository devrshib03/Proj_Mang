import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return NextResponse.json({ success: true, message: "Access granted", user: decoded });
  } catch (error) {
    return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
  }
}
