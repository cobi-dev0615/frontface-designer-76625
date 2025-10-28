import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { 
  MessageSquare, 
  Phone, 
  Settings, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Copy,
  ExternalLink,
  TestTube
} from "lucide-react";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import * as whatsappService from "@/services/whatsappService";

interface WhatsAppConfigProps {
  gymId?: string;
}

const WhatsAppConfig = ({ gymId }: WhatsAppConfigProps) => {
  const { t } = useTranslation();
  const [connectionStatus, setConnectionStatus] = useState<{
    configured: boolean;
    timestamp: string;
    error?: string;
  } | null>(null);
  const [businessProfile, setBusinessProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTesting, setIsTesting] = useState(false);

  // Configuration form state
  const [config, setConfig] = useState({
    accessToken: '',
    phoneNumberId: '',
    businessAccountId: '',
    webhookVerifyToken: '',
    apiVersion: 'v18.0'
  });

  useEffect(() => {
    loadConnectionStatus();
    loadBusinessProfile();
  }, []);

  const loadConnectionStatus = async () => {
    try {
      const response = await whatsappService.testConnection();
      setConnectionStatus(response.data);
    } catch (error: any) {
      setConnectionStatus({
        configured: false,
        timestamp: new Date().toISOString(),
        error: error.message
      });
    }
  };

  const loadBusinessProfile = async () => {
    try {
      const response = await whatsappService.getBusinessProfile();
      setBusinessProfile(response.data);
    } catch (error) {
      console.error('Error loading business profile:', error);
    }
  };

  const handleTestConnection = async () => {
    setIsTesting(true);
    try {
      await loadConnectionStatus();
      toast.success(t("whatsapp.connectionTested"));
    } catch (error: any) {
      toast.error(error.message || t("whatsapp.connectionTestFailed"));
    } finally {
      setIsTesting(false);
    }
  };

  const handleCopyWebhookUrl = () => {
    const webhookUrl = whatsappService.getWebhookUrl();
    navigator.clipboard.writeText(webhookUrl);
    toast.success(t("whatsapp.webhookUrlCopied"));
  };

  const handleUpdateProfile = async () => {
    setIsLoading(true);
    try {
      await whatsappService.updateBusinessProfile(businessProfile);
      toast.success(t("whatsapp.profileUpdated"));
    } catch (error: any) {
      toast.error(error.message || t("whatsapp.profileUpdateFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = () => {
    if (!connectionStatus) {
      return <Badge variant="secondary">{t("whatsapp.statusUnknown")}</Badge>;
    }

    if (connectionStatus.configured) {
      return (
        <Badge variant="default" className="bg-green-500">
          <CheckCircle className="h-3 w-3 mr-1" />
          {t("whatsapp.statusConnected")}
        </Badge>
      );
    } else {
      return (
        <Badge variant="destructive">
          <XCircle className="h-3 w-3 mr-1" />
          {t("whatsapp.statusDisconnected")}
        </Badge>
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {t("whatsapp.connectionStatus")}
          </CardTitle>
          <CardDescription>
            {t("whatsapp.connectionStatusDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              {connectionStatus && (
                <span className="text-sm text-muted-foreground">
                  {new Date(connectionStatus.timestamp).toLocaleString()}
                </span>
              )}
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleTestConnection}
              disabled={isTesting}
            >
              <TestTube className="h-4 w-4 mr-2" />
              {isTesting ? t("whatsapp.testing") : t("whatsapp.testConnection")}
            </Button>
          </div>

          {connectionStatus?.error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {connectionStatus.error}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {t("whatsapp.configuration")}
          </CardTitle>
          <CardDescription>
            {t("whatsapp.configurationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="accessToken">{t("whatsapp.accessToken")}</Label>
              <Input
                id="accessToken"
                type="password"
                placeholder={t("whatsapp.accessTokenPlaceholder")}
                value={config.accessToken}
                onChange={(e) => setConfig({ ...config, accessToken: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phoneNumberId">{t("whatsapp.phoneNumberId")}</Label>
              <Input
                id="phoneNumberId"
                placeholder={t("whatsapp.phoneNumberIdPlaceholder")}
                value={config.phoneNumberId}
                onChange={(e) => setConfig({ ...config, phoneNumberId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="businessAccountId">{t("whatsapp.businessAccountId")}</Label>
              <Input
                id="businessAccountId"
                placeholder={t("whatsapp.businessAccountIdPlaceholder")}
                value={config.businessAccountId}
                onChange={(e) => setConfig({ ...config, businessAccountId: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="webhookVerifyToken">{t("whatsapp.webhookVerifyToken")}</Label>
              <Input
                id="webhookVerifyToken"
                placeholder={t("whatsapp.webhookVerifyTokenPlaceholder")}
                value={config.webhookVerifyToken}
                onChange={(e) => setConfig({ ...config, webhookVerifyToken: e.target.value })}
              />
            </div>
          </div>

          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {t("whatsapp.configurationWarning")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Webhook Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            {t("whatsapp.webhookConfiguration")}
          </CardTitle>
          <CardDescription>
            {t("whatsapp.webhookConfigurationDescription")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>{t("whatsapp.webhookUrl")}</Label>
            <div className="flex gap-2">
              <Input
                value={whatsappService.getWebhookUrl()}
                readOnly
                className="font-mono text-sm"
              />
              <Button variant="outline" size="sm" onClick={handleCopyWebhookUrl}>
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>{t("whatsapp.webhookEvents")}</Label>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">messages</Badge>
              <Badge variant="outline">message_status</Badge>
              <Badge variant="outline">contacts</Badge>
            </div>
          </div>

          <Alert>
            <ExternalLink className="h-4 w-4" />
            <AlertDescription>
              {t("whatsapp.webhookInstructions")}
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Business Profile */}
      {businessProfile && (
        <Card>
          <CardHeader>
            <CardTitle>{t("whatsapp.businessProfile")}</CardTitle>
            <CardDescription>
              {t("whatsapp.businessProfileDescription")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="about">{t("whatsapp.about")}</Label>
                <Textarea
                  id="about"
                  placeholder={t("whatsapp.aboutPlaceholder")}
                  value={businessProfile.about || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, about: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("whatsapp.description")}</Label>
                <Textarea
                  id="description"
                  placeholder={t("whatsapp.descriptionPlaceholder")}
                  value={businessProfile.description || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, description: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t("whatsapp.email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("whatsapp.emailPlaceholder")}
                  value={businessProfile.email || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">{t("whatsapp.address")}</Label>
                <Input
                  id="address"
                  placeholder={t("whatsapp.addressPlaceholder")}
                  value={businessProfile.address || ''}
                  onChange={(e) => setBusinessProfile({ ...businessProfile, address: e.target.value })}
                />
              </div>
            </div>

            <Separator />

            <div className="flex justify-end">
              <Button onClick={handleUpdateProfile} disabled={isLoading}>
                {isLoading ? t("whatsapp.updating") : t("whatsapp.updateProfile")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default WhatsAppConfig;
