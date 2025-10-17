"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

// Public routes that don't require authentication
const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password", "/sso"];

/**
 * Auth guard to protect the entire app
 * Use this in the root layout
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isPublicRoute = PUBLIC_ROUTES.some(route => pathname.startsWith(route));

    // If on a protected route and not authenticated, redirect to login
    if (!isPublicRoute && !isAuthenticated) {
      router.push("/login");
    }

    // If on auth page and already authenticated, redirect to dashboard
    if (isPublicRoute && isAuthenticated && pathname !== "/") {
      router.push("/dashboard");
    }
  }, [isAuthenticated, pathname, router]);

  return <>{children}</>;
}
