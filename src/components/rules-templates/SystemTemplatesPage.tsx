"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Loader2, AlertCircle } from "lucide-react";
import { TemplatesList } from "@/components/rules-templates/TemplatesList";
import { useTemplates } from "@/hooks/useRulesAndTemplates";

export function SystemTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");

  const { data: templates = [], isLoading: templatesLoading, error: templatesError } = useTemplates();

  const getComplexityBadge = (complexity: string) => {
    const variants = {
      simple: "bg-blue-100 text-blue-800 border-blue-200",
      intermediate: "bg-orange-100 text-orange-800 border-orange-200",
      advanced: "bg-red-100 text-red-800 border-red-200",
    };
    return (
      <Badge className={`capitalize ${variants[complexity as keyof typeof variants]}`}>
        {complexity}
      </Badge>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">System Templates</h1>
          <p className="text-gray-600 mt-1">
            Browse and use available reconciliation templates
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          Filter
        </Button>
      </div>

      {templatesError ? (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-center h-48 text-red-600">
              <AlertCircle className="h-8 w-8 mr-2" />
              <span>Failed to load templates</span>
            </div>
          </CardContent>
        </Card>
      ) : (
        <TemplatesList
          templates={templates}
          searchTerm={searchTerm}
          filterCategory={filterCategory}
          getComplexityBadge={getComplexityBadge}
          isLoading={templatesLoading}
        />
      )}
    </div>
  );
}
