import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

// This is a temporary component to test all navigation links
// Remove this file after testing
const NavigationTest = () => {
  const allRoutes = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Leads", path: "/leads" },
    { name: "Lead Detail", path: "/leads/1" },
    { name: "Conversations", path: "/conversations" },
    { name: "Follow-ups", path: "/followups" },
    { name: "Analytics", path: "/analytics" },
    { name: "Reports", path: "/reports" },
    { name: "Notifications", path: "/notifications" },
    { name: "Profile", path: "/profile" },
    { name: "Settings", path: "/settings" },
  ];

  return (
    <div className="p-4 space-y-2">
      <h2 className="text-lg font-semibold mb-4">Navigation Test - All Routes</h2>
      <div className="grid grid-cols-2 gap-2">
        {allRoutes.map((route) => (
          <Link key={route.path} to={route.path}>
            <Button variant="outline" className="w-full justify-start">
              {route.name}
            </Button>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default NavigationTest;
