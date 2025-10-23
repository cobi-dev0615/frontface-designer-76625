import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

const Error403 = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">403</h1>
          <h2 className="text-2xl font-semibold">{t("errors.accessForbidden")}</h2>
          <p className="text-muted-foreground">
            {t("errors.accessForbiddenDescription")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("errors.goBack")}
          </Button>
          <Link to="/dashboard">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              {t("errors.goHome")}
            </Button>
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            {t("errors.needHelp")}{" "}
            <a href={`mailto:${t("errors.supportEmail")}`} className="text-primary hover:underline">
              {t("errors.supportEmail")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error403;
