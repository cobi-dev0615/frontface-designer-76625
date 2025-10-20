import { useState } from "react";
import { ArrowLeft, Phone, Video, MoreVertical, Send, Smile, Paperclip, Building2, Mail, Eye, Calendar, CheckCircle, Ban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";

const mockMessages = [
  { id: 1, sender: "user", text: "Hi! I saw your ad, and I want to know how much the gym costs.", time: "10:23 AM" },
  { id: 2, sender: "ai", text: "💪 Hello! Welcome to DuxFit — the biggest gym in Piauí! Our annual plan starts at just R$99.99 per month. Would you like me to help you register now?", time: "10:24 AM" },
  { id: 3, sender: "user", text: "What's included in this plan?", time: "10:25 AM" },
  { id: 4, sender: "ai", text: "Great question! The R$99.99/month annual plan includes: ✅ 24/7 gym access, ✅ All equipment, ✅ Group classes, ✅ Kids room (2.5-10 years), ✅ Lounge area, ✅ Lockers and showers", time: "10:26 AM" },
  { id: 5, sender: "user", text: "That sounds good. How do I sign up?", time: "10:27 AM" },
  { id: 6, sender: "ai", text: "Awesome! I'll just need your full name, CPF, birth date, address + ZIP, preferred workout time, your goal, and email to get started.", time: "10:28 AM" },
];

const quickResponses = [
  "Share pricing details",
  "Send registration link",
  "Schedule tour",
  "Answer about kids room",
];

const ConversationView = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [isTyping] = useState(false);

  const lead = {
    name: "Maria Souza",
    phone: "(86) 99123-4567",
    email: "maria.souza@email.com",
    cpf: "***.***.***.45",
    status: "qualified",
    dob: "15/03/1995",
    address: "Rua das Flores, 123",
    zip: "64000-000",
    workoutTime: "Evening (18:00-20:00)",
    goal: "Lose weight and build muscle",
  };

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // Handle send logic
    setMessage("");
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] gap-6">
      {/* Left Sidebar - Lead Info */}
      <div className="w-80 flex-shrink-0 space-y-4 overflow-y-auto">
        <Button
          variant="ghost"
          className="gap-2 -ml-2"
          onClick={() => navigate("/leads")}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to leads
        </Button>

        {/* Lead Profile */}
        <Card>
          <CardContent className="p-6 space-y-4">
            <div className="flex flex-col items-center text-center">
              <Avatar className="h-20 w-20 mb-3">
                <AvatarFallback className="bg-gradient-primary text-white text-xl font-bold">
                  MS
                </AvatarFallback>
              </Avatar>
              <h3 className="text-lg font-bold">{lead.name}</h3>
              <Badge className="mt-2 bg-green-500 text-white">
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
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span>CPF: {lead.cpf}</span>
              </div>
            </div>

            <Separator />

            <div className="space-y-2 text-sm">
              <div>
                <p className="text-muted-foreground">Date of Birth</p>
                <p className="font-medium">{lead.dob}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Address</p>
                <p className="font-medium">{lead.address}</p>
                <p className="text-muted-foreground text-xs">ZIP: {lead.zip}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Workout Time</p>
                <p className="font-medium">{lead.workoutTime}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Goal</p>
                <p className="font-medium">{lead.goal}</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <Button className="w-full gap-2" variant="outline">
                <Calendar className="h-4 w-4" />
                Schedule Follow-up
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <CheckCircle className="h-4 w-4" />
                Mark as Qualified
              </Button>
              <Button className="w-full gap-2" variant="outline">
                <Ban className="h-4 w-4 text-destructive" />
                Block Lead
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* EVO System */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">EVO System</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <span>Synced</span>
            </div>
            <p className="text-muted-foreground">EVO Member ID: #EVO-12345</p>
            <p className="text-muted-foreground text-xs">Last sync: 2 hours ago</p>
            <Button variant="outline" size="sm" className="w-full">
              Sync Now
            </Button>
          </CardContent>
        </Card>

        {/* Notes */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Notes</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Add notes about this lead..."
              className="min-h-[100px]"
            />
            <Button size="sm" className="w-full mt-2">
              Save
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
              Active now
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
          <div className="text-center">
            <p className="text-xs text-muted-foreground bg-muted px-3 py-1 rounded-full inline-block">
              Today
            </p>
          </div>

          {mockMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "ai" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[70%] ${msg.sender === "ai" ? "flex-row-reverse" : ""}`}>
                {msg.sender === "user" && (
                  <Avatar className="h-8 w-8 flex-shrink-0">
                    <AvatarFallback className="text-xs bg-muted">MS</AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <div
                    className={`rounded-2xl p-3 ${
                      msg.sender === "ai"
                        ? "bg-gradient-primary text-white"
                        : "bg-card border border-border"
                    }`}
                  >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 px-3">{msg.time}</p>
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
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              className="flex-1"
            />
            <Button
              variant="gradient"
              size="icon"
              disabled={!message.trim()}
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
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
            <CardTitle className="text-sm">Quick Responses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickResponses.map((response) => (
              <Button
                key={response}
                variant="outline"
                className="w-full justify-start text-left h-auto py-2 px-3"
                onClick={() => setMessage(response)}
              >
                {response}
              </Button>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Message Templates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <select className="w-full border border-input rounded-md p-2 bg-background">
              <option>Select template</option>
              <option>Welcome message</option>
              <option>Follow-up message</option>
              <option>Objection handling</option>
              <option>Closing message</option>
            </select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center justify-between">
              Activity Timeline
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-green-500 mt-1.5" />
              <div>
                <p className="font-medium">Lead created</p>
                <p className="text-xs text-muted-foreground">Oct 20, 10:00 AM</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-blue-500 mt-1.5" />
              <div>
                <p className="font-medium">First message sent</p>
                <p className="text-xs text-muted-foreground">Oct 20, 10:23 AM</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500 mt-1.5" />
              <div>
                <p className="font-medium">Status changed to Interested</p>
                <p className="text-xs text-muted-foreground">Oct 20, 10:45 AM</p>
              </div>
            </div>
            <div className="flex gap-2">
              <div className="h-2 w-2 rounded-full bg-purple-500 mt-1.5" />
              <div>
                <p className="font-medium">Qualified by AI</p>
                <p className="text-xs text-muted-foreground">Oct 20, 11:00 AM</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ConversationView;
