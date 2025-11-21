import { useState, useEffect } from "react";
import { Building2, Mail, Phone, X, MapPin, Save } from "lucide-react";
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
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { updateGym, getGymById, type Gym } from "@/services/gymService";
import GymAdvantagesManager from "./GymAdvantagesManager";

interface EditGymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gym: Gym | null;
  onGymUpdated: () => void;
}

interface FormData {
  name: string;
  slug: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  email: string;
  status: 'ACTIVE' | 'INACTIVE' | 'TRIAL';
}

const EditGymModal = ({ open, onOpenChange, gym, onGymUpdated }: EditGymModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: '',
    status: 'ACTIVE'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingGym, setLoadingGym] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (open && gym?.id) {
      loadGymData();
    }
  }, [open, gym?.id]);

  const loadGymData = async () => {
    if (!gym?.id) return;
    
    setLoadingGym(true);
    try {
      const gymData = await getGymById(gym.id);
      setFormData({
        name: gymData.name || '',
        slug: gymData.slug || '',
        address: gymData.address || '',
        city: gymData.city || '',
        state: gymData.state || '',
        zipCode: gymData.zipCode || '',
        phone: gymData.phone || '',
        email: gymData.email || '',
        status: gymData.status || 'ACTIVE'
      });
    } catch (error: any) {
      console.error('Error loading gym data:', error);
      toast.error(error.response?.data?.message || 'Failed to load gym data');
    } finally {
      setLoadingGym(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleNameChange = (name: string) => {
    setFormData(prev => ({
      ...prev,
      name,
      slug: generateSlug(name)
    }));
    if (errors.name) {
      setErrors(prev => ({ ...prev, name: undefined, slug: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = t("gyms.gymNameRequired");
    } else if (formData.name.trim().length < 2) {
      newErrors.name = t("gyms.nameMinLength");
    }

    if (!formData.slug.trim()) {
      newErrors.slug = t("gyms.slugRequired");
    } else if (!/^[a-z0-9-]+$/.test(formData.slug)) {
      newErrors.slug = t("gyms.slugFormat");
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t("gyms.invalidEmailFormat");
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!gym?.id || !validateForm()) return;

    setIsLoading(true);
    try {
      await updateGym(gym.id, {
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        zipCode: formData.zipCode.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined,
        status: formData.status
      });

      toast.success(t("gyms.gymUpdatedSuccess") || 'Gym updated successfully');
      handleClose();
      onGymUpdated();
    } catch (error: any) {
      console.error('Error updating gym:', error);
      toast.error(error.response?.data?.message || t("gyms.gymUpdatedFailed") || 'Failed to update gym');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      slug: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      status: 'ACTIVE'
    });
    setErrors({});
    onOpenChange(false);
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[66vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            {t("gyms.editDetails")}
          </DialogTitle>
          <DialogDescription>
            {t("gyms.updateGymInformation") || 'Update gym information'}
          </DialogDescription>
        </DialogHeader>

        {loadingGym ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
            {/* Gym Name */}
            <div className="space-y-2">
              <Label htmlFor="name">{t("gyms.gymName")} <span className="text-destructive">*</span></Label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="e.g., DuxFit - Piauí 2"
                  value={formData.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`pl-10 ${errors.name ? 'border-destructive' : ''}`}
                />
              </div>
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name}</p>
              )}
            </div>

            {/* Slug */}
            <div className="space-y-2">
              <Label htmlFor="slug">{t("gyms.slug")} <span className="text-destructive">*</span></Label>
              <Input
                id="slug"
                type="text"
                placeholder={t("gyms.autoGeneratedFromName")}
                value={formData.slug}
                onChange={(e) => handleInputChange('slug', e.target.value)}
                className={`font-mono text-sm ${errors.slug ? 'border-destructive' : ''}`}
              />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug}</p>
              )}
              <p className="text-xs text-muted-foreground">{t("gyms.urlFriendlyIdentifier")}</p>
            </div>

            {/* Status */}
            <div className="space-y-2">
              <Label htmlFor="status">{t("gyms.status")}</Label>
              <Select
                value={formData.status}
                onValueChange={(value: 'ACTIVE' | 'INACTIVE' | 'TRIAL') => handleInputChange('status', value)}
              >
                <SelectTrigger id="status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">{t("gyms.active")}</SelectItem>
                  <SelectItem value="INACTIVE">{t("gyms.inactive")}</SelectItem>
                  <SelectItem value="TRIAL">{t("gyms.trial")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* City and State */}
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">{t("gyms.city")}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="city"
                    type="text"
                    placeholder="e.g., Teresina"
                    value={formData.city}
                    onChange={(e) => handleInputChange('city', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">{t("gyms.state")}</Label>
                <Input
                  id="state"
                  type="text"
                  placeholder="e.g., PI"
                  maxLength={2}
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                  className="uppercase"
                />
              </div>
            </div>

            {/* Phone and Email */}
            <div className="grid gap-4 grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">{t("gyms.phone")}</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+55 (86) ..."
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">{t("gyms.email")}</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="gym@example.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
            </div>

            {/* Address */}
            <div className="space-y-2">
              <Label htmlFor="address">{t("gyms.address")}</Label>
              <Input
                id="address"
                type="text"
                placeholder={t("gyms.streetAddress")}
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
              />
            </div>

            {/* ZIP Code */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">{t("gyms.zipCode")}</Label>
              <Input
                id="zipCode"
                type="text"
                placeholder="64000-000"
                value={formData.zipCode}
                onChange={(e) => handleInputChange('zipCode', e.target.value)}
                className="max-w-[200px]"
              />
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={handleClose} disabled={isLoading}>
                <X className="h-4 w-4 mr-2" />
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                    {t("gyms.updating") || 'Saving...'}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    {t("common.save")}
                  </>
                )}
              </Button>
            </div>
            </form>

            {gym?.id && (
              <GymAdvantagesManager gymId={gym.id} />
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EditGymModal;

