import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { newStatus, assignedTo } = body;
    const exceptionId = params.id;

    // In a real app, update the database
    // For now, return success response
    return NextResponse.json({
      id: exceptionId,
      status: newStatus,
      assignedTo: assignedTo || null,
      updatedAt: new Date().toISOString(),
      message: "Exception status updated successfully"
    });
  } catch (error) {
    console.error("Error updating exception:", error);
    return NextResponse.json(
      { error: "Failed to update exception" },
      { status: 500 }
    );
  }
}
