import { CheckCircle, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const WhatsAppTab = () => {
  return (
    <div className="space-y-6">
      {/* Connection Status - Full Width */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            WhatsApp Connection Status
          </CardTitle>
          <CardDescription>Manage your WhatsApp Business API integration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold">WhatsApp Connected</h3>
              <p className="text-lg">+55 (86) 99123-4567</p>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <p className="text-sm text-muted-foreground">Last message: 2 minutes ago</p>
            <Button variant="outline" className="text-destructive hover:text-destructive">
              Disconnect WhatsApp
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout - Phone Settings & Auto-Reply */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Phone Number Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Phone Number Settings</CardTitle>
            <CardDescription>Configure your WhatsApp Business number</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone-number">Phone Number</Label>
              <div className="flex gap-2">
                <Input id="phone-number" defaultValue="+55 (86) 99123-4567" readOnly />
                <Badge className="bg-green-500 flex items-center gap-1 px-3">
                  <CheckCircle className="h-3 w-3" />
                  Verified
                </Badge>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="display-name">Display Name</Label>
              <Input id="display-name" defaultValue="DuxFit Piauí" maxLength={25} />
              <p className="text-xs text-muted-foreground">Maximum 25 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-description">Business Profile Description</Label>
              <textarea
                id="business-description"
                className="w-full min-h-[100px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue="The biggest gym in Piauí! 💪 24/7 access, top equipment, and expert trainers."
                maxLength={256}
              />
              <p className="text-xs text-muted-foreground">Maximum 256 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="business-category">Business Category</Label>
              <select
                id="business-category"
                className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue="gym"
              >
                <option value="gym">Gym / Fitness Center</option>
                <option value="health">Health & Wellness</option>
                <option value="sports">Sports & Recreation</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Auto-Reply Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Auto-Reply Settings</CardTitle>
            <CardDescription>Configure automated responses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="away-message">Away Message</Label>
              <textarea
                id="away-message"
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue="Thanks for reaching out! We're currently away but will respond as soon as possible."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-message">Welcome Message for New Contacts</Label>
              <textarea
                id="welcome-message"
                className="w-full min-h-[80px] px-3 py-2 text-sm border border-input rounded-md bg-background"
                defaultValue="Welcome to DuxFit! 💪 How can we help you achieve your fitness goals?"
              />
            </div>

            <div className="space-y-2">
              <Label>Business Hours</Label>
              <p className="text-sm text-muted-foreground">Auto-replies are sent outside these hours</p>
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="space-y-2">
                  <Label htmlFor="start-time">Start Time</Label>
                  <Input id="start-time" type="time" defaultValue="08:00" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-time">End Time</Label>
                  <Input id="end-time" type="time" defaultValue="18:00" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Two Column Layout - Message Templates & Webhook */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: Message Templates */}
        <Card>
          <CardHeader>
            <CardTitle>Message Templates</CardTitle>
            <CardDescription>Pre-approved templates for broadcast messages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Welcome Template</h4>
                  <Badge className="bg-green-500">Approved</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Welcome new leads to your gym</p>
              </div>
              <div className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">Promotion Template</h4>
                  <Badge className="bg-yellow-500">Pending</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Send promotional offers to leads</p>
              </div>
              <Button variant="outline" className="w-full">Add New Template</Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Column: Webhook Configuration */}
        <Card>
          <CardHeader>
            <CardTitle>Webhook Configuration</CardTitle>
            <CardDescription>Advanced settings for developers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="webhook-url">Webhook URL</Label>
              <div className="flex gap-2">
                <Input
                  id="webhook-url"
                  defaultValue="https://api.duxfit.com/webhooks/whatsapp"
                  readOnly
                />
                <Button variant="outline" size="sm">Copy</Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="verify-token">Verify Token</Label>
              <div className="flex gap-2">
                <Input
                  id="verify-token"
                  type="password"
                  defaultValue="••••••••••••••"
                  readOnly
                />
                <Button variant="outline" size="sm">Show</Button>
              </div>
            </div>

            <Button variant="outline">Test Webhook</Button>
          </CardContent>
        </Card>
      </div>

      {/* Footer Actions */}
      <div className="sticky bottom-0 bg-background border-t border-border p-4 flex items-center justify-between shadow-lg rounded-t-lg">
        <p className="text-sm text-muted-foreground">Last saved: Auto-saved</p>
        <Button variant="gradient">Save Configuration</Button>
      </div>
    </div>
  );
};

export default WhatsAppTab;
