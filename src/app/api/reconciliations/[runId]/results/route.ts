import { NextRequest, NextResponse } from "next/server";

// Mock reconciliation results data for all runs
const mockResults = {
  "run_001": {
    runId: "run_001",
    summary: {
      totalRecords: 15420,
      matchedRecords: 15280,
      partialMatches: 140,
      exceptions: 0,
      accuracy: 99.09
    },
    results: [
      {
        id: "rec_001",
        status: "match",
        datasetA: {
          source: "Bank API",
          record: {
            transactionId: "TXN_001",
            amount: 150.00,
            date: "2024-01-15",
            reference: "REF_001",
            description: "Payment for invoice #123"
          }
        },
        datasetB: {
          source: "Internal Ledger",
          record: {
            transactionId: "TXN_001",
            amount: 150.00,
            date: "2024-01-15",
            reference: "REF_001",
            description: "Payment for invoice #123"
          }
        },
        matchDetails: {
          confidence: 100,
          matchedFields: ["amount", "date", "reference"],
          differences: []
        }
      },
      {
        id: "rec_002",
        status: "partial",
        datasetA: {
          source: "Bank API",
          record: {
            transactionId: "TXN_002",
            amount: 75.50,
            date: "2024-01-15",
            reference: "REF_002",
            description: "Partial payment"
          }
        },
        datasetB: {
          source: "Internal Ledger",
          record: {
            transactionId: "TXN_002",
            amount: 75.50,
            date: "2024-01-15",
            reference: "REF_002_PARTIAL",
            description: "Partial payment - awaiting balance"
          }
        },
        matchDetails: {
          confidence: 85,
          matchedFields: ["amount", "date"],
          differences: [
            {
              field: "reference",
              datasetA: "REF_002",
              datasetB: "REF_002_PARTIAL",
              severity: "minor"
            }
          ]
        }
      }
    ]
  },
  "run_002": {
    runId: "run_002",
    summary: {
      totalRecords: 8560,
      matchedRecords: 8200,
      partialMatches: 0,
      exceptions: 0,
      accuracy: 95.79
    },
    results: [
      {
        id: "rec_003",
        status: "match",
        datasetA: {
          source: "CRM System",
          record: {
            customerId: "CUST_001",
            email: "john.doe@example.com",
            phone: "+1-555-0123",
            name: "John Doe"
          }
        },
        datasetB: {
          source: "Master Customer DB",
          record: {
            customerId: "CUST_001",
            email: "john.doe@example.com",
            phone: "+1-555-0123",
            name: "John Doe"
          }
        },
        matchDetails: {
          confidence: 100,
          matchedFields: ["email", "phone", "name"],
          differences: []
        }
      }
    ]
  },
  "run_003": {
    runId: "run_003",
    summary: {
      totalRecords: 0,
      matchedRecords: 0,
      partialMatches: 0,
      exceptions: 0,
      accuracy: 0
    },
    results: []
  },
  "run_004": {
    runId: "run_004",
    summary: {
      totalRecords: 45230,
      matchedRecords: 44980,
      partialMatches: 250,
      exceptions: 0,
      accuracy: 99.45
    },
    results: [
      {
        id: "rec_004",
        status: "match",
        datasetA: {
          source: "GL System",
          record: {
            accountId: "ACC_001",
            balance: 1000000.00,
            period: "2024-01",
            type: "Asset"
          }
        },
        datasetB: {
          source: "Subledger",
          record: {
            accountId: "ACC_001",
            balance: 1000000.00,
            period: "2024-01",
            type: "Asset"
          }
        },
        matchDetails: {
          confidence: 100,
          matchedFields: ["accountId", "balance", "period"],
          differences: []
        }
      },
      {
        id: "rec_005",
        status: "partial",
        datasetA: {
          source: "AP System",
          record: {
            accountId: "ACC_002",
            balance: 250000.00,
            period: "2024-01",
            type: "Liability"
          }
        },
        datasetB: {
          source: "AR System",
          record: {
            accountId: "ACC_002",
            balance: 249850.00,
            period: "2024-01",
            type: "Liability"
          }
        },
        matchDetails: {
          confidence: 95,
          matchedFields: ["accountId", "period", "type"],
          differences: [
            {
              field: "balance",
              datasetA: "250000.00",
              datasetB: "249850.00",
              severity: "minor"
            }
          ]
        }
      }
    ]
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;
    const { searchParams } = new URL(request.url);

    // Extract query parameters for filtering
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search");

    // In a real app, fetch from database based on runId
    const runResults = mockResults[runId as keyof typeof mockResults];

    if (runResults) {
      let filteredResults = [...runResults.results];

      // Apply status filter
      if (status && status !== "all") {
        filteredResults = filteredResults.filter(result => result.status === status);
      }

      // Apply search filter
      if (search) {
        filteredResults = filteredResults.filter(result =>
          JSON.stringify(result).toLowerCase().includes(search.toLowerCase())
        );
      }

      // Apply pagination
      const totalResults = filteredResults.length;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedResults = filteredResults.slice(startIndex, endIndex);

      return NextResponse.json({
        runId,
        summary: runResults.summary,
        results: paginatedResults,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(totalResults / limit),
          totalResults,
          hasNext: endIndex < totalResults,
          hasPrev: page > 1
        }
      });
    }

    return NextResponse.json(
      { error: "Run not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching run results:", error);
    return NextResponse.json(
      { error: "Failed to fetch run results" },
      { status: 500 }
    );
  }
}
