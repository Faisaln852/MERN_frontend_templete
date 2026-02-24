import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  const token = req.cookies.get("token")?.value
console.log("start----------------");
console.log(token)
console.log("end----------------");
  // ❌ If NOT logged in, redirect to login for protected routes
  if (!token) {
    if (pathname.startsWith("/admin") || pathname.startsWith("/user")) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return NextResponse.next()
  }

  // Optional: role hint stored separately
  const role = req.cookies.get("role")?.value
// return role;
  // Admin-only protection
  if (pathname.startsWith("/admin") && role !== "admin") {
    console.log(role)
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // User-only protection
  if (pathname.startsWith("/user") && role !== "user") {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/user/:path*"],
}
