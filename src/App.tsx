import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
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
import OnboardingFlow from "./pages/onboarding/OnboardingFlow";
import NotFound from "./pages/NotFound";
import Error403 from "./pages/errors/Error403";
import Error500 from "./pages/errors/Error500";
import { DashboardLayout } from "./components/layout/DashboardLayout";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/onboarding" element={<OnboardingFlow />} />
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/leads" element={<LeadsList />} />
            <Route path="/leads/:id" element={<LeadDetail />} />
            <Route path="/conversations" element={<ConversationView />} />
            <Route path="/followups" element={<FollowUpManagement />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/notifications" element={<NotificationsCenter />} />
            <Route path="/reports" element={<ReportsExport />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/profile" element={<UserProfile />} />
          </Route>
          <Route path="/403" element={<Error403 />} />
          <Route path="/500" element={<Error500 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
