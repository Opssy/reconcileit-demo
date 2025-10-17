"use client";

import { RuleBuilder } from "@/components/rules-templates/RuleBuilder";

export function RuleBuilderPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Rule Builder</h1>
          <p className="text-gray-600 mt-1">
            Create custom reconciliation rules using the visual builder
          </p>
        </div>
      </div>

      <RuleBuilder />
    </div>
  );
}
