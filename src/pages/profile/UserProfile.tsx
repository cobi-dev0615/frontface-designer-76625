import { User, Mail, Phone, Lock, Bell, Shield, Palette } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserProfile = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile and preferences</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center gap-4">
              <Avatar className="h-32 w-32">
                <AvatarFallback className="bg-gradient-primary text-white text-3xl font-bold">
                  AU
                </AvatarFallback>
              </Avatar>
              <div className="text-center">
                <p className="font-bold text-lg">Admin User</p>
                <p className="text-sm text-muted-foreground">admin@duxfit.com</p>
              </div>
              <div className="flex gap-2 w-full">
                <Button variant="outline" className="flex-1">Change Photo</Button>
                <Button variant="outline" size="icon">
                  <User className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Settings Tabs */}
        <Card className="lg:col-span-2">
          <Tabs defaultValue="personal">
            <CardHeader>
              <TabsList className="w-full">
                <TabsTrigger value="personal" className="flex-1">Personal</TabsTrigger>
                <TabsTrigger value="security" className="flex-1">Security</TabsTrigger>
                <TabsTrigger value="preferences" className="flex-1">Preferences</TabsTrigger>
              </TabsList>
            </CardHeader>

            <CardContent>
              <TabsContent value="personal" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input id="name" defaultValue="Admin User" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="flex gap-2">
                    <Input id="email" type="email" defaultValue="admin@duxfit.com" />
                    <Button variant="outline">Verify</Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input id="phone" defaultValue="+55 (86) 99999-9999" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" defaultValue="Administrator" readOnly />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    defaultValue="america/fortaleza"
                  >
                    <option value="america/fortaleza">America/Fortaleza (GMT-3)</option>
                    <option value="america/sao_paulo">America/São Paulo (GMT-3)</option>
                    <option value="america/manaus">America/Manaus (GMT-4)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <select
                    id="language"
                    className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background"
                    defaultValue="pt-BR"
                  >
                    <option value="pt-BR">Português (Brasil)</option>
                    <option value="en-US">English (US)</option>
                    <option value="es">Español</option>
                  </select>
                </div>

                <Button variant="gradient" className="w-full">Save Changes</Button>
              </TabsContent>

              <TabsContent value="security" className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" />
                </div>

                <Button variant="gradient" className="w-full">Update Password</Button>

                <Separator />

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-muted-foreground">Add an extra layer of security</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Login Notifications</p>
                      <p className="text-sm text-muted-foreground">Get notified of new logins</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <Button variant="outline" className="w-full">View Active Sessions</Button>
                </div>
              </TabsContent>

              <TabsContent value="preferences" className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">WhatsApp Notifications</p>
                    <p className="text-sm text-muted-foreground">Get alerts on WhatsApp</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Desktop Notifications</p>
                    <p className="text-sm text-muted-foreground">Browser push notifications</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label>Theme</Label>
                  <div className="grid grid-cols-3 gap-2">
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Palette className="h-5 w-5" />
                      <span className="text-xs">Light</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2 border-primary">
                      <Palette className="h-5 w-5" />
                      <span className="text-xs">Dark</span>
                    </Button>
                    <Button variant="outline" className="h-20 flex flex-col gap-2">
                      <Palette className="h-5 w-5" />
                      <span className="text-xs">Auto</span>
                    </Button>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Compact View</p>
                    <p className="text-sm text-muted-foreground">Reduce spacing in lists</p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Animations</p>
                    <p className="text-sm text-muted-foreground">Enable UI animations</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Button variant="gradient" className="w-full">Save Preferences</Button>
              </TabsContent>
            </CardContent>
          </Tabs>
        </Card>
      </div>

      {/* Danger Zone */}
      <Card className="border-destructive">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Export All My Data
          </Button>
          <Button variant="outline" className="w-full text-destructive hover:text-destructive">
            Delete My Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
