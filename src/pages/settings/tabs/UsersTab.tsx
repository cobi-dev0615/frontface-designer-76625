import { useState } from "react";
import { 
  Shield, 
  Lock, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  Database,
  Bell,
  Save
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

const UsersTab = () => {
  // Password Policy
  const [passwordMinLength, setPasswordMinLength] = useState("8");
  const [requireUppercase, setRequireUppercase] = useState(true);
  const [requireLowercase, setRequireLowercase] = useState(true);
  const [requireNumbers, setRequireNumbers] = useState(true);
  const [requireSpecialChars, setRequireSpecialChars] = useState(true);
  const [passwordExpiry, setPasswordExpiry] = useState("90");

  // Session
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [maxLoginAttempts, setMaxLoginAttempts] = useState("5");
  const [lockoutDuration, setLockoutDuration] = useState("30");
  const [enforce2FA, setEnforce2FA] = useState(false);
  const [allowMultipleSessions, setAllowMultipleSessions] = useState(true);

  // Registration
  const [allowSelfRegistration, setAllowSelfRegistration] = useState(false);
  const [defaultRole, setDefaultRole] = useState("AGENT");
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [invitationExpiry, setInvitationExpiry] = useState("7");

  // Data Retention
  const [inactiveUserDays, setInactiveUserDays] = useState("180");
  const [deletedUserRetention, setDeletedUserRetention] = useState("90");

  // Notifications
  const [notifyNewUser, setNotifyNewUser] = useState(true);
  const [notifyUserDeleted, setNotifyUserDeleted] = useState(true);
  const [notifyRoleChanged, setNotifyRoleChanged] = useState(true);

  const handleSave = () => {
    toast.success("User settings saved successfully!");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>User System Settings</CardTitle>
          <CardDescription>Configure system-wide user policies and security</CardDescription>
        </CardHeader>
      </Card>

      {/* Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Password Policy */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                <CardTitle>Password Policy</CardTitle>
              </div>
              <CardDescription>Password requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength" className="text-sm">Min Length</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    min="6"
                    max="32"
                    value={passwordMinLength}
                    onChange={(e) => setPasswordMinLength(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordExpiry" className="text-sm">Expiry (days)</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    min="0"
                    max="365"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(e.target.value)}
                    placeholder="0 = never"
                    className="h-9"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm">Requirements</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase" className="font-normal text-sm">Uppercase (A-Z)</Label>
                  <Switch
                    id="requireUppercase"
                    checked={requireUppercase}
                    onCheckedChange={setRequireUppercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireLowercase" className="font-normal text-sm">Lowercase (a-z)</Label>
                  <Switch
                    id="requireLowercase"
                    checked={requireLowercase}
                    onCheckedChange={setRequireLowercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers" className="font-normal text-sm">Numbers (0-9)</Label>
                  <Switch
                    id="requireNumbers"
                    checked={requireNumbers}
                    onCheckedChange={setRequireNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialChars" className="font-normal text-sm">Special Chars (!@#$)</Label>
                  <Switch
                    id="requireSpecialChars"
                    checked={requireSpecialChars}
                    onCheckedChange={setRequireSpecialChars}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* User Registration */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-primary" />
                <CardTitle>User Registration</CardTitle>
              </div>
              <CardDescription>Registration policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowSelfRegistration" className="font-normal text-sm">Allow Self-Registration</Label>
                <Switch
                  id="allowSelfRegistration"
                  checked={allowSelfRegistration}
                  onCheckedChange={setAllowSelfRegistration}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requireEmailVerification" className="font-normal text-sm">Require Email Verification</Label>
                <Switch
                  id="requireEmailVerification"
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />
              </div>

              <Separator />

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole" className="text-sm">Default Role</Label>
                  <Select value={defaultRole} onValueChange={setDefaultRole}>
                    <SelectTrigger id="defaultRole" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGENT">Agent</SelectItem>
                      <SelectItem value="MANAGER">Manager</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invitationExpiry" className="text-sm">Invitation Expiry</Label>
                  <Input
                    id="invitationExpiry"
                    type="number"
                    min="1"
                    max="30"
                    value={invitationExpiry}
                    onChange={(e) => setInvitationExpiry(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Session & Security */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                <CardTitle>Session & Security</CardTitle>
              </div>
              <CardDescription>Session and security policies</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm">Timeout (min)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="5"
                    max="1440"
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maxLoginAttempts" className="text-sm">Max Attempts</Label>
                  <Input
                    id="maxLoginAttempts"
                    type="number"
                    min="3"
                    max="10"
                    value={maxLoginAttempts}
                    onChange={(e) => setMaxLoginAttempts(e.target.value)}
                    className="h-9"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lockoutDuration" className="text-sm">Lockout (min)</Label>
                  <Input
                    id="lockoutDuration"
                    type="number"
                    min="5"
                    max="1440"
                    value={lockoutDuration}
                    onChange={(e) => setLockoutDuration(e.target.value)}
                    className="h-9"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="enforce2FA" className="font-normal text-sm">Enforce 2FA</Label>
                  <Switch
                    id="enforce2FA"
                    checked={enforce2FA}
                    onCheckedChange={setEnforce2FA}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowMultipleSessions" className="font-normal text-sm">Multiple Sessions</Label>
                  <Switch
                    id="allowMultipleSessions"
                    checked={allowMultipleSessions}
                    onCheckedChange={setAllowMultipleSessions}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Database className="h-5 w-5 text-primary" />
                <CardTitle>Data Retention</CardTitle>
              </div>
              <CardDescription>LGPD/GDPR compliance</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inactiveUserDays" className="text-sm">Inactive Warning</Label>
                  <Input
                    id="inactiveUserDays"
                    type="number"
                    min="30"
                    max="730"
                    value={inactiveUserDays}
                    onChange={(e) => setInactiveUserDays(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deletedUserRetention" className="text-sm">Deleted Retention</Label>
                  <Input
                    id="deletedUserRetention"
                    type="number"
                    min="30"
                    max="365"
                    value={deletedUserRetention}
                    onChange={(e) => setDeletedUserRetention(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">Days</p>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 border border-yellow-200 dark:border-yellow-900">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      LGPD Compliance
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                      Consult legal before changing.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                <CardTitle>Admin Notifications</CardTitle>
              </div>
              <CardDescription>User event notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyNewUser" className="font-normal text-sm">New User Created</Label>
                <Switch
                  id="notifyNewUser"
                  checked={notifyNewUser}
                  onCheckedChange={setNotifyNewUser}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyUserDeleted" className="font-normal text-sm">User Deleted</Label>
                <Switch
                  id="notifyUserDeleted"
                  checked={notifyUserDeleted}
                  onCheckedChange={setNotifyUserDeleted}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyRoleChanged" className="font-normal text-sm">Role Changed</Label>
                <Switch
                  id="notifyRoleChanged"
                  checked={notifyRoleChanged}
                  onCheckedChange={setNotifyRoleChanged}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline">
          Reset to Defaults
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </Button>
      </div>
    </div>
  );
};

export default UsersTab;