import { NextResponse } from "next/server";

// Mock template categories (replace with actual database queries)
const mockCategories = [
  "Financial",
  "Customer",
  "Inventory",
  "Sales",
  "HR",
  "Operations"
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json(mockCategories);
  } catch (error) {
    console.error("Error fetching template categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch template categories" },
      { status: 500 }
    );
  }
}
