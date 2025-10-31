import { useState, useEffect } from "react";
import { User, Mail, Phone, Save, X, Building2 } from "lucide-react";
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
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { updateUser, getUserById, type User as UserType } from "@/services/userManagementService";
import { getAllGyms, type Gym } from "@/services/gymService";

interface EditUserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: UserType;
  onUserUpdated: () => void;
}

interface FormData {
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'AGENT';
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  phone: string;
  gymIds: string[];
}

const EditUserModal = ({ open, onOpenChange, user, onUserUpdated }: EditUserModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    role: 'AGENT',
    status: 'ACTIVE',
    phone: '',
    gymIds: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [loadingGyms, setLoadingGyms] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  useEffect(() => {
    if (open && user?.id) {
      loadUserWithGyms();
      loadGyms();
    }
  }, [open, user?.id]);

  const loadUserWithGyms = async () => {
    setLoadingUser(true);
    try {
      const fullUser = await getUserById(user.id);
      setFormData({
        name: fullUser.name,
        email: fullUser.email,
        role: fullUser.role,
        status: fullUser.status,
        phone: fullUser.phone || '',
        gymIds: fullUser.gyms?.map(g => g.gymId) || []
      });
    } catch (error) {
      console.error('Error loading user:', error);
      toast.error('Failed to load user data');
    } finally {
      setLoadingUser(false);
    }
  };

  const loadGyms = async () => {
    setLoadingGyms(true);
    try {
      const response = await getAllGyms();
      // getAllGyms returns { gyms: [], total: number, hasMore: boolean }
      const allGyms = Array.isArray(response) ? response : response.gyms || [];
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
      newErrors.name = t("modals.userManagement.edit.nameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("modals.userManagement.edit.nameMinLength");
    }

    if (!formData.email.trim()) {
      newErrors.email = t("modals.userManagement.edit.emailRequired");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("modals.userManagement.edit.invalidEmailFormat");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await updateUser(user.id, {
        name: formData.name.trim(),
        email: formData.email.trim(),
        role: formData.role,
        status: formData.status,
        phone: formData.phone.trim() || undefined,
        gymIds: formData.gymIds.length > 0 ? formData.gymIds : []
      });

      toast.success(t("modals.userManagement.edit.userUpdatedSuccess"));
      handleClose();
      onUserUpdated();
    } catch (error: any) {
      console.error('Error updating user:', error);
      toast.error(error.response?.data?.message || t("modals.userManagement.edit.updateUserFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleGymToggle = (gymId: string) => {
    setFormData(prev => ({
      ...prev,
      gymIds: prev.gymIds.includes(gymId)
        ? prev.gymIds.filter(id => id !== gymId)
        : [...prev.gymIds, gymId]
    }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            {t("modals.userManagement.edit.title")}
          </DialogTitle>
          <DialogDescription>
            {t("modals.userManagement.edit.description")}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">{t("modals.userManagement.edit.fullName")}</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="name"
                type="text"
                placeholder={t("modals.userManagement.edit.enterFullName")}
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
            <Label htmlFor="email">{t("modals.userManagement.edit.emailAddress")}</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder={t("modals.userManagement.edit.enterEmailAddress")}
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
              />
            </div>
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">{t("modals.userManagement.edit.phoneNumber")}</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="phone"
                type="tel"
                placeholder={t("modals.userManagement.edit.phonePlaceholder")}
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Role */}
          <div className="space-y-2">
            <Label htmlFor="role">{t("modals.userManagement.edit.role")}</Label>
            <Select value={formData.role} onValueChange={(value: 'ADMIN' | 'MANAGER' | 'AGENT') => handleInputChange('role', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("modals.userManagement.edit.selectRole")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="AGENT">{t("modals.userManagement.edit.roleDescriptions.agent")}</SelectItem>
                <SelectItem value="MANAGER">{t("modals.userManagement.edit.roleDescriptions.manager")}</SelectItem>
                <SelectItem value="ADMIN">{t("modals.userManagement.edit.roleDescriptions.admin")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">{t("modals.userManagement.edit.status")}</Label>
            <Select value={formData.status} onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED') => handleInputChange('status', value)}>
              <SelectTrigger>
                <SelectValue placeholder={t("modals.userManagement.edit.selectStatus")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">{t("modals.userManagement.edit.statusOptions.active")}</SelectItem>
                <SelectItem value="INACTIVE">{t("modals.userManagement.edit.statusOptions.inactive")}</SelectItem>
                <SelectItem value="SUSPENDED">{t("modals.userManagement.edit.statusOptions.suspended")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Gym Selection */}
          <div className="space-y-2">
            <Label>{t("modals.createUser.gymAccess")}</Label>
            <div className="border rounded-md p-3 max-h-48 overflow-y-auto space-y-2">
              {loadingGyms || loadingUser ? (
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

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
              <X className="h-4 w-4 mr-2" />
              {t("modals.userManagement.edit.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  {t("modals.userManagement.edit.saving")}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {t("modals.userManagement.edit.saveChanges")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserModal;
