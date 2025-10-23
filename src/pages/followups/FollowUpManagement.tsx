import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Filter, Plus, Loader2, Phone, MessageSquare, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import * as followUpService from "@/services/followUpService";
import type { FollowUp, FollowUpStats } from "@/services/followUpService";
import CreateFollowUpModal from "@/components/modals/CreateFollowUpModal";
import FollowUpDetailModal from "@/components/modals/FollowUpDetailModal";

const FollowUpManagement = () => {
  const { t } = useTranslation();
  const [followUps, setFollowUps] = useState<FollowUp[]>([]);
  const [stats, setStats] = useState<FollowUpStats>({
    pending: 0,
    completed: 0,
    overdue: 0,
    today: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedGymId, setSelectedGymId] = useState("all-gyms");
  const [dateRange, setDateRange] = useState("today");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUp | null>(null);

  // Load follow-ups from backend
  const loadFollowUps = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      let dateFrom: string | undefined;
      let dateTo: string | undefined;
      const now = new Date();
      
      if (dateRange === "today") {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFrom = today.toISOString();
        dateTo = tomorrow.toISOString();
      } else if (dateRange === "week") {
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - now.getDay());
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 7);
        dateFrom = weekStart.toISOString();
        dateTo = weekEnd.toISOString();
      } else if (dateRange === "month") {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        dateFrom = monthStart.toISOString();
        dateTo = monthEnd.toISOString();
      }

      const response = await followUpService.getAllFollowUps({
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        type: selectedType !== "all" ? selectedType : undefined,
        gymId: selectedGymId !== "all-gyms" ? selectedGymId : undefined,
        dateFrom,
        dateTo,
        showCompleted: true,
      });

      setFollowUps(response.data);
      setStats(response.stats);
    } catch (error: any) {
      console.error("Error loading follow-ups:", error);
      toast.error(error.response?.data?.message || t("followUps.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  // Load follow-ups on mount and when filters change
  useEffect(() => {
    loadFollowUps();
  }, [selectedStatus, selectedType, selectedGymId, dateRange]);

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return <Phone className="h-4 w-4" />;
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'VISIT':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'OVERDUE':
        return 'bg-red-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleCompleteFollowUp = async (followUpId: string) => {
    try {
      await followUpService.completeFollowUp(followUpId);
      toast.success(t("followUps.completeSuccess"));
      loadFollowUps();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("followUps.completeFailed"));
    }
  };

  const handleCancelFollowUp = async (followUpId: string) => {
    try {
      await followUpService.cancelFollowUp(followUpId);
      toast.success(t("followUps.cancelSuccess"));
      loadFollowUps();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("followUps.cancelFailed"));
    }
  };

  const handleViewDetails = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-end">
        <Button variant="gradient" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("followUps.scheduleFollowUp")}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("followUps.todaysFollowUps")}</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">{t("followUps.scheduledForToday")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("followUps.pending")}</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">{t("followUps.awaitingCompletion")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("followUps.overdue")}</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">{t("followUps.requiresAttention")}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("followUps.completed")}</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">{t("followUps.successfullyCompleted")}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("followUps.filters")}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("followUps.followUpType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("followUps.allTypes")}</SelectItem>
                <SelectItem value="CALL">{t("followUps.types.call")}</SelectItem>
                <SelectItem value="WHATSAPP">{t("followUps.types.whatsapp")}</SelectItem>
                <SelectItem value="EMAIL">{t("followUps.types.email")}</SelectItem>
                <SelectItem value="VISIT">{t("followUps.types.visit")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("followUps.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("followUps.allStatus")}</SelectItem>
                <SelectItem value="PENDING">{t("followUps.pending")}</SelectItem>
                <SelectItem value="COMPLETED">{t("followUps.completed")}</SelectItem>
                <SelectItem value="OVERDUE">{t("followUps.overdue")}</SelectItem>
                <SelectItem value="CANCELLED">{t("followUps.cancelled")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder={t("followUps.dateRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">{t("followUps.today")}</SelectItem>
                <SelectItem value="week">{t("followUps.thisWeek")}</SelectItem>
                <SelectItem value="month">{t("followUps.thisMonth")}</SelectItem>
                <SelectItem value="all">{t("followUps.allTime")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("followUps.scheduledFollowUps")}</CardTitle>
          <CardDescription>{t("followUps.manageFollowUps")}</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">{t("followUps.loadingFollowUps")}</span>
            </div>
          ) : (
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">{t("followUps.pending")} ({followUps.filter(f => f.status === 'PENDING').length})</TabsTrigger>
                <TabsTrigger value="completed">{t("followUps.completed")} ({followUps.filter(f => f.status === 'COMPLETED').length})</TabsTrigger>
                <TabsTrigger value="overdue">{t("followUps.overdue")} ({followUps.filter(f => f.status === 'OVERDUE').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'PENDING').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("followUps.noPendingFollowUps")}</p>
                ) : (
                  followUps.filter(f => f.status === 'PENDING').map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(followUp)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 min-w-[80px]">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(followUp.scheduledAt)}
                          </span>
                          <span className="text-2xl font-bold">
                            {new Date(followUp.scheduledAt).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{followUp.lead.name}</h4>
                            <Badge className={`${getStatusColor(followUp.status)} text-white`}>
                              {t(`followUps.${followUp.status.toLowerCase()}`)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(followUp.scheduledAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(followUp.type)}
                              {t(`followUps.types.${followUp.type.toLowerCase()}`)}
                            </span>
                            <span>•</span>
                            <span>{followUp.lead.gym.name}</span>
                          </div>
                          {followUp.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{followUp.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm">{t("followUps.reschedule")}</Button>
                        <Button 
                          variant="gradient" 
                          size="sm"
                          onClick={() => handleCompleteFollowUp(followUp.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t("followUps.complete")}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'COMPLETED').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("followUps.noCompletedFollowUps")}</p>
                ) : (
                  followUps.filter(f => f.status === 'COMPLETED').map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(followUp)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 min-w-[80px]">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(followUp.scheduledAt)}
                          </span>
                          <span className="text-2xl font-bold">
                            {new Date(followUp.scheduledAt).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{followUp.lead.name}</h4>
                            <Badge className={`${getStatusColor(followUp.status)} text-white`}>
                              {t(`followUps.${followUp.status.toLowerCase()}`)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(followUp.scheduledAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(followUp.type)}
                              {t(`followUps.types.${followUp.type.toLowerCase()}`)}
                            </span>
                            <span>•</span>
                            <span>{followUp.lead.gym.name}</span>
                          </div>
                          {followUp.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{followUp.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(followUp)}>{t("followUps.viewDetails")}</Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="overdue" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'OVERDUE').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">{t("followUps.noOverdueFollowUps")}</p>
                ) : (
                  followUps.filter(f => f.status === 'OVERDUE').map((followUp) => (
                    <div key={followUp.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => handleViewDetails(followUp)}>
                      <div className="flex items-center gap-4 flex-1">
                        <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 min-w-[80px]">
                          <span className="text-xs text-muted-foreground">
                            {formatDate(followUp.scheduledAt)}
                          </span>
                          <span className="text-2xl font-bold">
                            {new Date(followUp.scheduledAt).getDate()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{followUp.lead.name}</h4>
                            <Badge className={`${getStatusColor(followUp.status)} text-white`}>
                              {t(`followUps.${followUp.status.toLowerCase()}`)}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {formatTime(followUp.scheduledAt)}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              {getTypeIcon(followUp.type)}
                              {t(`followUps.types.${followUp.type.toLowerCase()}`)}
                            </span>
                            <span>•</span>
                            <span>{followUp.lead.gym.name}</span>
                          </div>
                          {followUp.notes && (
                            <p className="text-sm text-muted-foreground mt-1">{followUp.notes}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                        <Button variant="outline" size="sm">{t("followUps.reschedule")}</Button>
                        <Button 
                          variant="gradient" 
                          size="sm"
                          onClick={() => handleCompleteFollowUp(followUp.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          {t("followUps.complete")}
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </CardContent>
      </Card>

      {/* Create Follow-Up Modal */}
      <CreateFollowUpModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          loadFollowUps();
          setIsCreateModalOpen(false);
        }}
      />

      {/* Follow-Up Detail Modal */}
      <FollowUpDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedFollowUp(null);
        }}
        followUp={selectedFollowUp}
        onComplete={handleCompleteFollowUp}
        onCancel={handleCancelFollowUp}
      />
    </div>
  );
};

export default FollowUpManagement;
