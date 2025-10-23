import { useState, useEffect } from "react";
import { 
  CheckCircle, 
  Link2, 
  RefreshCw, 
  AlertCircle, 
  Settings, 
  Eye, 
  EyeOff, 
  Save, 
  Clock, 
  Users, 
  CreditCard, 
  Activity, 
  DollarSign,
  MapPin,
  Calendar,
  Database,
  Zap
} from "lucide-react";
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
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useGymStore } from "@/store/gymStore";
import * as integrationService from "@/services/integrationService";
import * as gymService from "@/services/gymService";
import { Integration, EVOConfig, SyncHistory } from "@/services/integrationService";
import { useTranslation } from "@/hooks/useTranslation";

const EvoIntegrationTab = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  // State
  const [evoIntegration, setEvoIntegration] = useState<Integration | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  
  // Configuration State
  const [evoConfig, setEvoConfig] = useState<EVOConfig>({
    apiUrl: "https://api.evofit.com.br",
    apiKey: "",
    branchId: "",
    autoSync: true,
    bidirectional: true,
    syncNotifications: false,
    syncInterval: 15
  });
  
  // Sync Settings State
  const [syncSettings, setSyncSettings] = useState({
    syncMembers: true,
    syncPlans: true,
    syncCheckins: true,
    syncPayments: true,
    autoSync: true,
    syncInterval: 15
  });
  
  // UI State
  const [showApiKey, setShowApiKey] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isFieldMappingOpen, setIsFieldMappingOpen] = useState(false);
  const [isSyncHistoryOpen, setIsSyncHistoryOpen] = useState(false);
  const [syncHistory, setSyncHistory] = useState<SyncHistory[]>([]);
  
  // Field Mapping State
  const [fieldMappings, setFieldMappings] = useState([
    { evoField: "cliente_nome", duxfitField: "lead_name", isActive: true },
    { evoField: "cliente_telefone", duxfitField: "phone_number", isActive: true },
    { evoField: "cliente_email", duxfitField: "email", isActive: true },
    { evoField: "plano_nome", duxfitField: "membership_plan", isActive: true },
    { evoField: "data_nascimento", duxfitField: "birth_date", isActive: true },
    { evoField: "endereco", duxfitField: "address", isActive: true }
  ]);

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadEVOIntegration();
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
      toast.error(t("gyms.loadFailed"));
    }
  };

  const loadEVOIntegration = async () => {
    if (!selectedGym) return;
    
    try {
      setIsLoading(true);
      const response = await integrationService.getGymIntegrations(selectedGym.id);
      const evo = response.data.find(integration => integration.type === 'EVO');
      
      if (evo) {
        setEvoIntegration(evo);
        setEvoConfig(evo.config as EVOConfig);
        setSyncSettings({
          syncMembers: true,
          syncPlans: true,
          syncCheckins: true,
          syncPayments: true,
          autoSync: evo.config.autoSync,
          syncInterval: evo.config.syncInterval
        });
      }
    } catch (error: any) {
      console.error("Error loading EVO integration:", error);
      toast.error(t("integrations.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfiguration = async () => {
    if (!selectedGym) return;
    
    try {
      setIsSaving(true);
      
      if (evoIntegration) {
        // Update existing integration
        await integrationService.updateIntegration(evoIntegration.id, {
          config: { ...evoConfig, ...syncSettings }
        });
        toast.success(t("integrations.configurationUpdated"));
      } else {
        // Create new integration
        await integrationService.createOrUpdateEVOIntegration(selectedGym.id, {
          ...evoConfig,
          ...syncSettings
        });
        toast.success(t("integrations.integrationConfigured"));
      }
      
      loadEVOIntegration();
      setIsConfigModalOpen(false);
    } catch (error: any) {
      console.error("Error saving EVO config:", error);
      toast.error(t("integrations.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleTestConnection = async () => {
    if (!evoIntegration) return;
    
    try {
      setIsTestingConnection(true);
      const response = await integrationService.testIntegrationConnection(evoIntegration.id);
      
      if (response.data.connected) {
        toast.success(t("integrations.connectionTestSuccessful"));
      } else {
        toast.error(t("integrations.connectionTestFailed"));
      }
    } catch (error: any) {
      console.error("Error testing connection:", error);
      toast.error(t("integrations.testConnectionFailed"));
    } finally {
      setIsTestingConnection(false);
    }
  };

  const handleSyncNow = async () => {
    if (!selectedGym || !evoIntegration) return;
    
    try {
      setIsSyncing(true);
      const response = await integrationService.syncFromEVO(selectedGym.id, evoIntegration.id);
      
      if (response.success) {
        toast.success(t("integrations.syncedRecords", { count: response.data.recordsSynced }));
        loadEVOIntegration();
      } else {
        toast.error(t("integrations.syncFailed"));
      }
    } catch (error: any) {
      console.error("Error syncing:", error);
      toast.error(t("integrations.syncFailed"));
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
      toast.error(t("integrations.loadFailed"));
    }
  };

  const handleDisconnect = async () => {
    if (!evoIntegration) return;
    
    try {
      await integrationService.deleteIntegration(evoIntegration.id);
      toast.success(t("integrations.disconnected"));
      setEvoIntegration(null);
      loadEVOIntegration();
    } catch (error: any) {
      console.error("Error disconnecting EVO:", error);
      toast.error(t("integrations.disconnectFailed"));
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return t("common.justNow");
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
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("integrations.loadingEvoIntegration")}</p>
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
                <SelectValue placeholder={t("settings.selectGym")} />
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

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Connection Status & API Config */}
        <div className="lg:col-span-1 space-y-6">
          {/* Connection Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Link2 className="h-5 w-5" />
{t("integrations.connectionStatus")}
              </CardTitle>
              <CardDescription>{t("integrations.evoIntegrationStatus")}</CardDescription>
            </CardHeader>
            <CardContent>
              {evoIntegration ? (
                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 mx-auto">
                    <CheckCircle className="h-8 w-8 text-green-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t("integrations.evoConnected")}</h3>
                    <p className="text-sm text-muted-foreground">{selectedGym?.name}</p>
                    <Badge className="bg-green-500">{t("integrations.activeSync")}</Badge>
                  </div>
                  {evoIntegration.lastSyncAt && (
                    <p className="text-xs text-muted-foreground">
{t("integrations.lastSync")} {formatTime(evoIntegration.lastSyncAt)}
                    </p>
                  )}
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleSyncNow}
                      disabled={isSyncing}
                    >
                      {isSyncing ? (
                        <RefreshCw className="h-4 w-4 animate-spin" />
                      ) : (
                        <RefreshCw className="h-4 w-4" />
                      )}
{isSyncing ? t("integrations.saving") : t("integrations.syncNow")}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={handleViewSyncHistory}
                    >
                      <Clock className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-500/10 mx-auto">
                    <AlertCircle className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold">{t("integrations.notConnected")}</h3>
                    <p className="text-sm text-muted-foreground">{t("integrations.connectToEVO")}</p>
                  </div>
                  <Button onClick={() => setIsConfigModalOpen(true)}>
                    <Link2 className="h-4 w-4 mr-2" />
                    {t("integrations.connectEVO")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
{t("integrations.apiConfiguration")}
              </CardTitle>
              <CardDescription>{t("integrations.evoApiCredentials")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="api-url">{t("integrations.apiUrl")}</Label>
                <Input
                  id="api-url"
                  value={evoConfig.apiUrl}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="api-key">{t("integrations.apiKey")}</Label>
                <div className="flex gap-2">
                  <Input
                    id="api-key"
                    type={showApiKey ? "text" : "password"}
                    value={evoConfig.apiKey ? "••••••••••••••••••••" : ""}
                    readOnly
                    className="bg-muted"
                  />
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setShowApiKey(!showApiKey)}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-id">{t("integrations.branchId")}</Label>
                <Input 
                  id="gym-id" 
                  value={evoConfig.branchId}
                  readOnly
                  className="bg-muted"
                />
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={handleTestConnection}
                  disabled={!evoIntegration || isTestingConnection}
                >
                  {isTestingConnection ? (
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                  ) : null}
{t("integrations.testConnection")}
                </Button>
                <Button 
                  variant="outline"
                  onClick={() => setIsConfigModalOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sync Settings & History */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sync Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5" />
{t("integrations.synchronizationSettings")}
              </CardTitle>
              <CardDescription>{t("integrations.configureSyncData")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-blue-500" />
                      <div>
                        <Label className="font-medium">{t("integrations.syncMembers")}</Label>
                        <p className="text-xs text-muted-foreground">{t("integrations.importNewMembers")}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={syncSettings.syncMembers}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncMembers: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <CreditCard className="h-5 w-5 text-green-500" />
                      <div>
                        <Label className="font-medium">{t("integrations.syncPlans")}</Label>
                        <p className="text-xs text-muted-foreground">{t("integrations.keepPlansUpdated")}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={syncSettings.syncPlans}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncPlans: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Activity className="h-5 w-5 text-purple-500" />
                      <div>
                        <Label className="font-medium">{t("integrations.syncCheckins")}</Label>
                        <p className="text-xs text-muted-foreground">{t("integrations.trackMemberCheckins")}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={syncSettings.syncCheckins}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncCheckins: checked }))}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-5 w-5 text-yellow-500" />
                      <div>
                        <Label className="font-medium">{t("integrations.syncPayments")}</Label>
                        <p className="text-xs text-muted-foreground">{t("integrations.monitorPaymentStatus")}</p>
                      </div>
                    </div>
                    <Switch 
                      checked={syncSettings.syncPayments}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, syncPayments: checked }))}
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <RefreshCw className="h-5 w-5 text-orange-500" />
                      <div>
                        <Label className="font-medium">{t("integrations.autoSync")}</Label>
                        <p className="text-xs text-muted-foreground">Sync every {syncSettings.syncInterval} minutes</p>
                      </div>
                    </div>
                    <Switch 
                      checked={syncSettings.autoSync}
                      onCheckedChange={(checked) => setSyncSettings(prev => ({ ...prev, autoSync: checked }))}
                    />
                  </div>

                  <div className="p-3 border rounded-lg">
                    <Label className="text-sm font-medium mb-2 block">{t("integrations.syncIntervalMinutes")}</Label>
                    <Select 
                      value={syncSettings.syncInterval.toString()} 
                      onValueChange={(value) => setSyncSettings(prev => ({ ...prev, syncInterval: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">{t("integrations.fiveMinutes")}</SelectItem>
                        <SelectItem value="15">{t("integrations.fifteenMinutes")}</SelectItem>
                        <SelectItem value="30">{t("integrations.thirtyMinutes")}</SelectItem>
                        <SelectItem value="60">{t("integrations.oneHour")}</SelectItem>
                        <SelectItem value="240">{t("integrations.fourHours")}</SelectItem>
                        <SelectItem value="1440">{t("integrations.twentyFourHours")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Field Mapping */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
{t("integrations.fieldMapping")}
              </CardTitle>
              <CardDescription>{t("integrations.mapFields")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {fieldMappings.slice(0, 3).map((mapping, index) => (
                  <div key={index} className="grid grid-cols-2 gap-4 p-3 border rounded-lg">
                    <div>
                      <Label className="text-xs text-muted-foreground">{t("integrations.evoField")}</Label>
                      <p className="font-medium font-mono text-sm">{mapping.evoField}</p>
                    </div>
                    <div>
                      <Label className="text-xs text-muted-foreground">{t("integrations.duxfitField")}</Label>
                      <p className="font-medium font-mono text-sm">{mapping.duxfitField}</p>
                    </div>
                  </div>
                ))}
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setIsFieldMappingOpen(true)}
                >
                  <Settings className="h-4 w-4 mr-2" />
{t("integrations.configureFieldMapping")}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent Sync Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
{t("integrations.recentSyncActivity")}
              </CardTitle>
              <CardDescription>{t("integrations.lastSyncEvents")}</CardDescription>
            </div>
            <Button variant="outline" onClick={handleViewSyncHistory}>
{t("integrations.viewAll")}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {syncHistory.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("integrations.noSyncHistory")}</p>
              </div>
            ) : (
              syncHistory.slice(0, 5).map((sync, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                  {sync.status === "SUCCESS" ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : sync.status === "FAILED" ? (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  ) : (
                    <RefreshCw className="h-5 w-5 text-blue-500" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium text-sm">
{sync.status === "SUCCESS" ? t("integrations.syncedRecords", { count: sync.recordsSynced }) : 
                       sync.status === "FAILED" ? t("integrations.syncFailedStatus") : t("integrations.syncInProgress")}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatTime(sync.startedAt)} • {sync.duration}ms
                    </p>
                  </div>
                  <Badge className={getStatusColor(sync.status)}>
                    {sync.status}
                  </Badge>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuration Modal */}
      <Dialog open={isConfigModalOpen} onOpenChange={setIsConfigModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{t("integrations.evoIntegrationConfiguration")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="evo-api-url">{t("integrations.apiUrl")}</Label>
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
                  placeholder={t("integrations.enterEvoApiKey")}
                />
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setShowApiKey(!showApiKey)}
                >
                  {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
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
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsConfigModalOpen(false)}>
              {t("integrations.cancel")}
            </Button>
            <Button onClick={handleSaveConfiguration} disabled={isSaving}>
              {isSaving ? (
                <RefreshCw className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
{isSaving ? t("integrations.saving") : t("integrations.saveConfiguration")}
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
                <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">{t("integrations.noSyncHistory")}</p>
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

      {/* Field Mapping Modal */}
      <Dialog open={isFieldMappingOpen} onOpenChange={setIsFieldMappingOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>{t("integrations.fieldMappingConfiguration")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("integrations.evoField")}</TableHead>
                  <TableHead>{t("integrations.duxfitField")}</TableHead>
                  <TableHead>{t("integrations.status")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {fieldMappings.map((mapping, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Input
                        value={mapping.evoField}
                        onChange={(e) => {
                          const newMappings = [...fieldMappings];
                          newMappings[index].evoField = e.target.value;
                          setFieldMappings(newMappings);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        value={mapping.duxfitField}
                        onChange={(e) => {
                          const newMappings = [...fieldMappings];
                          newMappings[index].duxfitField = e.target.value;
                          setFieldMappings(newMappings);
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={mapping.isActive}
                        onCheckedChange={(checked) => {
                          const newMappings = [...fieldMappings];
                          newMappings[index].isActive = checked;
                          setFieldMappings(newMappings);
                        }}
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsFieldMappingOpen(false)}>
              {t("integrations.cancel")}
            </Button>
            <Button onClick={() => setIsFieldMappingOpen(false)}>
{t("integrations.saveMapping")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <div className="flex items-center gap-4">
          <p className="text-sm text-muted-foreground">
{t("integrations.lastSaved")} {evoIntegration ? t("integrations.autoSaved") : t("integrations.notConfigured")}
          </p>
          {evoIntegration && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleDisconnect}
              className="text-destructive hover:text-destructive"
            >
{t("integrations.disconnectEvo")}
            </Button>
          )}
        </div>
        <Button 
          onClick={handleSaveConfiguration}
          disabled={isSaving}
        >
          {isSaving ? (
            <RefreshCw className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
{isSaving ? t("integrations.saving") : t("integrations.saveConfiguration")}
        </Button>
      </div>
    </div>
  );
};

export default EvoIntegrationTab;