import { NextRequest, NextResponse } from "next/server";

// Mock data for rules (replace with actual database queries)
const mockRules = [
  {
    id: "1",
    name: "Transaction Amount Reconciliation",
    description: "Reconcile transaction amounts between source and target systems",
    version: "1.2.0",
    lastModified: "2024-01-15T10:30:00Z",
    status: "active" as const,
    type: "custom" as const,
    category: "Financial",
    createdBy: "admin",
    tags: ["transactions", "amount", "financial"],
    logic: "amount_source == amount_target",
    conditions: [
      {
        field: "amount",
        operator: "equals",
        value: "target_amount",
        logic: "AND"
      }
    ]
  },
  {
    id: "2",
    name: "Customer Data Validation",
    description: "Validate customer information consistency",
    version: "2.1.0",
    lastModified: "2024-01-14T14:20:00Z",
    status: "active" as const,
    type: "template-based" as const,
    category: "Customer",
    createdBy: "reviewer1",
    tags: ["customers", "validation", "data-quality"],
    logic: "email_format_valid && phone_format_valid",
    conditions: [
      {
        field: "email",
        operator: "matches",
        value: "^[^@]+@[^@]+\\.[^@]+$",
        logic: "AND"
      }
    ]
  },
  {
    id: "3",
    name: "Inventory Count Reconciliation",
    description: "Reconcile inventory counts between warehouse and sales systems",
    version: "1.0.0",
    lastModified: "2024-01-13T09:15:00Z",
    status: "draft" as const,
    type: "custom" as const,
    category: "Inventory",
    createdBy: "admin",
    tags: ["inventory", "warehouse", "sales"],
    logic: "warehouse_count == sales_count",
    conditions: [
      {
        field: "count",
        operator: "equals",
        value: "sales_count",
        logic: "AND"
      }
    ]
  }
];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ruleId } = await params;
    const rule = mockRules.find(r => r.id === ruleId);

    if (!rule) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(rule);
  } catch (error) {
    console.error("Error fetching rule:", error);
    return NextResponse.json(
      { error: "Failed to fetch rule" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ruleId } = await params;
    const body = await request.json();

    const ruleIndex = mockRules.findIndex(r => r.id === ruleId);
    if (ruleIndex === -1) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    // Update the rule
    mockRules[ruleIndex] = {
      ...mockRules[ruleIndex],
      ...body,
      id: ruleId,
      lastModified: new Date().toISOString()
    };

    return NextResponse.json(mockRules[ruleIndex]);
  } catch (error) {
    console.error("Error updating rule:", error);
    return NextResponse.json(
      { error: "Failed to update rule" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: ruleId } = await params;
    const ruleIndex = mockRules.findIndex(r => r.id === ruleId);

    if (ruleIndex === -1) {
      return NextResponse.json(
        { error: "Rule not found" },
        { status: 404 }
      );
    }

    // Remove the rule
    mockRules.splice(ruleIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting rule:", error);
    return NextResponse.json(
      { error: "Failed to delete rule" },
      { status: 500 }
    );
  }
}
