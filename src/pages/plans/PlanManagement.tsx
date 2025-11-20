import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Filter, RefreshCw, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import {
  getAllPlans,
  getPlansByGymId,
  createPlan,
  updatePlan,
  deletePlan,
  type Plan,
  type CreatePlanData,
  type UpdatePlanData,
} from "@/services/planService";
import { getAllGyms, type Gym } from "@/services/gymService";
import { useGymStore } from "@/store/gymStore";

const PlanManagement = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  const [plans, setPlans] = useState<Plan[]>([]);
  const [filteredPlans, setFilteredPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchInput, setSearchInput] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("all");
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [planToEdit, setPlanToEdit] = useState<Plan | null>(null);
  const [planToDelete, setPlanToDelete] = useState<Plan | null>(null);
  
  // Form states
  const [formData, setFormData] = useState<CreatePlanData>({
    gymId: "",
    name: "",
    description: "",
    price: 0,
    duration: 30,
    features: [],
    active: true,
  });

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadPlans();
    }
  }, [selectedGym]);

  useEffect(() => {
    filterPlans();
  }, [plans, searchInput, activeFilter]);

  const loadGyms = async () => {
    try {
      const response = await getAllGyms();
      setGyms(response.gyms);
      
      if (!selectedGym && response.gyms.length > 0) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error: any) {
      console.error("Error loading gyms:", error);
      toast.error(error.response?.data?.message || t("plansManagement.loadGymsFailed"));
    }
  };

  const loadPlans = async () => {
    if (!selectedGym) return;
    
    try {
      setIsLoading(true);
      const response = await getPlansByGymId(selectedGym.id);
      setPlans(response);
    } catch (error: any) {
      console.error("Error loading plans:", error);
      toast.error(error.response?.data?.message || t("plansManagement.loadPlansFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const filterPlans = () => {
    let filtered = plans;

    // Search filter
    if (searchInput) {
      filtered = filtered.filter(
        (plan) =>
          plan.name.toLowerCase().includes(searchInput.toLowerCase()) ||
          plan.description?.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Active filter
    if (activeFilter === "active") {
      filtered = filtered.filter((plan) => plan.active);
    } else if (activeFilter === "inactive") {
      filtered = filtered.filter((plan) => !plan.active);
    }

    setFilteredPlans(filtered);
  };

  const handleCreatePlan = async () => {
    if (!selectedGym) {
      toast.error(t("plansManagement.selectGymFirst"));
      return;
    }

    if (!formData.name || formData.price <= 0 || formData.duration <= 0) {
      toast.error(t("plansManagement.fillRequiredFields"));
      return;
    }

    try {
      await createPlan({
        ...formData,
        gymId: selectedGym.id,
      });
      toast.success(t("plansManagement.planCreatedSuccess"));
      setIsCreateDialogOpen(false);
      resetForm();
      loadPlans();
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast.error(error.response?.data?.message || t("plansManagement.createPlanFailed"));
    }
  };

  const handleEditPlan = (plan: Plan) => {
    setPlanToEdit(plan);
    setFormData({
      gymId: plan.gymId,
      name: plan.name,
      description: plan.description || "",
      price: plan.price,
      duration: plan.duration,
      features: plan.features || [],
      active: plan.active,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdatePlan = async () => {
    if (!planToEdit) return;

    try {
      await updatePlan(planToEdit.id, formData);
      toast.success(t("plansManagement.planUpdatedSuccess"));
      setIsEditDialogOpen(false);
      resetForm();
      setPlanToEdit(null);
      loadPlans();
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast.error(error.response?.data?.message || t("plansManagement.updatePlanFailed"));
    }
  };

  const handleDeletePlan = async () => {
    if (!planToDelete) return;

    try {
      await deletePlan(planToDelete.id);
      toast.success(t("plansManagement.planDeletedSuccess"));
      setIsDeleteDialogOpen(false);
      setPlanToDelete(null);
      loadPlans();
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast.error(error.response?.data?.message || t("plansManagement.deletePlanFailed"));
    }
  };

  const resetForm = () => {
    setFormData({
      gymId: selectedGym?.id || "",
      name: "",
      description: "",
      price: 0,
      duration: 30,
      features: [],
      active: true,
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(price);
  };

  const formatDuration = (days: number) => {
    if (days === 30) return t("plansManagement.durationFormat.oneMonth");
    if (days === 60) return t("plansManagement.durationFormat.twoMonths");
    if (days === 90) return t("plansManagement.durationFormat.threeMonths");
    if (days === 180) return t("plansManagement.durationFormat.sixMonths");
    if (days === 365) return t("plansManagement.durationFormat.oneYear");
    return t("plansManagement.durationFormat.days").replace("{{days}}", String(days));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("plansManagement.title")}</h1>
          <p className="text-muted-foreground">
            {t("plansManagement.description")}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {gyms.length > 0 && (
            <Select
              value={selectedGym?.id || ""}
              onValueChange={(value) => {
                const gym = gyms.find((g) => g.id === value);
                if (gym) setSelectedGym(gym);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder={t("plansManagement.selectGym")}>
                  {selectedGym && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>{selectedGym.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {gyms.map((gym) => (
                  <SelectItem key={gym.id} value={gym.id}>
                    {gym.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button onClick={loadPlans} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => {
              resetForm();
              setIsCreateDialogOpen(true);
            }}
            disabled={!selectedGym}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("plansManagement.createPlan")}
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={t("plansManagement.searchPlans")}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="w-[180px]">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("plansManagement.allPlans")}</SelectItem>
                <SelectItem value="active">{t("plansManagement.activeOnly")}</SelectItem>
                <SelectItem value="inactive">{t("plansManagement.inactiveOnly")}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("plansManagement.plans")}</CardTitle>
          <CardDescription>
            {t("plansManagement.plansFound")
              .replace("{{count}}", String(filteredPlans.length))
              .replace(/{{plural}}/g, filteredPlans.length !== 1 ? "s" : "")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
                <p className="text-muted-foreground">{t("plansManagement.loadingPlans")}</p>
              </div>
            </div>
          ) : filteredPlans.length === 0 ? (
            <div className="flex h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-muted-foreground mb-4">{t("plansManagement.noPlansFound")}</p>
                <Button
                  onClick={() => {
                    resetForm();
                    setIsCreateDialogOpen(true);
                  }}
                  disabled={!selectedGym}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {t("plansManagement.createFirstPlan")}
                </Button>
              </div>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("plansManagement.tableName")}</TableHead>
                  <TableHead>{t("plansManagement.tableDescription")}</TableHead>
                  <TableHead>{t("plansManagement.tablePrice")}</TableHead>
                  <TableHead>{t("plansManagement.tableDuration")}</TableHead>
                  <TableHead>{t("plansManagement.tableStatus")}</TableHead>
                  <TableHead className="text-right">{t("plansManagement.tableActions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      {plan.description || "-"}
                    </TableCell>
                    <TableCell>{formatPrice(plan.price)}</TableCell>
                    <TableCell>{formatDuration(plan.duration)}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? t("plansManagement.active") : t("plansManagement.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditPlan(plan)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setPlanToDelete(plan);
                            setIsDeleteDialogOpen(true);
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Create Plan Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("plansManagement.createDialog.title")}</DialogTitle>
            <DialogDescription>
              {selectedGym?.name 
                ? t("plansManagement.createDialog.description").replace("{{gymName}}", selectedGym.name)
                : t("plansManagement.createDialog.descriptionDefault")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">
                {t("plansManagement.createDialog.planName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t("plansManagement.createDialog.planNamePlaceholder")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">{t("plansManagement.createDialog.descriptionLabel")}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                placeholder={t("plansManagement.createDialog.descriptionPlaceholder")}
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  {t("plansManagement.createDialog.price")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                  placeholder={t("plansManagement.createDialog.pricePlaceholder")}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="duration">
                  {t("plansManagement.createDialog.duration")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })
                  }
                  placeholder={t("plansManagement.createDialog.durationPlaceholder")}
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="active">{t("plansManagement.createDialog.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
              {t("plansManagement.createDialog.cancel")}
            </Button>
            <Button onClick={handleCreatePlan}>{t("plansManagement.createDialog.createPlan")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Plan Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t("plansManagement.editDialog.title")}</DialogTitle>
            <DialogDescription>
              {t("plansManagement.editDialog.description").replace("{{planName}}", planToEdit?.name || "")}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">
                {t("plansManagement.editDialog.planName")} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">{t("plansManagement.editDialog.descriptionLabel")}</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-price">
                  {t("plansManagement.editDialog.price")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-duration">
                  {t("plansManagement.editDialog.duration")} <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="edit-duration"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })
                  }
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-active"
                checked={formData.active}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, active: checked })
                }
              />
              <Label htmlFor="edit-active">{t("plansManagement.editDialog.active")}</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              {t("plansManagement.editDialog.cancel")}
            </Button>
            <Button onClick={handleUpdatePlan}>{t("plansManagement.editDialog.updatePlan")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Plan Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("plansManagement.deleteDialog.title")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("plansManagement.deleteDialog.description")}{" "}
              <strong>{planToDelete?.name}</strong>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("plansManagement.deleteDialog.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeletePlan} className="bg-destructive">
              {t("plansManagement.deleteDialog.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default PlanManagement;

