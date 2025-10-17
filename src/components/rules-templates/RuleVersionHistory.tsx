"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Clock, User, GitBranch, RotateCcw, Eye, AlertTriangle, CheckCircle, XCircle, Plus, Minus, ArrowRight, Edit } from "lucide-react";

// Simple date formatting utility (temporary until date-fns is installed)
const formatDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return "Invalid date";
  }
};

interface RuleVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changeType: "created" | "modified" | "restored";
  description: string;
  changes: Array<{
    type: "added" | "removed" | "modified";
    field: string;
    oldValue?: unknown;
    newValue?: unknown;
  }>;
  ruleData: Record<string, unknown>;
}

interface RuleVersionHistoryProps {
  ruleId: string;
  ruleName: string;
  onRestore?: (versionId: string) => void;
}

export function RuleVersionHistory({ ruleId, ruleName, onRestore }: RuleVersionHistoryProps) {
  const [versions, setVersions] = useState<RuleVersion[]>([
    {
      id: "v1.0.0",
      version: "1.0.0",
      createdAt: "2024-01-15T10:30:00Z",
      createdBy: "John Doe",
      changeType: "created",
      description: "Initial rule creation",
      changes: [
        { type: "added", field: "name", newValue: "Transaction Validation Rule" },
        { type: "added", field: "description", newValue: "Validates transaction amounts and account numbers" },
        { type: "added", field: "steps", newValue: [] }
      ],
      ruleData: {
        name: "Transaction Validation Rule",
        description: "Validates transaction amounts and account numbers",
        steps: []
      }
    },
    {
      id: "v1.1.0",
      version: "1.1.0",
      createdAt: "2024-01-16T14:20:00Z",
      createdBy: "Jane Smith",
      changeType: "modified",
      description: "Added column selection and type casting steps",
      changes: [
        { type: "added", field: "steps[0]", newValue: { type: "select-columns", name: "Select Columns" } },
        { type: "added", field: "steps[1]", newValue: { type: "type-cast", name: "Type Cast" } },
        { type: "modified", field: "description", oldValue: "Validates transaction amounts and account numbers", newValue: "Validates transaction amounts and account numbers with column selection" }
      ],
      ruleData: {
        name: "Transaction Validation Rule",
        description: "Validates transaction amounts and account numbers with column selection",
        steps: [
          { type: "select-columns", name: "Select Columns", config: {} },
          { type: "type-cast", name: "Type Cast", config: {} }
        ]
      }
    },
    {
      id: "v1.2.0",
      version: "1.2.0",
      createdAt: "2024-01-17T09:45:00Z",
      createdBy: "John Doe",
      changeType: "modified",
      description: "Added filtering and derived fields",
      changes: [
        { type: "added", field: "steps[2]", newValue: { type: "filter", name: "Filter" } },
        { type: "added", field: "steps[3]", newValue: { type: "derive-fields", name: "Derive Fields" } },
        { type: "modified", field: "steps[1].config", oldValue: {}, newValue: { column: "amount", targetType: "number" } }
      ],
      ruleData: {
        name: "Transaction Validation Rule",
        description: "Validates transaction amounts and account numbers with column selection",
        steps: [
          { type: "select-columns", name: "Select Columns", config: {} },
          { type: "type-cast", name: "Type Cast", config: { column: "amount", targetType: "number" } },
          { type: "filter", name: "Filter", config: {} },
          { type: "derive-fields", name: "Derive Fields", config: {} }
        ]
      }
    }
  ]);

  const [selectedVersion, setSelectedVersion] = useState<RuleVersion | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareVersions, setCompareVersions] = useState<[RuleVersion, RuleVersion] | null>(null);
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [versionToRestore, setVersionToRestore] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy 'at' h:mm a");
    } catch {
      return "Invalid date";
    }
  };

  const getChangeIcon = (changeType: string) => {
    switch (changeType) {
      case "created":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "modified":
        return <Edit className="h-4 w-4 text-blue-600" />;
      case "restored":
        return <RotateCcw className="h-4 w-4 text-orange-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getChangeBadge = (changeType: string) => {
    const variants = {
      created: "bg-green-100 text-green-800 border-green-200",
      modified: "bg-blue-100 text-blue-800 border-blue-200",
      restored: "bg-orange-100 text-orange-800 border-orange-200",
    };
    return (
      <Badge className={`capitalize ${variants[changeType as keyof typeof variants]}`}>
        {changeType}
      </Badge>
    );
  };

  const handleViewVersion = (version: RuleVersion) => {
    setSelectedVersion(version);
    setCompareMode(false);
  };

  const handleCompareVersions = (version1: RuleVersion, version2: RuleVersion) => {
    setCompareVersions([version1, version2]);
    setSelectedVersion(null);
    setCompareMode(true);
  };

  const handleRestoreVersion = (versionId: string) => {
    setVersionToRestore(versionId);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (versionToRestore && onRestore) {
      onRestore(versionToRestore);
      setRestoreDialogOpen(false);
      setVersionToRestore(null);
    }
  };

  const renderDiff = (changes: Array<{ type: string; field: string; oldValue?: unknown; newValue?: unknown }>) => {
    return (
      <div className="space-y-2">
        {changes.map((change, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            {change.type === "added" && <Plus className="h-3 w-3 text-green-600" />}
            {change.type === "removed" && <Minus className="h-3 w-3 text-red-600" />}
            {change.type === "modified" && <ArrowRight className="h-3 w-3 text-blue-600" />}
            <span className="font-mono text-xs bg-gray-100 px-1 rounded">{change.field}</span>
            <span className="text-gray-600">
              {change.type === "added" && `Added: ${JSON.stringify(change.newValue)}`}
              {change.type === "removed" && `Removed: ${JSON.stringify(change.oldValue)}`}
              {change.type === "modified" && `${JSON.stringify(change.oldValue)} → ${JSON.stringify(change.newValue)}`}
            </span>
          </div>
        ))}
      </div>
    );
  };

  const renderVersionComparison = () => {
    if (!compareVersions) return null;

    const [version1, version2] = compareVersions;
    const allFields = new Set([...Object.keys(version1.ruleData), ...Object.keys(version2.ruleData)]);

    return (
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Version {version1.version}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
              {JSON.stringify(version1.ruleData, null, 2)}
            </pre>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Version {version2.version}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-gray-50 p-3 rounded overflow-auto max-h-64">
              {JSON.stringify(version2.ruleData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitBranch className="h-5 w-5" />
            Version History: {ruleName}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="timeline" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="timeline">Timeline</TabsTrigger>
              <TabsTrigger value="compare">Compare</TabsTrigger>
              <TabsTrigger value="details">Details</TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" className="space-y-4">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>

                {versions.map((version, index) => (
                  <div key={version.id} className="relative flex items-start gap-4 pb-6">
                    {/* Timeline dot */}
                    <div className={`relative z-10 w-3 h-3 rounded-full border-2 ${
                      index === 0 ? 'bg-green-600 border-green-600' :
                      version.changeType === 'modified' ? 'bg-blue-600 border-blue-600' :
                      'bg-gray-400 border-gray-400'
                    }`}>
                      {getChangeIcon(version.changeType)}
                    </div>

                    {/* Version card */}
                    <Card className="flex-1">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-medium">Version {version.version}</h3>
                              {getChangeBadge(version.changeType)}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{version.description}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <div className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {version.createdBy}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {formatDate(version.createdAt)}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button variant="outline" size="sm" onClick={() => handleViewVersion(version)}>
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleRestoreVersion(version.id)}
                              disabled={index === versions.length - 1} // Can't restore latest version
                            >
                              <RotateCcw className="h-3 w-3 mr-1" />
                              Restore
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="compare" className="space-y-4">
              <div className="flex items-center justify-between">
                <Label className="text-lg font-medium">Compare Versions</Label>
                <div className="flex gap-2">
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select version 1" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>v{v.version}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select version 2" />
                    </SelectTrigger>
                    <SelectContent>
                      {versions.map(v => (
                        <SelectItem key={v.id} value={v.id}>v{v.version}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button>Compare</Button>
                </div>
              </div>

              {compareVersions && renderVersionComparison()}
            </TabsContent>

            <TabsContent value="details" className="space-y-4">
              {selectedVersion ? (
                <Card>
                  <CardHeader>
                    <CardTitle>Version {selectedVersion.version} Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium">Created By</Label>
                        <p className="text-sm text-gray-600">{selectedVersion.createdBy}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium">Created At</Label>
                        <p className="text-sm text-gray-600">{formatDate(selectedVersion.createdAt)}</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Description</Label>
                      <p className="text-sm text-gray-600">{selectedVersion.description}</p>
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Changes</Label>
                      {renderDiff(selectedVersion.changes)}
                    </div>

                    <div>
                      <Label className="text-sm font-medium">Rule Data</Label>
                      <pre className="text-xs bg-gray-50 p-3 rounded mt-2 overflow-auto max-h-64">
                        {JSON.stringify(selectedVersion.ruleData, null, 2)}
                      </pre>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <p>Select a version from the timeline to view details</p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Restore Confirmation Dialog */}
      <AlertDialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              Restore Version
            </AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to restore this version? This will create a new version based on the selected version and may affect current rule functionality.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmRestore}
              className="bg-orange-600 hover:bg-orange-700"
            >
              Restore Version
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
