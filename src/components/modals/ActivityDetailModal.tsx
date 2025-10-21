import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Clock, FileText, Tag, Database } from "lucide-react";
import { format } from "date-fns";

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

interface ActivityDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  activity: Activity | null;
}

export default function ActivityDetailModal({ isOpen, onClose, activity }: ActivityDetailModalProps) {
  if (!activity) return null;

  const formatActivityType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'LEAD_CREATED':
        return 'bg-green-500';
      case 'LEAD_UPDATED':
        return 'bg-blue-500';
      case 'LEAD_STATUS_CHANGED':
        return 'bg-purple-500';
      case 'MESSAGE_SENT':
        return 'bg-indigo-500';
      case 'FOLLOW_UP_CREATED':
        return 'bg-orange-500';
      case 'FOLLOW_UP_COMPLETED':
        return 'bg-green-500';
      case 'USER_LOGIN':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: format(date, "EEEE, MMMM d, yyyy"),
      time: format(date, "h:mm:ss a")
    };
  };

  const getUserInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const dateTime = formatDateTime(activity.createdAt);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[66vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getActivityColor(activity.type)} text-white`}>
              <FileText className="h-5 w-5" />
            </div>
            Activity Details
          </DialogTitle>
          <DialogDescription>
            Complete information about this activity
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 overflow-y-auto flex-1 px-1">
          {/* Activity Type Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${getActivityColor(activity.type)} text-white`}>
              {formatActivityType(activity.type)}
            </Badge>
          </div>

          {/* Description */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-lg font-medium mt-1">{activity.description}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Information */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Performed By</p>
                  <div className="flex items-center gap-3 mt-2">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium">
                      {getUserInitials(activity.user.name)}
                    </div>
                    <div>
                      <p className="font-medium">{activity.user.name}</p>
                      <p className="text-sm text-muted-foreground">{activity.user.email}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lead Information (if applicable) */}
          {activity.lead && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">Related Lead</p>
                    <p className="font-medium mt-1">{activity.lead.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">Lead ID: {activity.leadId}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Timestamp */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Date</p>
                  <p className="font-medium">{dateTime.date}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Time</p>
                  <p className="font-medium">{dateTime.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Metadata (if any) */}
          {activity.metadata && Object.keys(activity.metadata).length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-start gap-3">
                  <Database className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-3">Additional Data</p>
                    <div className="space-y-2">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <div key={key} className="flex items-start gap-2">
                          <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div className="flex-1">
                            <p className="text-xs text-muted-foreground capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </p>
                            <p className="text-sm font-medium">
                              {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Activity ID */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Activity ID</p>
                  <p className="text-xs font-mono mt-1 text-muted-foreground">{activity.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}

