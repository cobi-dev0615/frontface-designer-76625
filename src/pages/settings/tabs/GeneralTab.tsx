import { Globe } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useTranslation } from "@/hooks/useTranslation";
import { LanguageSelector } from "@/components/LanguageSelector";

const GeneralTab = () => {
  const { t } = useTranslation();

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t("settings.general")}</CardTitle>
          <CardDescription>{t("settings.languageSettings.title")}</CardDescription>
        </CardHeader>
      </Card>

      {/* Language Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-primary" />
            <CardTitle>{t("settings.language")}</CardTitle>
          </div>
          <CardDescription>{t("settings.languageSettings.selectLanguage")}</CardDescription>
        </CardHeader>
        <CardContent>
          <LanguageSelector variant="card" />
        </CardContent>
      </Card>
    </div>
  );
};

export default GeneralTab;


