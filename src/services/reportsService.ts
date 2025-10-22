import api from './api';

export interface ReportTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  reportType: string;
}

export interface ExportHistory {
  id: string;
  name: string;
  reportType: string;
  format: string;
  size: string;
  status: string;
  createdAt: string;
}

export interface ExportStatistics {
  reportsThisMonth: number;
  totalSize: string;
  mostPopular: string;
  lastExport: string;
}

export interface ReportFilters {
  gymId?: string;
  startDate?: string;
  endDate?: string;
  format?: 'PDF' | 'XLSX' | 'CSV' | 'JSON';
  includeLevel?: 'ALL' | 'SUMMARY' | 'DETAILED';
}

export interface ReportData {
  content: string;
  summary?: any;
  totalRecords?: number;
}

/**
 * Get report templates
 */
export const getReportTemplates = async (): Promise<{ success: boolean; data: ReportTemplate[] }> => {
  const response = await api.get('/reports/templates');
  return response.data;
};

/**
 * Generate leads report
 */
export const generateLeadsReport = async (filters: ReportFilters = {}): Promise<{ success: boolean; data: ReportData; message: string }> => {
  const response = await api.get('/reports/generate/leads', { params: filters });
  return response.data;
};

/**
 * Generate performance report
 */
export const generatePerformanceReport = async (filters: ReportFilters = {}): Promise<{ success: boolean; data: ReportData; message: string }> => {
  const response = await api.get('/reports/generate/performance', { params: filters });
  return response.data;
};

/**
 * Generate conversion report
 */
export const generateConversionReport = async (filters: ReportFilters = {}): Promise<{ success: boolean; data: ReportData; message: string }> => {
  const response = await api.get('/reports/generate/conversion', { params: filters });
  return response.data;
};

/**
 * Generate activity report
 */
export const generateActivityReport = async (filters: ReportFilters = {}): Promise<{ success: boolean; data: ReportData; message: string }> => {
  const response = await api.get('/reports/generate/activity', { params: filters });
  return response.data;
};

/**
 * Get export history
 */
export const getExportHistory = async (limit: number = 10): Promise<{ success: boolean; data: ExportHistory[] }> => {
  const response = await api.get('/reports/history', { params: { limit } });
  return response.data;
};

/**
 * Get export statistics
 */
export const getExportStatistics = async (): Promise<{ success: boolean; data: ExportStatistics }> => {
  const response = await api.get('/reports/statistics');
  return response.data;
};

/**
 * Download report content as file
 */
export const downloadReport = (content: string, filename: string, format: string = 'csv') => {
  const mimeTypes: Record<string, string> = {
    csv: 'text/csv;charset=utf-8;',
    json: 'application/json;charset=utf-8;',
    txt: 'text/plain;charset=utf-8;'
  };

  const blob = new Blob([content], { type: mimeTypes[format.toLowerCase()] || mimeTypes.csv });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

