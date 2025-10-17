"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ConnectorsTable } from "@/components/data-sources/ConnectorsTable";
import { useRouter } from "next/navigation";

export default function DataSourcesPage() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-sm text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">My Connected Sources</h2>
          <p className="text-sm text-gray-600">
            Manage your existing data source connections
          </p>
        </div>
        <Button className="bg-[#90e39a] text-slate-900 hover:bg-[#90e39a]/90" onClick={() => router.push("/dashboard/data-sources/new")}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Connector
        </Button>
      </div>

      <ConnectorsTable />
    </div>
  );
}
