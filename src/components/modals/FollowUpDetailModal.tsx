import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Phone, MessageSquare, Mail, MapPin, Calendar, Clock, User, Building, FileText, CheckCircle, XCircle, Edit } from "lucide-react";
import { format } from "date-fns";
import type { FollowUp } from "@/services/followUpService";

interface FollowUpDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  followUp: FollowUp | null;
  onComplete?: (followUpId: string) => void;
  onCancel?: (followUpId: string) => void;
  onReschedule?: (followUp: FollowUp) => void;
}

export default function FollowUpDetailModal({
  isOpen,
  onClose,
  followUp,
  onComplete,
  onCancel,
  onReschedule
}: FollowUpDetailModalProps) {
  if (!followUp) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return <Phone className="h-5 w-5" />;
      case 'WHATSAPP':
        return <MessageSquare className="h-5 w-5" />;
      case 'EMAIL':
        return <Mail className="h-5 w-5" />;
      case 'VISIT':
        return <MapPin className="h-5 w-5" />;
      default:
        return <Phone className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'CALL':
        return 'Phone Call';
      case 'WHATSAPP':
        return 'WhatsApp Message';
      case 'EMAIL':
        return 'Email';
      case 'VISIT':
        return 'In-Person Visit';
      default:
        return type;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-500';
      case 'COMPLETED':
        return 'bg-green-500';
      case 'OVERDUE':
        return 'bg-red-500';
      case 'CANCELLED':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "EEEE, MMMM d, yyyy");
  };

  const formatTime = (dateString: string) => {
    return format(new Date(dateString), "h:mm a");
  };

  const isPending = followUp.status === 'PENDING' || followUp.status === 'OVERDUE';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className={`p-2 rounded-lg ${getStatusColor(followUp.status)} text-white`}>
              {getTypeIcon(followUp.type)}
            </div>
            Follow-Up Details
          </DialogTitle>
          <DialogDescription>
            View and manage this follow-up
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            <Badge className={`${getStatusColor(followUp.status)} text-white`}>
              {followUp.status}
            </Badge>
          </div>

          {/* Lead Information */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Lead</p>
                  <p className="text-lg font-semibold">{followUp.lead.name}</p>
                  <div className="flex flex-col gap-1 mt-2">
                    <p className="text-sm text-muted-foreground">
                      <Phone className="h-3 w-3 inline mr-1" />
                      {followUp.lead.phone}
                    </p>
                    {followUp.lead.email && (
                      <p className="text-sm text-muted-foreground">
                        <Mail className="h-3 w-3 inline mr-1" />
                        {followUp.lead.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Gym</p>
                  <p className="font-medium">{followUp.lead.gym.name}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Follow-up Details */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getStatusColor(followUp.status)} bg-opacity-10`}>
                  {getTypeIcon(followUp.type)}
                </div>
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="font-medium">{getTypeLabel(followUp.type)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Scheduled Date</p>
                  <p className="font-medium">{formatDate(followUp.scheduledAt)}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm text-muted-foreground">Scheduled Time</p>
                  <p className="font-medium">{formatTime(followUp.scheduledAt)}</p>
                </div>
              </div>

              {followUp.notes && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Notes</p>
                      <p className="text-sm mt-1">{followUp.notes}</p>
                    </div>
                  </div>
                </>
              )}

              {followUp.completedAt && (
                <>
                  <Separator />
                  <div className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Completed At</p>
                      <p className="font-medium">
                        {formatDate(followUp.completedAt)} at {formatTime(followUp.completedAt)}
                      </p>
                    </div>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card>
            <CardContent className="pt-6 space-y-3">
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">Created</p>
                  <p className="text-sm">
                    {formatDate(followUp.createdAt)} at {formatTime(followUp.createdAt)}
                  </p>
                </div>
              </div>
              {followUp.updatedAt !== followUp.createdAt && (
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Last Updated</p>
                    <p className="text-sm">
                      {formatDate(followUp.updatedAt)} at {formatTime(followUp.updatedAt)}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          {isPending && (
            <>
              {onReschedule && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onReschedule(followUp);
                    onClose();
                  }}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Reschedule
                </Button>
              )}
              {onCancel && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onCancel(followUp.id);
                    onClose();
                  }}
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Cancel Follow-up
                </Button>
              )}
              {onComplete && (
                <Button
                  variant="gradient"
                  onClick={() => {
                    onComplete(followUp.id);
                    onClose();
                  }}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Mark Complete
                </Button>
              )}
            </>
          )}
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

