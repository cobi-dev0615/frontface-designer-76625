import { useState } from "react";
import { AlertTriangle } from "lucide-react";
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
import { deleteUser, type User } from "@/services/userManagementService";

interface DeleteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User;
  onUserDeleted: () => void;
}

const DeleteUserDialog = ({ open, onOpenChange, user, onUserDeleted }: DeleteUserDialogProps) => {
  const { t } = useTranslation();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteUser(user.id);
      toast.success(`${t("modals.userManagement.delete.userDeletedSuccess")} ${user.name}`);
      onUserDeleted();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Error deleting user:', error);
      toast.error(error.response?.data?.message || t("modals.userManagement.delete.deleteUserFailed"));
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
            {t("modals.userManagement.delete.title")}
          </AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <p>
              {t("modals.userManagement.delete.description")} <strong>{user.name}</strong>?
            </p>
            <p className="text-sm">
              {t("modals.userManagement.delete.warning")}
            </p>
            <div className="mt-4 rounded-md bg-muted p-3">
              <p className="text-sm font-medium">{t("modals.userManagement.delete.userDetails")}</p>
              <ul className="mt-2 text-sm space-y-1">
                <li>• {t("modals.userManagement.delete.email")} {user.email}</li>
                <li>• {t("modals.userManagement.delete.role")} {user.role}</li>
                <li>• {t("modals.userManagement.delete.status")} {user.status}</li>
              </ul>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>{t("modals.userManagement.delete.cancel")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
                {t("modals.userManagement.delete.deleting")}
              </>
            ) : (
              t("modals.userManagement.delete.delete")
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteUserDialog;
