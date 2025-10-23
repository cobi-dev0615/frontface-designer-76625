import { useState, useEffect } from "react";
import { Plug, RefreshCw, CheckCircle, XCircle, Settings, Eye, Edit, Trash2, Plus, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { useGymStore } from "@/store/gymStore";
import * as integrationService from "@/services/integrationService";
import * as gymService from "@/services/gymService";
import { Integration, EVOConfig, SyncHistory, Webhook, IntegrationStatistics, WebhookStatistics } from "@/services/integrationService";

const IntegrationsTab = () => {
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  // State
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [statistics, setStatistics] = useState<IntegrationStatistics | null>(null);
  const [webhookStats, setWebhookStats] = useState<WebhookStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  
  // EVO Integration State
  const [evoIntegration, setEvoIntegration] = useState<Integration | null>(null);
  const [evoConfig, setEvoConfig] = useState<EVOConfig>({
    apiUrl: "https://api.evofit.com.br",
    apiKey: "",
    branchId: "",
    autoSync: true,
    bidirectional: true,
    syncNotifications: false,
    syncInterval: 15
  });
  const [showApiKey, setShowApiKey] = useState(false);
  
  // Modals
  const [isEVOConfigOpen, setIsEVOConfigOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isFieldMappingOpen, setIsFieldMappingOpen] = useState(false);
  const [isSyncHistoryOpen, setIsSyncHistoryOpen] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  
  // Webhook State
  const [webhookForm, setWebhookForm] = useState({
    name: "",
    url: "",
    events: [] as string[],
    secret: ""
  });

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadIntegrations();
      loadWebhooks();
      loadStatistics();
    }
  }, [selectedGym]);

  const loadGyms = async () => {
    try {
      const response = await gymService.getAllGyms();
      setGyms(response.gyms || []);
      if (response.gyms && response.gyms.length > 0 && !selectedGym) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error: any) {
      console.error("Error loading gyms:", error);
      toast.error("Failed to load gyms");
    }
  };

  const loadIntegrations = async () => {
    if (!selectedGym) return;
    
    try {
      setIsLoading(true);
      const response = await integrationService.getGymIntegrations(selectedGym.id);
      setIntegrations(response.data);
      
      // Find EVO integration
      const evo = response.data.find(integration => integration.type === 'EVO');
      setEvoIntegration(evo || null);
      
      if (evo) {
        setEvoConfig(evo.config as EVOConfig);
      }
    } catch (error: any) {
      console.error("Error loading integrations:", error);
      toast.error("Failed to load integrations");
    } finally {
      setIsLoading(false);
    }
  };

  const loadWebhooks = async () => {
    if (!selectedGym) return;
    
    try {
      const response = await integrationService.getGymWebhooks(selectedGym.id);
      setWebhooks(response.data);
    } catch (error: any) {
      console.error("Error loading webhooks:", error);
      toast.error("Failed to load webhooks");
    }
  };

  const loadStatistics = async () => {
    if (!selectedGym) return;
    
    try {
      const [integrationStats, webhookStats] = await Promise.all([
        integrationService.getIntegrationStatistics(selectedGym.id),
        integrationService.getWebhookStatistics(selectedGym.id)
      ]);
      setStatistics(integrationStats.data);
      setWebhookStats(webhookStats.data);
    } catch (error: any) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleEVOConfigSave = async () => {
    if (!selectedGym) return;
    
    try {
      if (evoIntegration) {
        // Update existing integration
        await integrationService.updateIntegration(evoIntegration.id, {
          config: evoConfig
        });
        toast.success("EVO configuration updated successfully");
      } else {
        // Create new integration
        await integrationService.createOrUpdateEVOIntegration(selectedGym.id, evoConfig);
        toast.success("EVO integration configured successfully");
      }
      
      loadIntegrations();
      setIsEVOConfigOpen(false);
    } catch (error: any) {
      console.error("Error saving EVO config:", error);
      toast.error("Failed to save EVO configuration");
    }
  };

  const handleTestConnection = async () => {
    if (!evoIntegration) return;
    
    try {
      const response = await integrationService.testIntegrationConnection(evoIntegration.id);
      if (response.data.connected) {
        toast.success("Connection test successful!");
      } else {
        toast.error("Connection test failed. Please check your credentials.");
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      toast.error("Failed to test connection");
    }
  };

  const handleSyncNow = async () => {
    if (!selectedGym || !evoIntegration) return;
    
    try {
      setIsSyncing(true);
      const response = await integrationService.syncFromEVO(selectedGym.id, evoIntegration.id);
      
      if (response.success) {
        toast.success(`Sync completed: ${response.data.recordsSynced} records synced`);
        loadIntegrations();
      } else {
        toast.error("Sync failed. Please try again.");
      }
    } catch (error: any) {
      console.error("Error syncing:", error);
      toast.error("Failed to sync data");
    } finally {
      setIsSyncing(false);
    }
  };

  const handleViewSyncHistory = async () => {
    if (!evoIntegration) return;
    
    try {
      const response = await integrationService.getEVOSyncHistory(evoIntegration.id);
      setSyncHistory(response.data);
      setIsSyncHistoryOpen(true);
    } catch (error: any) {
      console.error("Error loading sync history:", error);
      toast.error("Failed to load sync history");
    }
  };

  const handleCreateWebhook = async () => {
    if (!selectedGym) return;
    
    try {
      await integrationService.createWebhook({
        gymId: selectedGym.id,
        ...webhookForm
      });
      toast.success("Webhook created successfully");
      loadWebhooks();
      setIsWebhookModalOpen(false);
      setWebhookForm({ name: "", url: "", events: [], secret: "" });
    } catch (error: any) {
      console.error("Error creating webhook:", error);
      toast.error("Failed to create webhook");
    }
  };

  const handleTestWebhookUrl = async () => {
    try {
      const response = await integrationService.testWebhookUrl(webhookForm.url, webhookForm.secret);
      if (response.data.valid) {
        toast.success("Webhook URL is valid!");
      } else {
        toast.error("Webhook URL is invalid");
      }
    } catch (error: any) {
      console.error("Error testing webhook URL:", error);
      toast.error("Failed to test webhook URL");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SUCCESS':
        return 'bg-green-500';
      case 'FAILED':
        return 'bg-red-500';
      case 'RUNNING':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading integrations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Gym Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <Label className="text-sm font-medium">Gym:</Label>
            <Select value={selectedGym?.id || ""} onValueChange={(gymId) => {
              const gym = gyms.find(g => g.id === gymId);
              if (gym) setSelectedGym(gym);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select gym" />
              </SelectTrigger>
              <SelectContent>
                {gyms.map((gym) => (
                  <SelectItem key={gym.id} value={gym.id}>
                    {gym.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Integrations</CardTitle>
              <Plug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalIntegrations}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.activeIntegrations} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Webhooks</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.totalWebhooks || 0}</div>
              <p className="text-xs text-muted-foreground">
                {webhookStats?.activeWebhooks || 0} active
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.successRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
                webhook success rate
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Recent Activity</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.recentLogs || 0}</div>
              <p className="text-xs text-muted-foreground">
                last 24 hours
              </p>
            </CardContent>
          </Card>
        </div>
      )}

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
            <div className="flex items-center gap-2">
              {evoIntegration ? (
                <Badge className="bg-green-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Connected
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
                  Not Connected
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEVOConfigOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
                {evoIntegration ? 'Configure' : 'Connect'}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {evoIntegration && (
            <>
              {/* Connection Details */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="evo-url">EVO API URL</Label>
                    <Input
                      id="evo-url"
                      value={evoConfig.apiUrl}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evo-branch">Branch ID</Label>
                    <Input
                      id="evo-branch"
                      value={evoConfig.branchId}
                      readOnly
                    />
                  </div>
                </div>
              </div>

              {/* Auto-Sync Settings */}
              <div className="space-y-4">
                <h4 className="font-medium">Auto-Sync Settings</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">Enable Auto-Sync</Label>
                    <p className="text-sm text-muted-foreground">Automatically sync leads every {evoConfig.syncInterval} minutes</p>
                  </div>
                  <Switch 
                    id="auto-sync" 
                    checked={evoConfig.autoSync}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bidirectional">Bidirectional Sync</Label>
                    <p className="text-sm text-muted-foreground">Sync changes both ways between systems</p>
                  </div>
                  <Switch 
                    id="bidirectional" 
                    checked={evoConfig.bidirectional}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-sync">Sync Notifications</Label>
                    <p className="text-sm text-muted-foreground">Get notified when sync completes</p>
                  </div>
                  <Switch 
                    id="notify-sync" 
                    checked={evoConfig.syncNotifications}
                    disabled
                  />
                </div>
              </div>

              {/* Last Sync Status */}
              {evoIntegration.lastSyncAt && (
                <div className="border border-border rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Last Sync Status</h4>
                    <Badge className="bg-green-500">Success</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Last Sync</p>
                      <p className="font-medium">{formatTime(evoIntegration.lastSyncAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <p className="font-medium">Connected</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1 gap-2"
                  onClick={handleSyncNow}
                  disabled={isSyncing}
                >
                  {isSyncing ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="h-4 w-4" />
                  )}
                  {isSyncing ? 'Syncing...' : 'Sync Now'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleTestConnection}
                >
                  Test Connection
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleViewSyncHistory}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Webhooks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Webhooks</CardTitle>
              <CardDescription>Send data to custom endpoints</CardDescription>
            </div>
            <Button onClick={() => setIsWebhookModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Webhook
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No webhooks configured</h3>
              <p className="text-muted-foreground mb-4">
                Create webhooks to send data to external systems.
              </p>
              <Button onClick={() => setIsWebhookModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Create Webhook
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {webhooks.map((webhook) => (
                <div key={webhook.id} className="flex items-center justify-between border border-border rounded-lg p-4">
                  <div>
                    <h4 className="font-medium">{webhook.name}</h4>
                    <p className="text-sm text-muted-foreground">{webhook.url}</p>
                    <p className="text-xs text-muted-foreground">
                      {webhook.events.length} events • {webhook.isActive ? 'Active' : 'Inactive'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
                      {webhook.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>


      {/* EVO Configuration Modal */}
      <Dialog open={isEVOConfigOpen} onOpenChange={setIsEVOConfigOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>EVO Integration Configuration</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evo-api-url">EVO API URL</Label>
              <Input
                id="evo-api-url"
                value={evoConfig.apiUrl}
                onChange={(e) => setEvoConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                placeholder="https://api.evofit.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-api-key">API Key</Label>
              <div className="flex gap-2">
                <Input
                  id="evo-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={evoConfig.apiKey}
                  onChange={(e) => setEvoConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder="Enter your EVO API key"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? "Hide" : "Show"}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-branch-id">Branch ID</Label>
              <Input
                id="evo-branch-id"
                value={evoConfig.branchId}
                onChange={(e) => setEvoConfig(prev => ({ ...prev, branchId: e.target.value }))}
                placeholder="DUXFIT-PI-001"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Sync Settings</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync-config">Enable Auto-Sync</Label>
                  <p className="text-sm text-muted-foreground">Automatically sync leads</p>
                </div>
                <Switch 
                  id="auto-sync-config"
                  checked={evoConfig.autoSync}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bidirectional-config">Bidirectional Sync</Label>
                  <p className="text-sm text-muted-foreground">Sync changes both ways</p>
                </div>
                <Switch 
                  id="bidirectional-config"
                  checked={evoConfig.bidirectional}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, bidirectional: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-sync-config">Sync Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when sync completes</p>
                </div>
                <Switch 
                  id="notify-sync-config"
                  checked={evoConfig.syncNotifications}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, syncNotifications: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-interval">Sync Interval (minutes)</Label>
                <Input
                  id="sync-interval"
                  type="number"
                  min="1"
                  max="1440"
                  value={evoConfig.syncInterval}
                  onChange={(e) => setEvoConfig(prev => ({ ...prev, syncInterval: parseInt(e.target.value) || 15 }))}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEVOConfigOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEVOConfigSave}>
              Save Configuration
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhook Creation Modal */}
      <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Webhook</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">Name</Label>
              <Input
                id="webhook-name"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder="My Webhook"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">URL</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={webhookForm.url}
                  onChange={(e) => setWebhookForm(prev => ({ ...prev, url: e.target.value }))}
                  placeholder="https://example.com/webhook"
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleTestWebhookUrl}
                >
                  Test
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-events">Events</Label>
              <Select
                value={webhookForm.events[0] || ""}
                onValueChange={(value) => setWebhookForm(prev => ({ ...prev, events: [value] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select events" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead.created">Lead Created</SelectItem>
                  <SelectItem value="lead.updated">Lead Updated</SelectItem>
                  <SelectItem value="lead.status_changed">Lead Status Changed</SelectItem>
                  <SelectItem value="message.sent">Message Sent</SelectItem>
                  <SelectItem value="followup.created">Follow-up Created</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">Secret (optional)</Label>
              <Input
                id="webhook-secret"
                type="password"
                value={webhookForm.secret}
                onChange={(e) => setWebhookForm(prev => ({ ...prev, secret: e.target.value }))}
                placeholder="Webhook secret for signature verification"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWebhookModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateWebhook}>
              Create Webhook
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync History Modal */}
      <Dialog open={isSyncHistoryOpen} onOpenChange={setIsSyncHistoryOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>Sync History</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {syncHistory.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No sync history available</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Time</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Records</TableHead>
                    <TableHead>Duration</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {syncHistory.map((sync) => (
                    <TableRow key={sync.id}>
                      <TableCell>{formatTime(sync.startedAt)}</TableCell>
                      <TableCell className="capitalize">{sync.type.toLowerCase()}</TableCell>
                      <TableCell>
                        <Badge className={getStatusColor(sync.status)}>
                          {sync.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{sync.recordsSynced}</TableCell>
                      <TableCell>{sync.duration}ms</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IntegrationsTab;