import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthStore } from "@/store/authStore";
import PrivateRoute from "./components/PrivateRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Dashboard from "./pages/Dashboard";
import LeadsList from "./pages/leads/LeadsList";
import LeadDetail from "./pages/leads/LeadDetail";
import ConversationView from "./pages/conversations/ConversationView";
import FollowUpManagement from "./pages/followups/FollowUpManagement";
import AnalyticsPage from "./pages/analytics/AnalyticsPage";
import NotificationsCenter from "./pages/notifications/NotificationsCenter";
import ReportsExport from "./pages/reports/ReportsExport";
import SettingsPage from "./pages/settings/SettingsPage";
import UserProfile from "./pages/profile/UserProfile";
import UserManagement from "./pages/users/UserManagement";
import GymManagement from "./pages/gyms/GymManagement";
import ActivityLog from "./pages/activity/ActivityLog";
import OnboardingFlow from "./pages/onboarding/OnboardingFlow";
import NotFound from "./pages/NotFound";
import Error403 from "./pages/errors/Error403";
import Error500 from "./pages/errors/Error500";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const AppContent = () => {
  const { checkAuth, isLoading } = useAuthStore();

  // Check authentication on app load
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto mb-4"></div>
          <p className="text-lg font-medium">Loading DuxFit CRM...</p>
        </div>
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/onboarding" element={<OnboardingFlow />} />
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/leads" element={<LeadsList />} />
        <Route path="/leads/:id" element={<LeadDetail />} />
        <Route path="/conversations" element={<ConversationView />} />
        <Route path="/followups" element={<FollowUpManagement />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/notifications" element={<NotificationsCenter />} />
        <Route path="/reports" element={<ReportsExport />} />
        <Route path="/settings" element={<SettingsPage />} />
        <Route path="/users" element={<UserManagement />} />
        <Route path="/gyms" element={<GymManagement />} />
        <Route path="/activity" element={<ActivityLog />} />
        <Route path="/profile" element={<UserProfile />} />
      </Route>
      <Route path="/403" element={<Error403 />} />
      <Route path="/500" element={<Error500 />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
