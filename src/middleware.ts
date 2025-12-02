// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
  {
    path: '/admin/dashboard',
    roles: ['admin'],
    permissions: [],
  },
  {
    path: '/user/dashboard',
    roles: ['user'],
    permissions: ['create:post'],
  },
];

function getUserFromRequest(req: NextRequest) {
  // This example assumes you store auth info in cookies
  const token = req.cookies.get('token')?.value;
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload; // Assume payload includes { role, permissions }
  } catch {
    return null;
  }
}

export function middleware(req: NextRequest) {
  const user = getUserFromRequest(req);

  const pathname = req.nextUrl.pathname;

  for (const route of protectedRoutes) {
    if (pathname.startsWith(route.path)) {
      if (!user) {
        return NextResponse.redirect(new URL('/login', req.url));
      }

      const hasRole = route.roles.includes(user.role);
      const hasPermissions = route.permissions.every((p: string) =>
        user.permissions.includes(p)
      );

      if (!hasRole || !hasPermissions) {
        return NextResponse.redirect(new URL('/unauthorized', req.url));
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/user/:path*'], // routes to apply middleware on
};
