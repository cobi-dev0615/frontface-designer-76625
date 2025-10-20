import { Bell, MessageCircle, UserPlus, Calendar, CheckCircle, AlertCircle, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const NotificationsCenter = () => {
  const notifications = [
    { id: 1, type: "message", title: "New message from Maria Silva", time: "2 min ago", read: false, icon: MessageCircle },
    { id: 2, type: "lead", title: "New lead: João Santos", time: "15 min ago", read: false, icon: UserPlus },
    { id: 3, type: "followup", title: "Follow-up scheduled with Ana Costa", time: "1 hour ago", read: true, icon: Calendar },
    { id: 4, type: "success", title: "Lead converted to customer", time: "2 hours ago", read: true, icon: CheckCircle },
    { id: 5, type: "alert", title: "3 overdue follow-ups", time: "3 hours ago", read: false, icon: AlertCircle },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest activities</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">Mark All as Read</Button>
          <Button variant="outline">
            <Settings className="h-4 w-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Notifications Panel */}
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Notifications</CardTitle>
                  <CardDescription>You have {notifications.filter(n => !n.read).length} unread notifications</CardDescription>
                </div>
                <Badge variant="outline" className="bg-primary/10">
                  {notifications.filter(n => !n.read).length} New
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="all">
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="unread" className="flex-1">Unread</TabsTrigger>
                  <TabsTrigger value="messages" className="flex-1">Messages</TabsTrigger>
                </TabsList>

                <TabsContent value="all" className="space-y-2 mt-4">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                        !notification.read ? "bg-primary/5" : ""
                      }`}
                    >
                      <div className={`p-2 rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                        <notification.icon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                      </div>
                    </div>
                  ))}
                </TabsContent>

                <TabsContent value="unread" className="mt-4">
                  {notifications.filter(n => !n.read).length > 0 ? (
                    <div className="space-y-2">
                      {notifications.filter(n => !n.read).map((notification) => (
                        <div
                          key={notification.id}
                          className="flex items-start gap-4 p-4 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                        >
                          <div className="p-2 rounded-full bg-primary/10">
                            <notification.icon className="h-5 w-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium">{notification.title}</p>
                            <p className="text-sm text-muted-foreground mt-1">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-center text-muted-foreground py-8">No unread notifications</p>
                  )}
                </TabsContent>

                <TabsContent value="messages" className="mt-4">
                  <p className="text-center text-muted-foreground py-8">No message notifications</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>

        {/* Notification Settings Sidebar */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notification Preferences</CardTitle>
              <CardDescription>Choose what you want to be notified about</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="new-leads" className="flex flex-col gap-1">
                  <span className="font-medium">New Leads</span>
                  <span className="text-xs text-muted-foreground">Get notified of new leads</span>
                </Label>
                <Switch id="new-leads" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="messages" className="flex flex-col gap-1">
                  <span className="font-medium">Messages</span>
                  <span className="text-xs text-muted-foreground">WhatsApp and chat messages</span>
                </Label>
                <Switch id="messages" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="followups" className="flex flex-col gap-1">
                  <span className="font-medium">Follow-ups</span>
                  <span className="text-xs text-muted-foreground">Upcoming follow-up reminders</span>
                </Label>
                <Switch id="followups" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="conversions" className="flex flex-col gap-1">
                  <span className="font-medium">Conversions</span>
                  <span className="text-xs text-muted-foreground">Lead to customer conversions</span>
                </Label>
                <Switch id="conversions" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="alerts" className="flex flex-col gap-1">
                  <span className="font-medium">System Alerts</span>
                  <span className="text-xs text-muted-foreground">Important system messages</span>
                </Label>
                <Switch id="alerts" defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Delivery Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="push" className="font-medium">Push Notifications</Label>
                <Switch id="push" defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="email" className="font-medium">Email</Label>
                <Switch id="email" />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="whatsapp" className="font-medium">WhatsApp</Label>
                <Switch id="whatsapp" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NotificationsCenter;
