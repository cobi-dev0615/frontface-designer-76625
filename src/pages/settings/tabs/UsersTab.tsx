import { UserPlus, Shield, Mail, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const UsersTab = () => {
  const users = [
    { name: "Carlos Silva", email: "carlos@duxfit.com", role: "Administrator", status: "active", avatar: "CS" },
    { name: "Ana Santos", email: "ana@duxfit.com", role: "Sales Manager", status: "active", avatar: "AS" },
    { name: "Pedro Lima", email: "pedro@duxfit.com", role: "Sales Agent", status: "active", avatar: "PL" },
    { name: "Maria Costa", email: "maria@duxfit.com", role: "Sales Agent", status: "inactive", avatar: "MC" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Team Members</CardTitle>
              <CardDescription>Manage users who have access to your DuxFit CRM</CardDescription>
            </div>
            <Button variant="gradient" className="gap-2">
              <UserPlus className="h-4 w-4" />
              Invite User
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {users.map((user, index) => (
              <div key={index} className="p-6 flex items-center justify-between hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-white font-semibold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{user.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <p className="text-sm font-medium">{user.role}</p>
                    </div>
                    <Badge
                      variant="secondary"
                      className={user.status === "active" ? "bg-green-500 text-white" : "bg-gray-500 text-white"}
                    >
                      {user.status}
                    </Badge>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover">
                      <DropdownMenuItem>Edit User</DropdownMenuItem>
                      <DropdownMenuItem>Change Role</DropdownMenuItem>
                      <DropdownMenuItem>Reset Password</DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">Remove User</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Roles & Permissions */}
      <Card>
        <CardHeader>
          <CardTitle>Roles & Permissions</CardTitle>
          <CardDescription>Configure access levels for different roles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Administrator</h4>
              <Badge>Full Access</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Full system access including settings, user management, and all features
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Sales Manager</h4>
              <Badge variant="secondary">Limited Access</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Access to leads, conversations, analytics, and team management
            </p>
          </div>

          <div className="border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Sales Agent</h4>
              <Badge variant="secondary">Basic Access</Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Access to assigned leads, conversations, and basic reporting
            </p>
          </div>

          <Button variant="outline" className="w-full">Configure Roles</Button>
        </CardContent>
      </Card>

      {/* Pending Invitations */}
      <Card>
        <CardHeader>
          <CardTitle>Pending Invitations</CardTitle>
          <CardDescription>Users who have been invited but haven't accepted yet</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground">
            <p>No pending invitations</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersTab;
