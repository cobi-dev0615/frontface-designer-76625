import { NavLink } from "react-router-dom";
import { 
  Home, 
  Users, 
  MessageCircle, 
  BarChart, 
  Settings, 
  Dumbbell, 
  LogOut,
  Calendar,
  Bell,
  FileText,
  User
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Leads", href: "/leads", icon: Users },
  { name: "Conversations", href: "/conversations", icon: MessageCircle },
  { name: "Follow-ups", href: "/followups", icon: Calendar },
  { name: "Analytics", href: "/analytics", icon: BarChart },
  { name: "Reports", href: "/reports", icon: FileText },
  { name: "Notifications", href: "/notifications", icon: Bell },
  { name: "Profile", href: "/profile", icon: User },
  { name: "Settings", href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    }`;
  };

  return (
    <aside className="flex h-screen w-60 flex-col border-r border-sidebar-border bg-sidebar backdrop-blur-xl">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2 border-b border-sidebar-border px-6 backdrop-blur-sm">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-primary">
          <Dumbbell className="h-4 w-4 text-white" />
        </div>
        <span className="text-lg font-bold bg-gradient-primary bg-clip-text text-transparent">
          DuxFit
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 p-4">
        <div className="space-y-1">
          {navigation.slice(0, 4).map((item) => (
            <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </NavLink>
          ))}
        </div>
        
        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Reports & Analytics
          </p>
          <div className="space-y-1">
            {navigation.slice(4, 7).map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Account
          </p>
          <div className="space-y-1">
            {navigation.slice(7).map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>
      </nav>

      {/* User Profile */}
      <div className="border-t border-sidebar-border p-4">
        <div className="flex items-center gap-3 rounded-lg bg-sidebar-accent/50 p-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              AU
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">Admin User</p>
            <p className="text-xs text-muted-foreground truncate">Administrator</p>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 flex-shrink-0">
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
