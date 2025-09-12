import { NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function POST() {
  // To log out, we set the cookie's expiration date to the past
  const serializedCookie = serialize('authToken', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: -1, // Expire the cookie immediately
    path: '/',
  });

  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' });
  response.headers.set('Set-Cookie', serializedCookie);
  
  return response;
}
