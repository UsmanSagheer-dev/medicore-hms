import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const doctorId = request.cookies.get("doctorId")?.value;
  const receptionistId = request.cookies.get("receptionistId")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth");
  const isPublicRoute = pathname === "/" || isAuthRoute;

  if (!token && !isPublicRoute && pathname !== "/unauthorized") {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    if (isAuthRoute) {
      let dashboardPath = "/auth/login";
      if (userRole === "doctor" && doctorId) {
        dashboardPath = `/dashboard/doctor/${doctorId}`;
      } else if (userRole === "receptionist") {
        dashboardPath = `/dashboard/receptionist`;
      } else if (userRole === "admin") {
        dashboardPath = `/dashboard/admin`;
      } else if (userRole) {
        dashboardPath = `/dashboard/${userRole}`;
      }
      return NextResponse.redirect(new URL(dashboardPath, request.url));
    }

    if (pathname.startsWith("/dashboard/admin") && userRole !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (pathname.startsWith("/dashboard/doctor/") && userRole !== "doctor") {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    if (
      pathname.startsWith("/dashboard/receptionist") &&
      userRole !== "receptionist"
    ) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  return NextResponse.next();
}
export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
