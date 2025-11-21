import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MessageCircle, Phone, Mail, Clock, CheckCircle, AlertCircle, MoreVertical, Search, Filter, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
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
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });
  const [pageSize, setPageSize] = useState(10);
  const skipNextEffectRef = useRef(false);

  useEffect(() => {
    loadConversations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!skipNextEffectRef.current) {
      loadConversations();
    } else {
      skipNextEffectRef.current = false;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter, channelFilter]);

  const loadConversations = async (overrides?: { limit?: number; offset?: number }) => {
    try {
      setIsLoading(true);
      const currentLimit = overrides?.limit ?? pagination.limit;
      const currentOffset = overrides?.offset ?? pagination.offset;
      
      const response = await conversationService.getAllConversations({
        limit: currentLimit,
        offset: currentOffset,
        status: statusFilter !== "all" ? statusFilter : undefined,
        channel: channelFilter !== "all" ? channelFilter : undefined,
      });
      setConversations(response.data);
      setPagination(response.pagination);
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

  const handleDeleteConversation = async (conversationId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t("conversations.deleteConfirm"))) return;

    try {
      await conversationService.deleteConversation(conversationId);
      toast.success(t("conversations.deleteSuccess"));
      loadConversations();
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("conversations.deleteFailed"));
    }
  };

  const currentPage = Math.floor(pagination.offset / pagination.limit) + 1;
  const totalPages = Math.ceil(pagination.total / pagination.limit);

  const handlePreviousPage = () => {
    if (pagination.offset > 0) {
      const newOffset = Math.max(0, pagination.offset - pagination.limit);
      setPagination((prev) => ({
        ...prev,
        offset: newOffset,
      }));
      skipNextEffectRef.current = true;
      loadConversations({ offset: newOffset });
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const newOffset = pagination.offset + pagination.limit;
      setPagination((prev) => ({
        ...prev,
        offset: newOffset,
      }));
      skipNextEffectRef.current = true;
      loadConversations({ offset: newOffset });
    }
  };

  const handlePageClick = (page: number) => {
    const newOffset = (page - 1) * pagination.limit;
    setPagination((prev) => ({
      ...prev,
      offset: newOffset,
    }));
    skipNextEffectRef.current = true;
    loadConversations({ offset: newOffset });
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5; // Maximum number of page buttons to show
    
    if (totalPages <= maxVisible) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Show last page
      pages.push(totalPages);
    }
    
    return pages;
  };

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
            <Select 
              value={statusFilter} 
              onValueChange={(value) => {
                setStatusFilter(value);
                setPagination((prev) => ({ ...prev, offset: 0 }));
                skipNextEffectRef.current = true;
              }}
            >
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
            <Select 
              value={channelFilter} 
              onValueChange={(value) => {
                setChannelFilter(value);
                setPagination((prev) => ({ ...prev, offset: 0 }));
                skipNextEffectRef.current = true;
              }}
            >
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
            <Button variant="outline" onClick={() => {
              skipNextEffectRef.current = true;
              loadConversations();
            }}>
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
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={(e) => handleDeleteConversation(conversation.id, e)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t("conversations.delete")}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {!isLoading && filteredConversations.length > 0 && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-sm text-muted-foreground">
                  {t("conversations.showing")} {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} {t("conversations.of")} {pagination.total} {t("conversations.conversations")}
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">{t("conversations.itemsPerPage")}:</span>
                  <Select
                    value={pageSize.toString()}
                    onValueChange={(value) => {
                      const newPageSize = parseInt(value);
                      setPageSize(newPageSize);
                      setPagination((prev) => ({ ...prev, limit: newPageSize, offset: 0 }));
                      skipNextEffectRef.current = true;
                      loadConversations({ limit: newPageSize, offset: 0 });
                    }}
                  >
                    <SelectTrigger className="w-20 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5</SelectItem>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pagination.offset === 0}
                >
                  {t("conversations.previous")}
                </Button>
                
                {/* Page Numbers */}
                {totalPages > 0 && (
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === '...') {
                        return (
                          <span key={`ellipsis-${index}`} className="px-2 text-muted-foreground">
                            ...
                          </span>
                        );
                      }
                      const pageNum = page as number;
                      return (
                        <Button
                          key={pageNum}
                          variant={currentPage === pageNum ? "default" : "outline"}
                          size="sm"
                          className="min-w-[2.5rem]"
                          onClick={() => handlePageClick(pageNum)}
                          disabled={currentPage === pageNum}
                        >
                          {pageNum}
                        </Button>
                      );
                    })}
                  </div>
                )}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasMore}
                >
                  {t("conversations.next")}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ConversationsList;
