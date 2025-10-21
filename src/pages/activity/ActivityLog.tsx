import { useState, useEffect } from "react";
import { Calendar, User, MessageSquare, Phone, Mail, CheckCircle, UserPlus, FileText, Settings, Filter, Download, Search, Loader2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import ActivityDetailModal from "@/components/modals/ActivityDetailModal";

// Mock data for now - will be replaced with backend data
interface Activity {
  id: string;
  type: string;
  description: string;
  userId: string;
  user: {
    name: string;
    email: string;
    avatar?: string;
  };
  leadId?: string;
  lead?: {
    name: string;
  };
  metadata?: any;
  createdAt: string;
}

const ActivityLog = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("today");
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);

  // Mock data - will be replaced with API call
  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setActivities([
        {
          id: "1",
          type: "LEAD_CREATED",
          description: "New lead: Maria Silva",
          userId: "user1",
          user: { name: "John Doe", email: "john@example.com" },
          leadId: "lead1",
          lead: { name: "Maria Silva" },
          metadata: { source: "WhatsApp", score: 85 },
          createdAt: new Date().toISOString()
        },
        {
          id: "2",
          type: "FOLLOW_UP_CREATED",
          description: "Follow-up scheduled for Maria Silva",
          userId: "user1",
          user: { name: "John Doe", email: "john@example.com" },
          leadId: "lead1",
          lead: { name: "Maria Silva" },
          metadata: { type: "CALL", scheduledAt: "2025-10-25T14:00:00Z" },
          createdAt: new Date(Date.now() - 3600000).toISOString()
        },
        {
          id: "3",
          type: "USER_LOGIN",
          description: "User logged in: admin@duxfit.com",
          userId: "user2",
          user: { name: "Admin User", email: "admin@duxfit.com" },
          metadata: {},
          createdAt: new Date(Date.now() - 7200000).toISOString()
        },
        {
          id: "4",
          type: "LEAD_STATUS_CHANGED",
          description: "Lead status changed for João Santos",
          userId: "user1",
          user: { name: "John Doe", email: "john@example.com" },
          leadId: "lead2",
          lead: { name: "João Santos" },
          metadata: { previousStatus: "NEW", newStatus: "CONTACTED" },
          createdAt: new Date(Date.now() - 10800000).toISOString()
        },
        {
          id: "5",
          type: "MESSAGE_SENT",
          description: "WhatsApp message sent to Ana Costa",
          userId: "user1",
          user: { name: "John Doe", email: "john@example.com" },
          leadId: "lead3",
          lead: { name: "Ana Costa" },
          metadata: { channel: "WHATSAPP", messageLength: 150 },
          createdAt: new Date(Date.now() - 14400000).toISOString()
        }
      ]);
      setIsLoading(false);
    }, 1000);
  }, [selectedType, dateRange]);

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
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / 60000);

    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
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

  const handleViewDetails = (activity: Activity) => {
    setSelectedActivity(activity);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Activity Log</h1>
          <p className="text-muted-foreground mt-1">
            Track all activities and events in your CRM
          </p>
        </div>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Log
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Activities</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activities.length}</div>
            <p className="text-xs text-muted-foreground">In selected period</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lead Activities</CardTitle>
            <UserPlus className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter(a => a.type.includes('LEAD')).length}
            </div>
            <p className="text-xs text-muted-foreground">Lead-related events</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Follow-ups</CardTitle>
            <Phone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter(a => a.type.includes('FOLLOW_UP')).length}
            </div>
            <p className="text-xs text-muted-foreground">Follow-up actions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {activities.filter(a => a.type.includes('MESSAGE')).length}
            </div>
            <p className="text-xs text-muted-foreground">Messages sent</p>
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
            <div className="flex-1 min-w-[200px]">
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Activity Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="LEAD_CREATED">Lead Created</SelectItem>
                <SelectItem value="LEAD_UPDATED">Lead Updated</SelectItem>
                <SelectItem value="LEAD_STATUS_CHANGED">Status Changed</SelectItem>
                <SelectItem value="FOLLOW_UP_CREATED">Follow-up Created</SelectItem>
                <SelectItem value="FOLLOW_UP_COMPLETED">Follow-up Completed</SelectItem>
                <SelectItem value="MESSAGE_SENT">Message Sent</SelectItem>
                <SelectItem value="USER_LOGIN">User Login</SelectItem>
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

      {/* Activity Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Activity Timeline</CardTitle>
          <CardDescription>
            Chronological list of all activities in your CRM
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading activities...</span>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No activities found</p>
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
                            <span>Lead: {activity.lead.name}</span>
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
                              View details
                            </Button>
                          </>
                        )}
                      </div>

                      {/* Metadata Display (if any) */}
                      {activity.metadata && activity.type === 'LEAD_STATUS_CHANGED' && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          Status: <Badge variant="outline" className="text-xs">{activity.metadata.previousStatus}</Badge>
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
      <ActivityDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedActivity(null);
        }}
        activity={selectedActivity}
      />
    </div>
  );
};

export default ActivityLog;

