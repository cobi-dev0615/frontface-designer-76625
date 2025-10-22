import { useState, useEffect } from "react";
import { Bell, Building2, Search, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import { useNotificationStore } from "@/store/notificationStore";
import { toast } from "sonner";
import * as notificationService from "@/services/notificationService";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { GlobalSearch } from "@/components/GlobalSearch";

export const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();
  const { unreadCount, setUnreadCount } = useNotificationStore();
  const [searchOpen, setSearchOpen] = useState(false);

  // Load unread count on mount
  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const response = await notificationService.getUnreadCount();
        setUnreadCount(response.data.count);
      } catch (error) {
        console.error("Error loading unread count:", error);
      }
    };

    if (user) {
      loadUnreadCount();
    }
  }, [user, setUnreadCount]);

  // Breadcrumb mapping based on sidebar structure
  const getBreadcrumbs = () => {
    const path = location.pathname;
    
    // Main Pages
    if (path === '/dashboard') return { category: 'Dashboard', page: 'Overview' };
    if (path === '/leads' || path.startsWith('/leads/')) return { category: 'Main', page: 'Leads' };
    if (path === '/conversations') return { category: 'Main', page: 'Conversations' };
    if (path === '/followups') return { category: 'Main', page: 'Follow-ups' };
    
    // Reports & Analytics
    if (path === '/analytics') return { category: 'Reports & Analytics', page: 'Analytics' };
    if (path === '/activity') return { category: 'Reports & Analytics', page: 'Activity Log' };
    if (path === '/reports') return { category: 'Reports & Analytics', page: 'Reports' };
    if (path === '/notifications') return { category: 'Reports & Analytics', page: 'Notifications' };
    
    // Management
    if (path === '/gyms') return { category: 'Management', page: 'Gyms' };
    if (path === '/users') return { category: 'Management', page: 'User Management' };
    
    // Account
    if (path === '/profile') return { category: 'Account', page: 'Profile' };
    if (path === '/settings') return { category: 'Account', page: 'Settings' };
    
    // Default
    return { category: 'Dashboard', page: 'Overview' };
  };

  const breadcrumbs = getBreadcrumbs();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setSearchOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
    toast.success('Logged out successfully');
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
    <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-border bg-background px-6 shadow-sm">
      {/* Breadcrumbs */}
      <div className="flex items-center gap-2 text-sm">
        <span className="text-muted-foreground">{breadcrumbs.category}</span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
        <span className="text-foreground font-medium">{breadcrumbs.page}</span>
      </div>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Gym Selector */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">DuxFit - Piauí 1</span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover">
          <DropdownMenuLabel>Select Gym</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>DuxFit - Piauí 1</DropdownMenuItem>
          <DropdownMenuItem>DuxFit - Piauí 2</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Search */}
      <Button 
        variant="ghost" 
        size="icon"
        onClick={() => setSearchOpen(true)}
        title="Search (⌘K)"
        className="hidden md:flex"
      >
        <Search className="h-5 w-5" />
      </Button>

      {/* Notifications */}
      <Link to="/notifications">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground animate-pulse">
              {unreadCount > 99 ? '99+' : unreadCount}
            </span>
          )}
        </Button>
      </Link>

      {/* User Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="gap-2 px-2">
            <Avatar className="h-8 w-8">
              {/* {user?.avatar ? <img src={`${import.meta.env.VITE_API_URL}/uploads/${user?.avatar}`} alt={user?.name} /> : */}
              <AvatarFallback className="bg-gradient-primary text-white text-xs font-semibold">
                {getInitials(user?.name)}
              </AvatarFallback>
            </Avatar>
            <ChevronDown className="h-4 w-4 hidden sm:block" />
          </Button>                                                                
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48 bg-popover">
          <DropdownMenuLabel>
            <div className="flex flex-col">
              <span className="font-medium">{user?.name || 'My Account'}</span>
              <span className="text-xs text-muted-foreground font-normal">{user?.email}</span>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/profile">Profile</Link>
          </DropdownMenuItem>                    
          <DropdownMenuItem asChild>
            <Link to="/settings">Settings</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem 
            onClick={handleLogout}
            className="text-destructive cursor-pointer"
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <GlobalSearch open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
};
