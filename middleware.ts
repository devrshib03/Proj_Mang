import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    // Verify JWT (make sure JWT_SECRET is set in .env.local)
    jwt.verify(token, process.env.JWT_SECRET!);

    // ✅ If valid, allow request
    return NextResponse.next();
  } catch (err) {
    console.error("Invalid or expired token:", err);
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

// Apply middleware only on dashboard routes
export const config = {
  matcher: ["/app/dashboard/:path*", "/app"],
matcher: ["/app/members/:path*","/app"],
};
