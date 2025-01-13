import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/sign-in",
  "/sign-up",
  "/home",
]);

const isPublicApiRoute = createRouteMatcher([
  "/api/videos",
]);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();
  console.log("Auth Debug:", { userId });

  const currentUrl = new URL(req.url);
  const isAccessingDashboard = currentUrl.pathname === "/home";
  const isApiRequest = currentUrl.pathname.startsWith("/api");

  // Redirect from root "/" to "/home"
  if (currentUrl.pathname === "/") {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If user is logged in and accessing a public route but not the dashboard
  if (userId && isPublicRoute(req) && !isAccessingDashboard) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  // If user is not logged in
  if (!userId) {
    // Redirect to sign-in if accessing a protected route
    if (!isPublicRoute(req) && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Redirect to sign-in if accessing a protected API
    if (isApiRequest && !isPublicApiRoute(req)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }
  }

  // Allow other requests to proceed
  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
