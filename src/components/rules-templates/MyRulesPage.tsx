"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Filter, Loader2, AlertCircle } from "lucide-react";
import { RulesList } from "@/components/rules-templates/RulesList";
import { useRules } from "@/hooks/useRulesAndTemplates";

export function MyRulesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const router = useRouter();

  const { data: rules = [], isLoading: rulesLoading, error: rulesError } = useRules();

  const handleCreateRule = () => {
    router.push("/dashboard/rules-templates/rule-builder");
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

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Rules</h1>
          <p className="text-gray-600 mt-1">
            Manage your data reconciliation rules
          </p>
        </div>
        <Button onClick={handleCreateRule} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Create Rule
        </Button>
      </div>

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
    </div>
  );
}
