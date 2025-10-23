import { useState } from "react";
import { Check, Dumbbell, Rocket, MessageCircle, Users } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";

const OnboardingFlow = () => {
  const { t } = useTranslation();
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center space-y-2">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-primary">
              <Dumbbell className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
              DuxFit
            </span>
          </div>
          <CardTitle className="text-2xl">{t("onboarding.welcomeTitle")}</CardTitle>
          <CardDescription>
            {t("onboarding.welcomeDescription")}
          </CardDescription>
          <div className="pt-4">
            <Progress value={progress} className="h-2" />
            <p className="text-sm text-muted-foreground mt-2">
{t("onboarding.stepOf", { step, total: totalSteps })}
            </p>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Step 1: Gym Information */}
          {step === 1 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Dumbbell className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("onboarding.tellUsAboutGym")}</h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-name">{t("onboarding.gymName")}</Label>
                <Input id="gym-name" placeholder={t("onboarding.gymNamePlaceholder")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-location">{t("onboarding.location")}</Label>
                <Input id="gym-location" placeholder={t("onboarding.locationPlaceholder")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-phone">{t("onboarding.phoneNumber")}</Label>
                <Input id="gym-phone" placeholder={t("onboarding.phonePlaceholder")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gym-email">{t("onboarding.emailAddress")}</Label>
                <Input id="gym-email" type="email" placeholder={t("onboarding.emailPlaceholder")} />
              </div>
            </div>
          )}

          {/* Step 2: WhatsApp Integration */}
          {step === 2 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <MessageCircle className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("onboarding.connectWhatsApp")}</h3>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 space-y-3">
                <p className="text-sm">
                  {t("onboarding.connectWhatsAppDescription")}
                </p>
                <ul className="text-sm space-y-2 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
{t("onboarding.autoRespondMessages")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
{t("onboarding.qualifyLeadsWithAI")}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
{t("onboarding.trackConversations")}
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsapp-number">{t("onboarding.whatsappBusinessNumber")}</Label>
                <Input id="whatsapp-number" placeholder={t("onboarding.whatsappNumberPlaceholder")} />
              </div>

              <Button variant="outline" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
{t("onboarding.connectWhatsAppBusiness")}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
{t("onboarding.skipStepNote")}
              </p>
            </div>
          )}

          {/* Step 3: Team Setup */}
          {step === 3 && (
            <div className="space-y-4 animate-fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-full bg-primary/10">
                  <Users className="h-5 w-5 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t("onboarding.inviteTeam")}</h3>
              </div>

              <p className="text-sm text-muted-foreground">
{t("onboarding.inviteTeamDescription")}
              </p>

              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder={t("onboarding.teamEmailPlaceholder")} type="email" />
                    <select className="px-3 py-2 text-sm border border-input rounded-md bg-background min-w-[120px]">
                      <option>{t("onboarding.admin")}</option>
                      <option>{t("onboarding.manager")}</option>
                      <option>{t("onboarding.agent")}</option>
                    </select>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full">
{t("onboarding.addMoreTeamMembers")}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
{t("onboarding.addTeamMembersLater")}
              </p>
            </div>
          )}

          {/* Step 4: Ready to Launch */}
          {step === 4 && (
            <div className="space-y-6 text-center animate-fade-in">
              <div className="flex justify-center">
                <div className="p-4 rounded-full bg-gradient-primary">
                  <Rocket className="h-12 w-12 text-white" />
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold mb-2">{t("onboarding.allSet")}</h3>
                <p className="text-muted-foreground">
                  {t("onboarding.allSetDescription")}
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-6 space-y-3 text-left">
                <h4 className="font-semibold">{t("onboarding.whatsNext")}</h4>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{t("onboarding.startManagingLeads")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{t("onboarding.trackConversationsChannels")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{t("onboarding.monitorAnalytics")}</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span>{t("onboarding.customizeAIPrompts")}</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-4">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1"
              >
{t("onboarding.back")}
              </Button>
            )}
            {step < totalSteps ? (
              <Button
                variant="gradient"
                onClick={() => setStep(step + 1)}
                className="flex-1"
              >
{t("onboarding.continue")}
              </Button>
            ) : (
              <Button
                variant="gradient"
                className="flex-1"
                onClick={() => (window.location.href = "/dashboard")}
              >
{t("onboarding.goToDashboard")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
