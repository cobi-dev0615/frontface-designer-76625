import { CheckCircle, MessageSquare, Loader2, RefreshCcw } from "lucide-react";
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

const BRAZIL_COUNTRY_CODE = "+55";

const normalizePhoneNumber = (value?: string | null) => {
  if (!value) return "";
  const digitsOnly = value.replace(/[^\d]/g, "");
  if (!digitsOnly) return "";
  const withoutCountry = digitsOnly.startsWith("55") ? digitsOnly.slice(2) : digitsOnly;
  if (!withoutCountry) return "";
  return `${BRAZIL_COUNTRY_CODE}${withoutCountry}`;
};

const extractLocalPhoneNumber = (value?: string | null) => {
  if (!value) return "";
  return value.startsWith(BRAZIL_COUNTRY_CODE)
    ? value.slice(BRAZIL_COUNTRY_CODE.length)
    : value;
};

const buildDefaultConfig = (overrides: Partial<Record<string, any>> = {}) => ({
  id: "",
  phoneNumber: "",
  phoneNumberId: "",
  accessToken: "",
  status: "PENDING",
  createdAt: "",
  updatedAt: "",
  ...overrides,
});
const WhatsAppTab = () => {
  const { t } = useTranslation();
  const { selectedGym } = useGymStore();
  const [gymData, setGymData] = useState<any>(null);
  const [whatsappConfig, setWhatsappConfig] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
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
        const normalizedPhone = normalizePhoneNumber(
          (config && config.phoneNumber) || selectedGym?.phone || ""
        );

        if (config) {
          setWhatsappConfig(
            buildDefaultConfig({
              ...config,
              phoneNumber: normalizedPhone,
            })
          );
        } else {
          setWhatsappConfig(
            buildDefaultConfig({
              phoneNumber: normalizedPhone,
            })
          );
        }
      }
    } catch (error) {
      console.error('Error loading WhatsApp config:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!selectedGym?.id) {
      toast.error("No gym selected");
      return;
    }

    // Get current values from state (these should have the latest input values)
    const currentAccessToken = whatsappConfig?.accessToken || "";
    const currentPhoneNumberId = whatsappConfig?.phoneNumberId || "";
    const fallbackPhoneNumber = normalizePhoneNumber(
      gymData?.phone || selectedGym?.phone || ""
    );
    const rawPhoneNumber =
      whatsappConfig?.phoneNumber && whatsappConfig.phoneNumber.trim() !== ""
        ? whatsappConfig.phoneNumber
        : fallbackPhoneNumber;
    const currentPhoneNumber = normalizePhoneNumber(rawPhoneNumber);
    const localPhoneNumberPart = extractLocalPhoneNumber(currentPhoneNumber);

    // Validate required fields
    if (!currentAccessToken || !currentPhoneNumberId || !localPhoneNumberPart) {
      toast.error(t("whatsapp.configurationSaveFailed") || "Please fill in all required fields");
      return;
    }

    setIsSaving(true);
    try {
      const configData = {
        gymId: selectedGym.id,
        phoneNumber: currentPhoneNumber,
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
      toast.error(t("whatsapp.saveBeforeActivate") || "Please save the configuration first before activating");
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
  
  const fallbackPhoneNumber = normalizePhoneNumber(
    gymData?.phone || selectedGym?.phone || ""
  );
  const displayedPhoneNumber =
    whatsappConfig?.phoneNumber ?? fallbackPhoneNumber;
  const localPhoneNumber = extractLocalPhoneNumber(displayedPhoneNumber);

  return (
    <div className="space-y-6">
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin mr-2" />
          Loading WhatsApp configuration...
        </div>
      ) : (
        <>
          <div className="grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  {t("whatsapp.whatsappConnectionStatus")}
                </CardTitle>
                <CardDescription>{t("whatsapp.manageWhatsAppBusinessApi")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
                        <CheckCircle className="h-8 w-8 text-green-500" />
                      </div>
                      <div className="space-y-1">
                        <h3 className="text-xl font-semibold">
                          {gymData?.name || selectedGym?.name || t("whatsapp.whatsappConnected")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {displayedPhoneNumber || "+55 11999999999"}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-green-500">
                      {whatsappConfig?.status === "ACTIVE" ? t("whatsapp.active") : t("whatsapp.pending")}
                    </Badge>
                    <p className="text-sm text-muted-foreground">
                      {t("whatsapp.lastMessage", { time: "2 minutes ago" })}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-end gap-2">
                    {whatsappConfig?.status === "PENDING" && (
                      <Button
                        variant="default"
                        onClick={handleActivate}
                        disabled={isSaving}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {isSaving ? (
                          <Loader2 className="h-4 w-4 animate-spin mr-2" />
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-2" />
                        )}
                        {t("whatsapp.activate") || "Activate WhatsApp"}
                      </Button>
                    )}
                    <Button variant="outline" className="text-destructive hover:text-destructive">
                      {t("whatsapp.disconnectWhatsapp")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{t("whatsapp.phoneNumberSettings")}</CardTitle>
                <CardDescription>{t("whatsapp.configureWhatsAppBusinessNumber")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="phone-number">{t("whatsapp.phoneNumber")}</Label>
                      <div className="flex">
                        <span className="inline-flex items-center rounded-md rounded-r-none border border-input bg-muted px-3 text-sm text-muted-foreground">
                          {BRAZIL_COUNTRY_CODE}
                        </span>
                        <Input
                          id="phone-number"
                          value={localPhoneNumber}
                          placeholder="11 99999-9999"
                          inputMode="numeric"
                          onChange={(e) => {
                            const normalized = normalizePhoneNumber(e.target.value);
                            setWhatsappConfig((prev: any) =>
                              prev
                                ? {
                                    ...prev,
                                    phoneNumber: normalized,
                                  }
                                : buildDefaultConfig({
                                    phoneNumber: normalized,
                                  })
                            );
                          }}
                          className="rounded-l-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone-number-id">{t("whatsapp.phoneNumberId")}</Label>
                      <Input
                        id="phone-number-id"
                        placeholder={t("whatsapp.phoneNumberIdPlaceholder")}
                        value={whatsappConfig?.phoneNumberId || ""}
                        onChange={(e) =>
                          setWhatsappConfig((prev: any) =>
                            prev
                              ? {
                                  ...prev,
                                  phoneNumberId: e.target.value,
                                }
                              : buildDefaultConfig({
                                  phoneNumberId: e.target.value,
                                })
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("whatsapp.perGymPhoneNumberId") ||
                          "Phone Number ID assigned by Meta for this gym"}
                      </p>
                    </div>
                  </div>
                    <div className="space-y-2">
                      <Label htmlFor="access-token">{t("whatsapp.accessToken")}</Label>
                      <Input
                        id="access-token"
                        type="text"
                        placeholder={t("whatsapp.accessTokenPlaceholder")}
                        value={whatsappConfig?.accessToken || ""}
                        onChange={(e) =>
                          setWhatsappConfig((prev: any) =>
                            prev
                              ? {
                                  ...prev,
                                  accessToken: e.target.value,
                                }
                              : buildDefaultConfig({
                                  accessToken: e.target.value,
                                })
                          )
                        }
                      />
                      <p className="text-xs text-muted-foreground">
                        {t("whatsapp.perGymAccessToken") || "Permanent access token for this specific gym"}
                      </p>
                    </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <Badge className="bg-green-500 flex items-center gap-1 px-3">
                    <CheckCircle className="h-3 w-3" />
                    {whatsappConfig?.status === "ACTIVE" ? t("whatsapp.verified") : t("whatsapp.pending")}
                  </Badge>
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" onClick={handleTestConnection} disabled={isTesting}>
                      {isTesting ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <RefreshCcw className="h-4 w-4 mr-2" />
                      )}
                      {t("whatsapp.testConnection")}
                    </Button>
                    <Button onClick={handleSaveConfig} disabled={isSaving}>
                      {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {t("common.save")}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {whatsappConfig?.status === 'PENDING' && (
            <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 border border-yellow-200 dark:border-yellow-900">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                <strong>{t("whatsapp.configurationPending") || "Configuration is pending activation."}</strong>{" "}
                {t("whatsapp.clickActivateToEnable") || "Click 'Activate WhatsApp' after saving your configuration and testing the connection."}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WhatsAppTab;
