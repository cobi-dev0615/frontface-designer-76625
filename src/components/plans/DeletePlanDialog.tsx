import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plan } from "@/services/planService";

interface DeletePlanDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (planId: string) => void;
  plan: Plan | null;
}

const DeletePlanDialog = ({ isOpen, onClose, onConfirm, plan }: DeletePlanDialogProps) => {
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
          <AlertDialogTitle>Delete Plan</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the plan <strong>"{plan.name}"</strong>?
            <br /><br />
            This action cannot be undone. All data associated with this plan will be permanently removed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleConfirm}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Delete Plan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeletePlanDialog;
