import { useState, useEffect } from "react";
import { Plus, Search, Filter, MoreVertical, Edit, Trash2, Copy, Eye, TrendingUp, DollarSign, Users, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { useGymStore } from "@/store/gymStore";
import * as planService from "@/services/planService";
import * as gymService from "@/services/gymService";
import { Plan, PlanStatistics } from "@/services/planService";
import CreatePlanModal from "@/components/plans/CreatePlanModal";
import EditPlanModal from "@/components/plans/EditPlanModal";
import DeletePlanDialog from "@/components/plans/DeletePlanDialog";
import PlanDetailModal from "@/components/plans/PlanDetailModal";

const PlanManagement = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  // State
  const [plans, setPlans] = useState<Plan[]>([]);
  const [statistics, setStatistics] = useState<PlanStatistics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  
  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadPlans();
      loadStatistics();
    }
  }, [selectedGym]);

  const loadGyms = async () => {
    try {
      const response = await gymService.getAllGyms();
      setGyms(response.gyms || []);
      if (response.gyms && response.gyms.length > 0 && !selectedGym) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error: any) {
      console.error("Error loading gyms:", error);
      toast.error(t("plans.loadGymsFailed"));
    }
  };

  const loadPlans = async () => {
    if (!selectedGym) return;
    
    try {
      setIsLoading(true);
      const response = await planService.getGymPlans(selectedGym.id, false);
      setPlans(response.data);
    } catch (error: any) {
      console.error("Error loading plans:", error);
      toast.error(t("plans.loadPlansFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const loadStatistics = async () => {
    if (!selectedGym) return;
    
    try {
      const response = await planService.getPlanStatistics(selectedGym.id);
      setStatistics(response.data);
    } catch (error: any) {
      console.error("Error loading statistics:", error);
    }
  };

  const handleCreatePlan = async (planData: any) => {
    if (!selectedGym) return;
    
    try {
      await planService.createPlan(selectedGym.id, planData);
      toast.success(t("plans.planCreatedSuccess"));
      loadPlans();
      loadStatistics();
      setIsCreateModalOpen(false);
    } catch (error: any) {
      console.error("Error creating plan:", error);
      toast.error(t("plans.planCreatedFailed"));
    }
  };

  const handleEditPlan = async (planId: string, planData: any) => {
    if (!selectedGym) return;
    
    try {
      await planService.updatePlan(selectedGym.id, planId, planData);
      toast.success(t("plans.planUpdatedSuccess"));
      loadPlans();
      loadStatistics();
      setIsEditModalOpen(false);
      setSelectedPlan(null);
    } catch (error: any) {
      console.error("Error updating plan:", error);
      toast.error(t("plans.planUpdatedFailed"));
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!selectedGym) return;
    
    try {
      await planService.deletePlan(selectedGym.id, planId);
      toast.success(t("plans.planDeletedSuccess"));
      loadPlans();
      loadStatistics();
      setIsDeleteDialogOpen(false);
      setSelectedPlan(null);
    } catch (error: any) {
      console.error("Error deleting plan:", error);
      toast.error(t("plans.planDeletedFailed"));
    }
  };

  const handleToggleStatus = async (plan: Plan) => {
    if (!selectedGym) return;
    
    try {
      await planService.togglePlanStatus(selectedGym.id, plan.id, !plan.active);
      toast.success(plan.active ? t("plans.planDeactivatedSuccess") : t("plans.planActivatedSuccess"));
      loadPlans();
      loadStatistics();
    } catch (error: any) {
      console.error("Error toggling plan status:", error);
      toast.error(t("plans.planStatusUpdateFailed"));
    }
  };

  const handleDuplicatePlan = async (plan: Plan) => {
    if (!selectedGym) return;
    
    try {
      await planService.duplicatePlan(selectedGym.id, plan.id, `${plan.name} (Copy)`);
      toast.success(t("plans.planDuplicatedSuccess"));
      loadPlans();
      loadStatistics();
    } catch (error: any) {
      console.error("Error duplicating plan:", error);
      toast.error(t("plans.planDuplicatedFailed"));
    }
  };

  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         plan.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || 
                         (statusFilter === "active" && plan.active) ||
                         (statusFilter === "inactive" && !plan.active);
    
    const matchesPrice = priceRange === "all" ||
                        (priceRange === "low" && plan.price < 100) ||
                        (priceRange === "medium" && plan.price >= 100 && plan.price < 200) ||
                        (priceRange === "high" && plan.price >= 200);
    
    return matchesSearch && matchesStatus && matchesPrice;
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const formatDuration = (duration: number) => {
    if (duration === 1) return t("plans.oneMonth");
    if (duration < 12) return t("plans.months", { count: duration });
    const years = Math.floor(duration / 12);
    const months = duration % 12;
    if (months === 0) return years === 1 ? t("plans.oneYear", { count: years }) : t("plans.years", { count: years });
    return t("plans.yearMonths", { years, months });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{t("plans.planManagement")}</h1>
        </div>
        <div className="grid gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-4 bg-muted rounded w-1/4 mb-2" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("plans.planManagement")}</h1>
          <p className="text-muted-foreground">
            {t("plans.manageMembershipPlans", { gymName: selectedGym?.name || t("plans.gym") })}
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("plans.createPlan")}
        </Button>
      </div>

      {/* Gym Selector */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium">{t("plans.gym")}:</label>
            <Select value={selectedGym?.id || ""} onValueChange={(gymId) => {
              const gym = gyms.find(g => g.id === gymId);
              if (gym) setSelectedGym(gym);
            }}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder={t("plans.selectGym")} />
              </SelectTrigger>
              <SelectContent>
                {gyms.map((gym) => (
                  <SelectItem key={gym.id} value={gym.id}>
                    {gym.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Statistics Cards */}
      {statistics && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("plans.totalPlans")}</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.totalPlans}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.activePlans} {t("plans.active")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("plans.averagePrice")}</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatPrice(statistics.averagePrice)}</div>
              <p className="text-xs text-muted-foreground">
                {t("plans.perMonth")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("plans.priceRange")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {statistics.cheapestPlan && statistics.mostExpensivePlan
                  ? `${formatPrice(statistics.cheapestPlan.price)} - ${formatPrice(statistics.mostExpensivePlan.price)}`
                  : "N/A"
                }
              </div>
              <p className="text-xs text-muted-foreground">
                {t("plans.cheapestToMostExpensive")}
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("plans.activePlans")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statistics.activePlans}</div>
              <p className="text-xs text-muted-foreground">
                {statistics.inactivePlans} {t("plans.inactive")}
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 items-center">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("plans.searchPlans")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("plans.status")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("plans.allStatus")}</SelectItem>
                <SelectItem value="active">{t("plans.active")}</SelectItem>
                <SelectItem value="inactive">{t("plans.inactive")}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={priceRange} onValueChange={setPriceRange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder={t("plans.priceRange")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t("plans.allPrices")}</SelectItem>
                <SelectItem value="low">{t("plans.under100")}</SelectItem>
                <SelectItem value="medium">{t("plans.between100200")}</SelectItem>
                <SelectItem value="high">{t("plans.over200")}</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={loadPlans}>
              <Filter className="h-4 w-4 mr-2" />
              {t("plans.refresh")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plans Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t("plans.plans")} ({filteredPlans.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredPlans.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{t("plans.noPlansFound")}</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || statusFilter !== "all" || priceRange !== "all"
                  ? t("plans.tryAdjustingFilters")
                  : t("plans.createFirstMembershipPlan")}
              </p>
              <Button onClick={() => setIsCreateModalOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                {t("plans.createPlan")}
              </Button>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("plans.name")}</TableHead>
                  <TableHead>{t("plans.description")}</TableHead>
                  <TableHead>{t("plans.price")}</TableHead>
                  <TableHead>{t("plans.duration")}</TableHead>
                  <TableHead>{t("plans.status")}</TableHead>
                  <TableHead>{t("plans.features")}</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPlans.map((plan) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium">{plan.name}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {plan.description || t("plans.noDescription")}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatPrice(plan.price)}
                    </TableCell>
                    <TableCell>{formatDuration(plan.duration)}</TableCell>
                    <TableCell>
                      <Badge variant={plan.active ? "default" : "secondary"}>
                        {plan.active ? t("plans.active") : t("plans.inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {plan.features && Object.keys(plan.features).length > 0
                        ? `${Object.keys(plan.features).length} ${t("plans.features")}`
                        : t("plans.noFeatures")
                      }
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => {
                            setSelectedPlan(plan);
                            setIsDetailModalOpen(true);
                          }}>
                            <Eye className="h-4 w-4 mr-2" />
                            {t("plans.viewDetails")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => {
                            setSelectedPlan(plan);
                            setIsEditModalOpen(true);
                          }}>
                            <Edit className="h-4 w-4 mr-2" />
                            {t("plans.edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleDuplicatePlan(plan)}>
                            <Copy className="h-4 w-4 mr-2" />
                            {t("plans.duplicate")}
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleToggleStatus(plan)}>
                            {plan.active ? t("plans.deactivate") : t("plans.activate")}
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => {
                              setSelectedPlan(plan);
                              setIsDeleteDialogOpen(true);
                            }}
                            className="text-destructive"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            {t("plans.delete")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      <CreatePlanModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={handleCreatePlan}
        gymId={selectedGym?.id}
      />
      
      <EditPlanModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedPlan(null);
        }}
        onSubmit={handleEditPlan}
        plan={selectedPlan}
        gymId={selectedGym?.id}
      />
      
      <DeletePlanDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSelectedPlan(null);
        }}
        onConfirm={handleDeletePlan}
        plan={selectedPlan}
      />
      
      <PlanDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedPlan(null);
        }}
        plan={selectedPlan}
      />
    </div>
  );
};

export default PlanManagement;
