import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, MapPin, Clock, Tag, TrendingUp, Activity } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const LeadDetail = () => {
  const { id } = useParams();

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Link to="/leads">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Maria Silva</h1>
          <p className="text-muted-foreground">Lead ID: {id}</p>
        </div>
        <Button variant="gradient">
          <MessageCircle className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Contact Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Phone</p>
                  <p className="font-medium">+55 (86) 99876-5432</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium">maria.silva@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">Teresina, PI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>Activity Timeline</CardTitle>
              <CardDescription>Recent interactions with this lead</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: "2 hours ago", action: "WhatsApp message sent", status: "sent" },
                  { time: "1 day ago", action: "Called - No answer", status: "missed" },
                  { time: "2 days ago", action: "First contact via WhatsApp", status: "success" },
                  { time: "3 days ago", action: "Lead created from website", status: "info" }
                ].map((activity, idx) => (
                  <div key={idx} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                      {idx < 3 && <div className="w-px h-full bg-border mt-2" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Conversation History */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Messages</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">MS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">Olá! Gostaria de saber mais sobre os planos.</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday at 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-right">
                    <div className="bg-primary/10 rounded-lg p-3 inline-block">
                      <p className="text-sm">Olá Maria! Temos planos mensais e anuais...</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">Yesterday at 10:32 AM</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">View Full Conversation</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Lead Status</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Current Stage</p>
                <Badge className="bg-yellow-500">Negotiating</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Source</p>
                <Badge variant="outline">WhatsApp</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Assigned To</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">João Dias</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Lead Score</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div className="bg-gradient-primary h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                  <span className="text-sm font-medium">75/100</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Follow-up
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Tag className="h-4 w-4 mr-2" />
                Add Tag
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
                Change Stage
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Engagement Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Messages Sent</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Response Rate</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Avg Response Time</span>
                <span className="font-medium">15 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Days in Pipeline</span>
                <span className="font-medium">3</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LeadDetail;
