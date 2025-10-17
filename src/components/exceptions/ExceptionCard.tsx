"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, AlertTriangle, Info, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ExceptionCardProps {
  id: string;
  type: string;
  severity: "high" | "medium" | "low";
  amount: number;
  timestamp: string;
  source: string;
  target: string;
  description: string;
  assignedTo?: string | null;
  isDragging?: boolean;
  onClick?: () => void;
}

export function ExceptionCard({
  id,
  type,
  severity,
  amount,
  timestamp,
  source,
  target,
  description,
  assignedTo,
  isDragging,
  onClick
}: ExceptionCardProps) {
  const getSeverityColor = (sev: string) => {
    switch (sev) {
      case "high":
        return "bg-red-100 text-red-800 border-red-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case "high":
        return <AlertCircle className="w-4 h-4" />;
      case "medium":
        return <AlertTriangle className="w-4 h-4" />;
      case "low":
        return <Info className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <Card
      className={`p-4 cursor-pointer transition-all ${
        isDragging ? "opacity-50 shadow-lg" : "hover:shadow-md"
      } ${onClick ? "cursor-pointer" : "cursor-move"}`}
      onClick={onClick}
    >
      <div className="space-y-3">
        {/* Header with Type and Severity */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-semibold text-sm text-gray-900">{type}</h4>
            <p className="text-xs text-gray-600 mt-1">{description}</p>
          </div>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 whitespace-nowrap ${getSeverityColor(
              severity
            )}`}
          >
            {getSeverityIcon(severity)}
            <span className="capitalize">{severity}</span>
          </Badge>
        </div>

        {/* Amount */}
        <div className="bg-gray-50 px-3 py-2 rounded-md">
          <div className="text-xs text-gray-600">Amount</div>
          <div className="text-lg font-bold text-gray-900">
            ${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Source and Target */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div>
            <div className="text-gray-600">From</div>
            <div className="font-medium text-gray-900">{source}</div>
          </div>
          <div>
            <div className="text-gray-600">To</div>
            <div className="font-medium text-gray-900">{target}</div>
          </div>
        </div>

        {/* Timestamp and Assignment */}
        <div className="flex items-center justify-between text-xs text-gray-600 pt-2 border-t">
          <span>{formatDate(timestamp)}</span>
          {assignedTo && (
            <Badge variant="secondary" className="text-xs">
              {assignedTo}
            </Badge>
          )}
        </div>

        {/* Exception ID and View Button */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500 font-mono">{id}</span>
          {onClick && (
            <Button variant="ghost" size="sm" className="h-6 px-2">
              <Eye className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}
