import { NextRequest, NextResponse } from "next/server";

// Mock exceptions data (same as in main route)
const mockExceptions = [
  {
    id: "exc_001",
    type: "Amount Mismatch",
    severity: "high",
    amount: 5250.00,
    timestamp: "2024-01-15T14:30:00Z",
    source: "Bank API",
    target: "Internal Ledger",
    description: "Transaction amount differs between sources",
    status: "unassigned",
    createdBy: "system",
    assignedTo: null,
    sourceRecord: {
      id: "TXN_BANK_001",
      amount: 5250.00,
      date: "2024-01-15",
      reference: "REF_BANK_001",
      description: "Payment for invoice #12345",
      account: "ACC_BANK_001",
      currency: "USD",
      status: "completed"
    },
    targetRecord: {
      id: "TXN_LEDGER_001",
      amount: 5200.00,
      date: "2024-01-15",
      reference: "REF_LEDGER_001",
      description: "Payment for invoice #12345",
      account: "ACC_LEDGER_001",
      currency: "USD",
      status: "completed"
    },
    differences: [
      { field: "amount", sourceValue: 5250.00, targetValue: 5200.00, difference: 50.00 },
      { field: "reference", sourceValue: "REF_BANK_001", targetValue: "REF_LEDGER_001", difference: "REF mismatch" }
    ],
    aiSuggestion: {
      action: "Adjust",
      confidence: 0.85,
      explanation: "The amount difference of $50.00 appears to be a rounding issue. The reference numbers are similar but not identical, suggesting a potential data entry error.",
      suggestedValue: 5250.00,
      reasoning: "Source record (Bank API) should be trusted as the authoritative source for this transaction."
    },
    comments: [
      {
        id: "comment_001",
        user: "reviewer1",
        userName: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        content: "This looks like a rounding error. The amounts are very close.",
        timestamp: "2024-01-15T15:00:00Z"
      }
    ],
    history: [
      {
        action: "Created",
        user: "system",
        timestamp: "2024-01-15T14:30:00Z",
        details: "Exception automatically detected during reconciliation"
      }
    ]
  },
  {
    id: "exc_002",
    type: "Missing Record",
    severity: "medium",
    amount: 1200.00,
    timestamp: "2024-01-15T13:45:00Z",
    source: "Payment Gateway",
    target: "Transaction DB",
    description: "Record exists in source but not in target",
    status: "in_review",
    createdBy: "system",
    assignedTo: "reviewer1",
    sourceRecord: {
      id: "TXN_GATEWAY_002",
      amount: 1200.00,
      date: "2024-01-15",
      reference: "REF_GATEWAY_002",
      description: "Online payment received",
      account: "ACC_GATEWAY_001",
      currency: "USD",
      status: "completed"
    },
    targetRecord: null,
    differences: [
      { field: "record", sourceValue: "TXN_GATEWAY_002", targetValue: null, difference: "Missing in target" }
    ],
    aiSuggestion: {
      action: "Merge",
      confidence: 0.92,
      explanation: "This appears to be a legitimate transaction that was not properly recorded in the target system.",
      suggestedValue: null,
      reasoning: "The payment gateway record should be imported into the transaction database."
    },
    comments: [
      {
        id: "comment_002",
        user: "reviewer1",
        userName: "Sarah Johnson",
        avatar: "/avatars/sarah.jpg",
        content: "I need to verify if this payment was actually processed. Checking with finance team.",
        timestamp: "2024-01-15T14:15:00Z"
      }
    ],
    history: [
      {
        action: "Created",
        user: "system",
        timestamp: "2024-01-15T13:45:00Z",
        details: "Exception automatically detected during reconciliation"
      },
      {
        action: "Assigned",
        user: "system",
        timestamp: "2024-01-15T14:00:00Z",
        details: "Auto-assigned to reviewer1 based on workload"
      }
    ]
  },
  {
    id: "exc_003",
    type: "Duplicate Record",
    severity: "medium",
    amount: 3400.00,
    timestamp: "2024-01-15T12:15:00Z",
    source: "Internal Ledger",
    target: "GL System",
    description: "Duplicate transaction detected",
    status: "pending_approval",
    createdBy: "system",
    assignedTo: "approver1",
    sourceRecord: {
      id: "TXN_LEDGER_003A",
      amount: 3400.00,
      date: "2024-01-15",
      reference: "REF_LEDGER_003",
      description: "Monthly subscription payment",
      account: "ACC_LEDGER_002",
      currency: "USD",
      status: "completed"
    },
    targetRecord: {
      id: "TXN_GL_003B",
      amount: 3400.00,
      date: "2024-01-15",
      reference: "REF_GL_003",
      description: "Monthly subscription payment",
      account: "ACC_GL_002",
      currency: "USD",
      status: "completed"
    },
    differences: [
      { field: "reference", sourceValue: "REF_LEDGER_003", targetValue: "REF_GL_003", difference: "REF mismatch" }
    ],
    aiSuggestion: {
      action: "Merge",
      confidence: 0.78,
      explanation: "Two nearly identical transactions detected. This appears to be a duplicate entry.",
      suggestedValue: null,
      reasoning: "One record should be removed to avoid double-counting in financial reports."
    },
    comments: [
      {
        id: "comment_003",
        user: "approver1",
        userName: "Michael Chen",
        avatar: "/avatars/michael.jpg",
        content: "Reviewing with accounting team. Both transactions appear legitimate but from different systems.",
        timestamp: "2024-01-15T12:45:00Z"
      }
    ],
    history: [
      {
        action: "Created",
        user: "system",
        timestamp: "2024-01-15T12:15:00Z",
        details: "Exception automatically detected during reconciliation"
      },
      {
        action: "Assigned",
        user: "system",
        timestamp: "2024-01-15T12:30:00Z",
        details: "Escalated to approver1 for final decision"
      }
    ]
  },
  {
    id: "exc_004",
    type: "Date Mismatch",
    severity: "low",
    amount: 850.00,
    timestamp: "2024-01-15T11:00:00Z",
    source: "CRM System",
    target: "Master DB",
    description: "Transaction dates do not match",
    status: "resolved",
    createdBy: "system",
    assignedTo: "reviewer2",
    resolvedAt: "2024-01-15T14:00:00Z",
    resolution: "Accepted source record as correct",
    sourceRecord: {
      id: "TXN_CRM_004",
      amount: 850.00,
      date: "2024-01-15",
      reference: "REF_CRM_004",
      description: "Service payment",
      account: "ACC_CRM_001",
      currency: "USD",
      status: "completed"
    },
    targetRecord: {
      id: "TXN_MASTER_004",
      amount: 850.00,
      date: "2024-01-14",
      reference: "REF_MASTER_004",
      description: "Service payment",
      account: "ACC_MASTER_001",
      currency: "USD",
      status: "completed"
    },
    differences: [
      { field: "date", sourceValue: "2024-01-15", targetValue: "2024-01-14", difference: "1 day difference" }
    ],
    aiSuggestion: {
      action: "Accept",
      confidence: 0.95,
      explanation: "Single day difference in transaction dates. Source system (CRM) is likely more accurate for customer transactions.",
      suggestedValue: "2024-01-15",
      reasoning: "CRM system timestamps are typically more reliable for customer-facing transactions."
    },
    comments: [
      {
        id: "comment_004",
        user: "reviewer2",
        userName: "David Wilson",
        avatar: "/avatars/david.jpg",
        content: "Date discrepancy confirmed. CRM system shows correct transaction date.",
        timestamp: "2024-01-15T13:30:00Z"
      }
    ],
    history: [
      {
        action: "Created",
        user: "system",
        timestamp: "2024-01-15T11:00:00Z",
        details: "Exception automatically detected during reconciliation"
      },
      {
        action: "Assigned",
        user: "system",
        timestamp: "2024-01-15T11:15:00Z",
        details: "Assigned to reviewer2"
      },
      {
        action: "Resolved",
        user: "reviewer2",
        timestamp: "2024-01-15T14:00:00Z",
        details: "Accepted source record as correct"
      }
    ]
  }
];

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { exceptionIds, action, data } = body;

    if (!exceptionIds || !Array.isArray(exceptionIds) || exceptionIds.length === 0) {
      return NextResponse.json(
        { error: "Exception IDs are required" },
        { status: 400 }
      );
    }

    if (!action) {
      return NextResponse.json(
        { error: "Action is required" },
        { status: 400 }
      );
    }

    // Validate action types
    const validActions = ["assign", "resolve", "export"];
    if (!validActions.includes(action)) {
      return NextResponse.json(
        { error: "Invalid action. Must be one of: assign, resolve, export" },
        { status: 400 }
      );
    }

    // In a real app, update the database
    const updatedExceptions = [];

    for (const exceptionId of exceptionIds) {
      const exception = mockExceptions.find(exc => exc.id === exceptionId);

      if (!exception) {
        continue; // Skip if exception not found
      }

      let updatedException = { ...exception };

      switch (action) {
        case "assign":
          if (data?.assignedTo) {
            updatedException.assignedTo = data.assignedTo;
            updatedException.history = [
              ...exception.history,
              {
                action: "Assigned",
                user: "current_user", // In real app, get from auth
                timestamp: new Date().toISOString(),
                details: `Assigned to ${data.assignedTo}`
              }
            ];
          }
          break;

        case "resolve":
          updatedException.status = "resolved";
          updatedException.resolvedAt = new Date().toISOString();
          updatedException.resolution = data?.resolution || "Bulk resolved";
          updatedException.history = [
            ...exception.history,
            {
              action: "Resolved",
              user: "current_user", // In real app, get from auth
              timestamp: new Date().toISOString(),
              details: `Bulk resolved: ${data?.resolution || "No resolution provided"}`
            }
          ];
          break;

        case "export":
          // For export, we don't modify the exception, just mark it as processed
          updatedException.history = [
            ...exception.history,
            {
              action: "Exported",
              user: "current_user", // In real app, get from auth
              timestamp: new Date().toISOString(),
              details: `Included in bulk export (${data?.format || "CSV"})`
            }
          ];
          break;
      }

      updatedExceptions.push(updatedException);
    }

    return NextResponse.json({
      success: true,
      updatedCount: updatedExceptions.length,
      message: `Successfully processed ${updatedExceptions.length} exceptions`,
      exceptions: updatedExceptions
    });
  } catch (error) {
    console.error("Error in bulk update:", error);
    return NextResponse.json(
      { error: "Failed to process bulk update" },
      { status: 500 }
    );
  }
}
