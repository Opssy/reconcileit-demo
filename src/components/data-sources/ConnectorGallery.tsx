"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Globe,
  Database,
  Upload,
  Bot,
  Settings,
  CheckCircle,
  Clock,
  Zap
} from "lucide-react";
import { ConnectorModal } from "./ConnectorModal";

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

interface ConnectorGalleryProps {
  onConnectorSelect?: (connector: Connector) => void;
  className?: string;
}

const connectors: Connector[] = [
  {
    id: "api",
    name: "API Connector",
    description: "Connect to REST APIs, GraphQL endpoints, and webhook services with real-time data synchronization.",
    icon: Globe,
    category: "External Services",
    features: ["REST APIs", "GraphQL", "Webhooks", "Real-time sync"],
    setupTime: "5 minutes",
    popularity: "high",
    status: "active",
  },
  {
    id: "database",
    name: "Database Connector",
    description: "Connect to SQL databases, NoSQL stores, and data warehouses with advanced querying capabilities.",
    icon: Database,
    category: "Data Storage",
    features: ["SQL databases", "NoSQL stores", "Data warehouses", "Advanced queries"],
    setupTime: "10 minutes",
    popularity: "high",
    status: "active",
  },
  {
    id: "file-upload",
    name: "File Upload",
    description: "Upload CSV, Excel, JSON, and other file formats with automatic data parsing and validation.",
    icon: Upload,
    category: "File Processing",
    features: ["CSV/Excel", "JSON/XML", "Auto-parsing", "Data validation"],
    setupTime: "2 minutes",
    popularity: "medium",
    status: "active",
  },
  {
    id: "agentic-browser",
    name: "Agentic Browser",
    description: "AI-powered web scraping and data extraction with intelligent content recognition and automation.",
    icon: Bot,
    category: "AI & Automation",
    features: ["Web scraping", "AI extraction", "Content recognition", "Automation"],
    setupTime: "15 minutes",
    popularity: "medium",
    status: "beta",
  },
];

export function ConnectorGallery({ onConnectorSelect, className = "" }: ConnectorGalleryProps) {
  const [selectedConnector, setSelectedConnector] = useState<Connector | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const getPopularityColor = (popularity: string) => {
    switch (popularity) {
      case "high":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "low":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>;
      case "beta":
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Beta</Badge>;
      case "coming-soon":
        return <Badge className="bg-gray-100 text-gray-800 border-gray-200">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const handleConnectorClick = (connector: Connector) => {
    setSelectedConnector(connector);
    if (onConnectorSelect) {
      onConnectorSelect(connector);
    }
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setSelectedConnector(null);
  };

  const handleSave = (data: ConnectorConfig) => {
    console.log("Saving connector:", selectedConnector?.id, data);
    // Here you would typically make an API call to save the connector
    setModalOpen(false);
    setSelectedConnector(null);
  };

  return (
    <>
      <div className={`space-y-6 ${className}`}>
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Choose Your Data Source
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Connect your data from various sources with our powerful, secure connectors.
            Each connector is designed for reliability and ease of use.
          </p>
        </div>

        {/* Connector Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {connectors.map((connector) => (
            <Card
              key={connector.id}
              className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer group ${
                selectedConnector?.id === connector.id
                  ? 'ring-2 ring-blue-500 shadow-lg'
                  : 'hover:shadow-md'
              }`}
              onClick={() => handleConnectorClick(connector)}
            >
              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                {getStatusBadge(connector.status)}
              </div>

              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-3 rounded-lg ${
                    connector.id === 'api' ? 'bg-blue-100' :
                    connector.id === 'database' ? 'bg-green-100' :
                    connector.id === 'file-upload' ? 'bg-purple-100' :
                    'bg-orange-100'
                  }`}>
                    <connector.icon className={`h-6 w-6 ${
                      connector.id === 'api' ? 'text-blue-600' :
                      connector.id === 'database' ? 'text-green-600' :
                      connector.id === 'file-upload' ? 'text-purple-600' :
                      'text-orange-600'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                      {connector.name}
                    </CardTitle>
                    <p className="text-sm text-gray-500 mt-1">
                      {connector.category}
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0">
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {connector.description}
                </p>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Key Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {connector.features.map((feature, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700"
                      >
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Setup Info */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1" />
                    Setup: {connector.setupTime}
                  </div>
                  <div className={`px-2 py-1 rounded-full text-xs border ${getPopularityColor(connector.popularity)}`}>
                    {connector.popularity} popularity
                  </div>
                </div>

                {/* Hover Action */}
                <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleConnectorClick(connector);
                    }}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Configure Connector
                  </Button>
                </div>
              </CardContent>

              {/* Selected Indicator */}
              {selectedConnector?.id === connector.id && (
                <div className="absolute inset-0 bg-blue-50/50 border-2 border-blue-500 rounded-lg pointer-events-none" />
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Connector Modal */}
      <ConnectorModal
        connector={selectedConnector}
        isOpen={modalOpen}
        onClose={handleModalClose}
        onSave={handleSave}
        mode="create"
      />
    </>
  );
}
