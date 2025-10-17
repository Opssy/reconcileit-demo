"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, AlertTriangle, Info, CheckCircle, XCircle, Clock, UserPlus, MessageSquare, Bot, TrendingUp } from "lucide-react";
import { AssignmentModal } from "./AssignmentModal";

interface ExceptionDetailModalProps {
  exceptionId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

interface RecordData {
  id: string;
  amount?: number;
  date?: string;
  reference?: string;
  description?: string;
  account?: string;
  currency?: string;
  status?: string;
  [key: string]: unknown;
}

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
  createdBy: string;
  assignedTo: string | null;
  sourceRecord?: RecordData;
  targetRecord?: RecordData;
  differences: Array<{
    field: string;
    sourceValue: unknown;
    targetValue: unknown;
    difference: string;
  }>;
  aiSuggestion: {
    action: string;
    confidence: number;
    explanation: string;
    suggestedValue?: unknown;
    reasoning: string;
  };
  comments: Array<{
    id: string;
    user: string;
    userName: string;
    avatar: string;
    content: string;
    timestamp: string;
  }>;
  history: Array<{
    action: string;
    user: string;
    timestamp: string;
    details: string;
  }>;
}

export function ExceptionDetailModal({
  exceptionId,
  isOpen,
  onClose,
  onUpdate
}: ExceptionDetailModalProps) {
  const [exception, setException] = useState<Exception | null>(null);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    if (exceptionId && isOpen) {
      fetchExceptionDetails();
    }
  }, [exceptionId, isOpen]);

  const fetchExceptionDetails = async () => {
    if (!exceptionId) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/exceptions/${exceptionId}`);
      const data = await response.json();
      setException(data);
    } catch (error) {
      console.error("Error fetching exception details:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: string) => {
    if (!exception) return;

    try {
      let newStatus = exception.status;

      switch (action) {
        case "accept":
          newStatus = "resolved";
          break;
        case "adjust":
          newStatus = "in_review";
          break;
        case "merge":
          newStatus = "pending_approval";
          break;
        case "ignore":
          newStatus = "resolved";
          break;
        case "escalate":
          newStatus = "pending_approval";
          break;
      }

      await fetch(`/api/exceptions/${exception.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: newStatus,
          resolution: action === "accept" ? "Accepted source record as correct" :
                     action === "adjust" ? "Sent for manual adjustment" :
                     action === "merge" ? "Marked for merging" :
                     action === "ignore" ? "Ignored as acceptable discrepancy" :
                     "Escalated for approval"
        })
      });

      fetchExceptionDetails();
      onUpdate();
    } catch (error) {
      console.error("Error updating exception:", error);
    }
  };

  const handleAddComment = async () => {
    if (!exception || !newComment.trim()) return;

    setSubmittingComment(true);
    try {
      await fetch(`/api/exceptions/${exception.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newComment,
          user: "current_user", // In real app, get from auth
          userName: "Current User",
          avatar: "/avatars/current.jpg"
        })
      });

      setNewComment("");
      fetchExceptionDetails();
    } catch (error) {
      console.error("Error adding comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "high": return <AlertCircle className="w-4 h-4" />;
      case "medium": return <AlertTriangle className="w-4 h-4" />;
      case "low": return <Info className="w-4 h-4" />;
      default: return null;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  if (!exception) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                {getSeverityIcon(exception.severity)}
                {exception.type}
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-1">{exception.description}</p>
            </div>
            <Badge className={getSeverityColor(exception.severity)}>
              {exception.severity.toUpperCase()}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Left Column - Record Comparison */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" />
                  Record Comparison
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Source Record */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Source Record ({exception.source})</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {exception.sourceRecord ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>ID:</strong> {exception.sourceRecord.id}</div>
                        <div><strong>Amount:</strong> ${exception.sourceRecord.amount?.toLocaleString()}</div>
                        <div><strong>Date:</strong> {exception.sourceRecord.date}</div>
                        <div><strong>Reference:</strong> {exception.sourceRecord.reference}</div>
                        <div className="col-span-2"><strong>Description:</strong> {exception.sourceRecord.description}</div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No source record available</p>
                    )}
                  </div>
                </div>

                {/* Target Record */}
                <div>
                  <h4 className="font-medium text-sm text-gray-700 mb-2">Target Record ({exception.target})</h4>
                  <div className="bg-gray-50 p-3 rounded-md">
                    {exception.targetRecord ? (
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div><strong>ID:</strong> {exception.targetRecord.id}</div>
                        <div><strong>Amount:</strong> ${exception.targetRecord.amount?.toLocaleString()}</div>
                        <div><strong>Date:</strong> {exception.targetRecord.date}</div>
                        <div><strong>Reference:</strong> {exception.targetRecord.reference}</div>
                        <div className="col-span-2"><strong>Description:</strong> {exception.targetRecord.description}</div>
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">No target record available</p>
                    )}
                  </div>
                </div>

                {/* Differences */}
                {exception.differences.length > 0 && (
                  <div>
                    <h4 className="font-medium text-sm text-gray-700 mb-2">Differences</h4>
                    <div className="space-y-2">
                      {exception.differences.map((diff, index) => (
                        <div key={index} className="bg-red-50 border border-red-200 p-2 rounded text-sm">
                          <div className="font-medium">{diff.field}:</div>
                          <div className="text-red-700">
                            <span className="line-through">{String(diff.sourceValue)}</span> → {String(diff.targetValue)}
                          </div>
                          <div className="text-xs text-red-600">{diff.difference}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column - AI Suggestion & Actions */}
          <div className="space-y-6">
            {/* AI Suggestion */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  AI Suggestion
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700">
                    {exception.aiSuggestion.action}
                  </Badge>
                  <Badge variant="secondary">
                    {Math.round(exception.aiSuggestion.confidence * 100)}% confidence
                  </Badge>
                </div>
                <p className="text-sm text-gray-700">{exception.aiSuggestion.explanation}</p>
                <p className="text-xs text-gray-600">{exception.aiSuggestion.reasoning}</p>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => handleAction("accept")}
                    className="flex items-center gap-2"
                    disabled={exception.status === "resolved"}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Accept
                  </Button>
                  <Button
                    onClick={() => handleAction("adjust")}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={exception.status === "resolved"}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Adjust
                  </Button>
                  <Button
                    onClick={() => handleAction("merge")}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={exception.status === "resolved"}
                  >
                    <TrendingUp className="w-4 h-4" />
                    Merge
                  </Button>
                  <Button
                    onClick={() => handleAction("ignore")}
                    variant="outline"
                    className="flex items-center gap-2"
                    disabled={exception.status === "resolved"}
                  >
                    <XCircle className="w-4 h-4" />
                    Ignore
                  </Button>
                </div>
                <Button
                  onClick={() => handleAction("escalate")}
                  variant="destructive"
                  className="w-full flex items-center gap-2"
                  disabled={exception.status === "resolved"}
                >
                  <AlertTriangle className="w-4 h-4" />
                  Escalate
                </Button>
              </CardContent>
            </Card>

            {/* Assignment */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Assignment
                  <AssignmentModal
                    exceptionId={exception.id}
                    currentAssignee={exception.assignedTo}
                    onAssign={(assignee) => {
                      fetchExceptionDetails();
                      onUpdate();
                    }}
                  />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {exception.assignedTo ? (
                  <div className="flex items-center gap-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={`/avatars/${exception.assignedTo}.jpg`} />
                      <AvatarFallback>
                        {exception.assignedTo.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-sm">
                        {exception.assignedTo === "reviewer1" ? "Sarah Johnson" :
                         exception.assignedTo === "reviewer2" ? "David Wilson" :
                         exception.assignedTo === "approver1" ? "Michael Chen" : exception.assignedTo}
                      </p>
                      <p className="text-xs text-gray-500">Assigned</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Unassigned</p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Comments Section */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Comments ({exception.comments.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Existing Comments */}
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {exception.comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={comment.avatar} />
                    <AvatarFallback>{comment.userName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{comment.userName}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(comment.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Add Comment */}
            <div className="space-y-3">
              <Textarea
                placeholder="Add a comment..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-20"
              />
              <Button
                onClick={handleAddComment}
                disabled={!newComment.trim() || submittingComment}
                className="flex items-center gap-2"
              >
                <MessageSquare className="w-4 h-4" />
                {submittingComment ? "Adding..." : "Add Comment"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* History Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              History
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {exception.history.map((entry, index) => (
                <div key={index} className="flex gap-3">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mt-2"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-sm">{entry.action}</span>
                      <span className="text-xs text-gray-500">
                        {formatDate(entry.timestamp)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{entry.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
