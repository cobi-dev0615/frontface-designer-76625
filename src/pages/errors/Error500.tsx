import { Link } from "react-router-dom";
import { ServerCrash, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "@/hooks/useTranslation";

const Error500 = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="text-center space-y-6 max-w-md">
        <div className="flex justify-center">
          <div className="p-4 rounded-full bg-destructive/10">
            <ServerCrash className="h-16 w-16 text-destructive" />
          </div>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-6xl font-bold">500</h1>
          <h2 className="text-2xl font-semibold">{t("errors.internalServerError")}</h2>
          <p className="text-muted-foreground">
            {t("errors.internalServerErrorDescription")}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("errors.tryAgain")}
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
            {t("errors.problemPersists")}{" "}
            <a href={`mailto:${t("errors.supportEmail")}`} className="text-primary hover:underline">
              {t("errors.supportEmail")}
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error500;
