"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar, Filter, X, RotateCcw } from "lucide-react";

interface ExceptionFiltersProps {
  filters: {
    type: string;
    severity: string;
    amountMin: string;
    amountMax: string;
    dateFrom: string;
    dateTo: string;
    assignee: string;
    status: string;
  };
  onFiltersChange: (filters: Record<string, unknown>) => void;
  onClearFilters: () => void;
}

export function ExceptionFilters({
  filters,
  onFiltersChange,
  onClearFilters
}: ExceptionFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = (key: string, value: string) => {
    onFiltersChange({ ...filters, [key]: value } as Record<string, unknown>);
  };

  const hasActiveFilters = Object.values(filters).some(value =>
    value !== "" && value !== "all"
  );

  const activeFilterCount = Object.values(filters).filter(value =>
    value !== "" && value !== "all"
  ).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            <CardTitle className="text-lg">Filters</CardTitle>
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFilterCount} active
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onClearFilters()}
                className="flex items-center gap-1"
              >
                <RotateCcw className="w-4 h-4" />
                Clear
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? "Collapse" : "Expand"}
            </Button>
          </div>
        </div>
      </CardHeader>

      {isExpanded && (
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Exception Type Filter */}
            <div className="space-y-2">
              <Label htmlFor="type">Exception Type</Label>
              <Select
                value={filters.type}
                onValueChange={(value) => handleFilterChange("type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="Amount Mismatch">Amount Mismatch</SelectItem>
                  <SelectItem value="Missing Record">Missing Record</SelectItem>
                  <SelectItem value="Duplicate Record">Duplicate Record</SelectItem>
                  <SelectItem value="Date Mismatch">Date Mismatch</SelectItem>
                  <SelectItem value="Reference Mismatch">Reference Mismatch</SelectItem>
                  <SelectItem value="Status Mismatch">Status Mismatch</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Severity Filter */}
            <div className="space-y-2">
              <Label htmlFor="severity">Severity</Label>
              <Select
                value={filters.severity}
                onValueChange={(value) => handleFilterChange("severity", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All severities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Severities</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="low">Low</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Status Filter */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={filters.status}
                onValueChange={(value) => handleFilterChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="in_review">In Review</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="resolved">Resolved</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Range Filters */}
            <div className="space-y-2">
              <Label htmlFor="amountMin">Amount Range</Label>
              <div className="flex gap-2">
                <Input
                  id="amountMin"
                  type="number"
                  placeholder="Min"
                  value={filters.amountMin}
                  onChange={(e) => handleFilterChange("amountMin", e.target.value)}
                  className="flex-1"
                />
                <Input
                  id="amountMax"
                  type="number"
                  placeholder="Max"
                  value={filters.amountMax}
                  onChange={(e) => handleFilterChange("amountMax", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Date Range Filters */}
            <div className="space-y-2">
              <Label htmlFor="dateFrom">Date Range</Label>
              <div className="flex gap-2">
                <Input
                  id="dateFrom"
                  type="date"
                  value={filters.dateFrom}
                  onChange={(e) => handleFilterChange("dateFrom", e.target.value)}
                  className="flex-1"
                />
                <Input
                  id="dateTo"
                  type="date"
                  value={filters.dateTo}
                  onChange={(e) => handleFilterChange("dateTo", e.target.value)}
                  className="flex-1"
                />
              </div>
            </div>

            {/* Assignee Filter */}
            <div className="space-y-2">
              <Label htmlFor="assignee">Assignee</Label>
              <Select
                value={filters.assignee}
                onValueChange={(value) => handleFilterChange("assignee", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="All assignees" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Assignees</SelectItem>
                  <SelectItem value="unassigned">Unassigned</SelectItem>
                  <SelectItem value="reviewer1">Sarah Johnson</SelectItem>
                  <SelectItem value="reviewer2">David Wilson</SelectItem>
                  <SelectItem value="reviewer3">Emma Davis</SelectItem>
                  <SelectItem value="approver1">Michael Chen</SelectItem>
                  <SelectItem value="approver2">Lisa Rodriguez</SelectItem>
                  <SelectItem value="admin">John Smith</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Active Filters Summary */}
          {hasActiveFilters && (
            <div className="pt-4 border-t">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Active Filters:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onClearFilters()}
                  className="text-xs"
                >
                  Clear All
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {filters.type !== "all" && filters.type && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Type: {filters.type}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterChange("type", "all")}
                    />
                  </Badge>
                )}
                {filters.severity !== "all" && filters.severity && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Severity: {filters.severity}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterChange("severity", "all")}
                    />
                  </Badge>
                )}
                {filters.status !== "all" && filters.status && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Status: {filters.status.replace(/_/g, " ")}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterChange("status", "all")}
                    />
                  </Badge>
                )}
                {(filters.amountMin || filters.amountMax) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Amount: ${filters.amountMin || "0"} - ${filters.amountMax || "∞"}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        handleFilterChange("amountMin", "");
                        handleFilterChange("amountMax", "");
                      }}
                    />
                  </Badge>
                )}
                {(filters.dateFrom || filters.dateTo) && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Date: {filters.dateFrom || "∞"} - {filters.dateTo || "∞"}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => {
                        handleFilterChange("dateFrom", "");
                        handleFilterChange("dateTo", "");
                      }}
                    />
                  </Badge>
                )}
                {filters.assignee !== "all" && filters.assignee && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    Assignee: {filters.assignee === "unassigned" ? "Unassigned" :
                              filters.assignee === "reviewer1" ? "Sarah Johnson" :
                              filters.assignee === "reviewer2" ? "David Wilson" :
                              filters.assignee === "reviewer3" ? "Emma Davis" :
                              filters.assignee === "approver1" ? "Michael Chen" :
                              filters.assignee === "approver2" ? "Lisa Rodriguez" :
                              filters.assignee === "admin" ? "John Smith" : filters.assignee}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={() => handleFilterChange("assignee", "all")}
                    />
                  </Badge>
                )}
              </div>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
