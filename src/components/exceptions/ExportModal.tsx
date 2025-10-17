"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Download, FileText, FileSpreadsheet, File } from "lucide-react";

interface ExportModalProps {
  selectedCount: number;
  selectedIds: string[];
  onExport: (format: string, options: any) => void;
  trigger?: React.ReactNode;
}

export function ExportModal({
  selectedCount,
  selectedIds,
  onExport,
  trigger
}: ExportModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("csv");
  const [includeComments, setIncludeComments] = useState(true);
  const [includeHistory, setIncludeHistory] = useState(true);
  const [includeSourceData, setIncludeSourceData] = useState(true);
  const [includeTargetData, setIncludeTargetData] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    setLoading(true);
    try {
      await onExport(exportFormat, {
        includeComments,
        includeHistory,
        includeSourceData,
        includeTargetData,
        selectedIds
      });
      setIsOpen(false);
    } catch (error) {
      console.error("Error exporting exceptions:", error);
    } finally {
      setLoading(false);
    }
  };

  const getFormatIcon = (format: string) => {
    switch (format) {
      case "csv":
        return <FileText className="w-4 h-4" />;
      case "xlsx":
        return <FileSpreadsheet className="w-4 h-4" />;
      case "pdf":
        return <File className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getFormatDescription = (format: string) => {
    switch (format) {
      case "csv":
        return "Comma-separated values format, compatible with Excel and other spreadsheet applications";
      case "xlsx":
        return "Microsoft Excel format with multiple sheets and advanced formatting";
      case "pdf":
        return "Portable Document Format for sharing and printing reports";
      default:
        return "";
    }
  };

  const defaultTrigger = (
    <Button variant="outline" size="sm" className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      Export ({selectedCount})
    </Button>
  );

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export Exceptions</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Format Selection */}
          <div className="space-y-3">
            <Label>Export Format</Label>
            <Select value={exportFormat} onValueChange={setExportFormat}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("csv")}
                    <div>
                      <div className="font-medium">CSV</div>
                      <div className="text-xs text-gray-500">Comma-separated values</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="xlsx">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("xlsx")}
                    <div>
                      <div className="font-medium">Excel</div>
                      <div className="text-xs text-gray-500">XLSX format</div>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="pdf">
                  <div className="flex items-center gap-2">
                    {getFormatIcon("pdf")}
                    <div>
                      <div className="font-medium">PDF Report</div>
                      <div className="text-xs text-gray-500">Formatted report</div>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-600">
              {getFormatDescription(exportFormat)}
            </p>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <Label>Include Additional Data</Label>

            <div className="space-y-3">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeComments"
                  checked={includeComments}
                  onCheckedChange={setIncludeComments}
                />
                <Label htmlFor="includeComments" className="text-sm">
                  Include comments and discussions
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeHistory"
                  checked={includeHistory}
                  onCheckedChange={setIncludeHistory}
                />
                <Label htmlFor="includeHistory" className="text-sm">
                  Include exception history and audit trail
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeSourceData"
                  checked={includeSourceData}
                  onCheckedChange={setIncludeSourceData}
                />
                <Label htmlFor="includeSourceData" className="text-sm">
                  Include source system record details
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="includeTargetData"
                  checked={includeTargetData}
                  onCheckedChange={setIncludeTargetData}
                />
                <Label htmlFor="includeTargetData" className="text-sm">
                  Include target system record details
                </Label>
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-700">
              <span className="font-medium">Export Summary:</span><br />
              • {selectedCount} exceptions selected<br />
              • Format: {exportFormat.toUpperCase()}<br />
              • Includes: {[
                includeComments && "comments",
                includeHistory && "history",
                includeSourceData && "source data",
                includeTargetData && "target data"
              ].filter(Boolean).join(", ") || "basic data only"}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleExport}
              disabled={loading}
              className="flex-1 flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              {loading ? "Exporting..." : "Export"}
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
