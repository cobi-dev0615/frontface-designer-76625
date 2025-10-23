import { CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "@/hooks/useTranslation";

const WhatsAppTab = () => {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-6">
      {/* Connection Status - Full Width */}
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
              <h3 className="text-2xl font-bold">{t("whatsapp.whatsappConnected")}</h3>
              <p className="text-lg">+55 (86) 99123-4567</p>
              <Badge className="bg-green-500">{t("whatsapp.active")}</Badge>
            </div>
            <p className="text-sm text-muted-foreground">{t("whatsapp.lastMessage", { time: "2 minutes ago" })}</p>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              {t("whatsapp.disconnectWhatsapp")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout - Phone Settings & Auto-Reply */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Phone Number Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("whatsapp.phoneNumberSettings")}</CardTitle>
            <CardDescription>{t("whatsapp.configureWhatsAppBusinessNumber")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">{t("whatsapp.phoneNumber")}</Label>
              <div className="flex gap-2">
                <Input id="phone-number" defaultValue="+55 (86) 99123-4567" readOnly />
                <Badge className="bg-green-500 flex items-center gap-1 px-3">
                  <CheckCircle className="h-3 w-3" />
{t("whatsapp.verified")}
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">{t("whatsapp.displayName")}</Label>
              <Input id="display-name" defaultValue="DuxFit Piauí" maxLength={25} />
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

        {/* Right Column: Auto-Reply Settings */}
        <Card>
          <CardHeader>
            <CardTitle>{t("whatsapp.autoReplySettings")}</CardTitle>
            <CardDescription>{t("whatsapp.configureAutomatedResponses")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="away-message">{t("whatsapp.awayMessage")}</Label>
              <textarea
                id="away-message"
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue={t("whatsapp.awayMessagePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">{t("whatsapp.welcomeMessageForNewContacts")}</Label>
              <textarea
                id="welcome-message"
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue={t("whatsapp.welcomeMessagePlaceholder")}
              />
            </div>

            <div className="space-y-2">
              <Label>{t("whatsapp.businessHours")}</Label>
              <p className="text-sm text-muted-foreground">{t("whatsapp.autoRepliesSentOutsideHours")}</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="start-time">{t("whatsapp.startTime")}</Label>
                  <Input id="start-time" type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">{t("whatsapp.endTime")}</Label>
                  <Input id="end-time" type="time" defaultValue="18:00" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Message Templates & Webhook */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle>{t("whatsapp.messageTemplates")}</CardTitle>
            <CardDescription>{t("whatsapp.preApprovedTemplatesForBroadcast")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{t("whatsapp.welcomeTemplate")}</h4>
                  <Badge className="bg-green-500">{t("whatsapp.approved")}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t("whatsapp.welcomeNewLeadsToGym")}</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{t("whatsapp.promotionTemplate")}</h4>
                  <Badge className="bg-yellow-500">{t("whatsapp.pending")}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{t("whatsapp.sendPromotionalOffersToLeads")}</p>
              </div>
              <Button variant="outline" className="w-full">{t("whatsapp.addNewTemplate")}</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>{t("whatsapp.webhookConfiguration")}</CardTitle>
            <CardDescription>{t("whatsapp.advancedSettingsForDevelopers")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">{t("whatsapp.webhookUrl")}</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  defaultValue="https://api.duxfit.com/webhooks/whatsapp"
                  readOnly
                />
                <Button variant="outline" size="sm">{t("whatsapp.copy")}</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-token">{t("whatsapp.verifyToken")}</Label>
              <div className="flex gap-2">
                <Input
                  id="verify-token"
                  type="password"
                  defaultValue="••••••••••••••"
                  readOnly
                />
                <Button variant="outline" size="sm">{t("whatsapp.show")}</Button>
              </div>
            </div>

            <Button variant="outline">{t("whatsapp.testWebhook")}</Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <p className="text-sm text-muted-foreground">{t("whatsapp.lastSaved")} {t("whatsapp.autoSaved")}</p>
        <Button variant="gradient">{t("whatsapp.saveConfiguration")}</Button>
      </div>
    </div>
  );
};

export default WhatsAppTab;
