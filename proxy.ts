import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
)

async function getSessionFromRequest(request: NextRequest) {
  const token = request.cookies.get("session")?.value
  if (!token) return null

  try {
    const { payload } = await jwtVerify(token, SECRET_KEY)
    return payload as { userId: string; email: string; name: string; role: string }
  } catch {
    return null
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  const isAdminRoute = pathname.startsWith("/admin")
  const isSellerRoute = pathname.startsWith("/seller")
  const isCustomerRoute = pathname.startsWith("/minha-conta")

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname === "/login" ||
    pathname === "/registro" ||
    pathname === "/esqueci-senha"
  ) {
    return NextResponse.next()
  }

  if (isAdminRoute || isSellerRoute || isCustomerRoute) {
    const session = await getSessionFromRequest(request)
    console.log("[v0] proxy - pathname:", pathname, "| session:", session ? `role=${session.role}` : "NULL")

    if (!session) {
      const loginUrl = new URL("/login", request.url)
      loginUrl.searchParams.set("redirect", pathname)
      console.log("[v0] proxy - sem sessão, redirecionando para:", loginUrl.toString())
      return NextResponse.redirect(loginUrl)
    }

    if (isAdminRoute) {
      if (session.role !== "admin" && session.role !== "super_admin") {
        console.log("[v0] proxy - acesso negado a /admin para role:", session.role)
        return NextResponse.redirect(new URL("/", request.url))
      }
    }

    if (isSellerRoute) {
      if (session.role !== "seller" && session.role !== "admin" && session.role !== "super_admin") {
        console.log("[v0] proxy - acesso negado a /seller para role:", session.role)
        return NextResponse.redirect(new URL("/", request.url))
      }
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/seller",
    "/seller/:path*",
    "/minha-conta",
    "/minha-conta/:path*",
  ],
}
