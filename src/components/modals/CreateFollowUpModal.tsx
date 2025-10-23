import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Clock, Phone, MessageSquare, Mail, MapPin, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import * as leadService from "@/services/leadService";
import * as followUpService from "@/services/followUpService";
import type { Lead } from "@/services/leadService";

interface CreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateFollowUpModal({ isOpen, onClose, onSuccess }: CreateFollowUpModalProps) {
  const { t } = useTranslation();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    leadId: "",
    type: "" as "CALL" | "WHATSAPP" | "EMAIL" | "VISIT" | "",
    scheduledDate: undefined as Date | undefined,
    scheduledTime: "",
    notes: "",
    priority: "MEDIUM" as "HIGH" | "MEDIUM" | "LOW"
  });

  // Load leads when modal opens
  useEffect(() => {
    if (isOpen) {
      loadLeads();
    }
  }, [isOpen]);

  const loadLeads = async () => {
    try {
      setIsLoading(true);
      const response = await leadService.getAllLeads({
        limit: 100, // Load more leads for selection
        status: "all"
      });
      setLeads(response.data);
    } catch (error: any) {
      console.error("Error loading leads:", error);
      toast.error(t("modals.followUp.create.failedToLoadLeads"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leadId || !formData.type || !formData.scheduledDate || !formData.scheduledTime) {
      toast.error(t("modals.followUp.create.fillRequiredFields"));
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Combine date and time
      const scheduledAt = new Date(formData.scheduledDate);
      const [hours, minutes] = formData.scheduledTime.split(':');
      scheduledAt.setHours(parseInt(hours), parseInt(minutes));

      await followUpService.createFollowUp({
        leadId: formData.leadId,
        type: formData.type,
        scheduledAt: scheduledAt.toISOString(),
        notes: formData.notes || undefined
      });

      toast.success(t("modals.followUp.create.followUpScheduledSuccess"));
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error creating follow-up:", error);
      toast.error(error.response?.data?.message || t("modals.followUp.create.createFollowUpFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      leadId: "",
      type: "",
      scheduledDate: undefined,
      scheduledTime: "",
      notes: "",
      priority: "MEDIUM"
    });
    onClose();
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'CALL':
        return <Phone className="h-4 w-4" />;
      case 'WHATSAPP':
        return <MessageSquare className="h-4 w-4" />;
      case 'EMAIL':
        return <Mail className="h-4 w-4" />;
      case 'VISIT':
        return <MapPin className="h-4 w-4" />;
      default:
        return <Phone className="h-4 w-4" />;
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        times.push(timeString);
      }
    }
    return times;
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[66vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("modals.followUp.create.title")}</DialogTitle>
          <DialogDescription>
            {t("modals.followUp.create.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 overflow-y-auto flex-1 px-1">
          {/* Lead Selection */}
          <div className="space-y-2">
            <Label htmlFor="lead">{t("modals.followUp.create.lead")}</Label>
            <Select
              value={formData.leadId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? t("modals.followUp.create.loadingLeads") : t("modals.followUp.create.selectLead")} />
              </SelectTrigger>
              <SelectContent>
                {leads.map((lead) => (
                  <SelectItem key={lead.id} value={lead.id}>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{lead.name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({lead.phone})
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Follow-up Type */}
          <div className="space-y-2">
            <Label htmlFor="type">{t("modals.followUp.create.followUpType")}</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "CALL" | "WHATSAPP" | "EMAIL" | "VISIT") => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.followUp.create.selectFollowUpType")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CALL">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    {t("modals.followUp.create.call")}
                  </div>
                </SelectItem>
                <SelectItem value="WHATSAPP">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    {t("modals.followUp.create.whatsapp")}
                  </div>
                </SelectItem>
                <SelectItem value="EMAIL">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {t("modals.followUp.create.email")}
                  </div>
                </SelectItem>
                <SelectItem value="VISIT">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {t("modals.followUp.create.visit")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>{t("modals.followUp.create.date")}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.scheduledDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.scheduledDate ? (
                      format(formData.scheduledDate, "PPP")
                    ) : (
                      <span>{t("modals.followUp.create.pickDate")}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.scheduledDate}
                    onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                    disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">{t("modals.followUp.create.time")}</Label>
              <Select
                value={formData.scheduledTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, scheduledTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("modals.followUp.create.selectTime")} />
                </SelectTrigger>
                <SelectContent className="max-h-[200px]">
                  {generateTimeOptions().map((time) => (
                    <SelectItem key={time} value={time}>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {time}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority */}
          <div className="space-y-2">
            <Label htmlFor="priority">{t("modals.followUp.create.priority")}</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("modals.followUp.create.selectPriority")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    {t("modals.followUp.create.lowPriority")}
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    {t("modals.followUp.create.mediumPriority")}
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    {t("modals.followUp.create.highPriority")}
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{t("modals.followUp.create.notes")}</Label>
            <Textarea
              id="notes"
              placeholder={t("modals.followUp.create.notesPlaceholder")}
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>
        </form>

        <DialogFooter className="flex-shrink-0">
          <form onSubmit={handleSubmit} className="w-full flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              {t("modals.followUp.create.cancel")}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("modals.followUp.create.creating")}
                </>
              ) : (
                t("modals.followUp.create.scheduleFollowUp")
              )}
            </Button>
          </form>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

