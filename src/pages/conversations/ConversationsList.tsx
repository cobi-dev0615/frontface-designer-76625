import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Mail, Clock, CheckCircle, AlertCircle, MoreVertical, Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import * as conversationService from "@/services/conversationService";
import { Conversation } from "@/services/conversationService";

const ConversationsList = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [channelFilter, setChannelFilter] = useState("all");

  useEffect(() => {
    loadConversations();
  }, []);

  const loadConversations = async () => {
    try {
      setIsLoading(true);
      const response = await conversationService.getAllConversations({
        limit: 50,
        status: statusFilter !== "all" ? statusFilter : undefined,
        channel: channelFilter !== "all" ? channelFilter : undefined,
      });
      setConversations(response.data);
    } catch (error: any) {
      console.error("Error loading conversations:", error);
      toast.error(t("conversations.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-500";
      case "CLOSED":
        return "bg-gray-500";
      case "ARCHIVED":
        return "bg-yellow-500";
      default:
        return "bg-gray-500";
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "whatsapp":
        return <MessageCircle className="h-4 w-4" />;
      case "email":
        return <Mail className="h-4 w-4" />;
      case "phone":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageCircle className="h-4 w-4" />;
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return t("conversations.justNow");
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}${t("conversations.hoursAgo")}`;
    } else {
      return date.toLocaleDateString();
    }
  };

  const filteredConversations = conversations.filter(conversation => {
    const matchesSearch = conversation.lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conversation.lead.phone.includes(searchTerm) ||
                         conversation.lead.email?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <div className="h-10 w-10 bg-muted rounded-full" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-muted rounded w-1/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("conversations.searchPlaceholder")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("conversations.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("conversations.allStatus")}</SelectItem>
                <SelectItem value="ACTIVE">{t("conversations.active")}</SelectItem>
                <SelectItem value="CLOSED">{t("conversations.closed")}</SelectItem>
                <SelectItem value="ARCHIVED">{t("conversations.archived")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={channelFilter} onValueChange={setChannelFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("conversations.channel")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("conversations.allChannels")}</SelectItem>
                <SelectItem value="whatsapp">{t("conversations.whatsapp")}</SelectItem>
                <SelectItem value="email">{t("conversations.email")}</SelectItem>
                <SelectItem value="phone">{t("conversations.phone")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadConversations}>
              <Filter className="h-4 w-4 mr-2" />
              {t("conversations.refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Conversations List */}
      <div className="grid gap-4">
        {filteredConversations.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("conversations.noConversationsFound")}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || channelFilter !== "all"
                  ? t("conversations.noConversationsDescription")
                  : t("conversations.noConversationsDescriptionEmpty")}
              </p>
              <Button onClick={() => navigate("/leads")}>
                {t("conversations.viewLeads")}
              </Button>
            </CardContent>
          </Card>
        ) : (
          filteredConversations.map((conversation) => (
            <Card
              key={conversation.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => navigate(`/conversations/${conversation.id}`)}
            >
              <CardContent className="p-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-gradient-primary text-white">
                      {conversation.lead.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-semibold truncate">{conversation.lead.name}</h3>
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusColor(conversation.status)}>
                          {t(`conversations.status.${conversation.status.toLowerCase()}`)}
                        </Badge>
                        <div className="flex items-center text-muted-foreground">
                          {getChannelIcon(conversation.channel)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                      <span>{conversation.lead.phone}</span>
                      {conversation.lead.email && (
                        <span>{conversation.lead.email}</span>
                      )}
                      <span>{conversation.lead.gym.name}</span>
                    </div>
                    
                    {conversation.messages.length > 0 && (
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {conversation.messages[0].content}
                        </p>
                        <span className="text-xs text-muted-foreground ml-2">
                          {formatTime(conversation.messages[0].sentAt)}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ConversationsList;
