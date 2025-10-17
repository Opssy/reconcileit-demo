"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserCheck, CheckCircle, Download, Trash2 } from "lucide-react";
import { AssignmentModal } from "./AssignmentModal";

interface BulkActionsProps {
  selectedCount: number;
  selectedIds: string[];
  onBulkAction: (action: string, data?: any) => void;
  onClearSelection: () => void;
}

export function BulkActions({
  selectedCount,
  selectedIds,
  onBulkAction,
  onClearSelection
}: BulkActionsProps) {
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [assignToUser, setAssignToUser] = useState("");

  if (selectedCount === 0) {
    return null;
  }

  const handleAssign = (assignee: string) => {
    onBulkAction("assign", { assignedTo: assignee });
    setAssignToUser("");
    setIsAssignModalOpen(false);
  };

  const handleResolve = () => {
    onBulkAction("resolve", { resolution: "Bulk resolved" });
  };

  const handleExport = () => {
    onBulkAction("export", { format: "CSV" });
  };

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="font-bold">
            {selectedCount} selected
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearSelection}
            className="text-xs"
          >
            Clear Selection
          </Button>
        </div>

        <div className="flex items-center gap-2">
          {/* Assign Action */}
          <AssignmentModal
            exceptionId={selectedIds[0] || ""}
            currentAssignee={null}
            onAssign={(assignee) => handleAssign(assignee)}
            trigger={
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <UserCheck className="w-4 h-4" />
                Assign
              </Button>
            }
          />

          {/* Resolve Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleResolve}
            className="flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            Resolve
          </Button>

          {/* Export Action */}
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
        </div>
      </div>
    </>
  );
}
