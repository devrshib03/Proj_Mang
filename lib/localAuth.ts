// src/lib/localAuth.ts
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Team Member" | string;
};

export const LOCAL_USER_KEY = "user";

// ======================
// Storage Helpers
// ======================

export function saveCurrentUser(user: AppUser) {
  localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(user));
}

export function getCurrentUser(): AppUser | null {
  const v = localStorage.getItem(LOCAL_USER_KEY);
  return v ? (JSON.parse(v) as AppUser) : null;
}

export function removeCurrentUser() {
  localStorage.removeItem(LOCAL_USER_KEY);
}

// ======================
// API Helper
// ======================

export async function apiFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  return fetch(url, {
    ...options,
    headers,
    credentials: "include", // ✅ send cookies automatically
  });
}

// ======================
// Auth Actions
// ======================

export async function login(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
    credentials: "include", // ✅ save cookie from server
  });

  if (!res.ok) {
    throw new Error("Login failed");
  }

  const data = await res.json();
  saveCurrentUser(data.user); // ✅ only user info, no token
  return data.user;
}

export async function register(
  name: string,
  email: string,
  password: string,
  role: string = "Team Member"
) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, role }),
    credentials: "include", // ✅ same as login
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  const data = await res.json();
  saveCurrentUser(data.user);
  return data.user;
}

export function logout() {
  removeCurrentUser();
}
