import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";

interface CreatePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  gymId?: string;
}

const CreatePlanModal = ({ isOpen, onClose, onSubmit, gymId }: CreatePlanModalProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    features: {
      "24/7 Access": false,
      "All Equipment": false,
      "Group Classes": false,
      "Kids Room": false,
      "Lounge Area": false,
      "Lockers & Showers": false,
      "Personal Trainer": false,
      "Nutrition Counseling": false,
      "Online Workouts": false,
      "Guest Passes": false
    }
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.price || !formData.duration) {
      toast.error(t("modals.plans.create.fillRequiredFields"));
      return;
    }

    setIsSubmitting(true);
    
    try {
      const selectedFeatures = Object.entries(formData.features)
        .filter(([_, selected]) => selected)
        .map(([feature, _]) => feature);

      const planData = {
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        price: parseFloat(formData.price),
        duration: parseInt(formData.duration),
        features: {
          included: selectedFeatures,
          count: selectedFeatures.length
        }
      };

      await onSubmit(planData);
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        price: "",
        duration: "",
        features: {
          "24/7 Access": false,
          "All Equipment": false,
          "Group Classes": false,
          "Kids Room": false,
          "Lounge Area": false,
          "Lockers & Showers": false,
          "Personal Trainer": false,
          "Nutrition Counseling": false,
          "Online Workouts": false,
          "Guest Passes": false
        }
      });
    } catch (error) {
      console.error("Error creating plan:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: {
        ...prev.features,
        [feature]: !prev.features[feature as keyof typeof prev.features]
      }
    }));
  };

  const selectedFeaturesCount = Object.values(formData.features).filter(Boolean).length;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>{t("modals.plans.create.title")}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-1 px-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t("modals.plans.create.basicInformation")}</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t("modals.plans.create.planName")}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder={t("modals.plans.create.planNamePlaceholder")}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">{t("modals.plans.create.duration")}</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("modals.plans.create.selectDuration")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">{t("modals.plans.create.oneMonth")}</SelectItem>
                    <SelectItem value="3">{t("modals.plans.create.threeMonths")}</SelectItem>
                    <SelectItem value="6">{t("modals.plans.create.sixMonths")}</SelectItem>
                    <SelectItem value="12">{t("modals.plans.create.twelveMonths")}</SelectItem>
                    <SelectItem value="24">{t("modals.plans.create.twentyFourMonths")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("modals.plans.create.description")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t("modals.plans.create.descriptionPlaceholder")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">{t("modals.plans.create.monthlyPrice")}</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder={t("modals.plans.create.pricePlaceholder")}
                required
              />
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">{t("modals.plans.create.features")}</h3>
              <span className="text-sm text-muted-foreground">
                {selectedFeaturesCount} {t("modals.plans.create.selected")}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {Object.keys(formData.features).map((feature) => (
                <div key={feature} className="flex items-center space-x-2">
                  <Checkbox
                    id={feature}
                    checked={formData.features[feature as keyof typeof formData.features]}
                    onCheckedChange={() => handleFeatureToggle(feature)}
                  />
                  <Label htmlFor={feature} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {t(`modals.plans.create.planFeatures.${feature}`)}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("modals.plans.create.cancel")}
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? t("modals.plans.create.creating") : t("modals.plans.create.createPlan")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePlanModal;
