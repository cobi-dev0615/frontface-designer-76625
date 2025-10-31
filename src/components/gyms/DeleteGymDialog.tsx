import { useState } from "react";
import { Trash2, AlertTriangle } from "lucide-react";
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
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { deleteGym, type Gym } from "@/services/gymService";

interface DeleteGymDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  gym: Gym | null;
  onGymDeleted: () => void;
}

const DeleteGymDialog = ({ open, onOpenChange, gym, onGymDeleted }: DeleteGymDialogProps) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!gym?.id) return;

    setIsDeleting(true);
    try {
      await deleteGym(gym.id);
      toast.success(t("gyms.gymDeletedSuccess") || 'Gym deleted successfully');
      onOpenChange(false);
      onGymDeleted();
    } catch (error: any) {
      console.error('Error deleting gym:', error);
      toast.error(error.response?.data?.message || t("gyms.gymDeletedFailed") || 'Failed to delete gym');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            {t("gyms.deleteGym")}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t("gyms.deleteGymConfirm") || `Are you sure you want to delete "${gym?.name}"? This action cannot be undone.`}
            {gym?.name && (
              <span className="block mt-2 font-semibold text-foreground">
                {gym.name}
              </span>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>
            {t("common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-destructive-foreground border-t-transparent mr-2" />
                {t("gyms.deleting") || 'Deleting...'}
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                {t("common.delete")}
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteGymDialog;

