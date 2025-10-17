"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
  redirectTo?: string;
}

/**
 * Component to protect routes that require authentication
 * Redirects to login if user is not authenticated
 */
export function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, userRole } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not authenticated, redirect to login
    if (!isLoading && !isAuthenticated) {
      router.push(redirectTo);
    }

    // If role is required and user doesn't have it, redirect
    if (!isLoading && isAuthenticated && requiredRole && userRole !== requiredRole) {
      router.push("/unauthorized");
    }
  }, [isAuthenticated, isLoading, requiredRole, userRole, router, redirectTo]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  // If role is required and user doesn't have it, don't render
  if (requiredRole && userRole !== requiredRole) {
    return null;
  }

  // Render protected content
  return <>{children}</>;
}
