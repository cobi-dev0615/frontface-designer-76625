import { useState, useEffect } from "react";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Filter, Plus, Loader2, Phone, MessageSquare, Mail, MapPin } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import * as followUpService from "@/services/followUpService";
import type { FollowUp, FollowUpStats } from "@/services/followUpService";
import CreateFollowUpModal from "@/components/modals/CreateFollowUpModal";
import FollowUpDetailModal from "@/components/modals/FollowUpDetailModal";

const FollowUpManagement = () => {
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
      toast.error(error.response?.data?.message || "Failed to load follow-ups");
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
      toast.success("Follow-up completed successfully");
      loadFollowUps();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to complete follow-up");
    }
  };

  const handleCancelFollowUp = async (followUpId: string) => {
    try {
      await followUpService.cancelFollowUp(followUpId);
      toast.success("Follow-up cancelled successfully");
      loadFollowUps();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to cancel follow-up");
    }
  };

  const handleViewDetails = (followUp: FollowUp) => {
    setSelectedFollowUp(followUp);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          
        </div>
        <Button variant="gradient" onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Schedule Follow-Up
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Follow-Ups</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.today}</div>
            <p className="text-xs text-muted-foreground">Scheduled for today</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting completion</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{stats.overdue}</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Successfully completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Follow-up Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="CALL">Call</SelectItem>
                <SelectItem value="WHATSAPP">WhatsApp</SelectItem>
                <SelectItem value="EMAIL">Email</SelectItem>
                <SelectItem value="VISIT">Visit</SelectItem>
              </SelectContent>
            </Select>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            <Select value={dateRange} onValueChange={setDateRange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Date Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="today">Today</SelectItem>
                <SelectItem value="week">This Week</SelectItem>
                <SelectItem value="month">This Month</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Follow-ups Table */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Follow-Ups</CardTitle>
          <CardDescription>Manage your upcoming and past follow-ups</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading follow-ups...</span>
            </div>
          ) : (
            <Tabs defaultValue="pending">
              <TabsList>
                <TabsTrigger value="pending">Pending ({followUps.filter(f => f.status === 'PENDING').length})</TabsTrigger>
                <TabsTrigger value="completed">Completed ({followUps.filter(f => f.status === 'COMPLETED').length})</TabsTrigger>
                <TabsTrigger value="overdue">Overdue ({followUps.filter(f => f.status === 'OVERDUE').length})</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'PENDING').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No pending follow-ups</p>
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
                              {followUp.status}
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
                              {followUp.type}
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
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button 
                          variant="gradient" 
                          size="sm"
                          onClick={() => handleCompleteFollowUp(followUp.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'COMPLETED').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No completed follow-ups</p>
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
                              {followUp.status}
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
                              {followUp.type}
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
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(followUp)}>View Details</Button>
                      </div>
                    </div>
                  ))
                )}
              </TabsContent>

              <TabsContent value="overdue" className="space-y-4 mt-4">
                {followUps.filter(f => f.status === 'OVERDUE').length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No overdue follow-ups</p>
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
                              {followUp.status}
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
                              {followUp.type}
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
                        <Button variant="outline" size="sm">Reschedule</Button>
                        <Button 
                          variant="gradient" 
                          size="sm"
                          onClick={() => handleCompleteFollowUp(followUp.id)}
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Complete
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
