import { NextRequest, NextResponse } from "next/server";

// Mock SSO configuration - in real app, this would be in a database
const ssoProviders: Record<string, {
  provider: string;
  redirectUrl: string;
  enabled: boolean;
}> = {
  "acme": {
    provider: "okta",
    redirectUrl: "https://acme.okta.com/oauth2/authorize",
    enabled: true,
  },
  "techcorp": {
    provider: "azure",
    redirectUrl: "https://login.microsoftonline.com/techcorp/oauth2/authorize",
    enabled: true,
  },
  "demo": {
    provider: "google",
    redirectUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    enabled: true,
  },
};

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { domain } = body;

    // Validate domain
    if (!domain || domain.length < 3) {
      return NextResponse.json(
        { error: "Please provide a valid organization domain" },
        { status: 400 }
      );
    }

    // Normalize domain (lowercase, trim)
    const normalizedDomain = domain.toLowerCase().trim();

    // Check if SSO is configured for this domain
    const ssoConfig = ssoProviders[normalizedDomain];

    if (!ssoConfig || !ssoConfig.enabled) {
      return NextResponse.json(
        { 
          error: "SSO is not configured for this domain",
          message: "This organization domain is not set up for SSO authentication. Please contact your administrator or use email/password login."
        },
        { status: 404 }
      );
    }

    // In a real app, you would:
    // 1. Generate a state token for CSRF protection
    // 2. Store the state in session/database
    // 3. Build the full OAuth URL with client_id, redirect_uri, etc.
    // 4. Return the redirect URL

    // For demo purposes, we'll return a mock redirect URL
    const redirectUrl = `${ssoConfig.redirectUrl}?domain=${normalizedDomain}&state=mock_state_${Date.now()}`;

    return NextResponse.json({
      message: "SSO provider found",
      provider: ssoConfig.provider,
      redirectUrl: redirectUrl,
      domain: normalizedDomain,
    });

  } catch (error) {
    console.error("SSO error:", error);
    return NextResponse.json(
      { error: "Failed to process SSO request" },
      { status: 500 }
    );
  }
}
