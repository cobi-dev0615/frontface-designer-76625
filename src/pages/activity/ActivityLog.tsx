import { useState, useEffect } from "react";
import { Calendar, User, MessageSquare, Phone, Mail, CheckCircle, UserPlus, FileText, Settings, Filter, Download, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useTranslation } from "@/hooks/useTranslation";
import ActivityDetailModal from "@/components/modals/ActivityDetailModal";
import * as activityLogService from "@/services/activityLogService";
import type { ActivityLog, ActivityLogFilters } from "@/services/activityLogService";
import { toast } from "sonner";

// Activity interface is now imported from service

const ActivityLog = () => {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityLog | null>(null);
  const [stats, setStats] = useState({
    totalActivities: 0,
    leadActivities: 0,
    followUpActivities: 0,
    messageActivities: 0,
    userActivities: 0
  });
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false
  });

  // Load activity logs from API
  useEffect(() => {
    loadActivityLogs();
  }, [selectedType, dateRange, searchQuery]);

  const loadActivityLogs = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      const now = new Date();
      let startDate: string | undefined;
      let endDate: string | undefined;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate = weekAgo.toISOString();
          endDate = now.toISOString();
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          startDate = monthAgo.toISOString();
          endDate = now.toISOString();
          break;
        case "all":
        default:
          // No date filter
          break;
      }

      const filters: ActivityLogFilters = {
        type: selectedType === "all" ? undefined : selectedType,
        search: searchQuery || undefined,
        startDate,
        endDate,
        limit: 50,
        offset: 0
      };

      const response = await activityLogService.getActivityLogs(filters);
      
      setActivities(response.data);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Error loading activity logs:", error);
      toast.error(t("activity.failedToLoad"));
    } finally {
      setIsLoading(false);
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return <UserPlus className="h-5 w-5 text-green-500" />;
      case 'LEAD_UPDATED':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'LEAD_STATUS_CHANGED':
        return <Settings className="h-5 w-5 text-purple-500" />;
      case 'MESSAGE_SENT':
        return <MessageSquare className="h-5 w-5 text-indigo-500" />;
      case 'FOLLOW_UP_CREATED':
        return <Phone className="h-5 w-5 text-orange-500" />;
      case 'FOLLOW_UP_COMPLETED':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'USER_LOGIN':
        return <User className="h-5 w-5 text-gray-500" />;
      case 'CONVERSATION_STARTED':
        return <MessageSquare className="h-5 w-5 text-blue-500" />;
      case 'CONVERSATION_CLOSED':
        return <MessageSquare className="h-5 w-5 text-gray-500" />;
      default:
        return <FileText className="h-5 w-5 text-gray-500" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'LEAD_UPDATED':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      case 'LEAD_STATUS_CHANGED':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
      case 'MESSAGE_SENT':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'FOLLOW_UP_CREATED':
        return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'FOLLOW_UP_COMPLETED':
        return 'bg-green-500/10 text-green-500 border-green-500/20';
      case 'USER_LOGIN':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20';
    }
  };

  const formatActivityType = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'LEAD_CREATED': t("activity.leadCreated"),
      'LEAD_UPDATED': t("activity.leadUpdated"),
      'LEAD_STATUS_CHANGED': t("activity.statusChanged"),
      'MESSAGE_SENT': t("activity.messageSent"),
      'FOLLOW_UP_CREATED': t("activity.followUpCreated"),
      'FOLLOW_UP_COMPLETED': t("activity.followUpCompleted"),
      'USER_LOGIN': t("activity.userLogin"),
      'CONVERSATION_STARTED': t("activity.activityTypes.conversationStarted"),
      'CONVERSATION_CLOSED': t("activity.activityTypes.conversationClosed"),
    };
    
    return typeMap[type] || type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return t("activity.justNow");
    if (diffInMinutes < 60) return `${diffInMinutes}${t("activity.minAgo")}`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}${t("activity.hourAgo")}`;
    return format(date, 'MMM d, h:mm a');
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const filteredActivities = activities.filter(activity => {
    const matchesType = selectedType === "all" || activity.type === selectedType;
    const matchesSearch = searchQuery === "" || 
      activity.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      activity.user.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesType && matchesSearch;
  });

  const handleViewDetails = (activity: ActivityLog) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  const handleExport = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range for export
      const now = new Date();
      let startDate: string | undefined;
      let endDate: string | undefined;

      switch (dateRange) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
          endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59).toISOString();
          break;
        case "week":
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          startDate = weekAgo.toISOString();
          endDate = now.toISOString();
          break;
        case "month":
          const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          startDate = monthAgo.toISOString();
          endDate = now.toISOString();
          break;
        case "all":
        default:
          // No date filter
          break;
      }

      const filters: ActivityLogFilters = {
        type: selectedType === "all" ? undefined : selectedType,
        search: searchQuery || undefined,
        startDate,
        endDate
      };

      const blob = await activityLogService.exportActivityLogs(filters);
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `activity-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success(t("activity.exportSuccess"));
    } catch (error: any) {
      console.error("Error exporting activity logs:", error);
      toast.error(t("activity.exportFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("activity.activityLog")}</h1>
          <p className="text-muted-foreground mt-1">
            {t("activity.trackAllActivities")}
          </p>
        </div>
        <Button 
          variant="outline" 
          className="border-2 border-border"
          onClick={handleExport}
          disabled={isLoading}
        >
          <Download className="h-4 w-4 mr-2" />
          {isLoading ? t("common.exporting") : t("activity.exportLog")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activity.totalActivities")}</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalActivities}</div>
            <p className="text-xs text-muted-foreground">{t("activity.inSelectedPeriod")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activity.leadActivities")}</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.leadActivities}
            </div>
            <p className="text-xs text-muted-foreground">{t("activity.leadRelatedEvents")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activity.followUps")}</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.followUpActivities}
            </div>
            <p className="text-xs text-muted-foreground">{t("activity.followUpActions")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("activity.messages")}</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.messageActivities}
            </div>
            <p className="text-xs text-muted-foreground">{t("activity.messagesSent")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("activity.filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder={t("activity.searchActivities")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t("activity.activityType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("activity.allTypes")}</SelectItem>
                <SelectItem value="LEAD_CREATED">{t("activity.leadCreated")}</SelectItem>
                <SelectItem value="LEAD_UPDATED">{t("activity.leadUpdated")}</SelectItem>
                <SelectItem value="LEAD_STATUS_CHANGED">{t("activity.statusChanged")}</SelectItem>
                <SelectItem value="FOLLOW_UP_CREATED">{t("activity.followUpCreated")}</SelectItem>
                <SelectItem value="FOLLOW_UP_COMPLETED">{t("activity.followUpCompleted")}</SelectItem>
                <SelectItem value="MESSAGE_SENT">{t("activity.messageSent")}</SelectItem>
                <SelectItem value="USER_LOGIN">{t("activity.userLogin")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("activity.dateRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("activity.today")}</SelectItem>
                <SelectItem value="week">{t("activity.thisWeek")}</SelectItem>
                <SelectItem value="month">{t("activity.thisMonth")}</SelectItem>
                <SelectItem value="all">{t("activity.allTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>{t("activity.activityTimeline")}</CardTitle>
          <CardDescription>
            {t("activity.chronologicalList")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">{t("activity.loadingActivities")}</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("activity.noActivitiesFound")}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredActivities.map((activity, index) => (
                <div key={activity.id} className="cursor-pointer hover:bg-muted/30 rounded-lg -mx-2 px-2 transition-colors" onClick={() => handleViewDetails(activity)}>
                  <div className="flex gap-4">
                    {/* Timeline line */}
                    <div className="flex flex-col items-center">
                      <div className={`p-2 rounded-lg border ${getActivityColor(activity.type)}`}>
                        {getActivityIcon(activity.type)}
                      </div>
                      {index < filteredActivities.length - 1 && (
                        <div className="w-0.5 h-full bg-border my-2" />
                      )}
                    </div>

                    {/* Activity Content */}
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Badge variant="outline" className="mb-2">
                            {formatActivityType(activity.type)}
                          </Badge>
                          <p className="font-medium">{activity.description}</p>
                        </div>
                        <span className="text-xs text-muted-foreground whitespace-nowrap ml-4">
                          {formatTime(activity.createdAt)}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        {/* User */}
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium">
                            {getUserInitials(activity.user.name)}
                          </div>
                          <span>{activity.user.name}</span>
                        </div>

                        {/* Lead */}
                        {activity.lead && (
                          <>
                            <span>•</span>
                            <span>{t("activity.lead")}: {activity.lead.name}</span>
                          </>
                        )}

                        {/* Metadata */}
                        {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                          <>
                            <span>•</span>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-auto p-0 text-xs"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(activity);
                              }}
                            >
                              {t("activity.viewDetails")}
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Metadata Display (if any) */}
                      {activity.metadata && activity.type === 'LEAD_STATUS_CHANGED' && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {t("activity.status")}: <Badge variant="outline" className="text-xs">{activity.metadata.previousStatus}</Badge>
                          {' → '}
                          <Badge variant="outline" className="text-xs">{activity.metadata.newStatus}</Badge>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          isOpen={isDetailModalOpen}
          onClose={() => {
            setIsDetailModalOpen(false);
            setSelectedActivity(null);
          }}
          activity={{
            id: selectedActivity.id,
            type: selectedActivity.type,
            description: selectedActivity.description,
            userId: selectedActivity.userId || '',
            user: selectedActivity.user || { name: 'Unknown', email: '' },
            leadId: selectedActivity.leadId,
            lead: selectedActivity.lead,
            metadata: selectedActivity.metadata,
            createdAt: selectedActivity.createdAt
          }}
        />
      )}
    </div>
  );
};

export default ActivityLog;

