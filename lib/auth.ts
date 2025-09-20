// lib/auth.js
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

export function requireAuth() {
  const cookieStore = cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) return { error: "No auth token cookie found.", status: 401 };

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return { userId: decoded.id };
  } catch (_e) {
    return { error: "Invalid or expired token.", status: 401 };
  }
}
