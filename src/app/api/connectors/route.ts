import { NextRequest, NextResponse } from "next/server";

// Mock connectors data - in real app, this would come from a database
const mockConnectors = [
  {
    id: "conn-001",
    name: "Bank API",
    type: "api",
    status: "active",
    lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days ago
    recordsCount: 15420,
    errorCount: 0,
    config: {
      baseUrl: "https://api.bank.com",
      authType: "bearer",
      rateLimit: 1000,
    },
  },
  {
    id: "conn-002",
    name: "ERP Database",
    type: "database",
    status: "active",
    lastSync: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30 minutes ago
    createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(), // 15 days ago
    recordsCount: 8930,
    errorCount: 2,
    config: {
      host: "erp.company.com",
      port: 5432,
      database: "production",
      ssl: true,
    },
  },
  {
    id: "conn-003",
    name: "Transaction Files",
    type: "file-upload",
    status: "paused",
    lastSync: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
    recordsCount: 0,
    errorCount: 0,
    config: {
      uploadPath: "/data/transactions",
      fileTypes: ["csv", "xlsx"],
      autoProcess: false,
    },
  },
  {
    id: "conn-004",
    name: "Payment Gateway",
    type: "api",
    status: "error",
    lastSync: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(), // 4 hours ago
    createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days ago
    recordsCount: 0,
    errorCount: 15,
    config: {
      baseUrl: "https://api.paymentgateway.com",
      authType: "api_key",
      rateLimit: 500,
    },
  },
  {
    id: "conn-005",
    name: "Legacy System",
    type: "database",
    status: "active",
    lastSync: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), // 60 days ago
    recordsCount: 12500,
    errorCount: 1,
    config: {
      host: "legacy.company.com",
      port: 3306,
      database: "transactions",
      ssl: false,
    },
  },
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1") || 1);
    const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10") || 10));
    const search = searchParams.get("search") || "";
    const type = searchParams.get("type") || "";
    const status = searchParams.get("status") || "";

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    let filteredData = mockConnectors;

    // Filter by search term
    if (search) {
      filteredData = filteredData.filter(
        (connector) =>
          connector.name.toLowerCase().includes(search.toLowerCase()) ||
          connector.type.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Filter by type
    if (type) {
      filteredData = filteredData.filter((connector) => connector.type === type);
    }

    // Filter by status
    if (status) {
      filteredData = filteredData.filter((connector) => connector.status === status);
    }

    // Pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedData = filteredData.slice(startIndex, endIndex);

    return NextResponse.json({
      data: paginatedData,
      pagination: {
        page,
        limit,
        total: filteredData.length,
        totalPages: Math.ceil(filteredData.length / limit),
      },
      filters: {
        search,
        type,
        status,
      },
    });

  } catch (error) {
    console.error("Connectors fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch connectors" },
      { status: 500 }
    );
  }
}
