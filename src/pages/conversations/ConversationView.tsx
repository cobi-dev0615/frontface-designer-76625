import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Building2, Mail, Eye, Calendar, CheckCircle, Ban, Loader2, AlertCircle, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useSocket } from "@/hooks/useSocket";
import { useTranslation } from "@/hooks/useTranslation";
import * as conversationService from "@/services/conversationService";
import * as leadService from "@/services/leadService";
import * as followUpService from "@/services/followUpService";
import { Conversation, Message } from "@/services/conversationService";
import { Lead } from "@/services/leadService";

const ConversationView = () => {
  const { t } = useTranslation();
  const { id: conversationId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { socket, isConnected } = useSocket();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // State
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [lead, setLead] = useState<Lead | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [notes, setNotes] = useState("");

  // Quick responses
  const quickResponses = [
    t("conversations.sharePricingDetails"),
    t("conversations.sendRegistrationLink"), 
    t("conversations.scheduleTour"),
    t("conversations.answerAboutKidsRoom"),
  ];

  // Message templates
  const messageTemplates = {
    "welcome": t("conversations.welcomeTemplate"),
    "pricing": t("conversations.pricingTemplate"),
    "registration": t("conversations.registrationTemplate"),
    "tour": t("conversations.tourTemplate"),
    "kids": t("conversations.kidsTemplate")
  };

  useEffect(() => {
    if (conversationId) {
      loadConversation();
    }
  }, [conversationId]);

  useEffect(() => {
    if (socket && conversationId) {
      // Join conversation room
      socket.emit('join_conversation', conversationId);

      // Listen for new messages
      socket.on('message:new', handleNewMessage);
      socket.on('message:typing', handleTyping);

      return () => {
        socket.emit('leave_conversation', conversationId);
        socket.off('message:new');
        socket.off('message:typing');
      };
    }
  }, [socket, conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const loadConversation = async () => {
    try {
      setIsLoading(true);
      const response = await conversationService.getConversationById(conversationId!);
      setConversation(response.data);
      
      // Load lead details
      const leadResponse = await leadService.getLeadById(response.data.leadId);
      setLead(leadResponse.data);
      setNotes(leadResponse.data.notes || "");
    } catch (error: any) {
      console.error("Error loading conversation:", error);
      toast.error(t("conversations.failedToLoadConversation"));
      navigate("/conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewMessage = (newMessage: Message) => {
    if (conversation && newMessage.conversationId === conversation.id) {
      setConversation(prev => {
        if (!prev) return null;
        // Check if message already exists to prevent duplicates
        const messageExists = prev.messages.some(msg => msg.id === newMessage.id);
        if (messageExists) {
          return prev;
        }
        return {
          ...prev,
          messages: [...prev.messages, newMessage]
        };
      });
    }
  };

  const handleTyping = (data: { conversationId: string; isTyping: boolean }) => {
    if (data.conversationId === conversationId) {
      setIsTyping(data.isTyping);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation || isSending) return;

    try {
      setIsSending(true);
      const response = await conversationService.sendMessage(conversation.id, {
        content: message.trim(),
        sender: "AGENT",
        type: "TEXT"
      });

      // Add message immediately for better UX, but handleNewMessage will prevent duplicates
      // by checking if message ID already exists
      setConversation(prev => {
        if (!prev) return null;
        const messageExists = prev.messages.some(msg => msg.id === response.data.id);
        if (!messageExists) {
          return {
            ...prev,
            messages: [...prev.messages, response.data]
          };
        }
        return prev;
      });

      setMessage("");
    } catch (error: any) {
      console.error("Error sending message:", error);
      toast.error(t("conversations.failedToSendMessage"));
    } finally {
      setIsSending(false);
    }
  };

  const handleQuickResponse = (response: string) => {
    setMessage(response);
  };

  const handleTemplateSelect = (template: string) => {
    if (template && messageTemplates[template as keyof typeof messageTemplates]) {
      setMessage(messageTemplates[template as keyof typeof messageTemplates]);
    }
  };

  const handleScheduleFollowUp = async () => {
    if (!lead) return;

    try {
      await followUpService.createFollowUp({
        leadId: lead.id,
        type: "CALL",
        scheduledFor: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        notes: "Follow-up call scheduled from conversation"
      });
      toast.success(t("conversations.followUpScheduledSuccessfully"));
    } catch (error: any) {
      console.error("Error scheduling follow-up:", error);
      toast.error(t("conversations.failedToScheduleFollowUp"));
    }
  };

  const handleMarkQualified = async () => {
    if (!lead) return;

    try {
      await leadService.updateLead(lead.id, { status: "QUALIFIED" });
      setLead(prev => prev ? { ...prev, status: "QUALIFIED" } : null);
      toast.success(t("conversations.leadMarkedAsQualified"));
    } catch (error: any) {
      console.error("Error updating lead status:", error);
      toast.error(t("conversations.failedToUpdateLeadStatus"));
    }
  };

  const handleBlockLead = async () => {
    if (!lead) return;

    try {
      await leadService.updateLead(lead.id, { status: "BLOCKED" });
      setLead(prev => prev ? { ...prev, status: "BLOCKED" } : null);
      toast.success(t("conversations.leadBlocked"));
    } catch (error: any) {
      console.error("Error blocking lead:", error);
      toast.error(t("conversations.failedToBlockLead"));
    }
  };

  const handleSaveNotes = async () => {
    if (!lead) return;

    try {
      await leadService.updateLead(lead.id, { notes });
      toast.success(t("conversations.notesSaved"));
    } catch (error: any) {
      console.error("Error saving notes:", error);
      toast.error(t("conversations.failedToSaveNotes"));
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "QUALIFIED":
        return "bg-green-500";
      case "INTERESTED":
        return "bg-blue-500";
      case "NEW":
        return "bg-yellow-500";
      case "BLOCKED":
        return "bg-red-500";
      default:
        return "bg-gray-500";
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>{t("conversations.loadingConversation")}</p>
        </div>
      </div>
    );
  }

  if (!conversation || !lead) {
    return (
      <div className="flex h-[calc(100vh-5rem)] items-center justify-center">
        <div className="text-center">
          <AlertCircle className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
          <p>{t("conversations.conversationNotFound")}</p>
          <Button onClick={() => navigate("/conversations")} className="mt-4">
            {t("conversations.backToConversations")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-6">
      {/* Left Sidebar - Lead Info */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        <Button
          variant="ghost"
          className="gap-2 -ml-2"
          onClick={() => navigate("/conversations")}
        >
          <ArrowLeft className="h-4 w-4" />
{t("conversations.backToConversationsButton")}
        </Button>

        {/* Lead Profile */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                  {lead.name.split(" ").map(n => n[0]).join("").toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold">{lead.name}</h3>
              <Badge className={`mt-2 text-white ${getStatusColor(lead.status)}`}>
                {lead.status}
              </Badge>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="truncate">{lead.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Building2 className="h-4 w-4 text-muted-foreground" />
                <span>{lead.gym.name}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">{t("conversations.source")}</p>
                <p className="font-medium">{lead.source}</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("conversations.score")}</p>
                <p className="font-medium">{lead.score}/100</p>
              </div>
              <div>
                <p className="text-muted-foreground">{t("conversations.created")}</p>
                <p className="font-medium">{new Date(lead.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button className="w-full gap-2" variant="outline" onClick={handleScheduleFollowUp}>
                <Calendar className="h-4 w-4" />
{t("conversations.scheduleFollowUp")}
              </Button>
              <Button 
                className="w-full gap-2" 
                variant="outline" 
                onClick={handleMarkQualified}
                disabled={lead.status === "QUALIFIED"}
              >
                <CheckCircle className="h-4 w-4" />
{t("conversations.markAsQualified")}
              </Button>
              <Button 
                className="w-full gap-2" 
                variant="outline"
                onClick={handleBlockLead}
                disabled={lead.status === "BLOCKED"}
              >
                <Ban className="h-4 w-4 text-destructive" />
{t("conversations.blockLead")}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("conversations.notes")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder={t("conversations.addNotesPlaceholder")}
              className="min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
            <Button size="sm" className="w-full mt-2" onClick={handleSaveNotes}>
{t("conversations.save")}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Center - Chat */}
      <div className="flex-1 flex flex-col border border-border rounded-lg bg-card overflow-hidden">
        {/* Chat Header */}
        <div className="border-b border-border p-4 flex items-center justify-between bg-background">
          <div>
            <h3 className="font-semibold">{lead.name}</h3>
            <p className="text-sm text-green-500 flex items-center gap-1">
              <span className="h-2 w-2 rounded-full bg-green-500" />
{isConnected ? t("conversations.connected") : t("conversations.disconnected")}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" disabled>
              <Video className="h-5 w-5 opacity-50" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-muted/10">
          {conversation.messages.length === 0 ? (
            <div className="text-center py-8">
              <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">{t("conversations.noMessagesYet")}</p>
            </div>
          ) : (
            <>
              {conversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === "AGENT" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`flex gap-2 max-w-[70%] ${msg.sender === "AGENT" ? "flex-row-reverse" : ""}`}>
                    {msg.sender === "CUSTOMER" && (
                      <Avatar className="h-8 w-8 flex-shrink-0">
                        <AvatarFallback className="text-xs bg-muted">
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div>
                      <div
                        className={`rounded-2xl p-3 ${
                          msg.sender === "AGENT"
                            ? "bg-gradient-primary text-white"
                            : "bg-card border border-border"
                        }`}
                      >
                        <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 px-3">
                        {formatTime(msg.sentAt)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl p-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <div className="border-t border-border p-4 bg-background">
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Smile className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Paperclip className="h-5 w-5" />
            </Button>
            <Input
              placeholder={t("conversations.typeMessagePlaceholder")}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
              disabled={isSending}
            />
            <Button
              variant="gradient"
              size="icon"
              disabled={!message.trim() || isSending}
              onClick={handleSendMessage}
            >
              {isSending ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Send className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            {message.length}/1000
          </p>
        </div>
      </div>

      {/* Right Panel - Quick Actions */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("conversations.quickResponses")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickResponses.map((response) => (
              <Button
                key={response}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => handleQuickResponse(response)}
              >
                {response}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("conversations.messageTemplates")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder={t("conversations.selectTemplate")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="welcome">{t("conversations.welcomeMessage")}</SelectItem>
                <SelectItem value="pricing">{t("conversations.pricingDetails")}</SelectItem>
                <SelectItem value="registration">{t("conversations.registrationInfo")}</SelectItem>
                <SelectItem value="tour">{t("conversations.scheduleTourTemplate")}</SelectItem>
                <SelectItem value="kids">{t("conversations.kidsRoomInfo")}</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">{t("conversations.conversationInfo")}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("conversations.channel")}:</span>
              <span className="capitalize">{conversation.channel}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("conversations.status")}:</span>
              <Badge className={getStatusColor(conversation.status)}>
                {conversation.status}
              </Badge>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("conversations.messages")}:</span>
              <span>{conversation.messages.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("conversations.created")}:</span>
              <span>{new Date(conversation.createdAt).toLocaleDateString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversationView;