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
import * as reportsService from "@/services/reportsService";

interface CustomReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CustomReportModal({ isOpen, onClose, onSuccess }: CustomReportModalProps) {
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
      toast.error(error.response?.data?.message || "Failed to generate report");
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
            Create Custom Report
          </DialogTitle>
          <DialogDescription>
            Configure your custom report with advanced options
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 px-1">
          {/* Report Type */}
          <div className="space-y-2">
            <Label htmlFor="reportType">Report Type *</Label>
            <Select
              value={formData.reportType}
              onValueChange={(value) => setFormData(prev => ({ ...prev, reportType: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select report type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="leads">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    Leads Report
                  </div>
                </SelectItem>
                <SelectItem value="performance">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Performance Report
                  </div>
                </SelectItem>
                <SelectItem value="conversion">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Conversion Report
                  </div>
                </SelectItem>
                <SelectItem value="activity">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    Activity Report
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date Range */}
          <div className="space-y-2">
            <Label>Date Range *</Label>
            <Select
              value={formData.dateRange}
              onValueChange={(value) => setFormData(prev => ({ ...prev, dateRange: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select date range" />
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

          {/* Custom Date Range */}
          {formData.dateRange === 'custom' && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Start Date *</Label>
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
                        <span>Pick a date</span>
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
                <Label>End Date *</Label>
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
                        <span>Pick a date</span>
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
            <Label>Export Format *</Label>
            <Select
              value={formData.format}
              onValueChange={(value) => setFormData(prev => ({ ...prev, format: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select format" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="csv">CSV File (.csv)</SelectItem>
                <SelectItem value="json">JSON Data (.json)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Include Level */}
          <div className="space-y-2">
            <Label>Detail Level *</Label>
            <Select
              value={formData.includeLevel}
              onValueChange={(value) => setFormData(prev => ({ ...prev, includeLevel: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select detail level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Data</SelectItem>
                <SelectItem value="summary">Summary Only</SelectItem>
                <SelectItem value="detailed">Detailed View</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Additional Options */}
          <div className="space-y-3">
            <Label>Additional Options</Label>
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
                  Include summary statistics
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
                  Include detailed records
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
                  Include chart data (Coming soon)
                </label>
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="flex-shrink-0">
          <form onSubmit={handleSubmit} className="w-full flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isGenerating}>
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

