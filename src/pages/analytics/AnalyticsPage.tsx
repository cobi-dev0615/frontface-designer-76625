import { BarChart, Download, MessageCircle, Clock, Send, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const AnalyticsPage = () => {
  const summaryCards = [
    {
      title: "Total Conversations",
      value: "1,247",
      icon: MessageCircle,
      trend: "↑ 18% vs previous period",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      title: "Avg Response Time",
      value: "2.3 min",
      icon: Clock,
      trend: "↓ 12% (improved)",
      color: "text-green-500",
      bgColor: "bg-green-500/10",
    },
    {
      title: "Messages Sent",
      value: "3,892",
      icon: Send,
      trend: "1,245 AI | 2,647 Human",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      title: "Peak Hours",
      value: "6-8 PM",
      icon: TrendingUp,
      trend: "Most leads respond at 7 PM",
      color: "text-orange-500",
      bgColor: "bg-orange-500/10",
    },
  ];

  const topPerformingHours = [
    { time: "7:00 PM - 8:00 PM", messages: 245, conversion: "22%" },
    { time: "8:00 PM - 9:00 PM", messages: 198, conversion: "19%" },
    { time: "6:00 PM - 7:00 PM", messages: 187, conversion: "18%" },
    { time: "9:00 AM - 10:00 AM", messages: 134, conversion: "15%" },
    { time: "12:00 PM - 1:00 PM", messages: 98, conversion: "12%" },
  ];

  const agentPerformance = [
    { name: "Carlos Silva", conversations: 89, avgResponse: "1.8 min", conversions: 23, rate: "26%" },
    { name: "Ana Santos", conversations: 67, avgResponse: "2.3 min", conversions: 18, rate: "27%" },
    { name: "Pedro Lima", conversations: 45, avgResponse: "3.1 min", conversions: 9, rate: "20%" },
  ];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <BarChart className="h-8 w-8 text-primary" />
            Analytics & Reports
          </h1>
          <p className="text-muted-foreground mt-1">Track your gym's performance and lead conversion</p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="last-30">
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
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                <card.icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{card.value}</div>
              <p className="text-sm text-muted-foreground mt-2">{card.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Leads Over Time */}
        <Card>
          <CardHeader>
            <CardTitle>Leads Acquisition Trend</CardTitle>
            <CardDescription>Daily new leads - Last 30 days</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Line chart visualization</p>
                <p className="text-xs text-muted-foreground">Multiple series: Total, Qualified, Closed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lead Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Lead Status Distribution</CardTitle>
            <CardDescription>Status breakdown by week</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-[300px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <BarChart className="h-12 w-12 mx-auto text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Stacked bar chart</p>
                <p className="text-xs text-muted-foreground">Color-coded by status</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle>Conversion Funnel</CardTitle>
            <CardDescription>Lead journey from contact to close</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { stage: "Contacted", count: 247, percentage: 100 },
                { stage: "Engaged", count: 180, percentage: 73 },
                { stage: "Interested", count: 132, percentage: 53 },
                { stage: "Qualified", count: 89, percentage: 36 },
                { stage: "Closed", count: 45, percentage: 18 },
              ].map((item, index) => (
                <div key={item.stage}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-medium">{item.stage}</span>
                    <span className="text-muted-foreground">
                      {item.count} leads ({item.percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
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
            <div className="flex h-[280px] items-center justify-center rounded-lg border-2 border-dashed border-border bg-muted/30">
              <div className="text-center space-y-2">
                <div className="h-32 w-32 mx-auto rounded-full border-8 border-primary bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-xs text-muted-foreground">Total</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                    <span className="text-sm">WhatsApp (65%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-pink-500" />
                    <span className="text-sm">Instagram (25%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-blue-500" />
                    <span className="text-sm">Website (8%)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full bg-purple-500" />
                    <span className="text-sm">Referral (2%)</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Hours */}
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
                  <th className="text-left p-3 font-medium">Conversion Rate</th>
                </tr>
              </thead>
              <tbody>
                {topPerformingHours.map((hour) => (
                  <tr key={hour.time} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3">{hour.time}</td>
                    <td className="p-3">{hour.messages} messages</td>
                    <td className="p-3">
                      <span className="font-semibold text-green-500">{hour.conversion}</span>
                    </td>
                  </tr>
                ))}
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
                  <th className="text-left p-3 font-medium">Agent Name</th>
                  <th className="text-left p-3 font-medium">Conversations</th>
                  <th className="text-left p-3 font-medium">Avg Response</th>
                  <th className="text-left p-3 font-medium">Conversions</th>
                </tr>
              </thead>
              <tbody>
                {agentPerformance.map((agent) => (
                  <tr key={agent.name} className="border-b border-border hover:bg-muted/30">
                    <td className="p-3 font-medium">{agent.name}</td>
                    <td className="p-3">{agent.conversations}</td>
                    <td className="p-3">{agent.avgResponse}</td>
                    <td className="p-3">
                      {agent.conversions} <span className="text-muted-foreground">({agent.rate})</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
