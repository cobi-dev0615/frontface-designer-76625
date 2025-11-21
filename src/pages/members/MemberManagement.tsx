import { useState, useEffect, useCallback, useRef } from "react";
import { Users, Search, Building2, Eye, Trash2, MoreVertical, Loader2, CheckCircle2, XCircle, Clock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { formatDate } from "@/lib/utils";
import { memberService, type Member } from "@/services/memberService";
import * as gymService from "@/services/gymService";
import type { Gym } from "@/services/gymService";

const getStatusConfig = (status: string, t: (key: string) => string) => {
  const configs: Record<string, { label: string; color: string; icon: any }> = {
    PENDING: { label: t("members.status.pending"), color: "bg-yellow-500", icon: Clock },
    APPROVED: { label: t("members.status.approved"), color: "bg-green-500", icon: CheckCircle2 },
    REJECTED: { label: t("members.status.rejected"), color: "bg-red-500", icon: XCircle },
    ACTIVE: { label: t("members.status.active"), color: "bg-blue-500", icon: CheckCircle2 },
    INACTIVE: { label: t("members.status.inactive"), color: "bg-gray-500", icon: AlertCircle },
    EXPIRED: { label: t("members.status.expired"), color: "bg-orange-500", icon: AlertCircle },
  };
  return configs[status] || { label: status, color: "bg-gray-500", icon: AlertCircle };
};

const MemberManagement = () => {
  const { t } = useTranslation();
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGymId, setSelectedGymId] = useState("all-gyms");
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 10,
    offset: 0,
    hasMore: false,
  });
  const [pageSize, setPageSize] = useState(10);
  const inFlightRef = useRef(false);
  const skipNextEffectRef = useRef(false);
  const searchDebounceRef = useRef<number | undefined>(undefined);

  // Load gyms
  const loadGyms = async () => {
    try {
      const response = await gymService.getAllGyms();
      const gymsArray = Array.isArray(response)
        ? response
        : Array.isArray((response as any)?.data)
          ? (response as any).data
          : Array.isArray((response as any)?.gyms)
            ? (response as any).gyms
            : [];
      setGyms(gymsArray);
    } catch (error: any) {
      console.error("Error loading gyms:", error);
      toast.error(t("members.failedToLoadGyms"));
    }
  };

  // Load members
  const loadMembers = useCallback(async (overrides?: { limit?: number; offset?: number }) => {
    if (inFlightRef.current) {
      return;
    }

    try {
      inFlightRef.current = true;
      setIsLoading(true);

      const limit = overrides?.limit ?? pageSize;
      const offset = overrides?.offset ?? pagination.offset;

      const filters: any = {
        limit,
        offset,
      };

      if (selectedGymId !== "all-gyms") {
        filters.gymId = selectedGymId;
      }

      if (selectedStatus !== "all") {
        filters.status = selectedStatus;
      }

      if (searchQuery.trim()) {
        filters.search = searchQuery.trim();
      }

      const response = await memberService.getAllMembers(filters);
      if (response && response.data && response.pagination) {
        setMembers(response.data);
        setPagination({
          total: response.pagination.total,
          limit: response.pagination.limit,
          offset: response.pagination.offset,
          hasMore: response.pagination.hasMore,
        });
      } else {
        setMembers([]);
        setPagination({
          total: 0,
          limit: pageSize,
          offset: 0,
          hasMore: false,
        });
      }
    } catch (error: any) {
      console.error("Error loading members:", error);
      setError(error.message || t("members.failedToLoadMembers"));
      toast.error(t("members.failedToLoadMembers"));
      setMembers([]);
      setPagination({
        total: 0,
        limit: pageSize,
        offset: 0,
        hasMore: false,
      });
    } finally {
      setIsLoading(false);
      inFlightRef.current = false;
    }
  }, [selectedGymId, selectedStatus, searchQuery, pageSize, pagination.offset]);

  // Initial load
  useEffect(() => {
    loadGyms();
  }, []);

  // Load members when filters change
  useEffect(() => {
    if (skipNextEffectRef.current) {
      skipNextEffectRef.current = false;
      return;
    }
    loadMembers({ offset: 0 });
  }, [selectedGymId, selectedStatus, pageSize]);

  // Debounced search
  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = window.setTimeout(() => {
      skipNextEffectRef.current = false;
      loadMembers({ offset: 0 });
    }, 500);

    return () => {
      if (searchDebounceRef.current) {
        clearTimeout(searchDebounceRef.current);
      }
    };
  }, [searchQuery]);

  // Handle page size change
  const handlePageSizeChange = (newSize: string) => {
    const size = parseInt(newSize);
    setPageSize(size);
    skipNextEffectRef.current = true;
    loadMembers({ limit: size, offset: 0 });
  };

  // Handle page change
  const handlePageChange = (newPage: number) => {
    const newOffset = (newPage - 1) * pageSize;
    skipNextEffectRef.current = true;
    loadMembers({ offset: newOffset });
  };

  // Handle previous page
  const handlePreviousPage = () => {
    if (pagination.offset > 0) {
      const newOffset = Math.max(0, pagination.offset - pageSize);
      skipNextEffectRef.current = true;
      loadMembers({ offset: newOffset });
    }
  };

  // Handle next page
  const handleNextPage = () => {
    if (pagination.hasMore) {
      const newOffset = pagination.offset + pageSize;
      skipNextEffectRef.current = true;
      loadMembers({ offset: newOffset });
    }
  };

  // Handle view member details
  const handleViewMember = async (memberId: string) => {
    try {
      const member = await memberService.getMemberById(memberId);
      setSelectedMember(member);
      setIsDetailDialogOpen(true);
    } catch (error: any) {
      console.error("Error loading member details:", error);
      toast.error(t("members.failedToLoadMemberDetails"));
    }
  };

  // Handle delete member
  const handleDeleteMember = async () => {
    if (!memberToDelete) return;

    try {
      await memberService.deleteMember(memberToDelete);
      toast.success(t("members.memberDeleted"));
      setDeleteDialogOpen(false);
      setMemberToDelete(null);
      loadMembers();
    } catch (error: any) {
      console.error("Error deleting member:", error);
      toast.error(t("members.failedToDeleteMember"));
    }
  };

  // Format date using the utility function that respects language settings

  // Calculate total pages
  const totalPages = Math.ceil(pagination.total / pageSize);
  const currentPage = Math.floor(pagination.offset / pageSize) + 1;

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{t("members.title")}</h1>
          <p className="text-muted-foreground mt-1">{t("members.description")}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("members.searchPlaceholder")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </div>
        <Select value={selectedGymId} onValueChange={setSelectedGymId}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("members.selectGym")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-gyms">{t("members.allGyms")}</SelectItem>
            {gyms.map((gym) => (
              <SelectItem key={gym.id} value={gym.id}>
                {gym.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedStatus} onValueChange={setSelectedStatus}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder={t("members.selectStatus")} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">{t("members.allStatuses")}</SelectItem>
            <SelectItem value="PENDING">{t("members.status.pending")}</SelectItem>
            <SelectItem value="APPROVED">{t("members.status.approved")}</SelectItem>
            <SelectItem value="REJECTED">{t("members.status.rejected")}</SelectItem>
            <SelectItem value="ACTIVE">{t("members.status.active")}</SelectItem>
            <SelectItem value="INACTIVE">{t("members.status.inactive")}</SelectItem>
            <SelectItem value="EXPIRED">{t("members.status.expired")}</SelectItem>
          </SelectContent>
        </Select>
        <Select value={pageSize.toString()} onValueChange={handlePageSizeChange}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 {t("members.itemsPerPage")}</SelectItem>
            <SelectItem value="10">10 {t("members.itemsPerPage")}</SelectItem>
            <SelectItem value="20">20 {t("members.itemsPerPage")}</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Members Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">{t("members.loadingMembers")}</span>
          </div>
        ) : !members || members.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">{t("members.noMembersFound")}</h3>
            <p className="text-muted-foreground">{t("members.noMembersDescription")}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-left font-medium">{t("members.member")}</th>
                    <th className="p-4 text-left font-medium">{t("members.statusLabel")}</th>
                    <th className="p-4 text-left font-medium">{t("members.gym")}</th>
                    <th className="p-4 text-left font-medium">{t("members.plan")}</th>
                    <th className="p-4 text-left font-medium">{t("members.created")}</th>
                    <th className="p-4 text-left font-medium">{t("members.actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {members.map((member) => {
                    const statusConfig = getStatusConfig(member.status, t);
                    const StatusIcon = statusConfig.icon;
                    return (
                      <tr key={member.id} className="hover:bg-muted/50">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {member.fullName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()
                                  .slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.fullName}</div>
                              <div className="text-sm text-muted-foreground">{member.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <Badge className={`${statusConfig.color} text-white`}>
                            <StatusIcon className="h-3 w-3 mr-1" />
                            {statusConfig.label}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                            <span>{member.gym?.name || t("common.none")}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span>{member.plan?.name || t("common.none")}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-sm text-muted-foreground">
                            {formatDate(member.createdAt)}
                          </span>
                        </td>
                        <td className="p-4">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewMember(member.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                {t("members.viewDetails")}
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => {
                                  setMemberToDelete(member.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                {t("members.delete")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {t("members.showing")} {pagination.offset + 1} - {Math.min(pagination.offset + pageSize, pagination.total)} {t("members.of")} {pagination.total} {t("members.members")}
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pagination.offset === 0}
                >
                  {t("members.previous")}
                </Button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let pageNum: number;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasMore}
                >
                  {t("members.next")}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Member Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("members.memberDetails")}</DialogTitle>
            <DialogDescription>{t("members.memberDetailsDescription")}</DialogDescription>
          </DialogHeader>
          {selectedMember && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.fullName")}</label>
                  <p className="mt-1">{selectedMember.fullName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.cpf")}</label>
                  <p className="mt-1">{selectedMember.cpf}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.birthDate")}</label>
                  <p className="mt-1">{selectedMember.birthDate ? formatDate(selectedMember.birthDate) : t("common.none")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.phone")}</label>
                  <p className="mt-1">{selectedMember.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.email")}</label>
                  <p className="mt-1">{selectedMember.email || t("common.none")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.statusLabel")}</label>
                  <p className="mt-1">
                    <Badge className={`${getStatusConfig(selectedMember.status, t).color} text-white`}>
                      {getStatusConfig(selectedMember.status, t).label}
                    </Badge>
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.gym")}</label>
                  <p className="mt-1">{selectedMember.gym?.name || t("common.none")}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-muted-foreground">{t("members.plan")}</label>
                  <p className="mt-1">{selectedMember.plan?.name || t("common.none")}</p>
                </div>
                {selectedMember.address && (
                  <div className="col-span-2">
                    <label className="text-sm font-medium text-muted-foreground">{t("members.address")}</label>
                    <p className="mt-1">{selectedMember.address}</p>
                  </div>
                )}
                {selectedMember.zipCode && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.zipCode")}</label>
                    <p className="mt-1">{selectedMember.zipCode}</p>
                  </div>
                )}
                {selectedMember.preferredWorkoutTime && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.preferredWorkoutTime")}</label>
                    <p className="mt-1">{selectedMember.preferredWorkoutTime}</p>
                  </div>
                )}
                {selectedMember.gymGoal && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.gymGoal")}</label>
                    <p className="mt-1">{selectedMember.gymGoal}</p>
                  </div>
                )}
                {selectedMember.planExpirationDate && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.planExpirationDate")}</label>
                    <p className="mt-1">{selectedMember.planExpirationDate ? formatDate(selectedMember.planExpirationDate) : t("common.none")}</p>
                  </div>
                )}
                {selectedMember.approvedAt && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.approvedAt")}</label>
                    <p className="mt-1">{selectedMember.approvedAt ? formatDate(selectedMember.approvedAt) : t("common.none")}</p>
                  </div>
                )}
                {selectedMember.approver && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">{t("members.approvedBy")}</label>
                    <p className="mt-1">{selectedMember.approver.name}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("members.deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("members.deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("members.cancel")}</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMember} className="bg-destructive text-destructive-foreground">
              {t("members.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default MemberManagement;

