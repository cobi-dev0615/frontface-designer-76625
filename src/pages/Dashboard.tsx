import { Users, CheckCircle, Trophy, TrendingUp, TrendingDown, MessageCircle, UserPlus, Target } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const kpiData = [
  {
    title: "Total Leads",
    value: "247",
    icon: Users,
    trend: { value: 12, isPositive: true },
    iconBg: "bg-blue-500/10 text-blue-500",
  },
  {
    title: "Qualified Leads",
    value: "132",
    icon: CheckCircle,
    trend: { value: 8, isPositive: true },
    iconBg: "bg-green-500/10 text-green-500",
  },
  {
    title: "Closed This Month",
    value: "45",
    icon: Trophy,
    trend: { value: 23, isPositive: true },
    iconBg: "bg-secondary/20 text-secondary",
  },
  {
    title: "Conversion Rate",
    value: "18.2%",
    icon: Target,
    trend: { value: 2, isPositive: false },
    iconBg: "bg-orange-500/10 text-orange-500",
  },
];

const recentActivity = [
  { id: 1, text: "New lead registered: Maria Souza", time: "2 min ago", color: "bg-green-500" },
  { id: 2, text: "Lead updated: João Lima → Qualified", time: "15 min ago", color: "bg-yellow-500" },
  { id: 3, text: "Message sent to Ana Pereira", time: "1 hour ago", color: "bg-blue-500" },
  { id: 4, text: "Deal closed: Carlos Santos - R$99.99/month", time: "2 hours ago", color: "bg-purple-500" },
  { id: 5, text: "Follow-up scheduled: Pedro Silva", time: "3 hours ago", color: "bg-gray-500" },
  { id: 6, text: "New lead registered: Fernanda Costa", time: "4 hours ago", color: "bg-green-500" },
  { id: 7, text: "Lead updated: Roberto Alves → Interested", time: "5 hours ago", color: "bg-yellow-500" },
  { id: 8, text: "Message received from Juliana Pires", time: "6 hours ago", color: "bg-blue-500" },
];

const Dashboard = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-xl bg-gradient-subtle p-8 shadow-sm border border-border">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Welcome back, Admin! 👋
            </h1>
            <p className="text-muted-foreground text-lg">
              Here's what's happening with your gym today
            </p>
          </div>
          <p className="text-sm text-muted-foreground">{today}</p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="hover:shadow-md transition-shadow duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{kpi.title}</CardTitle>
              <div className={`p-2 rounded-lg ${kpi.iconBg}`}>
                <kpi.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{kpi.value}</div>
              <div className="flex items-center gap-1 mt-2">
                {kpi.trend.isPositive ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-destructive" />
                )}
                <span
                  className={`text-sm font-medium ${
                    kpi.trend.isPositive ? "text-green-500" : "text-destructive"
                  }`}
                >
                  {kpi.trend.isPositive ? "+" : "-"}
                  {kpi.trend.value}%
                </span>
                <span className="text-sm text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid gap-6 lg:grid-cols-7">
        {/* Leads Over Time Chart Placeholder */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <CardTitle>Leads Over Time</CardTitle>
            <CardDescription>Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Chart visualization coming soon</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates from your leads</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[300px] overflow-y-auto">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 last:pb-0 border-b last:border-0 border-border">
                  <div className={`h-2 w-2 mt-2 rounded-full ${activity.color}`} />
                  <div className="flex-1 space-y-1">
                    <p className="text-sm text-foreground leading-relaxed">{activity.text}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats Row */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Conversations</CardTitle>
            <MessageCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">34</div>
            <p className="text-xs text-muted-foreground mt-1">12 awaiting response</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">New Leads Today</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground mt-1">+3 from yesterday</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.3m</div>
            <p className="text-xs text-muted-foreground mt-1">Average response time</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
