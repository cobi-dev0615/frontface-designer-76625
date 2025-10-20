import { FileText, Download, Calendar, Filter, BarChart, Users, TrendingUp, MessageCircle } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

const ReportsExport = () => {
  const reportTemplates = [
    { id: 1, name: "Monthly Performance Report", description: "Complete overview of monthly metrics", icon: BarChart, category: "Performance" },
    { id: 2, name: "Leads Pipeline Report", description: "Detailed lead status and conversion data", icon: Users, category: "Leads" },
    { id: 3, name: "Conversion Funnel Analysis", description: "Stage-by-stage conversion metrics", icon: TrendingUp, category: "Analytics" },
    { id: 4, name: "WhatsApp Activity Report", description: "Message volume and response rates", icon: MessageCircle, category: "Communication" },
  ];

  const recentExports = [
    { id: 1, name: "January_Performance_Report.pdf", date: "2024-01-15", size: "2.4 MB", status: "completed" },
    { id: 2, name: "Leads_Q4_2023.xlsx", date: "2024-01-10", size: "1.8 MB", status: "completed" },
    { id: 3, name: "Conversion_Analysis.pdf", date: "2024-01-05", size: "3.1 MB", status: "completed" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground">Generate and download custom reports</p>
        </div>
        <Button variant="gradient">
          <FileText className="h-4 w-4 mr-2" />
          Create Custom Report
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Report Templates</CardTitle>
              <CardDescription>Pre-configured reports ready to generate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-2">
                {reportTemplates.map((template) => (
                  <div key={template.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors cursor-pointer">
                    <div className="flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <template.icon className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium mb-1">{template.name}</h4>
                        <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                        <Badge variant="outline" className="text-xs">{template.category}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full mt-4" size="sm">
                      <Download className="h-3 w-3 mr-2" />
                      Generate Report
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Custom Report Builder */}
          <Card>
            <CardHeader>
              <CardTitle>Custom Report Builder</CardTitle>
              <CardDescription>Configure your own report with custom parameters</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Report Type</Label>
                  <Select defaultValue="leads">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">Leads Report</SelectItem>
                      <SelectItem value="performance">Performance Report</SelectItem>
                      <SelectItem value="conversion">Conversion Report</SelectItem>
                      <SelectItem value="activity">Activity Report</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <Select defaultValue="month">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="week">This Week</SelectItem>
                      <SelectItem value="month">This Month</SelectItem>
                      <SelectItem value="quarter">This Quarter</SelectItem>
                      <SelectItem value="year">This Year</SelectItem>
                      <SelectItem value="custom">Custom Range</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Format</Label>
                  <Select defaultValue="pdf">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pdf">PDF Document</SelectItem>
                      <SelectItem value="xlsx">Excel Spreadsheet</SelectItem>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Include</Label>
                  <Select defaultValue="all">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Data</SelectItem>
                      <SelectItem value="summary">Summary Only</SelectItem>
                      <SelectItem value="detailed">Detailed View</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  Advanced Filters
                </Button>
                <Button variant="gradient" className="flex-1">
                  <Download className="h-4 w-4 mr-2" />
                  Generate & Download
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Exports</CardTitle>
              <CardDescription>Your previously generated reports</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentExports.map((export_item) => (
                  <div key={export_item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium text-sm">{export_item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {export_item.date} • {export_item.size}
                        </p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Stats Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Export Statistics</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Reports This Month</p>
                <p className="text-2xl font-bold">24</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Size</p>
                <p className="text-2xl font-bold">45.2 MB</p>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-1">Most Popular</p>
                <p className="font-medium">Performance Report</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Scheduled Reports</CardTitle>
              <CardDescription>Automated report generation</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Monthly Summary</p>
                  <p className="text-xs text-muted-foreground">Every 1st of month</p>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">Weekly Leads</p>
                  <p className="text-xs text-muted-foreground">Every Monday</p>
                </div>
                <Badge className="bg-green-500">Active</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">
                <Calendar className="h-3 w-3 mr-2" />
                Manage Schedule
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Email Report
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Bulk Download
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ReportsExport;
