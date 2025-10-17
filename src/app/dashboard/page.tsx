"use client";

import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { KPICard } from "@/components/dashboard/KPICard";
import { RecentActivityFeed } from "@/components/dashboard/RecentActivityFeed";
import { MatchRateTrendChart } from "@/components/dashboard/MatchRateTrendChart";
import { ExceptionTypesChart } from "@/components/dashboard/ExceptionTypesChart";
import { FileText, CheckCircle, AlertTriangle, Cog } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function DashboardPage() {
  const { user } = useAuth();
  const [selectedPeriod, setSelectedPeriod] = useState<"today" | "week" | "month">("today");

  // Fetch KPI data
  const { data: kpiData, isLoading: kpiLoading, refetch: refetchKPI } = useQuery({
    queryKey: ["kpis", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/kpis?period=${selectedPeriod}`);
      if (!response.ok) throw new Error("Failed to fetch KPI data");
      return response.json();
    },
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  // Fetch chart data
  const { data: chartData, isLoading: chartLoading, error: chartError } = useQuery({
    queryKey: ["charts", selectedPeriod],
    queryFn: async () => {
      const response = await fetch(`/api/dashboard/trends?period=${selectedPeriod}`);
      if (!response.ok) throw new Error("Failed to fetch chart data");
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
  });

  // Update data when period changes
  useEffect(() => {
    refetchKPI();
  }, [selectedPeriod, refetchKPI]);

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900 font-polymath">Key Metrics</h2>
        <div className="flex space-x-2">
          {(["today", "week", "month"] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-2 text-sm font-medium rounded-md capitalize transition-colors ${
                selectedPeriod === period
                  ? "bg-blue-600 text-white"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <KPICard
          title="Total Reconciliations"
          value={kpiData?.data?.totalReconciliations?.value || 0}
          change={kpiData?.data?.totalReconciliations?.change}
          trend={kpiData?.data?.totalReconciliations?.trend}
          icon={FileText}
          loading={kpiLoading}
        />
        <KPICard
          title="Match Rate"
          value={kpiData?.data?.matchRate?.value || 0}
          change={kpiData?.data?.matchRate?.change}
          trend={kpiData?.data?.matchRate?.trend}
          icon={CheckCircle}
          loading={kpiLoading}
        />
        <KPICard
          title="Open Exceptions"
          value={kpiData?.data?.openExceptions?.value || 0}
          change={kpiData?.data?.openExceptions?.change}
          trend={kpiData?.data?.openExceptions?.trend}
          icon={AlertTriangle}
          loading={kpiLoading}
        />
        <KPICard
          title="Processing Jobs"
          value={kpiData?.data?.processingJobs?.value || 0}
          change={kpiData?.data?.processingJobs?.change}
          trend={kpiData?.data?.processingJobs?.trend}
          icon={Cog}
          loading={kpiLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MatchRateTrendChart
          data={chartData?.data?.matchRateTrend}
          loading={chartLoading}
          error={chartError?.message}
        />
        <ExceptionTypesChart
          data={chartData?.data?.exceptionTypes}
          loading={chartLoading}
          error={chartError?.message}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2">
          <RecentActivityFeed />
        </div>


      </div>
    </div>
  );
}