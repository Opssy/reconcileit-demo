"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown, AlertCircle } from "lucide-react";

interface MatchRateTrendChartProps {
  data?: Array<{
    date: string;
    matchRate: number;
    volume: number;
  }>;
  loading?: boolean;
  error?: string;
  className?: string;
}

export function MatchRateTrendChart({
  data,
  loading = false,
  error,
  className = "",
}: MatchRateTrendChartProps) {
  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="text-sm font-medium text-gray-900 mb-1">
            {formatDate(label)}
          </p>
          <p className="text-sm text-blue-600">
            Match Rate: <span className="font-semibold">{payload[0].value}%</span>
          </p>
          <p className="text-sm text-gray-600">
            Volume: <span className="font-semibold">{payload[0].payload.volume.toLocaleString()}</span>
          </p>
        </div>
      );
    }
    return null;
  };

  if (error) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Match Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-red-600">
            <AlertCircle className="h-8 w-8 mr-2" />
            <span>Failed to load chart data</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (loading || !data) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Match Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-32 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (data.length === 0) {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-gray-900">
            Match Rate Trend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-gray-500">
            <div className="text-center">
              <TrendingUp className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No data available</p>
              <p className="text-sm">Match rate data will appear here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Calculate trend
  const currentRate = data[data.length - 1]?.matchRate || 0;
  const previousRate = data.length > 1
    ? data[data.length - 2]?.matchRate || 0
    : currentRate;
  const trend = data.length > 1
    ? currentRate - previousRate
    : 0;
  const isPositive = trend > 0;

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-gray-900">
            Match Rate Trend
          </CardTitle>
          <div className={`flex items-center text-sm ${isPositive ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : trend < 0 ? <TrendingDown className="h-4 w-4 mr-1" /> : null}
            <span>
              {trend !== 0 && `${Math.abs(trend).toFixed(1)}% `}
              vs previous day
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-600"
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                className="text-xs text-gray-600"
                domain={[85, 100]}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="matchRate"
                stroke="#2563eb"
                strokeWidth={3}
                dot={{ fill: "#2563eb", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#2563eb", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
