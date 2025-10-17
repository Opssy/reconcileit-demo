import { RunHistoryTable } from "@/components/reconciliations/RunHistoryTable";

export default function ReconciliationsHistoryPage() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reconciliation Run History</h1>
        <p className="text-gray-600 mt-1">
          View and analyze past reconciliation executions
        </p>
      </div>

      <RunHistoryTable />
    </div>
  );
}
