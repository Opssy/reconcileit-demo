"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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
  FileText,
  TrendingUp,
  Activity,
  Timer,
  Zap
} from "lucide-react";

interface ReconciliationRun {
  id: string;
  name: string;
  status: "completed" | "running" | "failed" | "paused";
  startTime: string;
  endTime: string | null;
  duration: number | null;
  initiatedBy: string;
  pipeline: {
    stages: Array<{
      id: string;
      name: string;
      status: string;
      startTime: string;
      endTime: string;
      duration: number;
      metrics: {
        [key: string]: unknown;
      };
    }>;
  };
  summary: {
    totalRecords: number;
    matchedRecords: number;
    partialMatches: number;
    exceptions: number;
    accuracy: number;
    totalDuration: number;
  };
}

interface ReconciliationResult {
  id: string;
  status: "match" | "partial" | "exception";
  datasetA: {
    source: string;
    record: Record<string, unknown>;
  };
  datasetB: {
    source: string;
    record: Record<string, unknown>;
  };
  matchDetails: {
    confidence: number;
    matchedFields: string[];
    differences: Array<{
      field: string;
      datasetA: string;
      datasetB: string;
      severity: string;
    }>;
  };
}

interface RunDetailsPageProps {
  runId?: string;
}

export function RunDetailsPage({ runId: propRunId }: RunDetailsPageProps) {
  const params = useParams();
  const runId = propRunId || params?.runId as string;
  const router = useRouter();

  const [run, setRun] = useState<ReconciliationRun | null>(null);
  const [results, setResults] = useState<ReconciliationResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedResult, setSelectedResult] = useState<ReconciliationResult | null>(null);
  const [filters, setFilters] = useState({
    status: "all",
    search: ""
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const itemsPerPage = 20;

  useEffect(() => {
    if (runId) {
      fetchRunDetails();
      fetchResults();
    }
  }, [runId, filters, currentPage]);

  const fetchRunDetails = async () => {
    try {
      const response = await fetch(`/api/reconciliations/${runId}`);
      if (response.ok) {
        const data = await response.json();
        setRun(data);
      }
    } catch (error) {
      console.error("Error fetching run details:", error);
    }
  };

  const fetchResults = async () => {
    try {
      const params = new URLSearchParams();
      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);
      params.append("page", currentPage.toString());
      params.append("limit", itemsPerPage.toString());

      const response = await fetch(`/api/reconciliations/${runId}/results?${params}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data.results);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (seconds: number) => {
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
      minute: "2-digit",
      second: "2-digit"
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

  const getResultStatusBadge = (status: string) => {
    const variants = {
      match: "bg-green-100 text-green-800 border-green-200",
      partial: "bg-yellow-100 text-yellow-800 border-yellow-200",
      exception: "bg-red-100 text-red-800 border-red-200",
    };

    return (
      <Badge className={`capitalize ${variants[status as keyof typeof variants]}`}>
        {status}
      </Badge>
    );
  };

  const handleExport = () => {
    // In a real app, this would trigger a CSV/XLSX download
    console.log("Exporting results...");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!run) {
    return (
      <div className="text-center py-8">
        <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-red-500" />
        <p className="text-gray-600">Run not found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/reconciliations/history")}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back to History
            </Button>
            <div className="flex items-center gap-2">
              {getStatusIcon(run.status)}
              {getStatusBadge(run.status)}
            </div>
          </div>
          <h1 className="text-3xl font-bold">{run.name}</h1>
          <p className="text-gray-600">Run ID: {run.id} • Initiated by {run.initiatedBy}</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="w-4 h-4" />
          Export Results
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Database className="w-8 h-8 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-2xl font-bold">{run.summary.totalRecords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Matches</p>
                <p className="text-2xl font-bold">{run.summary.matchedRecords.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-yellow-600" />
              <div>
                <p className="text-sm text-gray-600">Partials</p>
                <p className="text-2xl font-bold">{run.summary.partialMatches.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="w-8 h-8 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-2xl font-bold">{run.summary.accuracy.toFixed(2)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pipeline Stages */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Pipeline Execution Log
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {run.pipeline.stages.map((stage, index) => (
              <div key={stage.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex-shrink-0">
                  {getStatusIcon(stage.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium">{stage.name}</h3>
                    <Badge variant="outline">{stage.status}</Badge>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-medium">{formatDuration(stage.duration)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Start:</span>
                      <span className="ml-2 font-medium">{formatDate(stage.startTime)}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">End:</span>
                      <span className="ml-2 font-medium">{formatDate(stage.endTime)}</span>
                    </div>
                    {(stage.metrics.recordsIngested as number) > 0 && (
                      <div>
                        <span className="text-gray-600">Records:</span>
                        <span className="ml-2 font-medium">{(stage.metrics.recordsIngested as number).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Results Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Reconciliation Results
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search records..."
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Results</SelectItem>
                <SelectItem value="match">Matches</SelectItem>
                <SelectItem value="partial">Partials</SelectItem>
                <SelectItem value="exception">Exceptions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Results Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Status</TableHead>
                  <TableHead>Dataset A</TableHead>
                  <TableHead>Dataset B</TableHead>
                  <TableHead>Match Details</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow key={result.id} className="hover:bg-gray-50">
                    <TableCell>
                      {getResultStatusBadge(result.status)}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium text-sm">{result.datasetA.source}</div>
                        <div className="text-xs text-gray-600">
                          ID: {(result.datasetA.record.transactionId as string)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Amount: ${(result.datasetA.record.amount as number)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {result.datasetB.record ? (
                        <div className="space-y-1">
                          <div className="font-medium text-sm">{result.datasetB.source}</div>
                          <div className="text-xs text-gray-600">
                            ID: {(result.datasetB.record.transactionId as string)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Amount: ${(result.datasetB.record.amount as number)}
                          </div>
                        </div>
                      ) : (
                        <div className="text-sm text-gray-500 italic">No matching record</div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          Confidence: <span className="font-medium">{result.matchDetails.confidence}%</span>
                        </div>
                        <div className="text-xs text-gray-600">
                          Matched: {result.matchDetails.matchedFields.join(", ")}
                        </div>
                        {result.matchDetails.differences.length > 0 && (
                          <div className="text-xs text-red-600">
                            {result.matchDetails.differences.length} difference(s)
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger>
                          <Button
                            variant="ghost"
                            size="sm"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <DialogHeader>
                            <DialogTitle>Record Comparison</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">{result.datasetA.source}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                                    {JSON.stringify(result.datasetA.record, null, 2)}
                                  </pre>
                                </CardContent>
                              </Card>

                              <Card>
                                <CardHeader>
                                  <CardTitle className="text-sm">{result.datasetB.source}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                  <pre className="text-xs bg-gray-50 p-3 rounded overflow-x-auto">
                                    {result.datasetB.record ? JSON.stringify(result.datasetB.record, null, 2) : "No matching record"}
                                  </pre>
                                </CardContent>
                              </Card>
                            </div>

                            <div>
                              <h4 className="font-medium mb-2">Match Analysis</h4>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label className="text-sm">Matched Fields</Label>
                                  <div className="mt-1 space-y-1">
                                    {result.matchDetails.matchedFields.map((field, index) => (
                                      <Badge key={index} variant="outline" className="mr-1">
                                        {field}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                                <div>
                                  <Label className="text-sm">Differences</Label>
                                  <div className="mt-1 space-y-1">
                                    {result.matchDetails.differences.map((diff, index) => (
                                      <div key={index} className="text-xs p-2 bg-red-50 border border-red-200 rounded">
                                        <div className="font-medium">{diff.field}</div>
                                        <div>A: {diff.datasetA}</div>
                                        <div>B: {diff.datasetB}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
