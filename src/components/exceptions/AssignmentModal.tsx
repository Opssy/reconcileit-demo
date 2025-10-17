"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus } from "lucide-react";

interface AssignmentModalProps {
  exceptionId: string;
  currentAssignee?: string | null;
  onAssign: (assignee: string) => void;
  trigger?: React.ReactNode;
}

export function AssignmentModal({
  exceptionId,
  currentAssignee,
  onAssign,
  trigger
}: AssignmentModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedAssignee, setSelectedAssignee] = useState(currentAssignee || "");
  const [loading, setLoading] = useState(false);

  // Mock users list (in real app, fetch from API)
  const availableUsers = [
    { id: "reviewer1", name: "Sarah Johnson", role: "Reviewer" },
    { id: "reviewer2", name: "David Wilson", role: "Reviewer" },
    { id: "reviewer3", name: "Emma Davis", role: "Reviewer" },
    { id: "approver1", name: "Michael Chen", role: "Approver" },
    { id: "approver2", name: "Lisa Rodriguez", role: "Approver" },
    { id: "admin", name: "John Smith", role: "Admin" }
  ];

  const handleAssign = async () => {
    if (!selectedAssignee) return;

    setLoading(true);
    try {
      // In real app, call API to assign exception
      await fetch(`/api/exceptions/${exceptionId}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: selectedAssignee })
      });

      onAssign(selectedAssignee);
      setIsOpen(false);
    } catch (error) {
      console.error("Error assigning exception:", error);
    } finally {
      setLoading(false);
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <UserPlus className="w-4 h-4" />
      Assign
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)}>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Assign Exception</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="assignee">Select User</Label>
            <Select value={selectedAssignee} onValueChange={setSelectedAssignee}>
              <SelectTrigger className="mt-2">
                <SelectValue placeholder="Choose a user to assign this exception" />
              </SelectTrigger>
              <SelectContent>
                {availableUsers.map(user => (
                  <SelectItem key={user.id} value={user.id}>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center text-xs font-semibold">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-xs text-gray-500">{user.role}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedAssignee && (
            <div className="p-3 bg-blue-50 border border-blue-200 rounded-md">
              <p className="text-sm text-blue-800">
                This exception will be assigned to{" "}
                <span className="font-medium">
                  {availableUsers.find(u => u.id === selectedAssignee)?.name}
                </span>
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleAssign}
              disabled={!selectedAssignee || loading}
              className="flex-1"
            >
              {loading ? "Assigning..." : "Assign"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
