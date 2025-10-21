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
import * as leadService from "@/services/leadService";
import * as followUpService from "@/services/followUpService";
import type { Lead } from "@/services/leadService";

interface CreateFollowUpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateFollowUpModal({ isOpen, onClose, onSuccess }: CreateFollowUpModalProps) {
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
      toast.error("Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.leadId || !formData.type || !formData.scheduledDate || !formData.scheduledTime) {
      toast.error("Please fill in all required fields");
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

      toast.success("Follow-up scheduled successfully!");
      onSuccess();
      handleClose();
    } catch (error: any) {
      console.error("Error creating follow-up:", error);
      toast.error(error.response?.data?.message || "Failed to create follow-up");
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
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Schedule Follow-Up</DialogTitle>
          <DialogDescription>
            Create a new follow-up for a lead. Select the lead, type, and schedule the follow-up.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Lead Selection */}
          <div className="space-y-2">
            <Label htmlFor="lead">Lead *</Label>
            <Select
              value={formData.leadId}
              onValueChange={(value) => setFormData(prev => ({ ...prev, leadId: value }))}
              disabled={isLoading}
            >
              <SelectTrigger>
                <SelectValue placeholder={isLoading ? "Loading leads..." : "Select a lead"} />
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
            <Label htmlFor="type">Follow-up Type *</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "CALL" | "WHATSAPP" | "EMAIL" | "VISIT") => 
                setFormData(prev => ({ ...prev, type: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select follow-up type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CALL">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Call
                  </div>
                </SelectItem>
                <SelectItem value="WHATSAPP">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4" />
                    WhatsApp
                  </div>
                </SelectItem>
                <SelectItem value="EMAIL">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </div>
                </SelectItem>
                <SelectItem value="VISIT">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Visit
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
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
                      <span>Pick a date</span>
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
              <Label htmlFor="time">Time *</Label>
              <Select
                value={formData.scheduledTime}
                onValueChange={(value) => setFormData(prev => ({ ...prev, scheduledTime: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time" />
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
            <Label htmlFor="priority">Priority</Label>
            <Select
              value={formData.priority}
              onValueChange={(value: "HIGH" | "MEDIUM" | "LOW") => 
                setFormData(prev => ({ ...prev, priority: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LOW">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    Low Priority
                  </div>
                </SelectItem>
                <SelectItem value="MEDIUM">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-yellow-500" />
                    Medium Priority
                  </div>
                </SelectItem>
                <SelectItem value="HIGH">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500" />
                    High Priority
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes about this follow-up..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Schedule Follow-Up"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

