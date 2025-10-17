"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Calendar,
  Database,
  ChevronLeft,
  ChevronRight,
  Eye,
  Download,
  FileText
} from "lucide-react";

interface ReconciliationRun {
  id: string;
  name: string;
  status: "completed" | "running" | "failed" | "paused";
  startTime: string;
  endTime: string | null;
  duration: number | null;
  datasetPairs: Array<{
    source: string;
    target: string;
  }>;
  results: {
    totalRecords: number;
    matchedRecords: number;
    discrepancyRecords: number;
    accuracy: number;
  };
  pipeline: {
    stages: string[];
    currentStage: string;
  };
  error?: string;
}

interface RunHistoryTableProps {
  runs?: ReconciliationRun[];
  isLoading?: boolean;
}

export function RunHistoryTable({ runs = [], isLoading = false }: RunHistoryTableProps) {
  const [selectedRun, setSelectedRun] = useState<ReconciliationRun | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    startDate: "",
    endDate: "",
    source: "",
    search: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalRuns, setTotalRuns] = useState(0);
  const [filteredRuns, setFilteredRuns] = useState<ReconciliationRun[]>(runs);
  const router = useRouter();

  const itemsPerPage = 10;

  // Fetch runs with filters
  useEffect(() => {
    const fetchRuns = async () => {
      const params = new URLSearchParams();

      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);
      if (filters.source) params.append("source", filters.source);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      try {
        const response = await fetch(`/api/reconciliations?${params}`);
        if (response.ok) {
          const data = await response.json();
          setFilteredRuns(data.runs);
          setTotalPages(data.pagination.totalPages);
          setTotalRuns(data.pagination.totalRuns);
        }
      } catch (error) {
        console.error("Error fetching runs:", error);
      }
    };

    fetchRuns();
  }, [filters, currentPage]);

  const formatDuration = (seconds: number | null) => {
    if (!seconds) return "-";

    if (seconds < 60) return `${seconds}s`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`;

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: "bg-green-100 text-green-800 border-green-200",
      running: "bg-blue-100 text-blue-800 border-blue-200",
      failed: "bg-red-100 text-red-800 border-red-200",
      paused: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };

    return (
      <Badge className={`capitalize ${variants[status as keyof typeof variants]}`}>
        {status}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case "running":
        return <Play className="w-4 h-4 text-blue-600" />;
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />;
      case "paused":
        return <Pause className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProgressValue = (run: ReconciliationRun) => {
    if (run.status === "completed") return 100;
    if (run.status === "failed") return 0;

    const stageIndex = run.pipeline.stages.indexOf(run.pipeline.currentStage);
    return ((stageIndex + 1) / run.pipeline.stages.length) * 100;
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setCurrentPage(1); // Reset to first page when filtering
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => handleFilterChange("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="running">Running</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="paused">Paused</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Start Date</Label>
              <Input
                type="date"
                value={filters.startDate}
                onChange={(e) => handleFilterChange("startDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={filters.endDate}
                onChange={(e) => handleFilterChange("endDate", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Source/Target</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search sources..."
                  value={filters.source}
                  onChange={(e) => handleFilterChange("source", e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredRuns.length} of {totalRuns} runs
        </div>
      </div>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : filteredRuns.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Database className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reconciliation runs found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Run ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Dataset Pairs</TableHead>
                    <TableHead>Results</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRuns.map((run) => (
                    <TableRow key={run.id} className="hover:bg-gray-50">
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          {run.id}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{run.name}</div>
                          {run.error && (
                            <div className="text-xs text-red-600 mt-1">
                              {run.error}
                            </div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(run.status)}
                          {getStatusBadge(run.status)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDate(run.startTime)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {formatDuration(run.duration)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {run.datasetPairs.map((pair, index) => (
                            <div key={index} className="text-xs">
                              <Badge variant="outline" className="mr-1">
                                {pair.source}
                              </Badge>
                              →
                              <Badge variant="outline" className="ml-1">
                                {pair.target}
                              </Badge>
                            </div>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm space-y-1">
                          <div>Total: {run.results.totalRecords.toLocaleString()}</div>
                          <div className="text-green-600">
                            Matched: {run.results.matchedRecords.toLocaleString()}
                          </div>
                          {run.results.discrepancyRecords > 0 && (
                            <div className="text-red-600">
                              Issues: {run.results.discrepancyRecords.toLocaleString()}
                            </div>
                          )}
                          <div className="font-medium">
                            Accuracy: {run.results.accuracy.toFixed(2)}%
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-2">
                          <Progress value={getProgressValue(run)} className="w-full" />
                          <div className="text-xs text-gray-500">
                            {run.pipeline.currentStage} ({Math.round(getProgressValue(run))}%)
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => router.push(`/dashboard/reconciliations/history/${run.id}`)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Dialog>
                            <DialogTrigger>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedRun(run)}
                              >
                                <FileText className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                  {getStatusIcon(run.status)}
                                  {run.name} - {run.id}
                                </DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm font-medium">Status</Label>
                                    <div className="mt-1">{getStatusBadge(run.status)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Duration</Label>
                                    <div className="mt-1">{formatDuration(run.duration)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">Start Time</Label>
                                    <div className="mt-1">{formatDate(run.startTime)}</div>
                                  </div>
                                  <div>
                                    <Label className="text-sm font-medium">End Time</Label>
                                    <div className="mt-1">
                                      {run.endTime ? formatDate(run.endTime) : "In Progress"}
                                    </div>
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Dataset Pairs</Label>
                                  <div className="mt-2 space-y-2">
                                    {run.datasetPairs.map((pair, index) => (
                                      <div key={index} className="flex items-center gap-2">
                                        <Database className="w-4 h-4 text-gray-400" />
                                        <Badge variant="outline">{pair.source}</Badge>
                                        <span>→</span>
                                        <Badge variant="outline">{pair.target}</Badge>
                                      </div>
                                    ))}
                                  </div>
                                </div>

                                <div>
                                  <Label className="text-sm font-medium">Results</Label>
                                  <div className="mt-2 grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <div className="text-sm">Total Records</div>
                                      <div className="font-medium">{run.results.totalRecords.toLocaleString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">Matched Records</div>
                                      <div className="font-medium text-green-600">{run.results.matchedRecords.toLocaleString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">Discrepancies</div>
                                      <div className="font-medium text-red-600">{run.results.discrepancyRecords.toLocaleString()}</div>
                                    </div>
                                    <div className="space-y-1">
                                      <div className="text-sm">Accuracy</div>
                                      <div className="font-medium">{run.results.accuracy.toFixed(2)}%</div>
                                    </div>
                                  </div>
                                </div>

                                {run.error && (
                                  <div>
                                    <Label className="text-sm font-medium text-red-600">Error</Label>
                                    <div className="mt-1 p-3 bg-red-50 border border-red-200 rounded-md">
                                      <div className="text-sm text-red-800">{run.error}</div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
