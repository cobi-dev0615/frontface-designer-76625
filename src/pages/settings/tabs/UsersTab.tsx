import { useState } from "react";
import { 
  Shield, 
  Lock, 
  Clock, 
  UserCheck, 
  AlertTriangle,
  Database,
  Bell,
  Save,
  Globe
} from "lucide-react";
import { useLanguageStore } from "@/store/languageStore";
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
import { useTranslation } from "@/hooks/useTranslation";

const UsersTab = () => {
  const { t } = useTranslation();
  
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

  // Language Settings
  const { language } = useLanguageStore();
  const [defaultLanguage, setDefaultLanguage] = useState<'pt-BR' | 'en'>(language);

  const handleSave = () => {
    toast.success(t("users.userSettingsSavedSuccessfully"));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t("users.userSystemSettings")}</CardTitle>
          <CardDescription>{t("users.configureSystemWideUserPolicies")}</CardDescription>
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
                <CardTitle>{t("users.passwordPolicy")}</CardTitle>
              </div>
              <CardDescription>{t("users.passwordRequirements")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength" className="text-sm">{t("users.minLength")}</Label>
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
                  <Label htmlFor="passwordExpiry" className="text-sm">{t("users.expiryDays")}</Label>
                  <Input
                    id="passwordExpiry"
                    type="number"
                    min="0"
                    max="365"
                    value={passwordExpiry}
                    onChange={(e) => setPasswordExpiry(e.target.value)}
                    placeholder={t("users.never")}
                    className="h-9"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label className="text-sm">{t("users.requirements")}</Label>
                
                <div className="flex items-center justify-between">
                  <Label htmlFor="requireUppercase" className="font-normal text-sm">{t("users.uppercase")}</Label>
                  <Switch
                    id="requireUppercase"
                    checked={requireUppercase}
                    onCheckedChange={setRequireUppercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireLowercase" className="font-normal text-sm">{t("users.lowercase")}</Label>
                  <Switch
                    id="requireLowercase"
                    checked={requireLowercase}
                    onCheckedChange={setRequireLowercase}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireNumbers" className="font-normal text-sm">{t("users.numbers")}</Label>
                  <Switch
                    id="requireNumbers"
                    checked={requireNumbers}
                    onCheckedChange={setRequireNumbers}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="requireSpecialChars" className="font-normal text-sm">{t("users.specialChars")}</Label>
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
                <CardTitle>{t("users.userRegistration")}</CardTitle>
              </div>
              <CardDescription>{t("users.registrationPolicies")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="allowSelfRegistration" className="font-normal text-sm">{t("users.allowSelfRegistration")}</Label>
                <Switch
                  id="allowSelfRegistration"
                  checked={allowSelfRegistration}
                  onCheckedChange={setAllowSelfRegistration}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="requireEmailVerification" className="font-normal text-sm">{t("users.requireEmailVerification")}</Label>
                <Switch
                  id="requireEmailVerification"
                  checked={requireEmailVerification}
                  onCheckedChange={setRequireEmailVerification}
                />
              </div>

              <Separator />

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="defaultRole" className="text-sm">{t("users.defaultRole")}</Label>
                  <Select value={defaultRole} onValueChange={setDefaultRole}>
                    <SelectTrigger id="defaultRole" className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AGENT">{t("users.agent")}</SelectItem>
                      <SelectItem value="MANAGER">{t("users.manager")}</SelectItem>
                      <SelectItem value="ADMIN">{t("users.admin")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="invitationExpiry" className="text-sm">{t("users.invitationExpiry")}</Label>
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
                <CardTitle>{t("users.sessionAndSecurity")}</CardTitle>
              </div>
              <CardDescription>{t("users.sessionAndSecurityPolicies")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm">{t("users.timeoutMin")}</Label>
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
                  <Label htmlFor="maxLoginAttempts" className="text-sm">{t("users.maxAttempts")}</Label>
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
                  <Label htmlFor="lockoutDuration" className="text-sm">{t("users.lockoutMin")}</Label>
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
                  <Label htmlFor="enforce2FA" className="font-normal text-sm">{t("users.enforce2FA")}</Label>
                  <Switch
                    id="enforce2FA"
                    checked={enforce2FA}
                    onCheckedChange={setEnforce2FA}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="allowMultipleSessions" className="font-normal text-sm">{t("users.multipleSessions")}</Label>
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
                <CardTitle>{t("users.dataRetention")}</CardTitle>
              </div>
              <CardDescription>{t("users.lgpdGdprCompliance")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="inactiveUserDays" className="text-sm">{t("users.inactiveWarning")}</Label>
                  <Input
                    id="inactiveUserDays"
                    type="number"
                    min="30"
                    max="730"
                    value={inactiveUserDays}
                    onChange={(e) => setInactiveUserDays(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">{t("users.days")}</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deletedUserRetention" className="text-sm">{t("users.deletedRetention")}</Label>
                  <Input
                    id="deletedUserRetention"
                    type="number"
                    min="30"
                    max="365"
                    value={deletedUserRetention}
                    onChange={(e) => setDeletedUserRetention(e.target.value)}
                    className="h-9"
                  />
                  <p className="text-xs text-muted-foreground">{t("users.days")}</p>
                </div>
              </div>

              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-3 border border-yellow-200 dark:border-yellow-900">
                <div className="flex gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-medium text-yellow-800 dark:text-yellow-200">
                      {t("users.lgpdCompliance")}
                    </p>
                    <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-0.5">
                      {t("users.consultLegalBeforeChanging")}
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
                <CardTitle>{t("users.adminNotifications")}</CardTitle>
              </div>
              <CardDescription>{t("users.userEventNotifications")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="notifyNewUser" className="font-normal text-sm">{t("users.newUserCreated")}</Label>
                <Switch
                  id="notifyNewUser"
                  checked={notifyNewUser}
                  onCheckedChange={setNotifyNewUser}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyUserDeleted" className="font-normal text-sm">{t("users.userDeleted")}</Label>
                <Switch
                  id="notifyUserDeleted"
                  checked={notifyUserDeleted}
                  onCheckedChange={setNotifyUserDeleted}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="notifyRoleChanged" className="font-normal text-sm">{t("users.roleChanged")}</Label>
                <Switch
                  id="notifyRoleChanged"
                  checked={notifyRoleChanged}
                  onCheckedChange={setNotifyRoleChanged}
                />
              </div>
            </CardContent>
          </Card>

          {/* Language Settings */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                <CardTitle>{t("users.languageSettings")}</CardTitle>
              </div>
              <CardDescription>{t("users.defaultLanguageDescription")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="defaultLanguage" className="text-sm">{t("users.selectDefaultLanguage")}</Label>
                <Select value={defaultLanguage} onValueChange={(value: 'pt-BR' | 'en') => setDefaultLanguage(value)}>
                  <SelectTrigger id="defaultLanguage" className="h-9">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pt-BR">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇧🇷</span>
                        <span>{t("users.portuguese")}</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="en">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🇺🇸</span>
                        <span>{t("users.english")}</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="rounded-lg bg-muted/50 p-3 border">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{defaultLanguage === 'pt-BR' ? '🇧🇷' : '🇺🇸'}</span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-muted-foreground">{t("users.currentDefaultLanguage")}</p>
                    <p className="text-sm font-semibold">
                      {defaultLanguage === 'pt-BR' ? t("users.portuguese") : t("users.english")}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  {t("users.languageForNewUsers")}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline">
          {t("users.resetToDefaults")}
        </Button>
        <Button onClick={handleSave}>
          <Save className="h-4 w-4 mr-2" />
          {t("users.saveSettings")}
        </Button>
      </div>
    </div>
  );
};

export default UsersTab;