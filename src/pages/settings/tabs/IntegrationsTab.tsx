import { Plug, RefreshCw, CheckCircle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const IntegrationsTab = () => {
  return (
    <div className="space-y-6">
      {/* EVO Integration */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Plug className="h-5 w-5" />
                EVO Gym Management System
              </CardTitle>
              <CardDescription>Sync leads and members with your EVO system</CardDescription>
            </div>
            <Badge className="bg-green-500 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Connected
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Connection Details */}
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evo-url">EVO API URL</Label>
              <Input
                id="evo-url"
                defaultValue="https://api.evofit.com.br"
                readOnly
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-api-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="evo-api-key"
                  type="password"
                  defaultValue="••••••••••••••••••••"
                  readOnly
                />
                <Button variant="outline" size="sm">Show</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-branch">Branch ID</Label>
              <Input
                id="evo-branch"
                defaultValue="DUXFIT-PI-001"
                readOnly
              />
            </div>
          </div>

          {/* Auto-Sync Settings */}
          <div className="space-y-4">
            <h4 className="font-medium">Auto-Sync Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="auto-sync">Enable Auto-Sync</Label>
                <p className="text-sm text-muted-foreground">Automatically sync leads every 15 minutes</p>
              </div>
              <Switch id="auto-sync" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="bidirectional">Bidirectional Sync</Label>
                <p className="text-sm text-muted-foreground">Sync changes both ways between systems</p>
              </div>
              <Switch id="bidirectional" defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="notify-sync">Sync Notifications</Label>
                <p className="text-sm text-muted-foreground">Get notified when sync completes</p>
              </div>
              <Switch id="notify-sync" />
            </div>
          </div>

          {/* Sync Status */}
          <div className="border border-border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Last Sync Status</h4>
              <Badge className="bg-green-500">Success</Badge>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Last Sync</p>
                <p className="font-medium">2 minutes ago</p>
              </div>
              <div>
                <p className="text-muted-foreground">Records Synced</p>
                <p className="font-medium">15 leads</p>
              </div>
              <div>
                <p className="text-muted-foreground">Duration</p>
                <p className="font-medium">3.2 seconds</p>
              </div>
              <div>
                <p className="text-muted-foreground">Errors</p>
                <p className="font-medium">0</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1 gap-2">
              <RefreshCw className="h-4 w-4" />
              Sync Now
            </Button>
            <Button variant="outline" className="flex-1">Test Connection</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sync History */}
      <Card>
        <CardHeader>
          <CardTitle>Sync History</CardTitle>
          <CardDescription>Recent synchronization attempts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { time: "Oct 20, 10:45 AM", type: "Auto", status: "success", records: 15 },
              { time: "Oct 20, 10:30 AM", type: "Auto", status: "success", records: 8 },
              { time: "Oct 20, 10:15 AM", type: "Manual", status: "success", records: 23 },
              { time: "Oct 20, 10:00 AM", type: "Auto", status: "failed", records: 0 },
            ].map((sync, index) => (
              <div key={index} className="flex items-center justify-between border-b border-border pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  {sync.status === "success" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <div>
                    <p className="text-sm font-medium">{sync.time}</p>
                    <p className="text-xs text-muted-foreground">{sync.type} sync</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={sync.status === "success" ? "default" : "destructive"} className={sync.status === "success" ? "bg-green-500" : ""}>
                    {sync.status}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-1">{sync.records} records</p>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">View Full History</Button>
        </CardContent>
      </Card>

      {/* Field Mapping */}
      <Card>
        <CardHeader>
          <CardTitle>Field Mapping</CardTitle>
          <CardDescription>Map DuxFit fields to EVO fields</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-border">
                <tr>
                  <th className="text-left p-2 font-medium">DuxFit Field</th>
                  <th className="text-center p-2">→</th>
                  <th className="text-left p-2 font-medium">EVO Field</th>
                  <th className="text-left p-2 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {[
                  { duxfit: "Name", evo: "member_name", status: "mapped" },
                  { duxfit: "CPF", evo: "cpf_number", status: "mapped" },
                  { duxfit: "Email", evo: "email_address", status: "mapped" },
                  { duxfit: "Phone", evo: "phone_number", status: "mapped" },
                  { duxfit: "Date of Birth", evo: "birth_date", status: "mapped" },
                  { duxfit: "Address", evo: "address_line_1", status: "mapped" },
                  { duxfit: "ZIP Code", evo: "postal_code", status: "mapped" },
                ].map((mapping, index) => (
                  <tr key={index}>
                    <td className="p-2">{mapping.duxfit}</td>
                    <td className="p-2 text-center text-muted-foreground">→</td>
                    <td className="p-2 font-mono text-xs">{mapping.evo}</td>
                    <td className="p-2">
                      <Badge className="bg-green-500 text-white">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Mapped
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="outline" className="w-full mt-4">Reset to Default Mapping</Button>
        </CardContent>
      </Card>

      {/* Other Integrations */}
      <Card>
        <CardHeader>
          <CardTitle>Available Integrations</CardTitle>
          <CardDescription>Connect with other services</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Google Analytics</h4>
            <p className="text-sm text-muted-foreground mb-3">Track website and CRM analytics</p>
            <Button variant="outline" size="sm" className="w-full">Connect</Button>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Facebook Pixel</h4>
            <p className="text-sm text-muted-foreground mb-3">Track lead conversions from ads</p>
            <Button variant="outline" size="sm" className="w-full">Connect</Button>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Zapier</h4>
            <p className="text-sm text-muted-foreground mb-3">Connect to 5,000+ apps</p>
            <Button variant="outline" size="sm" className="w-full">Connect</Button>
          </div>

          <div className="border border-border rounded-lg p-4">
            <h4 className="font-medium mb-2">Webhooks</h4>
            <p className="text-sm text-muted-foreground mb-3">Send data to custom endpoints</p>
            <Button variant="outline" size="sm" className="w-full">Configure</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntegrationsTab;
