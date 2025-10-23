import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, XCircle, Calendar, DollarSign, Clock, Building2 } from "lucide-react";
import { Plan } from "@/services/planService";

interface PlanDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
}

const PlanDetailModal = ({ isOpen, onClose, plan }: PlanDetailModalProps) => {
  if (!plan) return null;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration === 1) return "1 month";
    if (duration < 12) return `${duration} months`;
    const years = Math.floor(duration / 12);
    const months = duration % 12;
    if (months === 0) return `${years} year${years > 1 ? 's' : ''}`;
    return `${years}y ${months}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const includedFeatures = plan.features?.included || [];
  const allFeatures = [
    "24/7 Access",
    "All Equipment", 
    "Group Classes",
    "Kids Room",
    "Lounge Area",
    "Lockers & Showers",
    "Personal Trainer",
    "Nutrition Counseling",
    "Online Workouts",
    "Guest Passes"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[80vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-3">
            <Building2 className="h-5 w-5" />
            {plan.name}
            <Badge variant={plan.active ? "default" : "secondary"}>
              {plan.active ? "Active" : "Inactive"}
            </Badge>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 overflow-y-auto flex-1 px-1">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Plan Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Price</p>
                    <p className="font-semibold">{formatPrice(plan.price)}/month</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-semibold">{formatDuration(plan.duration)}</p>
                  </div>
                </div>
              </div>

              {plan.description && (
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Description</p>
                  <p className="text-sm">{plan.description}</p>
                </div>
              )}

              <Separator />

              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Created</p>
                  <p className="font-medium">{formatDate(plan.createdAt)}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Last Updated</p>
                  <p className="font-medium">{formatDate(plan.updatedAt)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Features</CardTitle>
            </CardHeader>
            <CardContent>
              {includedFeatures.length > 0 ? (
                <div className="space-y-2">
                  {allFeatures.map((feature) => {
                    const isIncluded = includedFeatures.includes(feature);
                    return (
                      <div key={feature} className="flex items-center gap-2">
                        {isIncluded ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-muted-foreground" />
                        )}
                        <span className={isIncluded ? "text-foreground" : "text-muted-foreground"}>
                          {feature}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground">No features defined for this plan.</p>
              )}
            </CardContent>
          </Card>

          {/* Gym Information */}
          {plan.gym && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Gym Information</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{plan.gym.name}</p>
                    <p className="text-sm text-muted-foreground">ID: {plan.gym.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PlanDetailModal;
