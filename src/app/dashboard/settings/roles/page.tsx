"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { UserRole, SidebarMenuItem } from "@/types/sidebar";
import { sidebarConfig } from "@/config/sidebarConfig";
import { invitationService } from "@/app/services/invitationService";

export default function RolesPage() {
  const { user } = useAuth();
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] = useState<UserRole>("Reviewer");
  const [rolePermissions, setRolePermissions] = useState<{[key: string]: UserRole[]}>({
    // Initialize with current sidebar config
    ...Object.fromEntries(
      sidebarConfig.map(item => [item.id, [...item.rolesAllowed]])
    ),
    ...Object.fromEntries(
      sidebarConfig.flatMap(item =>
        item.children?.map(child => [child.id, [...child.rolesAllowed]]) || []
      )
    )
  });

  const handleInviteUser = async () => {
    try {
      const result = await invitationService.createInvitation({
        email: inviteEmail,
        role: inviteRole,
        invitedBy: user?.email || "",
      });

      if (result.success) {
        console.log("Invitation sent successfully");
        setShowInviteDialog(false);
        setInviteEmail("");
        setInviteRole("Reviewer");
      }
    } catch (error) {
      console.error("Error inviting user:", error);
    }
  };

  const handlePermissionToggle = (itemId: string, role: UserRole, checked: boolean) => {
    setRolePermissions(prev => ({
      ...prev,
      [itemId]: checked
        ? [...(prev[itemId] || []), role]
        : (prev[itemId] || []).filter(r => r !== role)
    }));
  };

  const getAllRoles = (): UserRole[] => ["Admin", "Reviewer", "Approver"];

  const renderMenuItemRow = (item: SidebarMenuItem, level: number = 0) => {
    const roles = getAllRoles();
    const itemRoles = rolePermissions[item.id] || item.rolesAllowed;

    return (
      <TableRow key={item.id}>
        <TableCell className="font-medium">
          <div style={{ paddingLeft: `${level * 20}px` }}>
            {item.icon && <span className="mr-2">📁</span>}
            {item.label}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex gap-2">
            {roles.map(role => (
              <div key={role} className="flex items-center space-x-2">
                <Checkbox
                  id={`${item.id}-${role}`}
                  checked={itemRoles.includes(role)}
                  onCheckedChange={(checked: boolean) =>
                    handlePermissionToggle(item.id, role, checked)
                  }
                />
                <Label
                  htmlFor={`${item.id}-${role}`}
                  className="text-sm font-normal capitalize"
                >
                  {role}
                </Label>
              </div>
            ))}
          </div>
        </TableCell>
        <TableCell>
          <div className="flex flex-wrap gap-1">
            {itemRoles.map(role => (
              <Badge key={role} variant="secondary" className="text-xs">
                {role}
              </Badge>
            ))}
          </div>
        </TableCell>
      </TableRow>
    );
  };

  if (user?.role !== "Admin") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">
            Access Denied
          </h2>
          <p className="text-slate-600">
            Only administrators can access this page.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Role Management</h1>
          <p className="text-slate-600">
            Configure roles and their access to menu features
          </p>
        </div>
        <Button
          className="bg-[#90e39a] text-slate-900 hover:bg-[#90e39a]/80"
          onClick={() => setShowInviteDialog(true)}
        >
          Invite User
        </Button>
      </div>

      <Dialog open={showInviteDialog} onOpenChange={setShowInviteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Invite New User</DialogTitle>
            <DialogDescription>
              Send an invitation email to add a new user to the system and assign them a role.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="user@company.com"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={inviteRole} onValueChange={(value) => setInviteRole(value as UserRole)}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Admin">Administrator</SelectItem>
                  <SelectItem value="Reviewer">Reviewer</SelectItem>
                  <SelectItem value="Approver">Approver</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInviteDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleInviteUser} className="bg-[#90e39a] text-slate-900 hover:bg-[#90e39a]/80">
              Send Invitation
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Menu & Feature Permissions</CardTitle>
          <CardDescription>
            Configure which roles can access each menu item and feature
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="max-h-96 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Menu Item</TableHead>
                  <TableHead>Role Permissions</TableHead>
                  <TableHead>Current Access</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sidebarConfig.map(item => (
                  <>
                    {renderMenuItemRow(item)}
                    {item.children?.map(child => renderMenuItemRow(child, 1))}
                  </>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
