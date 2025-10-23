import { useState } from "react";
import { Search, Users, MessageCircle, Calendar, FileText, TrendingUp } from "lucide-react";
import { useTranslation } from "@/hooks/useTranslation";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface GlobalSearchProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const GlobalSearch = ({ open, onOpenChange }: GlobalSearchProps) => {
  const { t } = useTranslation();
  const [query, setQuery] = useState("");

  const searchResults = [
    { id: 1, title: "Maria Silva", description: "Lead • Negotiating", icon: Users, type: "lead", href: "/leads/1" },
    { id: 2, title: "João Santos", description: "Lead • New", icon: Users, type: "lead", href: "/leads/2" },
    { id: 3, title: "Conversation with Ana Costa", description: "Last message 2 hours ago", icon: MessageCircle, type: "conversation", href: "/conversations" },
    { id: 4, title: "Follow-up: Pedro Lima", description: "Scheduled for today 14:00", icon: Calendar, type: "followup", href: "/followups" },
    { id: 5, title: "Monthly Performance Report", description: "Generated on Jan 15", icon: FileText, type: "report", href: "/reports" },
    { id: 6, title: "Analytics Dashboard", description: "View conversion metrics", icon: TrendingUp, type: "page", href: "/analytics" },
  ].filter(result => 
    query.length === 0 || 
    result.title.toLowerCase().includes(query.toLowerCase()) ||
    result.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="sr-only">{t("modals.globalSearch.title")}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              placeholder={t("modals.globalSearch.placeholder")}
              className="pl-10 h-12 text-base"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>

          <div className="max-h-[400px] overflow-y-auto space-y-2">
            {searchResults.length > 0 ? (
              searchResults.map((result) => (
                <a
                  key={result.id}
                  href={result.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-muted transition-colors cursor-pointer"
                  onClick={() => onOpenChange(false)}
                >
                  <div className="p-2 rounded-lg bg-primary/10">
                    <result.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{result.title}</p>
                    <p className="text-sm text-muted-foreground truncate">{result.description}</p>
                  </div>
                  <Badge variant="outline" className="capitalize">{result.type}</Badge>
                </a>
              ))
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-2 opacity-20" />
                <p>{t("modals.globalSearch.noResults")}</p>
              </div>
            )}
          </div>

          <div className="pt-3 border-t">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{t("modals.globalSearch.pressEscToClose")}</span>
              <span>{t("modals.globalSearch.cmdKToOpen")}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
