"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Eye, Copy, Trash2, MoreHorizontal, Edit, Clock, User, Tag, Play, Loader2, GitBranch } from "lucide-react";
import { RuleVersionHistory } from "./RuleVersionHistory";

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

interface Rule {
  id: string;
  name: string;
  description: string;
  version: string;
  lastModified: string;
  status: "active" | "inactive" | "draft";
  type: "custom" | "template-based";
  category: string;
  createdBy: string;
  tags: string[];
}

interface RulesListProps {
  rules: Rule[];
  searchTerm: string;
  filterCategory: string;
  getStatusBadge: (status: string) => JSX.Element;
  isLoading?: boolean;
}

export function RulesList({ rules, searchTerm, filterCategory, getStatusBadge, isLoading }: RulesListProps) {
  const [selectedRule, setSelectedRule] = useState<Rule | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ruleToDelete, setRuleToDelete] = useState<string | null>(null);
  const [versionHistoryOpen, setVersionHistoryOpen] = useState(false);
  const [selectedRuleForHistory, setSelectedRuleForHistory] = useState<Rule | null>(null);

  // Filter rules based on search term and category
  const filteredRules = useMemo(() => {
    return rules.filter(rule => {
      const matchesSearch = rule.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rule.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           rule.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesCategory = filterCategory === "all" || rule.category === filterCategory;

      return matchesSearch && matchesCategory;
    });
  }, [rules, searchTerm, filterCategory]);

  const handleView = (rule: Rule) => {
    setSelectedRule(rule);
  };

  const handleEdit = (ruleId: string) => {
    // TODO: Navigate to rule editor
    console.log("Edit rule:", ruleId);
  };

  const handleDuplicate = (ruleId: string) => {
    // TODO: Duplicate rule logic
    console.log("Duplicate rule:", ruleId);
  };

  const handleDelete = (ruleId: string) => {
    setRuleToDelete(ruleId);
    setDeleteDialogOpen(true);
  };

  const handleTest = (ruleId: string) => {
    // TODO: Test rule logic
    console.log("Test rule:", ruleId);
  };

  const handleViewVersionHistory = (rule: Rule) => {
    setSelectedRuleForHistory(rule);
    setVersionHistoryOpen(true);
  };

  const handleRestoreVersion = (versionId: string) => {
    console.log("Restore version:", versionId, "for rule:", selectedRuleForHistory?.id);
    // TODO: Implement version restore API call
  };

  const confirmDelete = () => {
    if (ruleToDelete) {
      // TODO: Delete rule API call
      console.log("Delete rule:", ruleToDelete);
      setDeleteDialogOpen(false);
      setRuleToDelete(null);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>My Rules ({filteredRules.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : filteredRules.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No rules found matching your criteria.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Last Modified</TableHead>
                    <TableHead>Created By</TableHead>
                    <TableHead>Tags</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredRules.map((rule) => (
                    <TableRow key={rule.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div>
                          <div className="font-medium">{rule.name}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {rule.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(rule.status)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={rule.type === "custom" ? "default" : "secondary"}>
                          {rule.type === "custom" ? "Custom" : "Template-based"}
                        </Badge>
                      </TableCell>
                      <TableCell>{rule.category}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                          v{rule.version}
                        </code>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <Clock className="h-3 w-3" />
                          {formatDate(rule.lastModified)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1 text-sm text-gray-600">
                          <User className="h-3 w-3" />
                          {rule.createdBy}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-wrap gap-1">
                          {rule.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                          {rule.tags.length > 2 && (
                            <Badge variant="outline" className="text-xs">
                              +{rule.tags.length - 2}
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleView(rule)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEdit(rule.id)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleTest(rule.id)}>
                              <Play className="mr-2 h-4 w-4" />
                              Test Rule
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleViewVersionHistory(rule)}>
                              <GitBranch className="mr-2 h-4 w-4" />
                              Version History
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleDuplicate(rule.id)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDelete(rule.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rule Details Modal */}
      {selectedRule && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{selectedRule.name}</CardTitle>
                <Button variant="ghost" onClick={() => setSelectedRule(null)}>
                  ×
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-gray-600">{selectedRule.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Status</h4>
                  {getStatusBadge(selectedRule.status)}
                </div>
                <div>
                  <h4 className="font-medium mb-2">Type</h4>
                  <Badge variant={selectedRule.type === "custom" ? "default" : "secondary"}>
                    {selectedRule.type === "custom" ? "Custom" : "Template-based"}
                  </Badge>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Version</h4>
                  <code className="text-sm bg-gray-100 px-2 py-1 rounded">
                    v{selectedRule.version}
                  </code>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Category</h4>
                  <span>{selectedRule.category}</span>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRule.tags.map((tag) => (
                    <Badge key={tag} variant="outline">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  Created by {selectedRule.createdBy}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Modified {formatDate(selectedRule.lastModified)}
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button onClick={() => handleEdit(selectedRule.id)}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Rule
                </Button>
                <Button variant="outline" onClick={() => handleTest(selectedRule.id)}>
                  <Play className="mr-2 h-4 w-4" />
                  Test Rule
                </Button>
                <Button variant="outline" onClick={() => handleDuplicate(selectedRule.id)}>
                  <Copy className="mr-2 h-4 w-4" />
                  Duplicate
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Rule</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this rule? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Version History Modal */}
      {versionHistoryOpen && selectedRuleForHistory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-6xl max-h-[90vh] overflow-hidden">
            <RuleVersionHistory
              ruleId={selectedRuleForHistory.id}
              ruleName={selectedRuleForHistory.name}
              onRestore={handleRestoreVersion}
            />
            <div className="flex justify-end mt-4">
              <Button variant="outline" onClick={() => setVersionHistoryOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
