import { SidebarMenuItem } from "@/types/sidebar";

export const sidebarConfig: SidebarMenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "LayoutDashboard",
    children: [
      {
        id: "overview",
        label: "Overview",
        rolesAllowed: ["Admin", "Reviewer", "Approver"],
        href: "/dashboard"
      }
    ],
    rolesAllowed: ["Admin", "Reviewer", "Approver"]
  },
  {
    id: "data_sources",
    label: "Data Sources",
    icon: "Database",
    children: [
      {
        id: "connectors",
        label: "Connectors",
        rolesAllowed: ["Admin", "Reviewer"],
        href: "/dashboard/data-sources"
      },
      {
        id: "connector_gallery",
        label: "Add New Connector",
        rolesAllowed: ["Admin"],
        href: "/dashboard/data-sources/new"
      }
    ],
    rolesAllowed: ["Admin", "Reviewer", "Approver"]
  },
  {
    id: "rules_templates",
    label: "Rules & Templates",
    icon: "Settings",
    children: [
      {
        id: "my_rules",
        label: "My Rules",
        rolesAllowed: ["Admin", "Reviewer"],
        href: "/dashboard/rules-templates/my-rules"
      },
      {
        id: "system_templates",
        label: "System Templates",
        rolesAllowed: ["Admin", "Reviewer"],
        href: "/dashboard/rules-templates/system-templates"
      },
      {
        id: "rule_builder",
        label: "Rule Builder",
        rolesAllowed: ["Admin"],
        href: "/dashboard/rules-templates/rule-builder"
      }
    ],
    rolesAllowed: ["Admin", "Reviewer", "Approver"]
  },
  {
    id: "reconciliations",
    label: "Reconciliations",
    icon: "Zap",
    children: [
      {
        id: "pipeline_builder",
        label: "Pipeline Builder",
        rolesAllowed: ["Admin", "Reviewer", "Approver"],
        href: "/dashboard/reconciliations"
      },
      {
        id: "run_history",
        label: "Run History",
        rolesAllowed: ["Admin", "Reviewer", "Approver"],
        href: "/dashboard/reconciliations/history"
      }
    ],
    rolesAllowed: ["Admin", "Reviewer", "Approver"]
  },
  {
    id: "exception_management",
    label: "Exception Management",
    icon: "AlertCircle",
    children: [
      {
        id: "exception_queue",
        label: "Exception Queue",
        rolesAllowed: ["Admin", "Reviewer", "Approver"],
        href: "/dashboard/exception-management/queue"
      }
    ],
    rolesAllowed: ["Admin", "Reviewer", "Approver"]
  },
  {
    id: "settings",
    label: "Settings",
    children: [
      {
        id: "user_management",
        label: "User Management",
        rolesAllowed: ["Admin"],
        href: "/dashboard/settings/users"
      },
      {
        id: "assign_role",
        label: "Roles",
        rolesAllowed: ["Admin"],
        href: "/dashboard/settings/roles"
      }
    ],
    rolesAllowed: ["Admin"]
  }
];
