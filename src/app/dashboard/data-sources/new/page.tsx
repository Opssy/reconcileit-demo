"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { ConnectorGallery } from "@/components/data-sources/ConnectorGallery";
import { ConnectorModal } from "@/components/data-sources/ConnectorModal";

export default function NewConnectorPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [selectedConnector, setSelectedConnector] = useState<any>(null);

  if (!user) {
    return null;
  }

  const handleConnectorSelect = (connector: any) => {
    setSelectedConnector(connector);
    setShowModal(true);
  };

  const handleConnectorSave = (data: any) => {
    console.log("Saving new connector:", data);
    // Here you would typically save the connector configuration
    setShowModal(false);
    setSelectedConnector(null);
    // Redirect back to main data sources page after saving
    router.push("/dashboard/data-sources");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Available Connectors</h2>
          <p className="text-sm text-gray-600">
            Select a connector type to begin the setup process
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={() => router.push("/dashboard/data-sources")}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          Back to Data Sources
        </Button>
      </div>

      <ConnectorGallery onConnectorSelect={handleConnectorSelect} />

      {/* Connector Modal */}
      <ConnectorModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        connector={selectedConnector}
        onSave={handleConnectorSave}
        mode="create"
      />
    </div>
  );
}
