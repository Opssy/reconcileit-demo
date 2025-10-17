import { NextRequest, NextResponse } from "next/server";

// Mock reconciliation runs data
const mockRuns = [
  {
    id: "run_001",
    name: "Daily Bank Reconciliation",
    status: "completed",
    startTime: "2024-01-15T08:00:00Z",
    endTime: "2024-01-15T08:05:30Z",
    duration: 330, // seconds
    datasetPairs: [
      { source: "Bank API", target: "Internal Ledger" },
      { source: "Payment Gateway", target: "Transaction DB" }
    ],
    results: {
      totalRecords: 15420,
      matchedRecords: 15280,
      discrepancyRecords: 140,
      accuracy: 99.09
    },
    pipeline: {
      stages: ["ingest", "prep", "reconcile", "export"],
      currentStage: "export"
    }
  },
  {
    id: "run_002",
    name: "Customer Data Validation",
    status: "running",
    startTime: "2024-01-15T07:30:00Z",
    endTime: null,
    duration: null,
    datasetPairs: [
      { source: "CRM System", target: "Master Customer DB" }
    ],
    results: {
      totalRecords: 8560,
      matchedRecords: 8200,
      discrepancyRecords: 360,
      accuracy: 95.79
    },
    pipeline: {
      stages: ["ingest", "prep", "reconcile"],
      currentStage: "reconcile"
    }
  },
  {
    id: "run_003",
    name: "Inventory Reconciliation",
    status: "failed",
    startTime: "2024-01-15T06:00:00Z",
    endTime: "2024-01-15T06:02:15Z",
    duration: 135,
    datasetPairs: [
      { source: "Warehouse System", target: "ERP Inventory" }
    ],
    results: {
      totalRecords: 0,
      matchedRecords: 0,
      discrepancyRecords: 0,
      accuracy: 0
    },
    pipeline: {
      stages: ["ingest", "prep"],
      currentStage: "prep"
    },
    error: "Connection timeout to warehouse system"
  },
  {
    id: "run_004",
    name: "Monthly Financial Close",
    status: "completed",
    startTime: "2024-01-14T20:00:00Z",
    endTime: "2024-01-14T20:45:22Z",
    duration: 2722,
    datasetPairs: [
      { source: "GL System", target: "Subledger" },
      { source: "AP System", target: "AR System" }
    ],
    results: {
      totalRecords: 45230,
      matchedRecords: 44980,
      discrepancyRecords: 250,
      accuracy: 99.45
    },
    pipeline: {
      stages: ["ingest", "prep", "reconcile", "export"],
      currentStage: "export"
    }
  }
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    // Extract query parameters for filtering
    const status = searchParams.get("status");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const source = searchParams.get("source");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let filteredRuns = [...mockRuns];

    // Apply filters
    if (status && status !== "all") {
      filteredRuns = filteredRuns.filter(run => run.status === status);
    }

    if (startDate) {
      filteredRuns = filteredRuns.filter(run => new Date(run.startTime) >= new Date(startDate));
    }

    if (endDate) {
      filteredRuns = filteredRuns.filter(run => new Date(run.startTime) <= new Date(endDate));
    }

    if (source) {
      filteredRuns = filteredRuns.filter(run =>
        run.datasetPairs.some(pair =>
          pair.source.toLowerCase().includes(source.toLowerCase()) ||
          pair.target.toLowerCase().includes(source.toLowerCase())
        )
      );
    }

    // Apply pagination
    const totalRuns = filteredRuns.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedRuns = filteredRuns.slice(startIndex, endIndex);

    // Calculate duration for running jobs
    const runsWithDuration = paginatedRuns.map(run => ({
      ...run,
      duration: run.duration || (run.status === "running" ?
        Math.floor((new Date().getTime() - new Date(run.startTime).getTime()) / 1000) : null
      )
    }));

    return NextResponse.json({
      runs: runsWithDuration,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalRuns / limit),
        totalRuns,
        hasNext: endIndex < totalRuns,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching reconciliation runs:", error);
    return NextResponse.json(
      { error: "Failed to fetch reconciliation runs" },
      { status: 500 }
    );
  }
}
