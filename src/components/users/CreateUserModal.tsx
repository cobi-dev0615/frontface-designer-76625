import { useState, useEffect } from "react";
import { User, Mail, Lock, Phone, UserCheck, X, Building2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { createUser } from "@/services/userManagementService";
import { getAllGyms, type Gym } from "@/services/gymService";

interface CreateUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUserCreated: () => void;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  phone: string;
  gymIds: string[];
}

const CreateUserModal = ({ open, onOpenChange, onUserCreated }: CreateUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'AGENT',
    phone: '',
    gymIds: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);

  useEffect(() => {
    if (open) {
      loadGyms();
    }
  }, [open]);

  const loadGyms = async () => {
    setLoadingGyms(true);
    try {
      const allGyms = await getAllGyms();
      setGyms(allGyms.filter(gym => !gym.isDeleted && gym.status === 'ACTIVE'));
    } catch (error) {
      console.error('Error loading gyms:', error);
      toast.error('Failed to load gyms');
    } finally {
      setLoadingGyms(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("modals.createUser.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("modals.createUser.nameMinLength");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("modals.createUser.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("modals.createUser.invalidEmailFormat");
    }

    if (!formData.password) {
      newErrors.password = t("modals.createUser.passwordRequired");
    } else if (formData.password.length < 8) {
      newErrors.password = t("modals.createUser.passwordMinLength");
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = t("modals.createUser.confirmPasswordRequired");
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("modals.createUser.passwordsDoNotMatch");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createUser({
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        role: formData.role,
        phone: formData.phone.trim() || undefined,
        gymIds: formData.gymIds.length > 0 ? formData.gymIds : undefined
      });

      toast.success(t("modals.createUser.userCreatedSuccess"));
      handleClose();
      onUserCreated();
    } catch (error: any) {
      console.error('Error creating user:', error);
      toast.error(error.response?.data?.message || t("modals.createUser.createUserFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'AGENT',
      phone: '',
      gymIds: []
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleGymToggle = (gymId: string) => {
    setFormData(prev => ({
      ...prev,
      gymIds: prev.gymIds.includes(gymId)
        ? prev.gymIds.filter(id => id !== gymId)
        : [...prev.gymIds, gymId]
    }));
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("modals.createUser.title")}
          </DialogTitle>
          <DialogDescription>
            {t("modals.createUser.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("modals.createUser.fullName")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder={t("modals.createUser.enterFullName")}
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name}</p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{t("modals.createUser.emailAddress")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("modals.createUser.enterEmailAddress")}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t("modals.createUser.role")}</Label>
            <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'MANAGER' | 'AGENT') => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("modals.createUser.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGENT">{t("modals.createUser.roleDescriptions.agent")}</SelectItem>
                <SelectItem value="MANAGER">{t("modals.createUser.roleDescriptions.manager")}</SelectItem>
                <SelectItem value="ADMIN">{t("modals.createUser.roleDescriptions.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t("modals.createUser.phoneNumber")}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder="+55 (86) 99999-9999"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Gym Selection */}
          <div className="space-y-2">
            <Label>{t("modals.createUser.gymAccess")}</Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {loadingGyms ? (
                <p className="text-sm text-muted-foreground">{t("common.loading")}...</p>
              ) : gyms.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t("modals.createUser.noGymsAvailable")}</p>
              ) : (
                gyms.map((gym) => (
                  <div key={gym.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`gym-${gym.id}`}
                      checked={formData.gymIds.includes(gym.id)}
                      onCheckedChange={() => handleGymToggle(gym.id)}
                    />
                    <Label
                      htmlFor={`gym-${gym.id}`}
                      className="text-sm font-normal cursor-pointer flex items-center gap-2"
                    >
                      <Building2 className="h-4 w-4" />
                      {gym.name}
                    </Label>
                  </div>
                ))
              )}
            </div>
            {formData.gymIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {t("modals.createUser.selectedGyms", { count: formData.gymIds.length })}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="space-y-2">
            <Label htmlFor="password">{t("modals.createUser.password")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={t("modals.createUser.enterPassword")}
                value={formData.password}
                onChange={(e) => handleInputChange('password', e.target.value)}
                className={`pl-10 ${errors.password ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password}</p>
            )}
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("modals.createUser.confirmPassword")}</Label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder={t("modals.createUser.confirmPasswordPlaceholder")}
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                className={`pl-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              {t("modals.createUser.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  {t("modals.createUser.creating")}
                </>
              ) : (
                <>
                  <User className="h-4 w-4 mr-2" />
                  {t("modals.createUser.createUser")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateUserModal;
