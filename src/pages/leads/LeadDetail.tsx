import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, MapPin, Clock, Tag, TrendingUp, Activity } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const LeadDetail = () => {
  const { t } = useTranslation();
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
          <p className="text-muted-foreground">{t("leadDetail.leadId")}: {id}</p>
        </div>
        <Button variant="gradient">
          <MessageCircle className="h-4 w-4 mr-2" />
{t("leadDetail.sendMessage")}
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Info Column */}
        <div className="md:col-span-2 space-y-6">
          {/* Contact Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t("leadDetail.contactInformation")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Phone className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("leadDetail.phone")}</p>
                  <p className="font-medium">+55 (86) 99876-5432</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("leadDetail.email")}</p>
                  <p className="font-medium">maria.silva@email.com</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">{t("leadDetail.location")}</p>
                  <p className="font-medium">Teresina, PI</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle>{t("leadDetail.activityTimeline")}</CardTitle>
              <CardDescription>{t("leadDetail.recentInteractions")}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { time: `2 ${t("leadDetail.hoursAgo")}`, action: t("leadDetail.whatsappMessageSent"), status: "sent" },
                  { time: `1 ${t("leadDetail.dayAgo")}`, action: t("leadDetail.calledNoAnswer"), status: "missed" },
                  { time: `2 ${t("leadDetail.daysAgo")}`, action: t("leadDetail.firstContactWhatsApp"), status: "success" },
                  { time: `3 ${t("leadDetail.daysAgo")}`, action: t("leadDetail.leadCreatedFromWebsite"), status: "info" }
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
              <CardTitle>{t("leadDetail.recentMessages")}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-gradient-primary text-white text-xs">MS</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg p-3">
                      <p className="text-sm">{t("leadDetail.sampleMessage1")}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t("leadDetail.yesterday")} {t("leadDetail.at")} 10:30 AM</p>
                  </div>
                </div>
                <div className="flex gap-3 flex-row-reverse">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-white text-xs">AI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 text-right">
                    <div className="bg-primary/10 rounded-lg p-3 inline-block">
                      <p className="text-sm">{t("leadDetail.sampleMessage2")}</p>
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t("leadDetail.yesterday")} {t("leadDetail.at")} 10:32 AM</p>
                  </div>
                </div>
              </div>
              <Button variant="outline" className="w-full mt-4">{t("leadDetail.viewFullConversation")}</Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Column */}
        <div className="space-y-6">
          {/* Status Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("leadDetail.leadStatus")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("leadDetail.currentStage")}</p>
                <Badge className="bg-yellow-500">{t("leadDetail.negotiating")}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("leadDetail.source")}</p>
                <Badge variant="outline">{t("leadDetail.whatsapp")}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("leadDetail.assignedTo")}</p>
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">JD</AvatarFallback>
                  </Avatar>
                  <span className="text-sm">João Dias</span>
                </div>
              </div>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">{t("leadDetail.leadScore")}</p>
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
              <CardTitle className="text-base">{t("leadDetail.quickActions")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start">
                <Calendar className="h-4 w-4 mr-2" />
{t("leadDetail.scheduleFollowUp")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Tag className="h-4 w-4 mr-2" />
{t("leadDetail.addTag")}
              </Button>
              <Button variant="outline" className="w-full justify-start">
                <Activity className="h-4 w-4 mr-2" />
{t("leadDetail.changeStage")}
              </Button>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">{t("leadDetail.engagementStats")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("leadDetail.messagesSent")}</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("leadDetail.responseRate")}</span>
                <span className="font-medium">85%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("leadDetail.avgResponseTime")}</span>
                <span className="font-medium">15 min</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">{t("leadDetail.daysInPipeline")}</span>
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
