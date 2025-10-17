import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
// import { toast } from "sonner"; // Temporarily commented out until sonner is installed

// Simple toast utility (temporary until sonner is installed)
const toast = {
  success: (message: string) => console.log(`✅ ${message}`),
  error: (message: string) => console.error(`❌ ${message}`),
};

export interface RuleVersion {
  id: string;
  version: string;
  createdAt: string;
  createdBy: string;
  changeType: "created" | "modified" | "restored";
  description: string;
  changes: Array<{
    type: "added" | "removed" | "modified";
    field: string;
    oldValue?: any;
    newValue?: any;
  }>;
  ruleData: Record<string, any>;
}

export interface Rule {
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
  logic: string;
  conditions: Array<{
    field: string;
    operator: string;
    value: string;
    logic: string;
  }>;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
  complexity: "simple" | "intermediate" | "advanced";
  usageCount: number;
  rating: number;
  tags: string[];
  preview: string;
  logicTemplate: string;
  conditionsTemplate: Array<{
    field: string;
    operator: string;
    value: string;
    logic: string;
  }>;
}

// API hooks for Rules
export function useRules() {
  return useQuery({
    queryKey: ["rules"],
    queryFn: async (): Promise<Rule[]> => {
      const response = await fetch("/api/rules");
      if (!response.ok) {
        throw new Error("Failed to fetch rules");
      }
      return response.json();
    },
  });
}

export function useRule(ruleId: string) {
  return useQuery({
    queryKey: ["rule", ruleId],
    queryFn: async (): Promise<Rule> => {
      const response = await fetch(`/api/rules/${ruleId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch rule");
      }
      return response.json();
    },
    enabled: !!ruleId,
  });
}

export function useCreateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleData: Omit<Rule, "id" | "lastModified" | "createdBy">): Promise<Rule> => {
      const response = await fetch("/api/rules", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleData),
      });

      if (!response.ok) {
        throw new Error("Failed to create rule");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create rule: ${error.message}`);
    },
  });
}

export function useUpdateRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...ruleData }: Partial<Rule> & { id: string }): Promise<Rule> => {
      const response = await fetch(`/api/rules/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleData),
      });

      if (!response.ok) {
        throw new Error("Failed to update rule");
      }

      return response.json();
    },
    onSuccess: (updatedRule) => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      queryClient.invalidateQueries({ queryKey: ["rule", updatedRule.id] });
      toast.success("Rule updated successfully");
    },
    onError: (error) => {
      toast.error(`Failed to update rule: ${error.message}`);
    },
  });
}

export function useDeleteRule() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (ruleId: string): Promise<void> => {
      const response = await fetch(`/api/rules/${ruleId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete rule");
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule deleted successfully");
    },
    onError: (error) => {
      toast.error(`Failed to delete rule: ${error.message}`);
    },
  });
}

export function useTestRule() {
  return useMutation({
    mutationFn: async ({ ruleId, testData }: { ruleId: string; testData: any }): Promise<any> => {
      const response = await fetch(`/api/rules/${ruleId}/test`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ testData }),
      });

      if (!response.ok) {
        throw new Error("Failed to test rule");
      }

      return response.json();
    },
    onError: (error) => {
      toast.error(`Test failed: ${error.message}`);
    },
  });
}

// API hooks for Templates
export function useTemplates() {
  return useQuery({
    queryKey: ["templates"],
    queryFn: async (): Promise<Template[]> => {
      const response = await fetch("/api/templates");
      if (!response.ok) {
        throw new Error("Failed to fetch templates");
      }
      return response.json();
    },
  });
}

export function useTemplate(templateId: string) {
  return useQuery({
    queryKey: ["template", templateId],
    queryFn: async (): Promise<Template> => {
      const response = await fetch(`/api/templates/${templateId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch template");
      }
      return response.json();
    },
    enabled: !!templateId,
  });
}

export function useTemplateCategories() {
  return useQuery({
    queryKey: ["template-categories"],
    queryFn: async (): Promise<string[]> => {
      const response = await fetch("/api/templates/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch template categories");
      }
      return response.json();
    },
  });
}

export function useCreateRuleFromTemplate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      templateId,
      ruleData
    }: {
      templateId: string;
      ruleData: Partial<Omit<Rule, "id" | "lastModified" | "createdBy" | "type">>
    }): Promise<Rule> => {
      const response = await fetch(`/api/templates/${templateId}/use`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(ruleData),
      });

      if (!response.ok) {
        throw new Error("Failed to create rule from template");
      }

      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["rules"] });
      toast.success("Rule created from template successfully");
    },
    onError: (error) => {
      toast.error(`Failed to create rule from template: ${error.message}`);
    },
  });
}
