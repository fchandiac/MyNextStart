import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  console.log('📦 TOKEN DESDE MIDDLEWARE:', token);

  // ✅ Permite pasar aunque el token sea null
  return NextResponse.next();
}

export const config = {
  matcher: ['/paddy/:path*'],
};
