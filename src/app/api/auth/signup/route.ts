import { NextRequest, NextResponse } from "next/server";

// Mock user database - in real app, this would be a database
const users: Array<{
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  company: string;
  industry: string;
  country: string;
  phoneNumber: string;
  password: string;
  role: string;
  createdAt: Date;
}> = [];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      company,
      industry,
      country,
      phoneNumber,
      password,
    } = body;

    // Validate required fields
    if (!firstName || !lastName || !email || !company || !industry || !country || !phoneNumber || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = {
      id: `user_${Date.now()}`,
      firstName,
      lastName,
      email,
      company,
      industry,
      country,
      phoneNumber,
      password, // In real app, hash this password!
      role: "user",
      createdAt: new Date(),
    };

    users.push(newUser);

    // In a real app, you'd generate a JWT token here
    const token = `mock_token_${newUser.id}_${Date.now()}`;

    // Return user data (without password) and token
    const { password: _, ...userWithoutPassword } = newUser;

    return NextResponse.json({
      user: userWithoutPassword,
      token,
      message: "Account created successfully"
    }, { status: 201 });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Export users for login endpoint to access
export { users };
