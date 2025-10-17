import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Please provide a valid email address" },
        { status: 400 }
      );
    }

    // In a real app, you would:
    // 1. Check if user exists in database
    // 2. Generate a password reset token
    // 3. Store token with expiration time
    // 4. Send email with reset link
    
    // For demo purposes, we'll simulate success
    console.log(`Password reset requested for: ${email}`);
    
    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({
      message: "Password reset link sent successfully",
      email: email,
    });

  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Failed to process password reset request" },
      { status: 500 }
    );
  }
}
