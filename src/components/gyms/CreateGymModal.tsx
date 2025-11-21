import { useState } from "react";
import { Building2, Mail, Phone, X, MapPin } from "lucide-react";
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
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { createGym } from "@/services/gymService";

interface CreateGymModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onGymCreated: () => void;
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
}

const CreateGymModal = ({ open, onOpenChange, onGymCreated }: CreateGymModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<FormData>({
    name: '',
    slug: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

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

    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await createGym({
        name: formData.name.trim(),
        slug: formData.slug.trim(),
        address: formData.address.trim() || undefined,
        city: formData.city.trim() || undefined,
        state: formData.state.trim() || undefined,
        zipCode: formData.zipCode.trim() || undefined,
        phone: formData.phone.trim() || undefined,
        email: formData.email.trim() || undefined
      });

      toast.success(t("gyms.gymCreatedSuccess"));
      handleClose();
      onGymCreated();
    } catch (error: any) {
      console.error('Error creating gym:', error);
      toast.error(error.response?.data?.message || t("gyms.gymCreatedFailed"));
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
      email: ''
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
            {t("gyms.createNewGym")}
          </DialogTitle>
          <DialogDescription>
            {t("gyms.addNewGymLocation")}
          </DialogDescription>
        </DialogHeader>

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

          {/* Slug (Auto-generated) */}
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
              {t("gyms.cancel")}
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                  {t("gyms.creating")}
                </>
              ) : (
                <>
                  <Building2 className="h-4 w-4 mr-2" />
                  {t("gyms.createGym")}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateGymModal;
