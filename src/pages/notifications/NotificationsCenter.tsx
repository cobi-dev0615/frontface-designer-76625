import { useState, useEffect } from "react";
import { Bell, MessageCircle, UserPlus, Calendar, CheckCircle, AlertCircle, Settings, Loader2, Trash2 } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import * as notificationService from "@/services/notificationService";
import type { Notification } from "@/services/notificationService";
import { useNotificationStore } from "@/store/notificationStore";

const NotificationsCenter = () => {
  const { notifications: storeNotifications, setNotifications, markAsRead, markAllAsRead: markAllAsReadStore, removeNotification } = useNotificationStore();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [isMarkingAllRead, setIsMarkingAllRead] = useState(false);

  // Load notifications on mount
  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await notificationService.getUserNotifications({ limit: 100 });
      setNotifications(response.data);
    } catch (error: any) {
      console.error("Error loading notifications:", error);
      toast.error("Failed to load notifications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await notificationService.markAsRead(notificationId);
      markAsRead(notificationId);
    } catch (error: any) {
      console.error("Error marking notification as read:", error);
      toast.error("Failed to mark as read");
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setIsMarkingAllRead(true);
      const response = await notificationService.markAllAsRead();
      markAllAsReadStore();
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error marking all as read:", error);
      toast.error("Failed to mark all as read");
    } finally {
      setIsMarkingAllRead(false);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await notificationService.deleteNotification(notificationId);
      removeNotification(notificationId);
      toast.success("Notification deleted");
    } catch (error: any) {
      console.error("Error deleting notification:", error);
      toast.error("Failed to delete notification");
    }
  };

  const handleDeleteReadNotifications = async () => {
    try {
      const response = await notificationService.deleteReadNotifications();
      // Reload notifications
      loadNotifications();
      toast.success(response.message);
    } catch (error: any) {
      console.error("Error deleting read notifications:", error);
      toast.error("Failed to delete read notifications");
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'NEW_MESSAGE':
        return MessageCircle;
      case 'NEW_LEAD':
        return UserPlus;
      case 'FOLLOW_UP_DUE':
        return Calendar;
      case 'LEAD_STATUS_CHANGE':
        return CheckCircle;
      case 'SYSTEM_ALERT':
        return AlertCircle;
      default:
        return Bell;
    }
  };

  const formatTime = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return dateString;
    }
  };

  const unreadNotifications = storeNotifications.filter(n => !n.read);
  const messageNotifications = storeNotifications.filter(n => n.type === 'NEW_MESSAGE');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold">Notifications</h1>
          <p className="text-muted-foreground">Stay updated with your latest activities</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={handleMarkAllAsRead}
            disabled={isMarkingAllRead || unreadNotifications.length === 0}
          >
            {isMarkingAllRead ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Marking...
              </>
            ) : (
              "Mark All as Read"
            )}
          </Button>
          <Button 
            variant="outline"
            onClick={handleDeleteReadNotifications}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Clear Read
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
                  <CardDescription>
                    {isLoading ? "Loading..." : `You have ${unreadNotifications.length} unread notifications`}
                  </CardDescription>
                </div>
                {!isLoading && unreadNotifications.length > 0 && (
                  <Badge variant="outline" className="bg-primary/10">
                    {unreadNotifications.length} New
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading notifications...</span>
                </div>
              ) : (
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full">
                    <TabsTrigger value="all" className="flex-1">
                      All ({storeNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="unread" className="flex-1">
                      Unread ({unreadNotifications.length})
                    </TabsTrigger>
                    <TabsTrigger value="messages" className="flex-1">
                      Messages ({messageNotifications.length})
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="all" className="space-y-2 mt-4">
                    {storeNotifications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No notifications</p>
                    ) : (
                      storeNotifications.map((notification) => {
                        const NotificationIcon = getNotificationIcon(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                              !notification.read ? "bg-primary/5" : ""
                            }`}
                            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                          >
                            <div className={`p-2 rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                              <NotificationIcon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="unread" className="space-y-2 mt-4">
                    {unreadNotifications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No unread notifications</p>
                    ) : (
                      unreadNotifications.map((notification) => {
                        const NotificationIcon = getNotificationIcon(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className="flex items-start gap-4 p-4 rounded-lg border bg-primary/5 hover:bg-primary/10 transition-colors cursor-pointer"
                            onClick={() => handleMarkAsRead(notification.id)}
                          >
                            <div className="p-2 rounded-full bg-primary/10">
                              <NotificationIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className="font-medium">{notification.title}</p>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>
                                <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>

                  <TabsContent value="messages" className="space-y-2 mt-4">
                    {messageNotifications.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">No message notifications</p>
                    ) : (
                      messageNotifications.map((notification) => {
                        const NotificationIcon = getNotificationIcon(notification.type);
                        return (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-4 p-4 rounded-lg border transition-colors cursor-pointer hover:bg-muted/50 ${
                              !notification.read ? "bg-primary/5" : ""
                            }`}
                            onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                          >
                            <div className={`p-2 rounded-full ${!notification.read ? "bg-primary/10" : "bg-muted"}`}>
                              <NotificationIcon className={`h-5 w-5 ${!notification.read ? "text-primary" : "text-muted-foreground"}`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex-1">
                                  <p className={`font-medium ${!notification.read ? "text-foreground" : "text-muted-foreground"}`}>
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                                </div>
                                {!notification.read && (
                                  <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                )}
                              </div>
                              <div className="flex items-center justify-between mt-2">
                                <p className="text-xs text-muted-foreground">{formatTime(notification.createdAt)}</p>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-1"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteNotification(notification.id);
                                  }}
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </TabsContent>
                </Tabs>
              )}
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
