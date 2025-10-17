import { NextRequest, NextResponse } from "next/server";

// Mock comments data (in real app, this would be in database)
const mockComments = {
  "exc_001": [
    {
      id: "comment_001",
      user: "reviewer1",
      userName: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      content: "This looks like a rounding error. The amounts are very close.",
      timestamp: "2024-01-15T15:00:00Z"
    }
  ],
  "exc_002": [
    {
      id: "comment_002",
      user: "reviewer1",
      userName: "Sarah Johnson",
      avatar: "/avatars/sarah.jpg",
      content: "I need to verify if this payment was actually processed. Checking with finance team.",
      timestamp: "2024-01-15T14:15:00Z"
    }
  ],
  "exc_003": [
    {
      id: "comment_003",
      user: "approver1",
      userName: "Michael Chen",
      avatar: "/avatars/michael.jpg",
      content: "Reviewing with accounting team. Both transactions appear legitimate but from different systems.",
      timestamp: "2024-01-15T12:45:00Z"
    }
  ],
  "exc_004": [
    {
      id: "comment_004",
      user: "reviewer2",
      userName: "David Wilson",
      avatar: "/avatars/david.jpg",
      content: "Date discrepancy confirmed. CRM system shows correct transaction date.",
      timestamp: "2024-01-15T13:30:00Z"
    }
  ]
};

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exceptionId = params.id;

    const comments = mockComments[exceptionId as keyof typeof mockComments] || [];

    return NextResponse.json({ comments });
  } catch (error) {
    console.error("Error fetching comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const exceptionId = params.id;
    const body = await request.json();
    const { content, user, userName, avatar } = body;

    if (!content || !user) {
      return NextResponse.json(
        { error: "Content and user are required" },
        { status: 400 }
      );
    }

    const newComment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user: user,
      userName: userName || user,
      avatar: avatar || "/avatars/default.jpg",
      content: content,
      timestamp: new Date().toISOString()
    };

    // In real app, save to database
    // For now, just return the new comment
    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    console.error("Error creating comment:", error);
    return NextResponse.json(
      { error: "Failed to create comment" },
      { status: 500 }
    );
  }
}
