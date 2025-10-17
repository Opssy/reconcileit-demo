import { NextRequest, NextResponse } from "next/server";

// Mock run details data for all runs
const mockRunDetails = {
  "run_001": {
    id: "run_001",
    name: "Daily Bank Reconciliation",
    status: "completed",
    startTime: "2024-01-15T08:00:00Z",
    endTime: "2024-01-15T08:05:30Z",
    duration: 330,
    initiatedBy: "admin",
    pipeline: {
      stages: [
        {
          id: "ingest",
          name: "Data Ingestion",
          status: "completed",
          startTime: "2024-01-15T08:00:00Z",
          endTime: "2024-01-15T08:00:45Z",
          duration: 45,
          metrics: {
            recordsIngested: 15420,
            dataSources: ["Bank API", "Payment Gateway"],
            errors: 0
          }
        },
        {
          id: "prep",
          name: "Data Preparation",
          status: "completed",
          startTime: "2024-01-15T08:00:45Z",
          endTime: "2024-01-15T08:02:15Z",
          duration: 90,
          metrics: {
            recordsProcessed: 15420,
            transformations: ["Date formatting", "Amount normalization"],
            duplicatesRemoved: 0
          }
        },
        {
          id: "reconcile",
          name: "Reconciliation",
          status: "completed",
          startTime: "2024-01-15T08:02:15Z",
          endTime: "2024-01-15T08:04:45Z",
          duration: 150,
          metrics: {
            recordsReconciled: 15420,
            matches: 15280,
            partials: 140,
            exceptions: 0,
            rulesApplied: ["Amount Match", "Reference Check"]
          }
        },
        {
          id: "export",
          name: "Results Export",
          status: "completed",
          startTime: "2024-01-15T08:04:45Z",
          endTime: "2024-01-15T08:05:30Z",
          duration: 45,
          metrics: {
            recordsExported: 15420,
            formats: ["CSV", "JSON"],
            destinations: ["S3 Bucket", "Local Storage"]
          }
        }
      ]
    },
    summary: {
      totalRecords: 15420,
      matchedRecords: 15280,
      partialMatches: 140,
      exceptions: 0,
      accuracy: 99.09,
      totalDuration: 330
    }
  },
  "run_002": {
    id: "run_002",
    name: "Customer Data Validation",
    status: "running",
    startTime: "2024-01-15T07:30:00Z",
    endTime: null,
    duration: null,
    initiatedBy: "reviewer1",
    pipeline: {
      stages: [
        {
          id: "ingest",
          name: "Data Ingestion",
          status: "completed",
          startTime: "2024-01-15T07:30:00Z",
          endTime: "2024-01-15T07:30:30Z",
          duration: 30,
          metrics: {
            recordsIngested: 8560,
            dataSources: ["CRM System"],
            errors: 0
          }
        },
        {
          id: "prep",
          name: "Data Preparation",
          status: "completed",
          startTime: "2024-01-15T07:30:30Z",
          endTime: "2024-01-15T07:31:45Z",
          duration: 75,
          metrics: {
            recordsProcessed: 8560,
            transformations: ["Email validation", "Phone formatting"],
            duplicatesRemoved: 12
          }
        },
        {
          id: "reconcile",
          name: "Reconciliation",
          status: "running",
          startTime: "2024-01-15T07:31:45Z",
          endTime: null,
          duration: null,
          metrics: {
            recordsReconciled: 8200,
            matches: 8200,
            partials: 0,
            exceptions: 0,
            rulesApplied: ["Email Format", "Phone Format"]
          }
        }
      ]
    },
    summary: {
      totalRecords: 8560,
      matchedRecords: 8200,
      partialMatches: 0,
      exceptions: 0,
      accuracy: 95.79,
      totalDuration: null
    }
  },
  "run_003": {
    id: "run_003",
    name: "Inventory Reconciliation",
    status: "failed",
    startTime: "2024-01-15T06:00:00Z",
    endTime: "2024-01-15T06:02:15Z",
    duration: 135,
    initiatedBy: "admin",
    pipeline: {
      stages: [
        {
          id: "ingest",
          name: "Data Ingestion",
          status: "completed",
          startTime: "2024-01-15T06:00:00Z",
          endTime: "2024-01-15T06:01:00Z",
          duration: 60,
          metrics: {
            recordsIngested: 0,
            dataSources: ["Warehouse System"],
            errors: 1
          }
        },
        {
          id: "prep",
          name: "Data Preparation",
          status: "failed",
          startTime: "2024-01-15T06:01:00Z",
          endTime: "2024-01-15T06:02:15Z",
          duration: 75,
          metrics: {
            recordsProcessed: 0,
            transformations: [],
            duplicatesRemoved: 0
          }
        }
      ]
    },
    summary: {
      totalRecords: 0,
      matchedRecords: 0,
      partialMatches: 0,
      exceptions: 0,
      accuracy: 0,
      totalDuration: 135
    },
    error: "Connection timeout to warehouse system"
  },
  "run_004": {
    id: "run_004",
    name: "Monthly Financial Close",
    status: "completed",
    startTime: "2024-01-14T20:00:00Z",
    endTime: "2024-01-14T20:45:22Z",
    duration: 2722,
    initiatedBy: "finance_manager",
    pipeline: {
      stages: [
        {
          id: "ingest",
          name: "Data Ingestion",
          status: "completed",
          startTime: "2024-01-14T20:00:00Z",
          endTime: "2024-01-14T20:05:00Z",
          duration: 300,
          metrics: {
            recordsIngested: 45230,
            dataSources: ["GL System", "AP System", "AR System"],
            errors: 0
          }
        },
        {
          id: "prep",
          name: "Data Preparation",
          status: "completed",
          startTime: "2024-01-14T20:05:00Z",
          endTime: "2024-01-14T20:15:00Z",
          duration: 600,
          metrics: {
            recordsProcessed: 45230,
            transformations: ["Currency conversion", "Account mapping"],
            duplicatesRemoved: 45
          }
        },
        {
          id: "reconcile",
          name: "Reconciliation",
          status: "completed",
          startTime: "2024-01-14T20:15:00Z",
          endTime: "2024-01-14T20:35:00Z",
          duration: 1200,
          metrics: {
            recordsReconciled: 45230,
            matches: 44980,
            partials: 250,
            exceptions: 0,
            rulesApplied: ["Trial Balance", "Account Reconciliation"]
          }
        },
        {
          id: "export",
          name: "Results Export",
          status: "completed",
          startTime: "2024-01-14T20:35:00Z",
          endTime: "2024-01-14T20:45:22Z",
          duration: 622,
          metrics: {
            recordsExported: 45230,
            formats: ["PDF Report", "Excel Workbook"],
            destinations: ["Finance Portal", "Archive Storage"]
          }
        }
      ]
    },
    summary: {
      totalRecords: 45230,
      matchedRecords: 44980,
      partialMatches: 250,
      exceptions: 0,
      accuracy: 99.45,
      totalDuration: 2722
    }
  }
};

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ runId: string }> }
) {
  try {
    const { runId } = await params;

    // In a real app, fetch from database
    const runDetails = mockRunDetails[runId as keyof typeof mockRunDetails];

    if (runDetails) {
      return NextResponse.json(runDetails);
    }

    return NextResponse.json(
      { error: "Run not found" },
      { status: 404 }
    );
  } catch (error) {
    console.error("Error fetching run details:", error);
    return NextResponse.json(
      { error: "Failed to fetch run details" },
      { status: 500 }
    );
  }
}
