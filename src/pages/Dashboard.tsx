import { useState, useEffect } from "react";
import { Users, CheckCircle, Trophy, TrendingUp, TrendingDown, MessageCircle, UserPlus, Target, Loader2, UserCheck, Phone, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import * as dashboardService from "@/services/dashboardService";
import type { DashboardData } from "@/services/dashboardService";

const Dashboard = () => {
  const { t } = useTranslation();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load dashboard data on mount
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      const response = await dashboardService.getDashboardData();
      setDashboardData(response.data);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      toast.error(t("dashboard.failedToLoad"));
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return 'bg-green-500';
      case 'LEAD_UPDATED':
        return 'bg-yellow-500';
      case 'LEAD_STATUS_CHANGED':
        return 'bg-purple-500';
      case 'MESSAGE_SENT':
        return 'bg-blue-500';
      case 'FOLLOW_UP_CREATED':
      case 'FOLLOW_UP_COMPLETED':
        return 'bg-orange-500';
      case 'USER_LOGIN':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const kpiConfig = [
    {
      key: 'totalLeads',
      title: t("dashboard.totalLeads"),
      icon: Users,
      iconBg: "bg-blue-500/10 text-blue-500",
    },
    {
      key: 'qualifiedLeads',
      title: t("dashboard.qualifiedLeads"),
      icon: CheckCircle,
      iconBg: "bg-green-500/10 text-green-500",
    },
    {
      key: 'closedThisMonth',
      title: t("dashboard.closedThisMonth"),
      icon: Trophy,
      iconBg: "bg-secondary/20 text-secondary",
    },
    {
      key: 'conversionRate',
      title: t("dashboard.conversionRate"),
      icon: Target,
      iconBg: "bg-orange-500/10 text-orange-500",
    },
  ];

  return (
    <div className="space-y-6">

      {/* KPI Cards */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">{t("common.loading")}</span>
        </div>
      ) : dashboardData ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {kpiConfig.map((config) => {
              const kpiData = (dashboardData.kpis as any)[config.key];
              return (
                <Card key={config.title} className="hover:shadow-md transition-shadow duration-200">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${config.iconBg}`}>
                      <config.icon className="h-4 w-4" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{kpiData.value}</div>
                    <div className="flex items-center gap-1 mt-2">
                      {kpiData.trend.isPositive ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-destructive" />
                      )}
                      <span
                        className={`text-sm font-medium ${
                          kpiData.trend.isPositive ? "text-green-500" : "text-destructive"
                        }`}
                      >
                        {kpiData.trend.isPositive ? "+" : "-"}
                        {kpiData.trend.value}%
                      </span>
                      <span className="text-sm text-muted-foreground">{t("dashboard.vsLastMonth")}</span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">{t("errors.loadFailed")}</p>
          <Button variant="outline" onClick={loadDashboardData} className="mt-4">
            {t("common.refresh")}
          </Button>
        </div>
      )}

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Leads Over Time Chart Placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>{t("dashboard.leadsOverTime")}</CardTitle>
            <CardDescription>{t("dashboard.last30Days")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t("dashboard.chartComingSoon")}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>{t("dashboard.recentActivity")}</CardTitle>
            <CardDescription>{t("dashboard.latestUpdates")}</CardDescription>
          </CardHeader>
          <CardContent>
            {!dashboardData || dashboardData.activities.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">{t("dashboard.noActivity")}</p>
            ) : (
              <div className="space-y-4 max-h-[300px] overflow-y-auto scrollbar-thin">
                {dashboardData.activities.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0 border-border">
                    <div className={`h-2 w-2 mt-2 rounded-full ${getActivityColor(activity.type)}`} />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm text-foreground leading-relaxed">{activity.description}</p>
                      <div className="flex items-center gap-2">
                        <p className="text-xs text-muted-foreground">{formatTime(activity.createdAt)}</p>
                        {activity.lead && (
                          <>
                            <span className="text-xs text-muted-foreground">•</span>
                            <p className="text-xs text-muted-foreground">{activity.lead.name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      {dashboardData && (
        <div className="grid gap-6 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.activeConversations")}</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.quickStats.activeConversations.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboardData.quickStats.activeConversations.detail}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.newLeadsToday")}</CardTitle>
              <UserPlus className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.quickStats.newLeadsToday.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboardData.quickStats.newLeadsToday.detail}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("dashboard.responseTime")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dashboardData.quickStats.responseTime.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{dashboardData.quickStats.responseTime.detail}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
