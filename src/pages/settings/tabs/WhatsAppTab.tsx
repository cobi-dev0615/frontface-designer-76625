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

const WhatsAppTab = () => {
  const { t } = useTranslation();
  const { selectedGym } = useGymStore();
  const [gymData, setGymData] = useState<any>(null);
  const [whatsappConfig, setWhatsappConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://api.duxfit.com/webhooks/whatsapp");

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
          businessAccountId: '',
          status: 'PENDING',
          createdAt: '',
          updatedAt: ''
        });
        // Note: accessToken and webhookVerifyToken are not returned from the API for security
        // They need to be entered fresh each time or stored separately in state
        if (config) {
          setWebhookUrl(`https://api.duxfit.com/webhooks/whatsapp/${selectedGym.id}`);
        }
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    navigator.clipboard.writeText(webhookUrl);
    toast.success(t("whatsapp.webhookUrlCopied"));
  };

  const handleSaveConfig = async () => {
    if (!selectedGym?.id) {
      toast.error("No gym selected");
      return;
    }

    // Get current values from state (these should have the latest input values)
    const currentAccessToken = whatsappConfig?.accessToken || "";
    const currentWebhookVerifyToken = whatsappConfig?.webhookVerifyToken || "";
    const currentPhoneNumberId = whatsappConfig?.phoneNumberId || "";
    const currentBusinessAccountId = whatsappConfig?.businessAccountId || "";

    // Validate required fields
    if (!currentAccessToken || !currentPhoneNumberId || !currentBusinessAccountId) {
      toast.error(t("whatsapp.configurationSaveFailed") || "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const configData = {
        gymId: selectedGym.id,
        phoneNumber: gymData?.phone || selectedGym?.phone || "",
        phoneNumberId: currentPhoneNumberId,
        businessAccountId: currentBusinessAccountId,
        accessToken: currentAccessToken,
        webhookVerifyToken: currentWebhookVerifyToken || undefined,
      };

      await whatsappConfigService.saveWhatsAppConfig(configData);
      toast.success(t("whatsapp.configurationSaved"));
      
      // Preserve the tokens in state since API doesn't return them for security
      const savedTokens = {
        accessToken: currentAccessToken,
        webhookVerifyToken: currentWebhookVerifyToken
      };
      
      await loadWhatsAppConfig(); // Reload to get updated status
      
      // Restore the tokens after reload
      setWhatsappConfig(prev => ({
        ...prev || {},
        ...savedTokens
      }));
    } catch (error) {
      console.error('Error saving WhatsApp config:', error);
      toast.error(t("whatsapp.configurationSaveFailed"));
    } finally {
      setIsSaving(false);
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

      {/* WhatsApp Configuration */}
      <Card>
        <CardHeader>
          <CardTitle>{t("whatsapp.configuration")}</CardTitle>
          <CardDescription>{t("whatsapp.configurationDescription")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="access-token">{t("whatsapp.accessToken")}</Label>
              <Input
                id="access-token"
                type="password"
                placeholder={t("whatsapp.accessTokenPlaceholder")}
                value={whatsappConfig?.accessToken || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ 
                  ...prev || {}, 
                  accessToken: e.target.value 
                }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone-number-id">{t("whatsapp.phoneNumberId")}</Label>
              <Input
                id="phone-number-id"
                placeholder={t("whatsapp.phoneNumberIdPlaceholder")}
                value={whatsappConfig?.phoneNumberId || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, phoneNumberId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="business-account-id">{t("whatsapp.businessAccountId")}</Label>
              <Input
                id="business-account-id"
                placeholder={t("whatsapp.businessAccountIdPlaceholder")}
                value={whatsappConfig?.businessAccountId || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ ...prev, businessAccountId: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhook-verify-token">{t("whatsapp.webhookVerifyToken")}</Label>
              <Input
                id="webhook-verify-token"
                type="password"
                placeholder={t("whatsapp.webhookVerifyTokenPlaceholder")}
                value={whatsappConfig?.webhookVerifyToken || ''}
                onChange={(e) => setWhatsappConfig(prev => ({ 
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
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://api.duxfit.com/webhooks/whatsapp"
              />
              <Button variant="outline" size="sm" onClick={handleCopyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
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
