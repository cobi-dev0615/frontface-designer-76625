import { CheckCircle, Link2, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const EvoIntegrationTab = () => {
  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Link2 className="h-5 w-5" />
            EVO Integration Status
          </CardTitle>
          <CardDescription>Connect with EVO Gym Management System</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">EVO Connected</h3>
              <p className="text-lg">DuxFit Piauí</p>
              <Badge className="bg-green-500">Active Sync</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last sync: 2 minutes ago</p>
            <div className="flex gap-2">
              <Button variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Sync Now
              </Button>
              <Button variant="outline" className="text-destructive hover:text-destructive">
                Disconnect
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* API Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>API Configuration</CardTitle>
          <CardDescription>Your EVO API credentials and endpoints</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="api-url">API URL</Label>
            <Input
              id="api-url"
              defaultValue="https://api.evofitness.com.br/v1"
              readOnly
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="api-key">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="api-key"
                type="password"
                defaultValue="••••••••••••••••••••"
                readOnly
              />
              <Button variant="outline" size="sm">Show</Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="gym-id">Gym ID</Label>
            <Input id="gym-id" defaultValue="DUXFIT-PI-001" readOnly />
          </div>

          <Button variant="outline">Test Connection</Button>
        </CardContent>
      </Card>

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Synchronization Settings</CardTitle>
          <CardDescription>Configure what data to sync with EVO</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="sync-members" className="flex flex-col gap-1">
              <span className="font-medium">Sync Members</span>
              <span className="text-xs text-muted-foreground">
                Automatically import new members from EVO
              </span>
            </Label>
            <Switch id="sync-members" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sync-plans" className="flex flex-col gap-1">
              <span className="font-medium">Sync Membership Plans</span>
              <span className="text-xs text-muted-foreground">
                Keep membership plans updated
              </span>
            </Label>
            <Switch id="sync-plans" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sync-checkins" className="flex flex-col gap-1">
              <span className="font-medium">Sync Check-ins</span>
              <span className="text-xs text-muted-foreground">
                Track member check-ins in real-time
              </span>
            </Label>
            <Switch id="sync-checkins" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sync-payments" className="flex flex-col gap-1">
              <span className="font-medium">Sync Payments</span>
              <span className="text-xs text-muted-foreground">
                Monitor payment status and renewals
              </span>
            </Label>
            <Switch id="sync-payments" defaultChecked />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="auto-sync" className="flex flex-col gap-1">
              <span className="font-medium">Automatic Sync</span>
              <span className="text-xs text-muted-foreground">
                Sync every 15 minutes automatically
              </span>
            </Label>
            <Switch id="auto-sync" defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Sync Activity</CardTitle>
          <CardDescription>Last 5 synchronization events</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "2 minutes ago", status: "success", message: "Synced 3 new members" },
              { time: "17 minutes ago", status: "success", message: "Updated 5 membership plans" },
              { time: "1 hour ago", status: "success", message: "Synced 12 check-ins" },
              { time: "2 hours ago", status: "warning", message: "Partial sync - 2 records skipped" },
              { time: "3 hours ago", status: "success", message: "Full sync completed" },
            ].map((sync, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                {sync.status === "success" ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-yellow-500" />
                )}
                <div className="flex-1">
                  <p className="font-medium text-sm">{sync.message}</p>
                  <p className="text-xs text-muted-foreground">{sync.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Field Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping</CardTitle>
          <CardDescription>Map EVO fields to DuxFit fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">EVO Field</Label>
                <p className="font-medium">cliente_nome</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">DuxFit Field</Label>
                <p className="font-medium">lead_name</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">EVO Field</Label>
                <p className="font-medium">cliente_telefone</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">DuxFit Field</Label>
                <p className="font-medium">phone_number</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
              <div>
                <Label className="text-xs text-muted-foreground">EVO Field</Label>
                <p className="font-medium">plano_nome</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">DuxFit Field</Label>
                <p className="font-medium">membership_plan</p>
              </div>
            </div>
            <Button variant="outline" className="w-full">Configure Field Mapping</Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <p className="text-sm text-muted-foreground">Last saved: Auto-saved</p>
        <Button variant="gradient">Save Configuration</Button>
      </div>
    </div>
  );
};

export default EvoIntegrationTab;
