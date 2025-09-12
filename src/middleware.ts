// middleware.ts  (place at project root or src/middleware.ts)
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyToken } from "@/utils/auth"; // async verify

// Define protected routes and allowed roles
const protectedRoutes: Record<string, ("admin" | "teacher" | "student")[]> = {
  "/api/exams/create": ["admin", "teacher"],
  "/api/exams/update": ["admin", "teacher"],
  "/api/exams/delete": ["admin"],
  "/api/attempts/create": ["student"],
  "/api/attempts/submit": ["student"],
  "/dashboard/admin": ["admin"],
  "/dashboard/teacher": ["teacher", "admin"],

  "/admin": ["admin", "teacher"],
  "/api/admin": ["admin"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public routes — do not protect
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/admin-login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname === "/about"
  ) {
    return NextResponse.next();
  }

  let user: any = null;

  // 1) NextAuth token (if present)
  try {
    const nextAuthToken = await getToken({
      req: req as any,
      secret: process.env.NEXTAUTH_SECRET,
    });
    if (nextAuthToken) {
      user = {
        id: nextAuthToken.sub,
        role: (nextAuthToken as any).role || "student",
      };
    }
  } catch (e) {
    // ignore next-auth errors here (fall back to custom token)
  }

  // 2) Custom JWT token (from cookie)
  if (!user) {
    const customToken = req.cookies.get("token")?.value;
    // helpful dev log (remove in production)
    console.log("middleware: customToken:", customToken);
    if (customToken) {
      const decoded = await verifyToken(customToken);
      if (decoded && (decoded as any).id) {
        user = { id: (decoded as any).id, role: (decoded as any).role || "student" };
      } else {
        return new NextResponse(JSON.stringify({ message: "Invalid token" }), { status: 401 });
      }
    }
  }

  console.log("middleware user:", user);

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
  }

  // 3) Role-based access check
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      if (!allowedRoles.includes(user.role)) {
        return new NextResponse(JSON.stringify({ message: "Forbidden: insufficient role" }), { status: 403 });
      }
    }
  }

  // Forward user info to downstream (API / server pages)
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-role", user.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*", "/tests/:path*", "/admin/:path*"],
};
