import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Filter, BarChart, Users, TrendingUp, MessageCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { format } from "date-fns";
import * as reportsService from "@/services/reportsService";
import type { ReportTemplate, ExportHistory, ExportStatistics } from "@/services/reportsService";
import CustomReportModal from "@/components/modals/CustomReportModal";

const ReportsExport = () => {
  const [templates, setTemplates] = useState<ReportTemplate[]>([]);
  const [exportHistory, setExportHistory] = useState<ExportHistory[]>([]);
  const [statistics, setStatistics] = useState<ExportStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [isCustomModalOpen, setIsCustomModalOpen] = useState(false);
  
  // Custom report builder state
  const [reportType, setReportType] = useState("leads");
  const [dateRange, setDateRange] = useState("month");
  const [reportFormat, setReportFormat] = useState("csv");
  const [includeLevel, setIncludeLevel] = useState("all");

  useEffect(() => {
    loadReportsData();
  }, []);

  const loadReportsData = async () => {
    try {
      setIsLoading(true);
      const [templatesRes, historyRes, statsRes] = await Promise.all([
        reportsService.getReportTemplates(),
        reportsService.getExportHistory(),
        reportsService.getExportStatistics()
      ]);
      
      setTemplates(templatesRes.data);
      setExportHistory(historyRes.data);
      setStatistics(statsRes.data);
    } catch (error: any) {
      console.error("Error loading reports data:", error);
      toast.error("Failed to load reports data");
    } finally {
      setIsLoading(false);
    }
  };

  const getTemplateIcon = (category: string) => {
    switch (category) {
      case 'Performance':
        return BarChart;
      case 'Leads':
        return Users;
      case 'Analytics':
        return TrendingUp;
      case 'Communication':
        return MessageCircle;
      default:
        return FileText;
    }
  };

  const handleGenerateTemplate = async (template: ReportTemplate) => {
    try {
      setGeneratingReport(template.id);
      
      let response;
      const filename = `${template.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;

      switch (template.reportType) {
        case 'leads':
          response = await reportsService.generateLeadsReport();
          break;
        case 'performance':
          response = await reportsService.generatePerformanceReport();
          break;
        case 'conversion':
          response = await reportsService.generateConversionReport();
          break;
        case 'activity':
          response = await reportsService.generateActivityReport();
          break;
        default:
          throw new Error('Unknown report type');
      }

      // Download the report
      reportsService.downloadReport(response.data.content, filename, 'csv');
      toast.success(response.message);
      
      // Reload history
      loadReportsData();
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setGeneratingReport(null);
    }
  };

  const handleGenerateCustomReport = async () => {
    try {
      setGeneratingReport('custom');
      
      let response;
      const filename = `${reportType}_report_${new Date().toISOString().split('T')[0]}.${reportFormat}`;

      switch (reportType) {
        case 'leads':
          response = await reportsService.generateLeadsReport({ format: reportFormat.toUpperCase() as any });
          break;
        case 'performance':
          response = await reportsService.generatePerformanceReport({ format: reportFormat.toUpperCase() as any });
          break;
        case 'conversion':
          response = await reportsService.generateConversionReport({ format: reportFormat.toUpperCase() as any });
          break;
        case 'activity':
          response = await reportsService.generateActivityReport({ format: reportFormat.toUpperCase() as any });
          break;
        default:
          throw new Error('Unknown report type');
      }

      // Download the report
      reportsService.downloadReport(response.data.content, filename, reportFormat);
      toast.success(response.message);
      
      // Reload history
      loadReportsData();
    } catch (error: any) {
      console.error("Error generating custom report:", error);
      toast.error(error.response?.data?.message || "Failed to generate report");
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Export</h1>
          <p className="text-muted-foreground">Generate and download custom reports</p>
        </div>
        <Button variant="gradient" onClick={() => setIsCustomModalOpen(true)}>
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
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2">
                  {templates.map((template) => {
                    const TemplateIcon = getTemplateIcon(template.category);
                    const isGenerating = generatingReport === template.id;
                    
                    return (
                      <div key={template.id} className="border rounded-lg p-4 hover:border-primary/50 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-lg bg-primary/10">
                            <TemplateIcon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium mb-1">{template.name}</h4>
                            <p className="text-sm text-muted-foreground mb-2">{template.description}</p>
                            <Badge variant="outline" className="text-xs">{template.category}</Badge>
                          </div>
                        </div>
                        <Button 
                          variant="outline" 
                          className="w-full mt-4" 
                          size="sm"
                          onClick={() => handleGenerateTemplate(template)}
                          disabled={isGenerating}
                        >
                          {isGenerating ? (
                            <>
                              <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                              Generating...
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-2" />
                              Generate Report
                            </>
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
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
                  <Select value={reportType} onValueChange={setReportType}>
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
                  <Select value={dateRange} onValueChange={setDateRange}>
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
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">CSV File</SelectItem>
                      <SelectItem value="json">JSON Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Include</Label>
                  <Select value={includeLevel} onValueChange={setIncludeLevel}>
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
                <Button 
                  variant="gradient" 
                  className="flex-1"
                  onClick={handleGenerateCustomReport}
                  disabled={generatingReport === 'custom'}
                >
                  {generatingReport === 'custom' ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Generate & Download
                    </>
                  )}
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
              {exportHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">No export history</p>
              ) : (
                <div className="space-y-3">
                  {exportHistory.map((export_item) => (
                    <div key={export_item.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <p className="font-medium text-sm">{export_item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(export_item.createdAt), 'MMM d, yyyy')} • {export_item.size}
                          </p>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                        {export_item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
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
              {statistics ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Reports This Month</p>
                    <p className="text-2xl font-bold">{statistics.reportsThisMonth}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Size</p>
                    <p className="text-2xl font-bold">{statistics.totalSize}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Most Popular</p>
                    <p className="font-medium">{statistics.mostPopular}</p>
                  </div>
                </>
              ) : (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              )}
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

      {/* Custom Report Modal */}
      <CustomReportModal
        isOpen={isCustomModalOpen}
        onClose={() => setIsCustomModalOpen(false)}
        onSuccess={() => {
          loadReportsData();
          setIsCustomModalOpen(false);
        }}
      />
    </div>
  );
};

export default ReportsExport;
