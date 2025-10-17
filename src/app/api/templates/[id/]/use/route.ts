import { NextRequest, NextResponse } from "next/server";

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

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const templateId = params.id;
    const template = mockTemplates.find(t => t.id === templateId);

    if (!template) {
      return NextResponse.json(
        { error: "Template not found" },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, description, category, tags = [] } = body;

    // Create a new rule based on the template
    const newRule = {
      id: Date.now().toString(),
      name: name || `${template.name} (Custom)`,
      description: description || template.description,
      version: "1.0.0",
      lastModified: new Date().toISOString(),
      status: "draft" as const,
      type: "template-based" as const,
      category: category || template.category,
      createdBy: "current_user", // Replace with actual user
      tags: [...template.tags, ...tags],
      logic: template.logicTemplate,
      conditions: template.conditionsTemplate
    };

    return NextResponse.json(newRule, { status: 201 });
  } catch (error) {
    console.error("Error creating rule from template:", error);
    return NextResponse.json(
      { error: "Failed to create rule from template" },
      { status: 500 }
    );
  }
}
