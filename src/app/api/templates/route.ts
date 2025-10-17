import { NextResponse } from "next/server";

// Mock data for templates (replace with actual database queries)
const mockTemplates = [
  {
    id: "1",
    name: "Bank Reconciliation Template",
    description: "Standard template for reconciling bank transactions",
    category: "Financial",
    complexity: "intermediate" as const,
    usageCount: 45,
    rating: 4.2,
    tags: ["banking", "transactions", "financial"],
    preview: "Reconcile bank statement transactions with internal records",
    logicTemplate: "bank_balance == internal_balance",
    conditionsTemplate: [
      {
        field: "amount",
        operator: "equals",
        value: "bank_amount",
        logic: "AND"
      }
    ]
  },
  {
    id: "2",
    name: "Customer Data Validation Template",
    description: "Template for validating customer information consistency",
    category: "Customer",
    complexity: "simple" as const,
    usageCount: 32,
    rating: 4.8,
    tags: ["customers", "validation", "data-quality"],
    preview: "Validate email formats and required fields",
    logicTemplate: "email_valid && required_fields_present",
    conditionsTemplate: [
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
    name: "Inventory Reconciliation Template",
    description: "Advanced template for inventory count reconciliation",
    category: "Inventory",
    complexity: "advanced" as const,
    usageCount: 18,
    rating: 4.0,
    tags: ["inventory", "warehouse", "stock"],
    preview: "Reconcile physical inventory with system records",
    logicTemplate: "physical_count == system_count && location_match",
    conditionsTemplate: [
      {
        field: "count",
        operator: "equals",
        value: "system_count",
        logic: "AND"
      },
      {
        field: "location",
        operator: "equals",
        value: "warehouse_location",
        logic: "AND"
      }
    ]
  }
];

export async function GET() {
  try {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json(mockTemplates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 }
    );
  }
}
