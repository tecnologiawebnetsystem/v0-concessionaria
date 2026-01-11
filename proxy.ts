import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { verifySession } from "./lib/session"

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path is an admin route
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("session")?.value

    if (!token) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    const session = await verifySession(token)

    if (!session) {
      return NextResponse.redirect(new URL("/login?redirect=/admin", request.url))
    }

    // Check if user has admin role
    if (session.role !== "admin" && session.role !== "super_admin") {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
