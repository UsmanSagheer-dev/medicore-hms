import { NextRequest, NextResponse } from "next/server";

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("authToken")?.value;
  const userRole = request.cookies.get("userRole")?.value;
  const doctorId = request.cookies.get("doctorId")?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthRoute = pathname.startsWith("/auth");
  const isOnboardingRoute = pathname.startsWith("/onboarding");
  const isPublicRoute = pathname === "/" || isAuthRoute;

  const isAuthenticated = !!userRole;

  if (
    !isAuthenticated &&
    !isPublicRoute &&
    !isOnboardingRoute &&
    pathname !== "/unauthorized"
  ) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAuthenticated) {
    if (isAuthRoute) {
      let dashboardPath = "/dashboard";

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

    if (pathname.startsWith("/dashboard/admin")) {
      if (userRole === "admin") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (pathname.startsWith("/dashboard/doctor/")) {
      if (userRole === "doctor") {
        console.log("✅ Doctor access granted");
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }

    if (pathname.startsWith("/dashboard/receptionist")) {
      if (userRole === "receptionist") {
        return NextResponse.next();
      } else {
        return NextResponse.redirect(new URL("/unauthorized", request.url));
      }
    }
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|assets|favicon.ico).*)"],
};
