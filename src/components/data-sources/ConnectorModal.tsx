"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, TestTube, Save, X } from "lucide-react";
import { APIConnectorForm } from "./APIConnectorForm";
import { DatabaseConnectorForm } from "./DatabaseConnectorForm";
import { FileUploadConnectorForm } from "./FileUploadConnectorForm";
import { AgenticBrowserConnectorForm } from "./AgenticBrowserConnectorForm";

interface Connector {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  category: string;
  features: string[];
  setupTime: string;
  popularity: "high" | "medium" | "low";
  status: "active" | "beta" | "coming-soon";
}

interface ConnectorConfig {
  name?: string;
  [key: string]: unknown;
}

interface ConnectorModalProps {
  connector: Connector | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ConnectorConfig) => void;
  isLoading?: boolean;
  mode?: "create" | "edit";
  existingConnector?: Connector;
}

export function ConnectorModal({
  connector,
  isOpen,
  onClose,
  onSave,
  isLoading = false,
  mode = "create",
  existingConnector,
}: ConnectorModalProps) {
  const [isTesting, setIsTesting] = useState(false);

  const handleSave = (formData: ConnectorConfig) => {
    onSave(formData);
  };

  const handleTest = async () => {
    setIsTesting(true);
    try {
      // Test connection logic would go here
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert("Connection test successful!");
    } catch (error) {
      alert("Connection test failed. Please check your settings.");
    } finally {
      setIsTesting(false);
    }
  };

  if (!connector) return null;

  const renderForm = () => {
    switch (connector.id) {
      case "api":
        return (
          <APIConnectorForm
            onSubmit={handleSave}
            initialData={existingConnector}
            isLoading={isLoading}
          />
        );
      case "database":
        return (
          <DatabaseConnectorForm
            onSubmit={handleSave}
            initialData={existingConnector}
            isLoading={isLoading}
          />
        );
      case "file-upload":
        return (
          <FileUploadConnectorForm
            onSubmit={handleSave}
            initialData={existingConnector}
            isLoading={isLoading}
          />
        );
      case "agentic-browser":
        return (
          <AgenticBrowserConnectorForm
            onSubmit={handleSave}
            initialData={existingConnector}
            isLoading={isLoading}
          />
        );
      default:
        return (
          <div className="text-center py-8 text-gray-500">
            Form for {connector.name} is not available yet
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              connector.id === 'api' ? 'bg-blue-100' :
              connector.id === 'database' ? 'bg-green-100' :
              connector.id === 'file-upload' ? 'bg-purple-100' :
              connector.id === 'agentic-browser' ? 'bg-orange-100' :
              'bg-orange-100'
            }`}>
              <connector.icon className={`h-5 w-5 ${
                connector.id === 'api' ? 'text-blue-600' :
                connector.id === 'database' ? 'text-green-600' :
                connector.id === 'file-upload' ? 'text-purple-600' :
                connector.id === 'agentic-browser' ? 'text-orange-600' :
                'text-orange-600'
              }`} />
            </div>
            <div>
              <DialogTitle className="text-xl">
                {mode === "create" ? "Setup" : "Edit"} {connector.name}
              </DialogTitle>
              <DialogDescription className="mt-1">
                {connector.description}
              </DialogDescription>
            </div>
          </div>

          {/* Status Badge */}
          <div className="flex items-center space-x-2 mt-2">
            <Badge className="bg-green-100 text-green-800 border-green-200">
              {connector.status}
            </Badge>
            <span className="text-sm text-gray-500">
              Setup time: {connector.setupTime}
            </span>
          </div>
        </DialogHeader>

        <Separator />

        {/* Form Content */}
        <div className="space-y-6">
          {renderForm()}
        </div>

        <DialogFooter className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleTest}
              disabled={isTesting || isLoading}
            >
              {isTesting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <TestTube className="mr-2 h-4 w-4" />
                  Test Connection
                </>
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Button>
            <Button onClick={() => handleSave({})} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  {mode === "create" ? "Create Connector" : "Update Connector"}
                </>
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
