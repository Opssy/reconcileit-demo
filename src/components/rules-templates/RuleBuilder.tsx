"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Code, Save, Play, Settings, Database, FileText, Plus, X, ArrowRight, GripVertical, Trash2, Edit } from "lucide-react";

interface TransformationStep {
  id: string;
  type: "select-columns" | "type-cast" | "filter" | "derive-fields" | "rename";
  name: string;
  config: Record<string, any>;
  position: { x: number; y: number };
}

const STEP_TYPES = [
  { id: "select-columns", name: "Select Columns", icon: "📊", description: "Choose which columns to include" },
  { id: "type-cast", name: "Type Cast", icon: "🔄", description: "Convert data types" },
  { id: "filter", name: "Filter", icon: "🔍", description: "Filter rows based on conditions" },
  { id: "derive-fields", name: "Derive Fields", icon: "➕", description: "Create new calculated fields" },
  { id: "rename", name: "Rename", icon: "📝", description: "Rename columns" },
];

export function RuleBuilder() {
  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [dataSource, setDataSource] = useState("");
  const [steps, setSteps] = useState<TransformationStep[]>([
    {
      id: "input",
      type: "select-columns",
      name: "Raw Data",
      config: { columns: [] },
      position: { x: 100, y: 100 }
    }
  ]);
  const [selectedStep, setSelectedStep] = useState<string | null>(null);
  const [showStepPalette, setShowStepPalette] = useState(false);
  const [formulaEditor, setFormulaEditor] = useState("");

  const handleSave = () => {
    console.log("Save rule:", { ruleName, ruleDescription, dataSource, steps });
  };

  const handleTest = () => {
    console.log("Test rule with steps:", steps);
  };

  const addStep = (stepType: string) => {
    const newStep: TransformationStep = {
      id: `step-${Date.now()}`,
      type: stepType as any,
      name: STEP_TYPES.find(s => s.id === stepType)?.name || stepType,
      config: {},
      position: { x: 300 + steps.length * 200, y: 100 }
    };
    setSteps([...steps, newStep]);
    setShowStepPalette(false);
  };

  const removeStep = (stepId: string) => {
    if (stepId === "input") return; // Don't remove input step
    setSteps(steps.filter(step => step.id !== stepId));
    if (selectedStep === stepId) {
      setSelectedStep(null);
    }
  };

  const updateStepConfig = (stepId: string, config: Record<string, any>) => {
    setSteps(steps.map(step =>
      step.id === stepId ? { ...step, config } : step
    ));
  };

  const selectedStepData = steps.find(step => step.id === selectedStep);

  const renderStepIcon = (type: string) => {
    const stepType = STEP_TYPES.find(s => s.id === type);
    return stepType?.icon || "⚙️";
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Visual Rule Builder
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="ruleName">Rule Name</Label>
              <Input
                id="ruleName"
                placeholder="Enter rule name"
                value={ruleName}
                onChange={(e) => setRuleName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dataSource">Data Source</Label>
              <Select value={dataSource} onValueChange={setDataSource}>
                <SelectTrigger>
                  <SelectValue placeholder="Select data source" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="transactions">Transaction Database</SelectItem>
                  <SelectItem value="customers">Customer Database</SelectItem>
                  <SelectItem value="products">Product Catalog</SelectItem>
                  <SelectItem value="orders">Order Management</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="ruleDescription">Description</Label>
            <Textarea
              id="ruleDescription"
              placeholder="Describe what this rule does"
              value={ruleDescription}
              onChange={(e) => setRuleDescription(e.target.value)}
              rows={3}
            />
          </div>

          {/* Visual Flow Diagram */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-lg font-medium">Transformation Pipeline</Label>
              <Button onClick={() => setShowStepPalette(true)} className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add Step
              </Button>
            </div>

            {/* Flow Diagram Area */}
            <div className="relative bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 min-h-[400px]">
              {/* Connection Lines */}
              {steps.slice(1).map((step, index) => (
                <div key={`line-${step.id}`} className="absolute" style={{
                  left: `${200 + index * 200}px`,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  zIndex: 1
                }}>
                  <ArrowRight className="h-6 w-6 text-gray-400" />
                </div>
              ))}

              {/* Step Nodes */}
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`absolute cursor-pointer transition-all duration-200 ${
                    selectedStep === step.id ? 'ring-2 ring-blue-500 scale-105' : 'hover:scale-105'
                  }`}
                  style={{
                    left: `${100 + index * 200}px`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    zIndex: 2
                  }}
                  onClick={() => setSelectedStep(step.id)}
                >
                  <Card className={`w-48 ${selectedStep === step.id ? 'ring-2 ring-blue-500' : ''}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-lg">{renderStepIcon(step.type)}</span>
                          <CardTitle className="text-sm">{step.name}</CardTitle>
                        </div>
                        {step.id !== "input" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeStep(step.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-xs text-gray-600">
                        {STEP_TYPES.find(s => s.id === step.type)?.description}
                      </p>
                    </CardContent>
                  </Card>
                </div>
              ))}

              {/* Output Node */}
              <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
                <Card className="w-48 bg-green-50 border-green-200">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Database className="h-4 w-4 text-green-600" />
                      Output
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <p className="text-xs text-gray-600">Final transformed data</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Step Palette Dialog */}
            <Dialog open={showStepPalette} onOpenChange={setShowStepPalette}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Add Transformation Step</DialogTitle>
                </DialogHeader>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {STEP_TYPES.map((stepType) => (
                    <Card
                      key={stepType.id}
                      className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => addStep(stepType.id)}
                    >
                      <CardContent className="p-4 text-center">
                        <div className="text-2xl mb-2">{stepType.icon}</div>
                        <h3 className="font-medium mb-1">{stepType.name}</h3>
                        <p className="text-xs text-gray-600">{stepType.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Configuration Panel Sidebar */}
          {selectedStepData && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>{renderStepIcon(selectedStepData.type)}</span>
                  Configure {selectedStepData.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedStepData.type === "select-columns" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Available Columns</Label>
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        {["id", "name", "amount", "date", "status", "category"].map(col => (
                          <div key={col} className="flex items-center space-x-2">
                            <input type="checkbox" id={col} />
                            <Label htmlFor={col} className="text-sm">{col}</Label>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {selectedStepData.type === "type-cast" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Column</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">amount</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                            <SelectItem value="id">id</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>Target Type</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="string">String</SelectItem>
                            <SelectItem value="number">Number</SelectItem>
                            <SelectItem value="date">Date</SelectItem>
                            <SelectItem value="boolean">Boolean</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                )}

                {selectedStepData.type === "filter" && (
                  <div className="space-y-4">
                    <div>
                      <Label>Filter Condition</Label>
                      <div className="grid grid-cols-3 gap-2 mt-2">
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">amount</SelectItem>
                            <SelectItem value="status">status</SelectItem>
                            <SelectItem value="date">date</SelectItem>
                          </SelectContent>
                        </Select>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Operator" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="equals">equals</SelectItem>
                            <SelectItem value="greater_than">greater than</SelectItem>
                            <SelectItem value="less_than">less than</SelectItem>
                            <SelectItem value="contains">contains</SelectItem>
                          </SelectContent>
                        </Select>
                        <Input placeholder="Value" />
                      </div>
                    </div>
                  </div>
                )}

                {selectedStepData.type === "derive-fields" && (
                  <div className="space-y-4">
                    <div>
                      <Label>New Field Name</Label>
                      <Input placeholder="e.g., total_with_tax" className="mt-2" />
                    </div>
                    <div>
                      <Label>Formula</Label>
                      <Textarea
                        placeholder="amount * 1.1"
                        value={formulaEditor}
                        onChange={(e) => setFormulaEditor(e.target.value)}
                        className="font-mono text-sm mt-2"
                        rows={3}
                      />
                    </div>
                    <div className="bg-blue-50 p-3 rounded-lg">
                      <p className="text-sm text-blue-800">
                        <strong>Available variables:</strong> amount, quantity, price, tax_rate, etc.
                      </p>
                    </div>
                  </div>
                )}

                {selectedStepData.type === "rename" && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Current Name</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select column" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="amount">amount</SelectItem>
                            <SelectItem value="customer_name">customer_name</SelectItem>
                            <SelectItem value="order_date">order_date</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label>New Name</Label>
                        <Input placeholder="new_column_name" className="mt-2" />
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-2">
                  <Button variant="outline">Cancel</Button>
                  <Button>Apply Configuration</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-6 border-t">
            <Button variant="outline" onClick={handleTest} className="flex items-center gap-2">
              <Play className="h-4 w-4" />
              Test Rule
            </Button>
            <Button onClick={handleSave} className="flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save Rule
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
