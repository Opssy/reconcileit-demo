"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  CheckCircle,
  XCircle,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  Eye,
  RefreshCw
} from "lucide-react";
import { useRouter } from "next/navigation";

interface RecentReconciliation {
  id: string;
  sourcePairs: string[];
  status: "completed" | "running" | "failed";
  matchRate?: number;
  totalMatches?: number;
  totalRecords: number;
  timestamp: string;
  duration: string;
  error?: string;
}

interface RecentActivityFeedProps {
  className?: string;
}

export function RecentActivityFeed({ className = "" }: RecentActivityFeedProps) {
  const router = useRouter();

  // Fetch recent reconciliations
  const { data: recentData, isLoading, error, refetch } = useQuery({
    queryKey: ["recent-reconciliations"],
    queryFn: async () => {
      const response = await fetch("/api/reconciliations/recent?limit=10");
      if (!response.ok) throw new Error("Failed to fetch recent reconciliations");
      return response.json();
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${diffDays}d ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "running":
        return <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      running:   "bg-blue-100 text-blue-800 border-blue-200",
      failed:    "bg-red-100 text-red-800 border-red-200",
    };

    const variantClass =
      variants[status as keyof typeof variants] ||
      "bg-gray-100 text-gray-800 border-gray-200";

    return (
      <Badge variant="outline" className={`capitalize ${variantClass}`}>
        {status}
      </Badge>
    );
  };

  const handleViewDetails = (reconciliationId: string) => {
    router.push(`/dashboard/reconciliations/${reconciliationId}`);
  };

  const handleRefresh = () => {
    refetch();
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-48 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Failed to load recent activity</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Recent Activity
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isLoading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {isLoading ? (
          <div className="space-y-4 p-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="flex items-center justify-between mb-2">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16"></div>
                </div>
                <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                <div className="flex justify-between text-sm">
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                  <div className="h-3 bg-gray-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        ) : recentData?.data?.length === 0 ? (
          <div className="flex items-center justify-center h-48 text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Reconciliation runs will appear here</p>
            </div>
          </div>
        ) : (
          <div className="space-y-0">
            {recentData?.data?.map((reconciliation: RecentReconciliation) => (
              <div
                key={reconciliation.id}
                className="p-4 border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => handleViewDetails(reconciliation.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getStatusIcon(reconciliation.status)}
                    <span className="font-medium text-gray-900">
                      {reconciliation.id}
                    </span>
                  </div>
                  {getStatusBadge(reconciliation.status)}
                </div>

                <div className="text-sm text-gray-600 mb-2">
                  <span className="font-medium">Sources:</span>{" "}
                  {reconciliation.sourcePairs.join(" ↔ ")}
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-4">
                    {reconciliation.matchRate && (
                      <span className="text-green-600 font-medium">
                        {reconciliation.matchRate}% match rate
                      </span>
                    )}
                    {reconciliation.totalMatches && (
                      <span className="text-blue-600">
                        {reconciliation.totalMatches.toLocaleString()} matches
                      </span>
                    )}
                    <span className="text-gray-500">
                      {reconciliation.totalRecords.toLocaleString()} records
                    </span>
                  </div>
                  <span className="text-gray-500">
                    {formatTimestamp(reconciliation.timestamp)}
                  </span>
                </div>

                {reconciliation.error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-4 w-4 inline mr-1" />
                    {reconciliation.error}
                  </div>
                )}

                <div className="mt-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-gray-500">
                    Duration: {reconciliation.duration}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-blue-600 hover:text-blue-800 p-1"
                  >
                    <Eye className="h-4 w-4 mr-1" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
