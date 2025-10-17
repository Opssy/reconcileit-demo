"use client";

import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { ArrowLeft, Building2, AlertCircle, Loader2 } from "lucide-react";

// Validation schema
const ssoSchema = z.object({
  domain: z.string()
    .min(3, "Domain must be at least 3 characters")
    .regex(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, "Please enter a valid domain (e.g., company)"),
});

type SSOFormData = z.infer<typeof ssoSchema>;

export default function SSOPage() {
  const form = useForm<SSOFormData>({
    resolver: zodResolver(ssoSchema),
    defaultValues: {
      domain: "",
    },
  });

  const ssoMutation = useMutation({
    mutationFn: async (data: SSOFormData) => {
      // API call to POST /api/auth/sso
      const response = await fetch("/api/auth/sso", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ domain: data.domain }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "SSO authentication failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      // Redirect to SSO provider
      if (data.redirectUrl) {
        window.location.href = data.redirectUrl;
      }
    },
    onError: (error) => {
      console.error("SSO failed:", error);
    },
  });

  const onSubmit = (data: SSOFormData) => {
    ssoMutation.mutate(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8">
        {/* Back to Login Link */}
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to login
        </Link>

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-blue-600 rounded-lg flex items-center justify-center">
            <Building2 className="h-6 w-6 text-white" />
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Sign in with SSO
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter your organization&apos;s domain to continue
          </p>
        </div>

        {/* SSO Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 bg-white p-8 rounded-lg shadow">
            {/* Domain Field */}
            <FormField
              control={form.control}
              name="domain"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Domain</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="company"
                        {...field}
                        className="pr-32"
                      />
                      <div className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-gray-500">
                        .example.com
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription>
                    Enter your organization&apos;s domain name (without the full URL)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Error Message */}
            {ssoMutation.isError && (
              <div className="bg-red-50 border border-red-200 rounded-md p-3 flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-600">
                  <p className="font-medium">SSO not configured</p>
                  <p className="mt-1">
                    {ssoMutation.error?.message || "This domain is not configured for SSO. Please contact your administrator or use email/password login."}
                  </p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={ssoMutation.isPending}
            >
              {ssoMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                "Continue with SSO"
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>

            {/* Alternative Login Options */}
            <div className="space-y-3">
              <Link href="/login">
                <Button variant="outline" className="w-full">
                  Sign in with email
                </Button>
              </Link>
              <div className="text-center">
                <span className="text-sm text-gray-600">
                  Do not have an account?{" "}
                  <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
                    Sign up
                  </Link>
                </span>
              </div>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
