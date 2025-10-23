import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Loader2, Download, FileText, Users, TrendingUp, MessageCircle } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import * as reportsService from "@/services/reportsService";

interface CustomReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomReportModal({ isOpen, onClose, onSuccess }: CustomReportModalProps) {
  const { t } = useTranslation();
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    reportType: "leads",
    dateRange: "month",
    customStartDate: undefined as Date | undefined,
    customEndDate: undefined as Date | undefined,
    format: "csv",
    includeLevel: "all",
    includeSummary: true,
    includeCharts: false,
    includeDetails: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsGenerating(true);
      
      // Build filters
      const filters: any = {
        format: formData.format.toUpperCase(),
        includeLevel: formData.includeLevel.toUpperCase()
      };

      // Add custom date range if selected
      if (formData.dateRange === 'custom' && formData.customStartDate && formData.customEndDate) {
        filters.startDate = formData.customStartDate.toISOString();
        filters.endDate = formData.customEndDate.toISOString();
      }

      // Generate report based on type
      let response;
      const timestamp = new Date().toISOString().split('T')[0];
      const filename = `${formData.reportType}_report_${timestamp}.${formData.format}`;

      switch (formData.reportType) {
        case 'leads':
          response = await reportsService.generateLeadsReport(filters);
          break;
        case 'performance':
          response = await reportsService.generatePerformanceReport(filters);
          break;
        case 'conversion':
          response = await reportsService.generateConversionReport(filters);
          break;
        case 'activity':
          response = await reportsService.generateActivityReport(filters);
          break;
        default:
          throw new Error('Unknown report type');
      }

      // Download the report
      reportsService.downloadReport(response.data.content, filename, formData.format);
      toast.success(response.message);
      
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error generating custom report:", error);
      toast.error(error.response?.data?.message || t("modals.customReport.generateReportFailed"));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleClose = () => {
    setFormData({
      reportType: "leads",
      dateRange: "month",
      customStartDate: undefined,
      customEndDate: undefined,
      format: "csv",
      includeLevel: "all",
      includeSummary: true,
      includeCharts: false,
      includeDetails: true
    });
    onClose();
  };

  const getReportIcon = () => {
    switch (formData.reportType) {
      case 'leads':
        return <Users className="h-5 w-5" />;
      case 'performance':
        return <TrendingUp className="h-5 w-5" />;
      case 'conversion':
        return <TrendingUp className="h-5 w-5" />;
      case 'activity':
        return <MessageCircle className="h-5 w-5" />;
      default:
        return <FileText className="h-5 w-5" />;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[66vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              {getReportIcon()}
            </div>
            {t("modals.customReport.title")}
          </DialogTitle>
          <DialogDescription>
            {t("modals.customReport.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 px-1">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType">{t("modals.customReport.reportType")}</Label>
            <Select
              value={formData.reportType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.customReport.selectReportType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leads">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {t("modals.customReport.leadsReport")}
                  </div>
                </SelectItem>
                <SelectItem value="performance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t("modals.customReport.performanceReport")}
                  </div>
                </SelectItem>
                <SelectItem value="conversion">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    {t("modals.customReport.conversionReport")}
                  </div>
                </SelectItem>
                <SelectItem value="activity">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    {t("modals.customReport.activityReport")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>{t("modals.customReport.dateRange")}</Label>
            <Select
              value={formData.dateRange}
              onValueChange={(value) => setFormData(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.customReport.selectDateRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("modals.customReport.today")}</SelectItem>
                <SelectItem value="week">{t("modals.customReport.thisWeek")}</SelectItem>
                <SelectItem value="month">{t("modals.customReport.thisMonth")}</SelectItem>
                <SelectItem value="quarter">{t("modals.customReport.thisQuarter")}</SelectItem>
                <SelectItem value="year">{t("modals.customReport.thisYear")}</SelectItem>
                <SelectItem value="custom">{t("modals.customReport.customRange")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Custom Date Range */}
          {formData.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>{t("modals.customReport.startDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.customStartDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.customStartDate ? (
                        format(formData.customStartDate, "PPP")
                      ) : (
                        <span>{t("modals.customReport.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.customStartDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, customStartDate: date }))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label>{t("modals.customReport.endDate")}</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.customEndDate && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.customEndDate ? (
                        format(formData.customEndDate, "PPP")
                      ) : (
                        <span>{t("modals.customReport.pickDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.customEndDate}
                      onSelect={(date) => setFormData(prev => ({ ...prev, customEndDate: date }))}
                      disabled={(date) => formData.customStartDate ? date < formData.customStartDate : false}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          )}

          {/* Format */}
          <div className="space-y-2">
            <Label>{t("modals.customReport.exportFormat")}</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.customReport.selectFormat")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">{t("modals.customReport.csvFile")}</SelectItem>
                <SelectItem value="json">{t("modals.customReport.jsonData")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Level */}
          <div className="space-y-2">
            <Label>{t("modals.customReport.detailLevel")}</Label>
            <Select
              value={formData.includeLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, includeLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.customReport.selectDetailLevel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("modals.customReport.allData")}</SelectItem>
                <SelectItem value="summary">{t("modals.customReport.summaryOnly")}</SelectItem>
                <SelectItem value="detailed">{t("modals.customReport.detailedView")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label>{t("modals.customReport.additionalOptions")}</Label>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeSummary" 
                  checked={formData.includeSummary}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeSummary: checked as boolean }))}
                />
                <label
                  htmlFor="includeSummary"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("modals.customReport.includeSummaryStats")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeDetails" 
                  checked={formData.includeDetails}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeDetails: checked as boolean }))}
                />
                <label
                  htmlFor="includeDetails"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("modals.customReport.includeDetailedRecords")}
                </label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="includeCharts" 
                  checked={formData.includeCharts}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, includeCharts: checked as boolean }))}
                  disabled
                />
                <label
                  htmlFor="includeCharts"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {t("modals.customReport.includeChartData")}
                </label>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-shrink-0">
          <form onSubmit={handleSubmit} className="w-full flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("modals.customReport.cancel")}
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("modals.customReport.generating")}
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  {t("modals.customReport.generateReport")}
                </>
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

