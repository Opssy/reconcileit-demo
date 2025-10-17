"use client";

import { useState, useCallback, useMemo } from "react";
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Connection,
  ConnectionMode,
  Panel,
} from "reactflow";
import "reactflow/dist/style.css";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, Save, Settings, Clock, Database, Zap, Download } from "lucide-react";
import { ScheduleModal } from "./ScheduleModal";

// Define the node types for different pipeline stages
const nodeTypes = {
  ingest: {
    background: "#3b82f6",
    color: "#ffffff",
    icon: Database,
    label: "Ingest"
  },
  prep: {
    background: "#10b981",
    color: "#ffffff",
    icon: Zap,
    label: "Prep"
  },
  reconcile: {
    background: "#f59e0b",
    color: "#ffffff",
    icon: Settings,
    label: "Reconcile"
  },
  export: {
    background: "#8b5cf6",
    color: "#ffffff",
    icon: Download,
    label: "Export"
  }
};

const initialNodes: Node[] = [
  {
    id: "ingest",
    type: "default",
    position: { x: 100, y: 100 },
    data: {
      label: "Ingest",
      type: "ingest",
      description: "Data ingestion from sources"
    },
    style: {
      background: nodeTypes.ingest.background,
      color: nodeTypes.ingest.color,
      border: "2px solid #1e40af",
      borderRadius: "8px",
      padding: "12px",
      width: 120,
    },
  },
  {
    id: "prep",
    type: "default",
    position: { x: 300, y: 100 },
    data: {
      label: "Prep",
      type: "prep",
      description: "Data preparation and transformation"
    },
    style: {
      background: nodeTypes.prep.background,
      color: nodeTypes.prep.color,
      border: "2px solid #059669",
      borderRadius: "8px",
      padding: "12px",
      width: 120,
    },
  },
  {
    id: "reconcile",
    type: "default",
    position: { x: 500, y: 100 },
    data: {
      label: "Reconcile",
      type: "reconcile",
      description: "Reconciliation logic execution"
    },
    style: {
      background: nodeTypes.reconcile.background,
      color: nodeTypes.reconcile.color,
      border: "2px solid #d97706",
      borderRadius: "8px",
      padding: "12px",
      width: 120,
    },
  },
  {
    id: "export",
    type: "default",
    position: { x: 700, y: 100 },
    data: {
      label: "Export",
      type: "export",
      description: "Export results to destinations"
    },
    style: {
      background: nodeTypes.export.background,
      color: nodeTypes.export.color,
      border: "2px solid #7c3aed",
      borderRadius: "8px",
      padding: "12px",
      width: 120,
    },
  },
];

const initialEdges: Edge[] = [
  {
    id: "ingest-prep",
    source: "ingest",
    target: "prep",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "prep-reconcile",
    source: "prep",
    target: "reconcile",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
    animated: true,
  },
  {
    id: "reconcile-export",
    source: "reconcile",
    target: "export",
    type: "smoothstep",
    style: { stroke: "#6b7280", strokeWidth: 2 },
    animated: true,
  },
];

export function PipelineBuilder() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleRunNow = async () => {
    try {
      const response = await fetch("/api/reconciliations/run", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          pipeline: {
            nodes,
            edges,
          },
        }),
      });

      if (response.ok) {
        console.log("Pipeline executed successfully");
      } else {
        throw new Error("Failed to run pipeline");
      }
    } catch (error) {
      console.error("Error running pipeline:", error);
    }
  };

  const handleSavePipeline = async () => {
    try {
      const response = await fetch("/api/reconciliations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "New Reconciliation Pipeline",
          description: "Pipeline created via visual builder",
          nodes,
          edges,
        }),
      });

      if (response.ok) {
        console.log("Pipeline saved successfully");
      } else {
        throw new Error("Failed to save pipeline");
      }
    } catch (error) {
      console.error("Error saving pipeline:", error);
    }
  };

  const getNodeIcon = (nodeType: string) => {
    const type = nodeTypes[nodeType as keyof typeof nodeTypes];
    if (!type) return null;
    const IconComponent = type.icon;
    return <IconComponent className="w-4 h-4" />;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Pipeline Builder</h1>
          <p className="text-gray-600">Visual reconciliation pipeline editor</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setScheduleModalOpen(true)}>
            <Clock className="w-4 h-4 mr-2" />
            Schedule
          </Button>
          <Button variant="outline" onClick={handleRunNow}>
            <Play className="w-4 h-4 mr-2" />
            Run Now
          </Button>
          <Button onClick={handleSavePipeline}>
            <Save className="w-4 h-4 mr-2" />
            Save Pipeline
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Sidebar - Node Palette */}
        <div className="w-64 bg-gray-50 border-r p-4">
          <h3 className="font-semibold mb-4">Pipeline Stages</h3>
          <div className="space-y-2">
            {Object.entries(nodeTypes).map(([key, type]) => (
              <Card
                key={key}
                className="cursor-pointer hover:shadow-md transition-shadow"
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("application/reactflow", key);
                  e.dataTransfer.effectAllowed = "move";
                }}
              >
                <CardContent className="p-3 flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded flex items-center justify-center text-white text-sm"
                    style={{ backgroundColor: type.background }}
                  >
                    {getNodeIcon(key)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{type.label}</div>
                    <div className="text-xs text-gray-500">Drag to add</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* React Flow Canvas */}
        <div className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            fitView
            className="bg-gray-50"
          >
            <Background />
            <Controls />
            <MiniMap
              nodeColor={(node) => {
                const nodeType = nodeTypes[node.data?.type as keyof typeof nodeTypes];
                return nodeType?.background || "#3b82f6";
              }}
              maskColor="rgba(0, 0, 0, 0.1)"
            />
          </ReactFlow>
        </div>

        {/* Properties Panel */}
        <div className="w-80 bg-white border-l p-4 overflow-y-auto">
          {selectedNode ? (
            <div>
              <h3 className="font-semibold mb-4">Stage Configuration</h3>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <div
                      className="w-6 h-6 rounded flex items-center justify-center text-white text-xs"
                      style={{
                        backgroundColor: nodeTypes[selectedNode.data?.type as keyof typeof nodeTypes]?.background
                      }}
                    >
                      {getNodeIcon(selectedNode.data?.type)}
                    </div>
                    {selectedNode.data?.label}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="text-sm font-medium">Description</label>
                    <p className="text-sm text-gray-600 mt-1">
                      {selectedNode.data?.description}
                    </p>
                  </div>

                  {/* Stage-specific configuration */}
                  {selectedNode.data?.type === "ingest" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Data Sources</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Database Connection</option>
                        <option>API Endpoint</option>
                        <option>File Upload</option>
                      </select>
                    </div>
                  )}

                  {selectedNode.data?.type === "prep" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Transformations</label>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Data Validation</span>
                        </label>
                        <label className="flex items-center">
                          <input type="checkbox" className="mr-2" />
                          <span className="text-sm">Type Conversion</span>
                        </label>
                      </div>
                    </div>
                  )}

                  {selectedNode.data?.type === "reconcile" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Reconciliation Rules</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>Transaction Amount Match</option>
                        <option>Customer Data Validation</option>
                        <option>Inventory Count Match</option>
                      </select>
                    </div>
                  )}

                  {selectedNode.data?.type === "export" && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Export Format</label>
                      <select className="w-full p-2 border rounded-md">
                        <option>CSV File</option>
                        <option>Excel File</option>
                        <option>Database Table</option>
                        <option>API Endpoint</option>
                      </select>
                    </div>
                  )}

                  <Button className="w-full">Apply Configuration</Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center text-gray-500 mt-8">
              <Settings className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a stage to configure</p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal */}
      <ScheduleModal
        open={scheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onSchedule={(scheduleData) => {
          console.log("Schedule data:", scheduleData);
          setScheduleModalOpen(false);
        }}
      />
    </div>
  );
}
