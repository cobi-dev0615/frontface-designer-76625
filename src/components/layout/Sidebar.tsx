import { NavLink, useNavigate } from "react-router-dom";
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
  User,
  UserCog,
  Activity,
  Bot,
  CreditCard
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";

const getNavigation = (t: (key: string) => string) => [
  { name: t("navigation.dashboard"), href: "/dashboard", icon: Home },
  { name: t("navigation.leads"), href: "/leads", icon: Users },
  { name: t("navigation.conversations"), href: "/conversations", icon: MessageCircle },
  { name: t("navigation.followUps"), href: "/followups", icon: Calendar },
  { name: t("navigation.analytics"), href: "/analytics", icon: BarChart },
  { name: t("navigation.activity"), href: "/activity", icon: Activity },
  { name: t("navigation.reports"), href: "/reports", icon: FileText },
  { name: t("navigation.notifications"), href: "/notifications", icon: Bell },
  { name: t("navigation.gyms"), href: "/gyms", icon: Dumbbell },
  { name: t("navigation.plans"), href: "/plans", icon: CreditCard },
  { name: t("navigation.members"), href: "/members", icon: Users },
  { name: t("navigation.prompts"), href: "/ai-prompts", icon: Bot },
  { name: t("navigation.user"), href: "/users", icon: UserCog },
  { name: t("navigation.profile"), href: "/profile", icon: User },
  { name: t("navigation.settings"), href: "/settings", icon: Settings },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuthStore();
  const { t } = useTranslation();
  
  const navigation = getNavigation(t);

  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    return `flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
      isActive
        ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
        : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
    }`;
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success(t('auth.logoutSuccess'));
  };

  // Get user initials
  const getInitials = (name?: string) => {
    if (!name) return 'AU';
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <aside className="sidebar-enhanced colorful-scroll flex h-screen w-60 flex-col backdrop-blur-xl">
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
            {t("navigation.reportsAnalytics")}
          </p>
          <div className="space-y-1">
            {navigation.slice(4, 8).map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("navigation.management")}
          </p>
          <div className="space-y-1">
            {navigation.slice(8, 13).map((item) => (
              <NavLink key={item.name} to={item.href} className={getNavLinkClass}>
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <p className="px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            {t("navigation.account")}
          </p>
          <div className="space-y-1">
            {navigation.slice(13).map((item) => (
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
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback className="bg-gradient-primary text-white font-semibold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-sidebar-foreground truncate">
              {user?.name || 'Admin User'}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.role || 'Administrator'}
            </p>
          </div>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 flex-shrink-0"
            onClick={handleLogout}
            title={t("navigation.logout")}
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
};
