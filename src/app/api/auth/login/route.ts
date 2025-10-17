import { NextRequest, NextResponse } from "next/server";

// Mock user database - in real app, this would be a database
const users = [
  {
    id: "1",
    email: "admin@reconcileit.com",
    password: "password123",
    name: "Admin User",
    role: "Admin"
  },
  {
    id: "2",
    email: "user@company.com",
    password: "password123",
    name: "John Doe",
    role: "Reviewer"
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Find user by email and password
    const user = users.find(u => u.email === email && u.password === password);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // In a real app, you'd generate a JWT token here
    const token = `mock_token_${user.id}_${Date.now()}`;

    // Return user data and token
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token,
      message: "Login successful"
    });

  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
