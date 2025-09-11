// src/lib/localAuth.ts
export type AppUser = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Team Member' | string;
};

export const LOCAL_USER_KEY = 'user';
export const LOCAL_USERS_KEY = 'users';

export function generateId() {
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;
}

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

export function getAllUsers(): AppUser[] {
  const v = localStorage.getItem(LOCAL_USERS_KEY);
  return v ? (JSON.parse(v) as AppUser[]) : [];
}

export function saveAllUsers(users: AppUser[]) {
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
}

export function addUserToStore(user: AppUser) {
  const users = getAllUsers();
  users.push(user);
  saveAllUsers(users);
}
