import { NextRequest, NextResponse } from "next/server";

// Mock chart data - in real app, this would come from a database
const mockChartData = {
  matchRateTrend: [
    { date: "2024-01-01", matchRate: 92.1, volume: 1200 },
    { date: "2024-01-02", matchRate: 93.2, volume: 1350 },
    { date: "2024-01-03", matchRate: 91.8, volume: 1180 },
    { date: "2024-01-04", matchRate: 94.5, volume: 1420 },
    { date: "2024-01-05", matchRate: 93.9, volume: 1380 },
    { date: "2024-01-06", matchRate: 95.1, volume: 1500 },
    { date: "2024-01-07", matchRate: 94.8, volume: 1450 },
  ],
  exceptionTypes: [
    { type: "Amount Mismatch", count: 45, percentage: 35.2 },
    { type: "Date Discrepancy", count: 32, percentage: 25.0 },
    { type: "Missing Reference", count: 28, percentage: 21.9 },
    { type: "Account Mismatch", count: 18, percentage: 14.1 },
    { type: "Other", count: 5, percentage: 3.9 },
  ],
  weeklyTrends: [
    { week: "Week 1", reconciliations: 8200, exceptions: 145 },
    { week: "Week 2", reconciliations: 8900, exceptions: 132 },
    { week: "Week 3", reconciliations: 7600, exceptions: 168 },
    { week: "Week 4", reconciliations: 9100, exceptions: 124 },
  ],
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const chartType = searchParams.get("type") || "all";
    const period = searchParams.get("period") || "week";

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));

    switch (chartType) {
      case "match-rate":
        return NextResponse.json({
          type: "match-rate",
          period,
          data: mockChartData.matchRateTrend.slice(-7), // Last 7 days
        });

      case "exceptions":
        return NextResponse.json({
          type: "exceptions",
          period,
          data: mockChartData.exceptionTypes,
        });

      case "trends":
        return NextResponse.json({
          type: "trends",
          period,
          data: mockChartData.weeklyTrends,
        });

      case "all":
      default:
        return NextResponse.json({
          type: "all",
          period,
          data: {
            matchRateTrend: mockChartData.matchRateTrend.slice(-7),
            exceptionTypes: mockChartData.exceptionTypes,
            weeklyTrends: mockChartData.weeklyTrends,
          },
        });
    }

  } catch (error) {
    console.error("Chart data error:", error);
    return NextResponse.json(
      { error: "Failed to fetch chart data" },
      { status: 500 }
    );
  }
}
