import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    // Clear the session cookie by setting its maxAge to 0
    cookies().set('session_token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 0, // Expire the cookie immediately
    });

    return NextResponse.json({ success: true, message: 'Logged out successfully.' });

  } catch (error: any) {
    console.error('Error during logout:', error);
    return NextResponse.json({ error: error.message || 'Failed to logout.' }, { status: 500 });
  }
}
