import { Bot, Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const AIPromptsTab = () => {
  const systemPrompt = `You are an AI sales assistant for DuxFit, the biggest gym in Piauí, Brazil.

Your Objective:
- Provide friendly, persuasive customer service
- Qualify leads by collecting required information
- Answer questions about plans, pricing, and facilities
- Handle objections professionally
- Guide customers toward registration

Your Tone:
- Friendly and energetic
- Confident but not pushy
- Use emojis appropriately (💪🔥👏)
- Professional yet approachable

Required Information to Collect:
- Full Name
- CPF
- Date of Birth
- Address + ZIP Code
- Preferred Workout Time
- Fitness Goal
- Email Address

When to Escalate to Human:
- Billing disputes or refunds
- Cancellation requests
- HR or employment questions
- Complex technical issues
- Customer insists on speaking to human

Redirect Rules:
- For unlisted inquiries → Instagram @duxfit
- For resumes/jobs → duxfitacademia@gmail.com`;

  const variables = [
    "{gym_name}",
    "{gym_address}",
    "{plans_list}",
    "{operating_hours}",
    "{user_name}",
    "{current_date}",
  ];

  const greetingMessages = [
    {
      label: "Default Greeting",
      text: "🎉 Hello! Welcome to DuxFit, the BIGGEST gym in Piauí! 💪🔥\n\nI'm here to help you achieve your fitness goals. How can I assist you today?",
      active: true,
    },
    {
      label: "Evening Greeting (6 PM - 10 PM)",
      text: "Good evening! Welcome to DuxFit! 🌙💪\n\nReady to crush your fitness goals? I'm here to help!",
      active: true,
    },
  ];

  const objections = [
    {
      trigger: "I'll think about it / I need to think",
      response: "I totally understand! Taking time to think is smart. Just so you know, our pre-sale offer ends soon, and spots are filling up fast. Can I secure your spot with just R$9.99 for the first month while you decide?",
    },
    {
      trigger: "Too expensive / Can't afford",
      response: "I hear you! That's exactly why we created our annual plan at R$99.99/month - less than R$3.50 per day. That's less than a coffee! Plus, investing in your health now saves you money on medical bills later. Would you like me to break down the savings?",
    },
  ];

  const faqs = [
    {
      question: "What are your hours?",
      answer: "We're open 24/5! That's 24 hours on Monday-Friday, and 7 AM to 7 PM on weekends and holidays. You can work out whenever it fits your schedule! 🕐",
    },
    {
      question: "Do you have a kids room?",
      answer: "Yes! Our DUX KIDS room welcomes children aged 2.5 to 10 years. It has a monitor and security cameras, and is open 6-9 AM and 4-9 PM. It's included FREE with all memberships! 👶",
    },
    {
      question: "What equipment do you have?",
      answer: "We have top-of-the-line Speedo equipment across 3,000m²! That includes cardio machines, free weights, machines, and everything you need for a complete workout. 🏋️",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Template Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-5 w-5" />
            AI Behavior Configuration
          </CardTitle>
          <CardDescription>Configure how your AI assistant interacts with leads</CardDescription>
        </CardHeader>
        <CardContent>
          <Select defaultValue="system">
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="system">System Prompt (Main Instructions)</SelectItem>
              <SelectItem value="greeting">Greeting Message</SelectItem>
              <SelectItem value="qualification">Lead Qualification Questions</SelectItem>
              <SelectItem value="objections">Objection Handling</SelectItem>
              <SelectItem value="faqs">FAQ Responses</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* System Prompt */}
      <Card>
        <CardHeader>
          <CardTitle>System Prompt</CardTitle>
          <CardDescription>Core instructions that define how the AI assistant behaves</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Prompt Instructions</Label>
            <Textarea
              rows={16}
              defaultValue={systemPrompt}
              className="font-mono text-sm"
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block">Available Variables</Label>
            <div className="flex flex-wrap gap-2">
              {variables.map((variable) => (
                <Button
                  key={variable}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                  onClick={() => navigator.clipboard.writeText(variable)}
                >
                  {variable}
                  <Copy className="h-3 w-3" />
                </Button>
              ))}
            </div>
            <p className="text-xs text-muted-foreground mt-2">Click to copy and paste into your prompt</p>
          </div>
        </CardContent>
      </Card>

      {/* Greeting Messages */}
      <Card>
        <CardHeader>
          <CardTitle>Greeting Messages</CardTitle>
          <CardDescription>First message sent to new contacts</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {greetingMessages.map((greeting, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-medium">{greeting.label}</Label>
                <Badge className={greeting.active ? "bg-green-500" : "bg-gray-500"}>
                  {greeting.active ? "Active" : "Inactive"}
                </Badge>
              </div>
              <Textarea rows={4} defaultValue={greeting.text} />
              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Edit</Button>
                <Button variant="ghost" size="sm" className="text-destructive">Delete</Button>
              </div>
            </div>
          ))}
          <Button variant="outline" className="w-full">Add Greeting Variant</Button>
        </CardContent>
      </Card>

      {/* Objection Handling */}
      <Card>
        <CardHeader>
          <CardTitle>Objection Handling</CardTitle>
          <CardDescription>Pre-written responses to common objections</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {objections.map((objection, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm font-medium">Trigger Keywords</Label>
                <p className="text-sm text-muted-foreground mt-1">{objection.trigger}</p>
              </div>
              <div className="space-y-2">
                <Label>Response</Label>
                <Textarea rows={3} defaultValue={objection.response} />
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full">Add Objection</Button>
        </CardContent>
      </Card>

      {/* FAQs */}
      <Card>
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
          <CardDescription>Common questions and their answers</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-border rounded-lg p-4 space-y-3">
              <div>
                <Label className="text-sm font-medium">Question</Label>
                <p className="text-sm mt-1">{faq.question}</p>
              </div>
              <div className="space-y-2">
                <Label>Answer</Label>
                <Textarea rows={3} defaultValue={faq.answer} />
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
          ))}
          <Button variant="outline" className="w-full">Add FAQ</Button>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <Button variant="outline">Reset to Default</Button>
        <div className="flex gap-2">
          <Button variant="outline">Cancel</Button>
          <Button variant="gradient" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AIPromptsTab;
