import { NavLink } from "react-router-dom";
import { Home, Users, MessageCircle, BarChart, Settings } from "lucide-react";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Chat", href: "/conversations", icon: MessageCircle },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const MobileNav = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex flex-col items-center gap-1 py-2 px-3 text-xs font-medium rounded-lg transition-all ${
      isActive
        ? "text-primary"
        : "text-muted-foreground hover:text-foreground"
    }`;
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 safe-area-bottom">
      <div className="flex items-center justify-around px-2 py-1">
        {navigation.map((item) => (
          <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
            {({ isActive }) => (
              <>
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-primary/10' : ''}`}>
                  <item.icon className={`h-5 w-5 ${isActive ? 'text-primary' : ''}`} />
                </div>
                <span>{item.name}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};
