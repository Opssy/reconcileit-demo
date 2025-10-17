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

export async function POST(
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

    const body = await request.json();
    const { testData } = body;

    // Simulate rule testing with mock data
    const testResults = {
      passed: Math.random() > 0.3, // 70% pass rate for demo
      totalRecords: testData?.length || 100,
      passedRecords: Math.floor((testData?.length || 100) * (Math.random() > 0.3 ? 0.9 : 0.6)),
      failedRecords: 0,
      errors: []
    };

    if (!testResults.passed) {
      testResults.failedRecords = testResults.totalRecords - testResults.passedRecords;
      testResults.errors = [
        {
          recordId: "001",
          field: "amount",
          expected: "100.00",
          actual: "99.50",
          message: "Amount mismatch"
        }
      ];
    }

    return NextResponse.json(testResults);
  } catch (error) {
    console.error("Error testing rule:", error);
    return NextResponse.json(
      { error: "Failed to test rule" },
      { status: 500 }
    );
  }
}
