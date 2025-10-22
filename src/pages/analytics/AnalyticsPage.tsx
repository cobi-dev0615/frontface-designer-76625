import { useState, useEffect } from "react";
import { BarChart as BarChartIcon, Download, MessageCircle, Clock, Send, TrendingUp, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import * as analyticsService from "@/services/analyticsService";
import type { AnalyticsData } from "@/services/analyticsService";

const AnalyticsPage = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState("last-30");

  // Load analytics data on mount
  useEffect(() => {
    loadAnalyticsData();
  }, [dateRange]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await analyticsService.getAnalyticsData();
      setAnalyticsData(response.data);
    } catch (error: any) {
      console.error("Error loading analytics data:", error);
      toast.error("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleExportReport = () => {
    if (!analyticsData) {
      toast.error("No data available to export");
      return;
    }

    try {
      // Create CSV content
      let csvContent = "DuxFit Analytics Report\n";
      csvContent += `Generated: ${new Date().toLocaleString()}\n\n`;
      
      // Summary Metrics
      csvContent += "SUMMARY METRICS\n";
      csvContent += "Metric,Value,Trend\n";
      csvContent += `Total Conversations,${analyticsData.summary.totalConversations.value},${analyticsData.summary.totalConversations.trend}\n`;
      csvContent += `Avg Response Time,${analyticsData.summary.avgResponseTime.value},${analyticsData.summary.avgResponseTime.trend}\n`;
      csvContent += `Messages Sent,${analyticsData.summary.messagesSent.value},${analyticsData.summary.messagesSent.trend}\n`;
      csvContent += `Peak Hours,${analyticsData.summary.peakHours.value},${analyticsData.summary.peakHours.trend}\n\n`;

      // Conversion Funnel
      csvContent += "CONVERSION FUNNEL\n";
      csvContent += "Stage,Count,Percentage\n";
      analyticsData.conversionFunnel.forEach(item => {
        csvContent += `${item.stage},${item.count},${item.percentage}%\n`;
      });
      csvContent += "\n";

      // Lead Sources
      csvContent += "LEAD SOURCES\n";
      csvContent += "Source,Count,Percentage\n";
      analyticsData.leadSources.sources.forEach(source => {
        csvContent += `${source.source},${source.count},${source.percentage}%\n`;
      });
      csvContent += "\n";

      // Peak Performance Hours
      csvContent += "PEAK PERFORMANCE HOURS\n";
      csvContent += "Time Slot,Messages,Conversion Rate\n";
      analyticsData.peakHours.forEach(hour => {
        csvContent += `${hour.time},${hour.messages},${hour.conversion}\n`;
      });
      csvContent += "\n";

      // Agent Performance
      csvContent += "AGENT PERFORMANCE\n";
      csvContent += "Agent,Conversations,Avg Response,Conversions,Rate\n";
      analyticsData.agentPerformance.forEach(agent => {
        csvContent += `${agent.name},${agent.conversations},${agent.avgResponse},${agent.conversions},${agent.rate}\n`;
      });

      // Create blob and download
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `duxfit-analytics-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      toast.success("Analytics report exported successfully");
    } catch (error) {
      console.error("Error exporting report:", error);
      toast.error("Failed to export report");
    }
  };

  const summaryCardsConfig = [
    {
      key: 'totalConversations',
      title: "Total Conversations",
      icon: MessageCircle,
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      key: 'avgResponseTime',
      title: "Avg Response Time",
      icon: Clock,
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      key: 'messagesSent',
      title: "Messages Sent",
      icon: Send,
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      key: 'peakHours',
      title: "Peak Hours",
      icon: TrendingUp,
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChartIcon className="h-8 w-8 text-primary" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1">Track your gym's performance and lead conversion</p>
        </div>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last-7">Last 7 days</SelectItem>
              <SelectItem value="last-30">Last 30 days</SelectItem>
              <SelectItem value="last-90">Last 90 days</SelectItem>
              <SelectItem value="custom">Custom range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2" onClick={handleExportReport} disabled={!analyticsData}>
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-muted-foreground">Loading analytics...</span>
        </div>
      ) : analyticsData ? (
        <>
          {/* Summary Cards */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {summaryCardsConfig.map((config) => {
              const cardData = (analyticsData.summary as any)[config.key];
              return (
                <Card key={config.title}>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">{config.title}</CardTitle>
                    <div className={`p-2 rounded-lg ${config.bgColor}`}>
                      <config.icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{cardData.value}</div>
                    <p className="text-sm text-muted-foreground mt-2">{cardData.trend}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </>
      ) : null}

      {analyticsData && (
        <>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads Acquisition Trend */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Leads Acquisition Trend</CardTitle>
            <CardDescription>Daily new leads - Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analyticsData.acquisitionTrend}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="date" 
                  className="text-xs"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return `${date.getMonth() + 1}/${date.getDate()}`;
                  }}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="total" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  name="Total Leads"
                  dot={{ fill: '#3b82f6', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="qualified" 
                  stroke="#22c55e" 
                  strokeWidth={2}
                  name="Qualified"
                  dot={{ fill: '#22c55e', r: 4 }}
                  activeDot={{ r: 6 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="closed" 
                  stroke="#a855f7" 
                  strokeWidth={2}
                  name="Closed"
                  dot={{ fill: '#a855f7', r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

      </div>

      {/* Three Charts Row - Horizontal */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
            <CardDescription>Current breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={analyticsData.statusDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis 
                  dataKey="status" 
                  className="text-xs"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tickFormatter={(value) => value.charAt(0) + value.slice(1).toLowerCase().slice(0, 4)}
                />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px'
                  }}
                  labelFormatter={(value) => value.charAt(0) + value.slice(1).toLowerCase()}
                />
                <Bar 
                  dataKey="count" 
                  fill="#8b5cf6" 
                  name="Leads"
                  radius={[8, 8, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analyticsData.conversionFunnel.map((item, index) => (
                <div key={item.stage}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
                    <div
                      className="h-full bg-gradient-primary transition-all"
                      style={{ width: `${item.percentage}%`, opacity: 1 - index * 0.15 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Lead Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Sources</CardTitle>
            <CardDescription>Where leads come from</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[280px] flex-col items-center justify-center">
              <div className="text-center space-y-4">
                <div className="h-24 w-24 mx-auto rounded-full border-8 border-primary bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-xl font-bold">{analyticsData.leadSources.total}</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {analyticsData.leadSources.sources.slice(0, 4).map((source, index) => {
                    const colors = ['bg-green-500', 'bg-pink-500', 'bg-blue-500', 'bg-purple-500', 'bg-orange-500'];
                    return (
                      <div key={source.source} className="flex items-center justify-between gap-3 px-2">
                        <div className="flex items-center gap-2">
                          <div className={`h-2.5 w-2.5 rounded-full ${colors[index % colors.length]}`} />
                          <span className="text-xs font-medium">
                            {source.source.charAt(0) + source.source.slice(1).toLowerCase()}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{source.percentage}%</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Tables - Horizontal Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Peak Performance Times */}
        <Card>
          <CardHeader>
            <CardTitle>Peak Performance Times</CardTitle>
            <CardDescription>Best times for lead engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Time Slot</th>
                    <th className="text-left p-3 font-medium">Messages</th>
                    <th className="text-left p-3 font-medium">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.peakHours.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="p-6 text-center text-muted-foreground">
                        No peak hours data available
                      </td>
                    </tr>
                  ) : (
                    analyticsData.peakHours.map((hour) => (
                      <tr key={hour.time} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3">{hour.time}</td>
                        <td className="p-3">{hour.messages}</td>
                        <td className="p-3">
                          <span className="font-semibold text-green-500">{hour.conversion}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Agent Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Agent Performance</CardTitle>
            <CardDescription>Individual team member metrics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-medium">Agent</th>
                    <th className="text-left p-3 font-medium">Conv.</th>
                    <th className="text-left p-3 font-medium">Closed</th>
                    <th className="text-left p-3 font-medium">Rate</th>
                  </tr>
                </thead>
                <tbody>
                  {analyticsData.agentPerformance.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="p-6 text-center text-muted-foreground">
                        No agent performance data available
                      </td>
                    </tr>
                  ) : (
                    analyticsData.agentPerformance.map((agent) => (
                      <tr key={agent.email} className="border-b border-border hover:bg-muted/30">
                        <td className="p-3 font-medium">{agent.name}</td>
                        <td className="p-3">{agent.conversations}</td>
                        <td className="p-3">{agent.conversions}</td>
                        <td className="p-3">
                          <span className="font-semibold text-green-500">{agent.rate}</span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
        </>
      )}
    </div>
  );
};

export default AnalyticsPage;
