import { RunDetailsPage } from "@/components/reconciliations/RunDetailsPage";

interface RunDetailsProps {
  params: {
    runId: string;
  };
}

export default function RunDetails({ params }: RunDetailsProps) {
  return <RunDetailsPage runId={params.runId} />;
}
