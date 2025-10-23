import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useTranslation } from "@/hooks/useTranslation";
import { Plan } from "@/services/planService";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: string) => void;
  plan: Plan | null;
}

const DeletePlanDialog = ({ isOpen, onClose, onConfirm, plan }: DeletePlanDialogProps) => {
  const { t } = useTranslation();
  const handleConfirm = () => {
    if (plan) {
      onConfirm(plan.id);
    }
  };

  if (!plan) return null;

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("modals.plans.delete.title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("modals.plans.delete.description")} <strong>"{plan.name}"</strong>?
            <br /><br />
            {t("modals.plans.delete.warning")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("modals.plans.delete.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {t("modals.plans.delete.delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlanDialog;
