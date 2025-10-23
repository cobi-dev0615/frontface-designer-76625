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
import { useTranslation } from "@/hooks/useTranslation";

const IntegrationsTab = () => {
  const { t } = useTranslation();
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
      toast.error(t("integrations.failedToLoadGyms"));
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
      toast.error(t("integrations.failedToLoadIntegrations"));
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
      toast.error(t("integrations.failedToLoadWebhooks"));
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
        toast.success(t("integrations.evoConfigurationUpdated"));
      } else {
        // Create new integration
        await integrationService.createOrUpdateEVOIntegration(selectedGym.id, evoConfig);
        toast.success(t("integrations.evoIntegrationConfigured"));
      }
      
      loadIntegrations();
      setIsEVOConfigOpen(false);
    } catch (error: any) {
      console.error("Error saving EVO config:", error);
      toast.error(t("integrations.failedToSaveEvoConfiguration"));
    }
  };

  const handleTestConnection = async () => {
    if (!evoIntegration) return;
    
    try {
      const response = await integrationService.testIntegrationConnection(evoIntegration.id);
      if (response.data.connected) {
        toast.success(t("integrations.connectionTestSuccessful"));
      } else {
        toast.error(t("integrations.connectionTestFailed"));
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      toast.error(t("integrations.failedToTestConnection"));
    }
  };

  const handleSyncNow = async () => {
    if (!selectedGym || !evoIntegration) return;
    
    try {
      setIsSyncing(true);
      const response = await integrationService.syncFromEVO(selectedGym.id, evoIntegration.id);
      
      if (response.success) {
        toast.success(t("integrations.syncCompleted", { count: response.data.recordsSynced }));
        loadIntegrations();
      } else {
        toast.error(t("integrations.syncFailed"));
      }
    } catch (error: any) {
      console.error("Error syncing:", error);
      toast.error(t("integrations.failedToSyncData"));
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
      toast.error(t("integrations.failedToLoadSyncHistory"));
    }
  };

  const handleCreateWebhook = async () => {
    if (!selectedGym) return;
    
    try {
      await integrationService.createWebhook({
        gymId: selectedGym.id,
        ...webhookForm
      });
      toast.success(t("integrations.webhookCreatedSuccessfully"));
      loadWebhooks();
      setIsWebhookModalOpen(false);
      setWebhookForm({ name: "", url: "", events: [], secret: "" });
    } catch (error: any) {
      console.error("Error creating webhook:", error);
      toast.error(t("integrations.failedToCreateWebhook"));
    }
  };

  const handleTestWebhookUrl = async () => {
    try {
      const response = await integrationService.testWebhookUrl(webhookForm.url, webhookForm.secret);
      if (response.data.valid) {
        toast.success(t("integrations.webhookUrlIsValid"));
      } else {
        toast.error(t("integrations.webhookUrlIsInvalid"));
      }
    } catch (error: any) {
      console.error("Error testing webhook URL:", error);
      toast.error(t("integrations.failedToTestWebhookUrl"));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t("integrations.justNow");
    if (diffInMinutes < 60) return t("integrations.minutesAgo", { minutes: diffInMinutes });
    if (diffInMinutes < 1440) return t("integrations.hoursAgo", { hours: Math.floor(diffInMinutes / 60) });
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
          <p className="text-muted-foreground">{t("integrations.loadingIntegrations")}</p>
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
            <Label className="text-sm font-medium">{t("integrations.gym")}</Label>
            <Select value={selectedGym?.id || ""} onValueChange={(gymId) => {
              const gym = gyms.find(g => g.id === gymId);
              if (gym) setSelectedGym(gym);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={t("integrations.selectGym")} />
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
              <CardTitle className="text-sm font-medium">{t("integrations.totalIntegrations")}</CardTitle>
              <Plug className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalIntegrations}</div>
              <p className="text-xs text-muted-foreground">
{statistics.activeIntegrations} {t("integrations.active")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("integrations.webhooks")}</CardTitle>
              <Settings className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.totalWebhooks || 0}</div>
              <p className="text-xs text-muted-foreground">
{webhookStats?.activeWebhooks || 0} {t("integrations.active")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("integrations.successRate")}</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.successRate || 0}%</div>
              <p className="text-xs text-muted-foreground">
{t("integrations.webhookSuccessRate")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("integrations.recentActivity")}</CardTitle>
              <RefreshCw className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{webhookStats?.recentLogs || 0}</div>
              <p className="text-xs text-muted-foreground">
{t("integrations.last24Hours")}
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
{t("integrations.evoGymManagementSystem")}
              </CardTitle>
              <CardDescription>{t("integrations.syncLeadsAndMembers")}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              {evoIntegration ? (
                <Badge className="bg-green-500 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
{t("integrations.connected")}
                </Badge>
              ) : (
                <Badge variant="secondary" className="flex items-center gap-1">
                  <XCircle className="h-3 w-3" />
{t("integrations.notConnected")}
                </Badge>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEVOConfigOpen(true)}
              >
                <Settings className="h-4 w-4 mr-2" />
{evoIntegration ? t("integrations.configure") : t("integrations.connect")}
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
                    <Label htmlFor="evo-url">{t("integrations.evoApiUrl")}</Label>
                    <Input
                      id="evo-url"
                      value={evoConfig.apiUrl}
                      readOnly
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="evo-branch">{t("integrations.branchId")}</Label>
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
                <h4 className="font-medium">{t("integrations.autoSyncSettings")}</h4>
                
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="auto-sync">{t("integrations.enableAutoSync")}</Label>
                    <p className="text-sm text-muted-foreground">{t("integrations.automaticallySyncLeads", { minutes: evoConfig.syncInterval })}</p>
                  </div>
                  <Switch 
                    id="auto-sync" 
                    checked={evoConfig.autoSync}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="bidirectional">{t("integrations.bidirectionalSync")}</Label>
                    <p className="text-sm text-muted-foreground">{t("integrations.syncChangesBothWays")}</p>
                  </div>
                  <Switch 
                    id="bidirectional" 
                    checked={evoConfig.bidirectional}
                    disabled
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="notify-sync">{t("integrations.syncNotifications")}</Label>
                    <p className="text-sm text-muted-foreground">{t("integrations.getNotifiedWhenSync")}</p>
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
                    <h4 className="font-medium">{t("integrations.lastSyncStatus")}</h4>
                    <Badge className="bg-green-500">{t("integrations.success")}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t("integrations.lastSync")}</p>
                      <p className="font-medium">{formatTime(evoIntegration.lastSyncAt)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t("integrations.status")}</p>
                      <p className="font-medium">{t("integrations.connected")}</p>
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
{isSyncing ? t("integrations.syncing") : t("integrations.syncNow")}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleTestConnection}
                >
{t("integrations.testConnection")}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleViewSyncHistory}
                >
                  <Eye className="h-4 w-4 mr-2" />
{t("integrations.history")}
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
              <CardTitle>{t("integrations.webhooks")}</CardTitle>
              <CardDescription>{t("integrations.sendDataToCustomEndpoints")}</CardDescription>
            </div>
            <Button onClick={() => setIsWebhookModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
{t("integrations.addWebhook")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {webhooks.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("integrations.noWebhooksConfigured")}</h3>
              <p className="text-muted-foreground mb-4">
                {t("integrations.createWebhooksToSendData")}
              </p>
              <Button onClick={() => setIsWebhookModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
{t("integrations.createWebhook")}
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
{webhook.events.length} {t("integrations.events")} • {webhook.isActive ? t("integrations.active") : t("integrations.inactive")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={webhook.isActive ? "default" : "secondary"}>
{webhook.isActive ? t("integrations.active") : t("integrations.inactive")}
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
            <DialogTitle>{t("integrations.evoIntegrationConfiguration")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evo-api-url">{t("integrations.evoApiUrl")}</Label>
              <Input
                id="evo-api-url"
                value={evoConfig.apiUrl}
                onChange={(e) => setEvoConfig(prev => ({ ...prev, apiUrl: e.target.value }))}
                placeholder="https://api.evofit.com.br"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-api-key">{t("integrations.apiKey")}</Label>
              <div className="flex gap-2">
                <Input
                  id="evo-api-key"
                  type={showApiKey ? "text" : "password"}
                  value={evoConfig.apiKey}
                  onChange={(e) => setEvoConfig(prev => ({ ...prev, apiKey: e.target.value }))}
                  placeholder={t("integrations.enterYourEvoApiKey")}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
{showApiKey ? t("integrations.hide") : t("integrations.show")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="evo-branch-id">{t("integrations.branchId")}</Label>
              <Input
                id="evo-branch-id"
                value={evoConfig.branchId}
                onChange={(e) => setEvoConfig(prev => ({ ...prev, branchId: e.target.value }))}
                placeholder="DUXFIT-PI-001"
              />
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">{t("integrations.syncSettings")}</h4>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-sync-config">{t("integrations.enableAutoSync")}</Label>
                  <p className="text-sm text-muted-foreground">{t("integrations.automaticallySyncLeads")}</p>
                </div>
                <Switch 
                  id="auto-sync-config"
                  checked={evoConfig.autoSync}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, autoSync: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="bidirectional-config">{t("integrations.bidirectionalSync")}</Label>
                  <p className="text-sm text-muted-foreground">{t("integrations.syncChangesBothWays")}</p>
                </div>
                <Switch 
                  id="bidirectional-config"
                  checked={evoConfig.bidirectional}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, bidirectional: checked }))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="notify-sync-config">{t("integrations.syncNotifications")}</Label>
                  <p className="text-sm text-muted-foreground">{t("integrations.getNotifiedWhenSync")}</p>
                </div>
                <Switch 
                  id="notify-sync-config"
                  checked={evoConfig.syncNotifications}
                  onCheckedChange={(checked) => setEvoConfig(prev => ({ ...prev, syncNotifications: checked }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sync-interval">{t("integrations.syncIntervalMinutes")}</Label>
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
              {t("integrations.cancel")}
            </Button>
            <Button onClick={handleEVOConfigSave}>
              {t("integrations.saveConfiguration")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Webhook Creation Modal */}
      <Dialog open={isWebhookModalOpen} onOpenChange={setIsWebhookModalOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("integrations.createWebhook")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-name">{t("integrations.name")}</Label>
              <Input
                id="webhook-name"
                value={webhookForm.name}
                onChange={(e) => setWebhookForm(prev => ({ ...prev, name: e.target.value }))}
                placeholder={t("integrations.myWebhook")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-url">{t("integrations.url")}</Label>
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
{t("integrations.test")}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-events">{t("integrations.events")}</Label>
              <Select
                value={webhookForm.events[0] || ""}
                onValueChange={(value) => setWebhookForm(prev => ({ ...prev, events: [value] }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("integrations.selectEvents")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lead.created">{t("integrations.leadCreated")}</SelectItem>
                  <SelectItem value="lead.updated">{t("integrations.leadUpdated")}</SelectItem>
                  <SelectItem value="lead.status_changed">{t("integrations.leadStatusChanged")}</SelectItem>
                  <SelectItem value="message.sent">{t("integrations.messageSent")}</SelectItem>
                  <SelectItem value="followup.created">{t("integrations.followupCreated")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook-secret">{t("integrations.secretOptional")}</Label>
              <Input
                id="webhook-secret"
                type="password"
                value={webhookForm.secret}
                onChange={(e) => setWebhookForm(prev => ({ ...prev, secret: e.target.value }))}
                placeholder={t("integrations.webhookSecretForSignature")}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWebhookModalOpen(false)}>
              {t("integrations.cancel")}
            </Button>
            <Button onClick={handleCreateWebhook}>
              {t("integrations.createWebhook")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sync History Modal */}
      <Dialog open={isSyncHistoryOpen} onOpenChange={setIsSyncHistoryOpen}>
        <DialogContent className="sm:max-w-[700px]">
          <DialogHeader>
            <DialogTitle>{t("integrations.syncHistory")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {syncHistory.length === 0 ? (
              <div className="text-center py-8">
                <RefreshCw className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("integrations.noSyncHistoryAvailable")}</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("integrations.time")}</TableHead>
                    <TableHead>{t("integrations.type")}</TableHead>
                    <TableHead>{t("integrations.status")}</TableHead>
                    <TableHead>{t("integrations.records")}</TableHead>
                    <TableHead>{t("integrations.duration")}</TableHead>
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