"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Loader2, AlertCircle } from "lucide-react";
import { RulesList } from "./RulesList";
import { TemplateGallery } from "./TemplateGallery";
import { RuleBuilder } from "./RuleBuilder";
import { useRules, useTemplates } from "@/hooks/useRulesAndTemplates";

export function RulesAndTemplatesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [activeTab, setActiveTab] = useState("my-rules");
  const router = useRouter();

  // API hooks
  const { data: rules = [], isLoading: rulesLoading, error: rulesError } = useRules();
  const { data: templates = [], isLoading: templatesLoading, error: templatesError } = useTemplates();

  // Handle URL hash changes to set active tab
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.substring(1); // Remove the '#'
      if (hash && ["my-rules", "system-templates", "rule-builder"].includes(hash)) {
        setActiveTab(hash);
      }
    };

    // Set initial tab based on URL hash
    handleHashChange();

    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Update URL hash
    window.location.hash = value;
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "bg-green-100 text-green-800 border-green-200",
      inactive: "bg-gray-100 text-gray-800 border-gray-200",
      draft: "bg-yellow-100 text-yellow-800 border-yellow-200",
    };
    return (
      <Badge className={`capitalize ${variants[status as keyof typeof variants]}`}>
        {status}
      </Badge>
    );
  };

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
          <h1 className="text-3xl font-bold">Rules & Templates</h1>
          <p className="text-gray-600 mt-1">
            Manage your data reconciliation rules and browse available templates
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="my-rules">My Rules</TabsTrigger>
          <TabsTrigger value="system-templates">System Templates</TabsTrigger>
          <TabsTrigger value="rule-builder">Rule Builder</TabsTrigger>
        </TabsList>

        <TabsContent value="my-rules" className="space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search rules..."
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

          {rulesError ? (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center h-48 text-red-600">
                  <AlertCircle className="h-8 w-8 mr-2" />
                  <span>Failed to load rules</span>
                </div>
              </CardContent>
            </Card>
          ) : (
            <RulesList
              rules={rules}
              searchTerm={searchTerm}
              filterCategory={filterCategory}
              getStatusBadge={getStatusBadge}
              isLoading={rulesLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="system-templates" className="space-y-6">
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
            <TemplateGallery
              templates={templates}
              searchTerm={searchTerm}
              filterCategory={filterCategory}
              getComplexityBadge={getComplexityBadge}
              isLoading={templatesLoading}
            />
          )}
        </TabsContent>

        <TabsContent value="rule-builder" className="space-y-6">
          <RuleBuilder />
        </TabsContent>
      </Tabs>
    </div>
  );
}
