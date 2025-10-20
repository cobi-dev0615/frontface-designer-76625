import { Link } from "react-router-dom";
import { ShieldAlert, Home, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Error403 = () => {
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
          <h2 className="text-2xl font-semibold">Access Forbidden</h2>
          <p className="text-muted-foreground">
            You don't have permission to access this resource. Please contact your administrator if you believe this is an error.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button variant="gradient" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Go Back
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
            Need help? Contact{" "}
            <a href="mailto:support@duxfit.com" className="text-primary hover:underline">
              support@duxfit.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Error403;
