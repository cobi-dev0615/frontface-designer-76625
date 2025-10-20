import { Calendar, Clock, Users, CheckCircle, AlertCircle, Filter, Plus } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const FollowUpManagement = () => {
  const followups = [
    { id: 1, lead: "Maria Silva", type: "Call", date: "2024-01-20", time: "14:00", status: "pending", priority: "high" },
    { id: 2, lead: "João Santos", type: "WhatsApp", date: "2024-01-20", time: "16:30", status: "pending", priority: "medium" },
    { id: 3, lead: "Ana Costa", type: "Email", date: "2024-01-21", time: "10:00", status: "pending", priority: "low" },
    { id: 4, lead: "Pedro Lima", type: "Visit", date: "2024-01-21", time: "15:00", status: "completed", priority: "high" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Follow-Up Management</h1>
          <p className="text-muted-foreground">Schedule and track follow-ups with leads</p>
        </div>
        <Button variant="gradient">
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
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">2 completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">Next 7 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overdue</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">3</div>
            <p className="text-xs text-muted-foreground">Requires attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">This month</p>
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
            <Input placeholder="Search leads..." className="max-w-xs" />
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Follow-up Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="call">Call</SelectItem>
                <SelectItem value="whatsapp">WhatsApp</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="visit">Visit</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="overdue">Overdue</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
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
          <Tabs defaultValue="pending">
            <TabsList>
              <TabsTrigger value="pending">Pending ({followups.filter(f => f.status === 'pending').length})</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="space-y-4 mt-4">
              {followups.filter(f => f.status === 'pending').map((followup) => (
                <div key={followup.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex flex-col items-center justify-center bg-muted rounded-lg p-3 min-w-[80px]">
                      <span className="text-xs text-muted-foreground">
                        {new Date(followup.date).toLocaleDateString('en-US', { month: 'short' })}
                      </span>
                      <span className="text-2xl font-bold">
                        {new Date(followup.date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{followup.lead}</h4>
                        {followup.priority === 'high' && (
                          <Badge className="bg-destructive">High Priority</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {followup.time}
                        </span>
                        <span>•</span>
                        <span>{followup.type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Reschedule</Button>
                    <Button variant="gradient" size="sm">
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Complete
                    </Button>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="completed" className="mt-4">
              <p className="text-center text-muted-foreground py-8">No completed follow-ups</p>
            </TabsContent>

            <TabsContent value="overdue" className="mt-4">
              <p className="text-center text-muted-foreground py-8">No overdue follow-ups</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default FollowUpManagement;
