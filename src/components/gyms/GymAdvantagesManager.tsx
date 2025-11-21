import { useEffect, useMemo, useState } from "react";
import { Plus, Loader2, Edit, Trash2, ListOrdered, Sparkles } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { toast } from "sonner";
import {
  createGymAdvantage,
  deleteGymAdvantage,
  getGymAdvantages,
  updateGymAdvantage,
  type GymAdvantage,
} from "@/services/gymAdvantageService";

interface GymAdvantagesManagerProps {
  gymId?: string | null;
}

const emptyForm = {
  title: "",
  description: "",
  order: "",
};

const GymAdvantagesManager = ({ gymId }: GymAdvantagesManagerProps) => {
  const { t } = useTranslation();
  const [advantages, setAdvantages] = useState<GymAdvantage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAdvantage, setSelectedAdvantage] = useState<GymAdvantage | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (gymId) {
      loadAdvantages(gymId);
    } else {
      setAdvantages([]);
    }
  }, [gymId]);

  const loadAdvantages = async (targetGymId: string) => {
    setIsLoading(true);
    try {
      const data = await getGymAdvantages(targetGymId);
      setAdvantages(data);
    } catch (error: any) {
      console.error("Error loading advantages:", error);
      toast.error(error.response?.data?.message || t("gyms.advantages.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (advantage?: GymAdvantage) => {
    setSelectedAdvantage(advantage || null);
    if (advantage) {
      setFormData({
        title: advantage.title,
        description: advantage.description || "",
        order: String(advantage.order ?? ""),
      });
    } else {
      setFormData({
        title: "",
        description: "",
        order: String(advantages.length + 1),
      });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!gymId) return;
    if (!formData.title.trim()) {
      toast.error(t("gyms.advantages.titleRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        order: formData.order ? Number(formData.order) : undefined,
      };

      if (selectedAdvantage) {
        await updateGymAdvantage(gymId, selectedAdvantage.id, payload);
        toast.success(t("gyms.advantages.updateSuccess"));
      } else {
        await createGymAdvantage(gymId, payload);
        toast.success(t("gyms.advantages.createSuccess"));
      }

      setIsDialogOpen(false);
      setFormData(emptyForm);
      loadAdvantages(gymId);
    } catch (error: any) {
      console.error("Error saving advantage:", error);
      toast.error(error.response?.data?.message || t("gyms.advantages.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!gymId || !selectedAdvantage) return;
    try {
      await deleteGymAdvantage(gymId, selectedAdvantage.id);
      toast.success(t("gyms.advantages.deleteSuccess"));
      setIsDeleteDialogOpen(false);
      setSelectedAdvantage(null);
      loadAdvantages(gymId);
    } catch (error: any) {
      console.error("Error deleting advantage:", error);
      toast.error(error.response?.data?.message || t("gyms.advantages.deleteFailed"));
    }
  };

  const orderedAdvantages = useMemo(
    () => advantages.slice().sort((a, b) => a.order - b.order),
    [advantages]
  );

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />
            {t("gyms.advantages.title")}
          </CardTitle>
          <CardDescription>{t("gyms.advantages.subtitle")}</CardDescription>
        </div>
        <Button
          size="sm"
          onClick={() => handleOpenDialog()}
          disabled={!gymId}
        >
          <Plus className="h-4 w-4 mr-2" />
          {t("gyms.advantages.addAdvantage")}
        </Button>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            {t("common.loading")}
          </div>
        ) : orderedAdvantages.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground">
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-70" />
            <p className="font-medium">{t("gyms.advantages.emptyTitle")}</p>
            <p className="text-sm">{t("gyms.advantages.emptyDescription")}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {orderedAdvantages.map((advantage) => (
              <div
                key={advantage.id}
                className="border border-border rounded-lg p-4 flex gap-3 items-start justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="uppercase tracking-wider">
                      {t("gyms.advantages.orderLabel")} {advantage.order}
                    </Badge>
                    <p className="font-medium text-sm">{advantage.title}</p>
                  </div>
                  {advantage.description && (
                    <p className="text-sm text-muted-foreground whitespace-pre-line">
                      {advantage.description}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleOpenDialog(advantage)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => {
                      setSelectedAdvantage(advantage);
                      setIsDeleteDialogOpen(true);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>
                {selectedAdvantage
                  ? t("gyms.advantages.editAdvantage")
                  : t("gyms.advantages.addAdvantage")}
              </DialogTitle>
              <DialogDescription>
                {t("gyms.advantages.dialogDescription")}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-2">
              <Label htmlFor="adv-title">{t("gyms.advantages.form.title")}</Label>
              <Input
                id="adv-title"
                value={formData.title}
                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                placeholder={t("gyms.advantages.form.titlePlaceholder")}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adv-description">{t("gyms.advantages.form.description")}</Label>
              <Textarea
                id="adv-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, description: e.target.value }))
                }
                placeholder={t("gyms.advantages.form.descriptionPlaceholder")}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adv-order">{t("gyms.advantages.form.order")}</Label>
              <div className="relative">
                <ListOrdered className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="adv-order"
                  type="number"
                  min={0}
                  value={formData.order}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, order: e.target.value }))
                  }
                  className="pl-10"
                />
              </div>
              <p className="text-xs text-muted-foreground">
                {t("gyms.advantages.form.orderHint")}
              </p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                {t("common.cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                )}
                {selectedAdvantage ? t("common.update") : t("common.create")}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("gyms.advantages.deleteTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("gyms.advantages.deleteDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("common.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={handleDelete}
            >
              {t("common.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default GymAdvantagesManager;

