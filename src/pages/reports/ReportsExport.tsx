import { useState, useEffect } from "react";
import { FileText, Download, Calendar, Filter, BarChart, Users, TrendingUp, MessageCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { format } from "date-fns";
import * as reportsService from "@/services/reportsService";
import type { ReportTemplate, ExportHistory, ExportStatistics } from "@/services/reportsService";
import CustomReportModal from "@/components/modals/CustomReportModal";

const ReportsExport = () => {
  const { t } = useTranslation();
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
      toast.error(t("reports.loadFailed"));
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

  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'Performance': t("reports.categories.performance"),
      'Leads': t("reports.categories.leads"),
      'Analytics': t("reports.categories.analytics"),
      'Communication': t("reports.categories.communication"),
    };
    
    return categoryMap[category] || category;
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
          throw new Error(t("reports.unknownReportType"));
      }

      // Download the report
      reportsService.downloadReport(response.data.content, filename, 'csv');
      toast.success(t("reports.generateSuccess"));
      
      // Reload history
      loadReportsData();
    } catch (error: any) {
      console.error("Error generating report:", error);
      toast.error(error.response?.data?.message || t("reports.generateFailed"));
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
          throw new Error(t("reports.unknownReportType"));
      }

      // Download the report
      reportsService.downloadReport(response.data.content, filename, reportFormat);
      toast.success(t("reports.generateSuccess"));
      
      // Reload history
      loadReportsData();
    } catch (error: any) {
      console.error("Error generating custom report:", error);
      toast.error(error.response?.data?.message || t("reports.generateFailed"));
    } finally {
      setGeneratingReport(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("reports.reportsExport")}</h1>
          <p className="text-muted-foreground">{t("reports.generateDownloadReports")}</p>
        </div>
        <Button variant="gradient" onClick={() => setIsCustomModalOpen(true)}>
          <FileText className="h-4 w-4 mr-2" />
          {t("reports.createCustomReport")}
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Report Templates */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.reportTemplates")}</CardTitle>
              <CardDescription>{t("reports.preConfiguredReports")}</CardDescription>
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
                            <Badge variant="outline" className="text-xs">{getCategoryTranslation(template.category)}</Badge>
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
                              {t("reports.generating")}
                            </>
                          ) : (
                            <>
                              <Download className="h-3 w-3 mr-2" />
                              {t("reports.generateReport")}
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
              <CardTitle>{t("reports.customReportBuilder")}</CardTitle>
              <CardDescription>{t("reports.configureCustomParameters")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>{t("reports.reportType")}</Label>
                  <Select value={reportType} onValueChange={setReportType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="leads">{t("reports.reportTypes.leads")}</SelectItem>
                      <SelectItem value="performance">{t("reports.reportTypes.performance")}</SelectItem>
                      <SelectItem value="conversion">{t("reports.reportTypes.conversion")}</SelectItem>
                      <SelectItem value="activity">{t("reports.reportTypes.activity")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("reports.dateRange")}</Label>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">{t("reports.today")}</SelectItem>
                      <SelectItem value="week">{t("reports.thisWeek")}</SelectItem>
                      <SelectItem value="month">{t("reports.thisMonth")}</SelectItem>
                      <SelectItem value="quarter">{t("reports.thisQuarter")}</SelectItem>
                      <SelectItem value="year">{t("reports.thisYear")}</SelectItem>
                      <SelectItem value="custom">{t("reports.customRange")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("reports.format")}</Label>
                  <Select value={reportFormat} onValueChange={setReportFormat}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="csv">{t("reports.csvFile")}</SelectItem>
                      <SelectItem value="json">{t("reports.jsonData")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>{t("reports.include")}</Label>
                  <Select value={includeLevel} onValueChange={setIncludeLevel}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">{t("reports.allData")}</SelectItem>
                      <SelectItem value="summary">{t("reports.summaryOnly")}</SelectItem>
                      <SelectItem value="detailed">{t("reports.detailedView")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              <div className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Filter className="h-4 w-4 mr-2" />
                  {t("reports.advancedFilters")}
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
                      {t("reports.generating")}
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      {t("reports.generateDownload")}
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Recent Exports */}
          <Card>
            <CardHeader>
              <CardTitle>{t("reports.recentExports")}</CardTitle>
              <CardDescription>{t("reports.previouslyGeneratedReports")}</CardDescription>
            </CardHeader>
            <CardContent>
              {exportHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">{t("reports.noExportHistory")}</p>
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
              <CardTitle className="text-base">{t("reports.exportStatistics")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {statistics ? (
                <>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("reports.reportsThisMonth")}</p>
                    <p className="text-2xl font-bold">{statistics.reportsThisMonth}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("reports.totalSize")}</p>
                    <p className="text-2xl font-bold">{statistics.totalSize}</p>
                  </div>
                  <Separator />
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{t("reports.mostPopular")}</p>
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
              <CardTitle className="text-base">{t("reports.scheduledReports")}</CardTitle>
              <CardDescription>{t("reports.automatedReportGeneration")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t("reports.monthlySummary")}</p>
                  <p className="text-xs text-muted-foreground">{t("reports.every1stOfMonth")}</p>
                </div>
                <Badge className="bg-green-500">{t("reports.active")}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm">{t("reports.weeklyLeads")}</p>
                  <p className="text-xs text-muted-foreground">{t("reports.everyMonday")}</p>
                </div>
                <Badge className="bg-green-500">{t("reports.active")}</Badge>
              </div>
              <Button variant="outline" className="w-full mt-2" size="sm">
                <Calendar className="h-3 w-3 mr-2" />
                {t("reports.manageSchedule")}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("reports.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" size="sm">
                <FileText className="h-4 w-4 mr-2" />
                {t("reports.emailReport")}
              </Button>
              <Button variant="outline" className="w-full justify-start" size="sm">
                <Download className="h-4 w-4 mr-2" />
                {t("reports.bulkDownload")}
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
