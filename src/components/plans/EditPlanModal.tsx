import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plan } from "@/services/planService";

interface EditPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (planId: string, data: any) => void;
  plan: Plan | null;
  gymId?: string;
}

const EditPlanModal = ({ isOpen, onClose, onSubmit, plan, gymId }: EditPlanModalProps) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    active: true,
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

  useEffect(() => {
    if (plan) {
      const includedFeatures = plan.features?.included || [];
      const features = {
        "24/7 Access": includedFeatures.includes("24/7 Access"),
        "All Equipment": includedFeatures.includes("All Equipment"),
        "Group Classes": includedFeatures.includes("Group Classes"),
        "Kids Room": includedFeatures.includes("Kids Room"),
        "Lounge Area": includedFeatures.includes("Lounge Area"),
        "Lockers & Showers": includedFeatures.includes("Lockers & Showers"),
        "Personal Trainer": includedFeatures.includes("Personal Trainer"),
        "Nutrition Counseling": includedFeatures.includes("Nutrition Counseling"),
        "Online Workouts": includedFeatures.includes("Online Workouts"),
        "Guest Passes": includedFeatures.includes("Guest Passes")
      };

      setFormData({
        name: plan.name,
        description: plan.description || "",
        price: plan.price.toString(),
        duration: plan.duration.toString(),
        active: plan.active,
        features
      });
    }
  }, [plan]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!plan || !formData.name.trim() || !formData.price || !formData.duration) {
      toast.error("Please fill in all required fields");
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
        active: formData.active,
        features: {
          included: selectedFeatures,
          count: selectedFeatures.length
        }
      };

      await onSubmit(plan.id, planData);
    } catch (error) {
      console.error("Error updating plan:", error);
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

  if (!plan) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle>Edit Plan: {plan.name}</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto flex-1 px-1">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Plan Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Basic Plan, Premium Plan"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration (months) *</Label>
                <Select
                  value={formData.duration}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 month</SelectItem>
                    <SelectItem value="3">3 months</SelectItem>
                    <SelectItem value="6">6 months</SelectItem>
                    <SelectItem value="12">12 months</SelectItem>
                    <SelectItem value="24">24 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this plan includes..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Monthly Price (BRL) *</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                placeholder="99.99"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, active: checked }))}
              />
              <Label htmlFor="active">Active Plan</Label>
            </div>
          </div>

          {/* Features */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Features</h3>
              <span className="text-sm text-muted-foreground">
                {selectedFeaturesCount} selected
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
                    {feature}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        </form>

        <div className="flex justify-end gap-2 pt-4 border-t flex-shrink-0">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? "Updating..." : "Update Plan"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditPlanModal;
