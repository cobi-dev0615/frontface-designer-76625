import { Link } from "react-router-dom";
import { ServerCrash, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error500 = () => {
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
          <h2 className="text-2xl font-semibold">Internal Server Error</h2>
          <p className="text-muted-foreground">
            Oops! Something went wrong on our end. Our team has been notified and is working on a fix.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" onClick={() => window.location.reload()}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
          <Link to="/dashboard">
            <Button variant="outline">
              <Home className="h-4 w-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>

        <div className="pt-4">
          <p className="text-sm text-muted-foreground">
            If the problem persists, please contact support at{" "}
            <a href="mailto:support@duxfit.com" className="text-primary hover:underline">
              support@duxfit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error500;
