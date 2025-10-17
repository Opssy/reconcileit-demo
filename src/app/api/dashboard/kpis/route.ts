import { NextRequest, NextResponse } from "next/server";

// Mock KPI data - in real app, this would come from a database
const mockKPIData = {
  today: {
    totalReconciliations: 1247,
    matchRate: 94.2,
    openExceptions: 23,
    processingJobs: 8,
  },
  week: {
    totalReconciliations: 8920,
    matchRate: 92.8,
    openExceptions: 156,
    processingJobs: 42,
  },
  month: {
    totalReconciliations: 35680,
    matchRate: 93.1,
    openExceptions: 684,
    processingJobs: 178,
  },
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "today";

    // Validate period
    if (!["today", "week", "month"].includes(period)) {
      return NextResponse.json(
        { error: "Invalid period. Use: today, week, or month" },
        { status: 400 }
      );
    }

    // Get KPI data for the period
    const kpiData = mockKPIData[period as keyof typeof mockKPIData];

    // Add trend data (mock calculations)
    const trends = {
      totalReconciliations: period === "today" ? 12 : period === "week" ? 8 : -3,
      matchRate: period === "today" ? 2.1 : period === "week" ? 1.5 : 0.8,
      openExceptions: period === "today" ? -15 : period === "week" ? -8 : 5,
      processingJobs: period === "today" ? 25 : period === "week" ? 18 : -12,
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      period,
      data: {
        totalReconciliations: {
          value: kpiData.totalReconciliations,
          change: trends.totalReconciliations,
          trend: trends.totalReconciliations > 0 ? "up" : trends.totalReconciliations < 0 ? "down" : "neutral",
        },
        matchRate: {
          value: kpiData.matchRate,
          change: trends.matchRate,
          trend: trends.matchRate > 0 ? "up" : trends.matchRate < 0 ? "down" : "neutral",
        },
        openExceptions: {
          value: kpiData.openExceptions,
          change: trends.openExceptions,
          trend: trends.openExceptions > 0 ? "up" : trends.openExceptions < 0 ? "down" : "neutral",
        },
        processingJobs: {
          value: kpiData.processingJobs,
          change: trends.processingJobs,
          trend: trends.processingJobs > 0 ? "up" : trends.processingJobs < 0 ? "down" : "neutral",
        },
      },
    });

  } catch (error) {
    console.error("KPI data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch KPI data" },
      { status: 500 }
    );
  }
}
