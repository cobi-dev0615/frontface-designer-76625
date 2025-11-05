import { CheckCircle, MessageSquare, Copy, Loader2, Info, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";
import { useGymStore } from "@/store/gymStore";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { getGymById } from "@/services/gymService";
import * as whatsappConfigService from "@/services/whatsappConfigService";
import { useAuthStore } from "@/store/authStore";

const WhatsAppTab = () => {
  const { t } = useTranslation();
  const { selectedGym } = useGymStore();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'ADMIN';
  
  const [gymData, setGymData] = useState<any>(null);
  const [whatsappConfig, setWhatsappConfig] = useState<any>(null);
  const [metaConfig, setMetaConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isSavingMeta, setIsSavingMeta] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  useEffect(() => {
    if (selectedGym?.id) {
      loadGymData();
      loadWhatsAppConfig();
    }
  }, [selectedGym?.id]);

  const loadGymData = async () => {
    try {
      if (selectedGym?.id) {
        const gym = await getGymById(selectedGym.id);
        setGymData(gym);
      }
    } catch (error) {
      console.error('Error loading gym data:', error);
    }
  };

  const loadWhatsAppConfig = async () => {
    try {
      if (selectedGym?.id) {
        const config = await whatsappConfigService.getWhatsAppConfig(selectedGym.id);
        // Initialize with empty values if config doesn't exist, preserving structure
        setWhatsappConfig(config || {
          id: '',
          phoneNumber: '',
          phoneNumberId: '',
          accessToken: '',
          status: 'PENDING',
          createdAt: '',
          updatedAt: ''
        });
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMetaConfig = async () => {
    try {
      const config = await whatsappConfigService.getWhatsAppMetaConfig();
      setMetaConfig(config || {
        id: '',
        metaBusinessManagerId: '',
        metaAppId: '',
        metaAppSecret: '',
        webhookVerifyToken: '',
        webhookUrl: 'https://api.duxfit.com/webhooks/whatsapp',
        createdAt: '',
        updatedAt: ''
      });
    } catch (error) {
      console.error('Error loading Meta config:', error);
      // If no config exists, initialize empty
      setMetaConfig({
        id: '',
        metaBusinessManagerId: '',
        metaAppId: '',
        metaAppSecret: '',
        webhookVerifyToken: '',
        webhookUrl: 'https://api.duxfit.com/webhooks/whatsapp',
        createdAt: '',
        updatedAt: ''
      });
    }
  };

  const handleCopyWebhookUrl = () => {
    const url = metaConfig?.webhookUrl || `https://api.duxfit.com/webhooks/whatsapp/${selectedGym?.id}`;
    navigator.clipboard.writeText(url);
    toast.success(t("whatsapp.webhookUrlCopied"));
  };

  const handleSaveConfig = async () => {
    if (!selectedGym?.id) {
      toast.error("No gym selected");
      return;
    }

    // Get current values from state (these should have the latest input values)
    const currentAccessToken = whatsappConfig?.accessToken || "";
    const currentPhoneNumberId = whatsappConfig?.phoneNumberId || "";

    // Validate required fields
    if (!currentAccessToken || !currentPhoneNumberId) {
      toast.error(t("whatsapp.configurationSaveFailed") || "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const configData = {
        gymId: selectedGym.id,
        phoneNumber: gymData?.phone || selectedGym?.phone || "",
        phoneNumberId: currentPhoneNumberId,
        accessToken: currentAccessToken,
      };

      await whatsappConfigService.saveWhatsAppConfig(configData);
      toast.success(t("whatsapp.configurationSaved"));
      await loadWhatsAppConfig(); // Reload to get updated status with tokens from database
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      toast.error(t("whatsapp.configurationSaveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveMetaConfig = async () => {
    if (!isAdmin) {
      toast.error("Admin access required");
      return;
    }

    setIsSavingMeta(true);
    try {
      const metaData = {
        metaBusinessManagerId: metaConfig?.metaBusinessManagerId || undefined,
        metaAppId: metaConfig?.metaAppId || undefined,
        metaAppSecret: metaConfig?.metaAppSecret || undefined,
        webhookVerifyToken: metaConfig?.webhookVerifyToken || undefined,
        webhookUrl: metaConfig?.webhookUrl || undefined,
      };

      await whatsappConfigService.updateWhatsAppMetaConfig(metaData);
      toast.success(t("whatsapp.metaConfigSaved") || "Meta configuration saved successfully!");
      await loadMetaConfig();
    } catch (error) {
      console.error('Error saving Meta config:', error);
      toast.error(t("whatsapp.metaConfigSaveFailed") || "Failed to save Meta configuration");
    } finally {
      setIsSavingMeta(false);
    }
  };

  const handleTestConnection = async () => {
    if (!selectedGym?.id) {
      toast.error("No gym selected");
      return;
    }

    setIsTesting(true);
    try {
      const response = await whatsappConfigService.testWhatsAppConnection(selectedGym.id);
      if (response.configured) {
        toast.success(t("whatsapp.connectionTested"));
      } else {
        toast.error(t("whatsapp.connectionTestFailed"));
      }
    } catch (error) {
      console.error('Error testing WhatsApp connection:', error);
      toast.error(t("whatsapp.connectionTestFailed"));
    } finally {
      setIsTesting(false);
    }
  };

  const handleActivate = async () => {
    if (!selectedGym?.id) {
      toast.error("No gym selected");
      return;
    }

    // Validate that config exists
    if (!whatsappConfig?.accessToken || !whatsappConfig?.phoneNumberId) {
      toast.error("Please save the configuration first before activating");
      return;
    }

    setIsSaving(true);
    try {
      await whatsappConfigService.activateWhatsAppConfig(selectedGym.id);
      toast.success(t("whatsapp.configurationActivated") || "WhatsApp configuration activated successfully!");
      await loadWhatsAppConfig(); // Reload to get updated status
    } catch (error: any) {
      console.error('Error activating WhatsApp config:', error);
      const errorMessage = error.response?.data?.message || error.message || "Failed to activate WhatsApp configuration";
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading WhatsApp configuration...
        </div>
      ) : (
        <>
          {/* Connection Status and Phone Settings - Horizontal Layout */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Left Column: Connection Status */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
{t("whatsapp.whatsappConnectionStatus")}
                </CardTitle>
                <CardDescription>{t("whatsapp.manageWhatsAppBusinessApi")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
                    <CheckCircle className="h-10 w-10 text-green-500" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-2xl font-bold">{gymData?.name || selectedGym?.name || t("whatsapp.whatsappConnected")}</h3>
                    <p className="text-lg">{gymData?.phone || selectedGym?.phone || "+55 (86) 99123-4567"}</p>
                    <Badge className="bg-green-500">{whatsappConfig?.status === 'ACTIVE' ? t("whatsapp.active") : t("whatsapp.pending")}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{t("whatsapp.lastMessage", { time: "2 minutes ago" })}</p>
                  <Button variant="outline" className="text-destructive hover:text-destructive">
                    {t("whatsapp.disconnectWhatsapp")}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Right Column: Phone Number Settings */}
            <Card>
              <CardHeader>
                <CardTitle>{t("whatsapp.phoneNumberSettings")}</CardTitle>
                <CardDescription>{t("whatsapp.configureWhatsAppBusinessNumber")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone-number">{t("whatsapp.phoneNumber")}</Label>
                  <div className="flex gap-2">
                    <Input id="phone-number" defaultValue={gymData?.phone || selectedGym?.phone || "+55 (86) 99123-4567"} readOnly />
                    <Badge className="bg-green-500 flex items-center gap-1 px-3">
                      <CheckCircle className="h-3 w-3" />
{whatsappConfig?.status === 'ACTIVE' ? t("whatsapp.verified") : t("whatsapp.pending")}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="display-name">{t("whatsapp.displayName")}</Label>
                  <Input id="display-name" defaultValue={gymData?.name || selectedGym?.name || "DuxFit Piauí"} maxLength={25} />
                  <p className="text-xs text-muted-foreground">{t("whatsapp.maximum25Characters")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-description">{t("whatsapp.businessProfileDescription")}</Label>
                  <textarea
                    id="business-description"
                    className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                    defaultValue={t("whatsapp.businessDescriptionPlaceholder")}
                    maxLength={256}
                  />
                  <p className="text-xs text-muted-foreground">{t("whatsapp.maximum256Characters")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="business-category">{t("whatsapp.businessCategory")}</Label>
                  <select
                    id="business-category"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    defaultValue="gym"
                  >
                    <option value="gym">{t("whatsapp.gymFitnessCenter")}</option>
                    <option value="health">{t("whatsapp.healthWellness")}</option>
                    <option value="sports">{t("whatsapp.sportsRecreation")}</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </div>

      {/* Meta Configuration (Shared Settings - Admin Only) */}
      {isAdmin && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              {t("whatsapp.metaConfiguration") || "Meta Configuration (Shared)"}
            </CardTitle>
            <CardDescription>
              {t("whatsapp.metaConfigurationDescription") || "These settings are shared across all gyms. Configure once for your entire application."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="meta-business-manager-id">{t("whatsapp.metaBusinessManagerId") || "Meta Business Manager ID"}</Label>
                <Input
                  id="meta-business-manager-id"
                  type="text"
                  placeholder={t("whatsapp.metaBusinessManagerIdPlaceholder") || "Enter your Meta Business Manager ID"}
                  value={metaConfig?.metaBusinessManagerId || ''}
                  onChange={(e) => setMetaConfig(prev => ({ 
                    ...prev || {}, 
                    metaBusinessManagerId: e.target.value 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-app-id">{t("whatsapp.metaAppId") || "Meta App ID"}</Label>
                <Input
                  id="meta-app-id"
                  type="text"
                  placeholder={t("whatsapp.metaAppIdPlaceholder") || "Enter your Meta App ID"}
                  value={metaConfig?.metaAppId || ''}
                  onChange={(e) => setMetaConfig(prev => ({ 
                    ...prev || {}, 
                    metaAppId: e.target.value 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="meta-app-secret">{t("whatsapp.metaAppSecret") || "Meta App Secret"}</Label>
                <Input
                  id="meta-app-secret"
                  type="text"
                  placeholder={t("whatsapp.metaAppSecretPlaceholder") || "Enter your Meta App Secret"}
                  value={metaConfig?.metaAppSecret || ''}
                  onChange={(e) => setMetaConfig(prev => ({ 
                    ...prev || {}, 
                    metaAppSecret: e.target.value 
                  }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="webhook-verify-token">{t("whatsapp.webhookVerifyToken")}</Label>
                <Input
                  id="webhook-verify-token"
                  type="text"
                  placeholder={t("whatsapp.webhookVerifyTokenPlaceholder")}
                  value={metaConfig?.webhookVerifyToken || ''}
                  onChange={(e) => setMetaConfig(prev => ({ 
                    ...prev || {}, 
                    webhookVerifyToken: e.target.value 
                  }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="webhook-url">{t("whatsapp.webhookUrl")}</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  value={metaConfig?.webhookUrl || 'https://api.duxfit.com/webhooks/whatsapp'}
                  onChange={(e) => setMetaConfig(prev => ({ 
                    ...prev || {}, 
                    webhookUrl: e.target.value 
                  }))}
                  placeholder="https://api.duxfit.com/webhooks/whatsapp"
                />
                <Button variant="outline" size="sm" onClick={handleCopyWebhookUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                {t("whatsapp.webhookUrlDescription") || "This URL is used for all gyms. Use this in your Meta Business Manager webhook configuration."}
              </p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSaveMetaConfig} disabled={isSavingMeta}>
                {isSavingMeta ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                {t("common.save")} {t("whatsapp.metaConfig") || "Meta Config"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Gym-Specific WhatsApp Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t("whatsapp.gymConfiguration") || t("whatsapp.configuration")}</CardTitle>
          <CardDescription>
            {t("whatsapp.gymConfigurationDescription") || t("whatsapp.configurationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="access-token">{t("whatsapp.accessToken")}</Label>
              <Input
                id="access-token"
                type="text"
                placeholder={t("whatsapp.accessTokenPlaceholder")}
                value={whatsappConfig?.accessToken || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ 
                  ...prev || {}, 
                  accessToken: e.target.value 
                }))}
              />
              <p className="text-xs text-muted-foreground">
                {t("whatsapp.perGymAccessToken") || "Permanent access token for this specific gym"}
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number-id">{t("whatsapp.phoneNumberId")}</Label>
              <Input
                id="phone-number-id"
                placeholder={t("whatsapp.phoneNumberIdPlaceholder")}
                value={whatsappConfig?.phoneNumberId || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
              />
              <p className="text-xs text-muted-foreground">
                {t("whatsapp.perGymPhoneNumberId") || "Phone Number ID assigned by Meta for this gym"}
              </p>
            </div>
          </div>
          
          <p className="text-sm text-muted-foreground flex items-center gap-1">
            <Info className="h-4 w-4 text-yellow-500" />
            {t("whatsapp.configurationWarning")}
          </p>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={handleSaveConfig} disabled={isSaving}>
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {t("common.save")}
            </Button>
            <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
              {isTesting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              {t("whatsapp.testConnection")}
            </Button>
            {whatsappConfig?.status === 'PENDING' && (
              <Button 
                variant="default" 
                onClick={handleActivate} 
                disabled={isSaving}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
                {t("whatsapp.activate") || "Activate WhatsApp"}
              </Button>
            )}
          </div>
          
          {whatsappConfig?.status === 'PENDING' && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>{t("whatsapp.configurationPending") || "Configuration is pending activation."}</strong>{" "}
                {t("whatsapp.clickActivateToEnable") || "Click 'Activate WhatsApp' after saving your configuration and testing the connection."}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <p className="text-sm text-muted-foreground">{t("whatsapp.lastSaved")} {t("whatsapp.autoSaved")}</p>
        <Button variant="gradient">{t("whatsapp.saveConfiguration")}</Button>
      </div>
        </>
      )}
    </div>
  );
};

export default WhatsAppTab;
