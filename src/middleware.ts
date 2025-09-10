import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { verifyToken } from "@/utils/auth"; // custom JWT verify (jsonwebtoken)

// ✅ Define protected routes with allowed roles
const protectedRoutes: Record<string, ("admin" | "teacher" | "student")[]> = {
  "/api/exams/create": ["admin", "teacher"],
  "/api/exams/update": ["admin", "teacher"],
  "/api/exams/delete": ["admin"],
  "/api/attempts/create": ["student"],
  "/api/attempts/submit": ["student"],
  "/dashboard/admin": ["admin"],
  "/dashboard/teacher": ["teacher", "admin"],
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Public routes allow
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/static") ||
    pathname === "/login" ||
    pathname === "/signup" ||
    pathname === "/" ||
    pathname === "/api/subjects" ||
    pathname === "/api/questions"
  ) {
    return NextResponse.next();
  }

  let user: any = null;

  // ✅ 1) NextAuth token (Google/Facebook login)
  const nextAuthToken = await getToken({
    req: req as any,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (nextAuthToken) {
    user = {
      id: nextAuthToken.sub,
      role: (nextAuthToken as any).role || "student", // role ko session/jwt callback me set karna hoga
    };
  }

  // ✅ 2) Custom JWT token (email/password login)
  if (!user) {
    const customToken = req.cookies.get("token")?.value;
    if (customToken) {
      try {
        user = verifyToken(customToken); // decode { id, role }
      } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Invalid token" }), {
          status: 401,
        });
      }
    }
  }

  if (!user) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
    });
  }

  // ✅ 3) Role-based access check
  for (const route in protectedRoutes) {
    if (pathname.startsWith(route)) {
      const allowedRoles = protectedRoutes[route];
      if (!allowedRoles.includes(user.role)) {
        return new NextResponse(JSON.stringify({ message: "Forbidden: insufficient role" }), {
          status: 403,
        });
      }
    }
  }

  // ✅ Forward user info in request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-user-id", user.id);
  requestHeaders.set("x-user-role", user.role);

  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ["/api/:path*", "/dashboard/:path*"], // protect API + dashboard
};
