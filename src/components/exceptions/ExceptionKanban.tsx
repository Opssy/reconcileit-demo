"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExceptionCard } from "./ExceptionCard";
import { ExceptionDetailModal } from "./ExceptionDetailModal";
import { ExceptionFilters } from "./ExceptionFilters";
import { BulkActions } from "./BulkActions";
import { ExportModal } from "./ExportModal";
import { LayoutGrid, LayoutList, CheckSquare } from "lucide-react";

interface Exception {
  id: string;
  type: string;
  severity: "high" | "medium" | "low";
  amount: number;
  timestamp: string;
  source: string;
  target: string;
  description: string;
  status: string;
  assignedTo?: string | null;
}

interface KanbanColumn {
  id: string;
  title: string;
  color: string;
  exceptions: Exception[];
}

export function ExceptionKanban() {
  const [viewMode, setViewMode] = useState<"kanban" | "table">("kanban");
  const [columns, setColumns] = useState<KanbanColumn[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExceptionId, setSelectedExceptionId] = useState<string | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedExceptions, setSelectedExceptions] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState({
    type: "all",
    severity: "all",
    amountMin: "",
    amountMax: "",
    dateFrom: "",
    dateTo: "",
    assignee: "all",
    status: "all"
  });

  useEffect(() => {
    fetchExceptions();
  }, []);

  useEffect(() => {
    // Apply filters when they change
    fetchExceptions();
  }, [filters]);

  const fetchExceptions = async () => {
    try {
      setLoading(true);

      // Build query parameters from filters
      const params = new URLSearchParams();

      if (filters.status !== "all") params.append("status", filters.status);
      if (filters.severity !== "all") params.append("severity", filters.severity);

      const response = await fetch(`/api/exceptions?${params.toString()}`);
      const data = await response.json();

      // Apply client-side filters
      let filteredExceptions = data.exceptions;

      // Type filter
      if (filters.type !== "all") {
        filteredExceptions = filteredExceptions.filter((exc: Exception) =>
          exc.type === filters.type
        );
      }

      // Amount range filter
      if (filters.amountMin) {
        filteredExceptions = filteredExceptions.filter((exc: Exception) =>
          exc.amount >= parseFloat(filters.amountMin)
        );
      }
      if (filters.amountMax) {
        filteredExceptions = filteredExceptions.filter((exc: Exception) =>
          exc.amount <= parseFloat(filters.amountMax)
        );
      }

      // Date range filter
      if (filters.dateFrom) {
        filteredExceptions = filteredExceptions.filter((exc: Exception) =>
          new Date(exc.timestamp) >= new Date(filters.dateFrom)
        );
      }
      if (filters.dateTo) {
        filteredExceptions = filteredExceptions.filter((exc: Exception) =>
          new Date(exc.timestamp) <= new Date(filters.dateTo)
        );
      }

      // Assignee filter
      if (filters.assignee !== "all") {
        if (filters.assignee === "unassigned") {
          filteredExceptions = filteredExceptions.filter((exc: Exception) =>
            !exc.assignedTo
          );
        } else {
          filteredExceptions = filteredExceptions.filter((exc: Exception) =>
            exc.assignedTo === filters.assignee
          );
        }
      }

      // Organize exceptions by status
      const organized = organizeByStatus(filteredExceptions);
      setColumns(organized);
    } catch (error) {
      console.error("Error fetching exceptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const organizeByStatus = (exceptions: Exception[]): KanbanColumn[] => {
    const statusMap: Record<string, KanbanColumn> = {
      unassigned: {
        id: "unassigned",
        title: "Unassigned",
        color: "bg-gray-50",
        exceptions: []
      },
      in_review: {
        id: "in_review",
        title: "In Review",
        color: "bg-blue-50",
        exceptions: []
      },
      pending_approval: {
        id: "pending_approval",
        title: "Pending Approval",
        color: "bg-yellow-50",
        exceptions: []
      },
      resolved: {
        id: "resolved",
        title: "Resolved",
        color: "bg-green-50",
        exceptions: []
      }
    };

    exceptions.forEach(exc => {
      if (statusMap[exc.status]) {
        statusMap[exc.status].exceptions.push(exc);
      }
    });

    return Object.values(statusMap);
  };

  const handleDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;

    if (!destination) return;

    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }

    // Find the exception being dragged
    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destColumn = columns.find(col => col.id === destination.droppableId);

    if (!sourceColumn || !destColumn) return;

    const exception = sourceColumn.exceptions[source.index];

    // Update local state
    const newColumns = columns.map(col => {
      if (col.id === source.droppableId) {
        return {
          ...col,
          exceptions: col.exceptions.filter((_, idx) => idx !== source.index)
        };
      }
      if (col.id === destination.droppableId) {
        const newExceptions = [...col.exceptions];
        newExceptions.splice(destination.index, 0, {
          ...exception,
          status: destination.droppableId
        });
        return {
          ...col,
          exceptions: newExceptions
        };
      }
      return col;
    });

    setColumns(newColumns);

    // Update backend
    try {
      await fetch(`/api/exceptions/${exception.id}/move`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          newStatus: destination.droppableId,
          assignedTo: exception.assignedTo
        })
      });
    } catch (error) {
      console.error("Error updating exception status:", error);
      // Revert on error
      fetchExceptions();
    }
  };

  const handleExceptionClick = (exceptionId: string) => {
    setSelectedExceptionId(exceptionId);
    setDetailModalOpen(true);
  };

  const handleDetailModalClose = () => {
    setDetailModalOpen(false);
    setSelectedExceptionId(null);
  };

  const handleExceptionUpdate = () => {
    fetchExceptions();
  };

  const handleSelectAll = () => {
    const allIds = columns.flatMap(col => col.exceptions.map(exc => exc.id));
    setSelectedExceptions(new Set(allIds));
  };

  const handleClearSelection = () => {
    setSelectedExceptions(new Set());
  };

  const handleSelectException = (exceptionId: string, selected: boolean) => {
    const newSelected = new Set(selectedExceptions);
    if (selected) {
      newSelected.add(exceptionId);
    } else {
      newSelected.delete(exceptionId);
    }
    setSelectedExceptions(newSelected);
  };

  const handleBulkAction = async (action: string, data?: Record<string, unknown>) => {
    try {
      const response = await fetch("/api/exceptions/bulk-update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          exceptionIds: Array.from(selectedExceptions),
          action,
          data
        })
      });

      const result = await response.json();

      if (result.success) {
        setSelectedExceptions(new Set());
        fetchExceptions();
      }
    } catch (error) {
      console.error("Error performing bulk action:", error);
    }
  };

  const handleExport = async (format: string, options: Record<string, unknown>) => {
    // In a real app, this would generate and download the file
    console.log("Exporting exceptions:", { format, options });

    // For demo, just show success message
    alert(`Exported ${selectedExceptions.size} exceptions as ${format.toUpperCase()}`);

    // Clear selection after export
    setSelectedExceptions(new Set());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading exceptions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Exception Queue</h1>
          <p className="text-gray-600 mt-1">Manage and resolve reconciliation exceptions</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={viewMode === "kanban" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("kanban")}
            className="flex items-center gap-2"
          >
            <LayoutGrid className="w-4 h-4" />
            Kanban
          </Button>
          <Button
            variant={viewMode === "table" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("table")}
            className="flex items-center gap-2"
          >
            <LayoutList className="w-4 h-4" />
            Table
          </Button>
        </div>
      </div>

      {/* Filters */}
      <ExceptionFilters
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={() => setFilters({
          type: "all",
          severity: "all",
          amountMin: "",
          amountMax: "",
          dateFrom: "",
          dateTo: "",
          assignee: "all",
          status: "all"
        })}
      />

      {/* Bulk Actions */}
      <BulkActions
        selectedCount={selectedExceptions.size}
        selectedIds={Array.from(selectedExceptions)}
        onBulkAction={handleBulkAction}
        onClearSelection={handleClearSelection}
      />

      {/* Kanban View */}
      {viewMode === "kanban" && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {columns.map(column => (
              <div key={column.id} className="flex flex-col">
                {/* Column Header */}
                <div className={`${column.color} rounded-t-lg p-4 border-b`}>
                  <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-gray-900">{column.title}</h2>
                    <Badge variant="secondary" className="font-bold">
                      {column.exceptions.length}
                    </Badge>
                  </div>
                </div>

                {/* Droppable Area */}
                <Droppable droppableId={column.id}>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  {(provided: any, snapshot: any) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 p-4 space-y-3 min-h-96 ${
                        snapshot.isDraggingOver ? "bg-gray-100" : "bg-white"
                      } transition-colors`}
                    >
                      {column.exceptions.map((exception, index) => (
                        <Draggable
                          key={exception.id}
                          draggableId={exception.id}
                          index={index}
                        >
                          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                          {(provided: any, snapshot: any) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className="relative"
                            >
                              {/* Selection Checkbox */}
                              <div className="absolute top-2 left-2 z-10">
                                <Checkbox
                                  checked={selectedExceptions.has(exception.id)}
                                  onCheckedChange={(checked) =>
                                    handleSelectException(exception.id, checked as boolean)
                                  }
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>

                              <ExceptionCard
                                {...exception}
                                isDragging={snapshot.isDragging}
                                onClick={() => handleExceptionClick(exception.id)}
                              />
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}

                      {column.exceptions.length === 0 && (
                        <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                          No exceptions
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Table View */}
      {viewMode === "table" && (
        <Card>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900 w-12">
                      <Checkbox
                        checked={selectedExceptions.size === columns.flatMap(col => col.exceptions).length && columns.flatMap(col => col.exceptions).length > 0}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            handleSelectAll();
                          } else {
                            handleClearSelection();
                          }
                        }}
                      />
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Severity
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Amount
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Source → Target
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Assigned To
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Timestamp
                    </th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {columns.flatMap(col =>
                    col.exceptions.map(exc => (
                      <tr key={exc.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <Checkbox
                            checked={selectedExceptions.has(exc.id)}
                            onCheckedChange={(checked) =>
                              handleSelectException(exc.id, checked as boolean)
                            }
                          />
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          {exc.type}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge
                            variant="outline"
                            className={
                              exc.severity === "high"
                                ? "bg-red-100 text-red-800"
                                : exc.severity === "medium"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-blue-100 text-blue-800"
                            }
                          >
                            {exc.severity}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          ${exc.amount.toLocaleString("en-US", {
                            minimumFractionDigits: 2
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {exc.source} → {exc.target}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Badge variant="outline">{exc.status.replace(/_/g, " ")}</Badge>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {exc.assignedTo || "—"}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {new Date(exc.timestamp).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExceptionClick(exc.id)}
                          >
                            View
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Exception Detail Modal */}
      <ExceptionDetailModal
        exceptionId={selectedExceptionId}
        isOpen={detailModalOpen}
        onClose={handleDetailModalClose}
        onUpdate={handleExceptionUpdate}
      />

      {/* Export Modal */}
      <ExportModal
        selectedCount={selectedExceptions.size}
        selectedIds={Array.from(selectedExceptions)}
        onExport={handleExport}
      />
    </div>
  );
}
