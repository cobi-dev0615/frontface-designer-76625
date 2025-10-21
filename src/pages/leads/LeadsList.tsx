import { useState, useEffect } from "react";
import { Users, Download, Plus, Search, Building2, Calendar, Eye, Pencil, MessageCircle, Trash2, MoreVertical, Loader2 } from "lucide-react";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import * as leadService from "@/services/leadService";
import * as gymService from "@/services/gymService";
import type { Lead, LeadStats } from "@/services/leadService";
import type { Gym } from "@/services/gymService";

const statusConfig = {
  new: { label: "New", color: "bg-blue-500" },
  contacted: { label: "Contacted", color: "bg-yellow-500" },
  qualified: { label: "Qualified", color: "bg-green-500" },
  negotiating: { label: "Negotiating", color: "bg-orange-500" },
  closed: { label: "Closed", color: "bg-purple-500" },
  lost: { label: "Lost", color: "bg-red-500" },
};

const LeadsList = () => {
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStats>({
    all: 0,
    new: 0,
    contacted: 0,
    qualified: 0,
    negotiating: 0,
    closed: 0,
    lost: 0,
  });
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGymId, setSelectedGymId] = useState("all-gyms");
  const [dateRange, setDateRange] = useState("last-30");
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({
    total: 0,
    limit: 50,
    offset: 0,
    hasMore: false,
  });

  // Load gyms from backend
  const loadGyms = async () => {
    try {
      const response = await gymService.getAllGyms();
      setGyms(response.gyms || []);
    } catch (error: any) {
      console.error("Error loading gyms:", error);
      toast.error("Failed to load gyms");
    }
  };

  // Load leads from backend
  const loadLeads = async () => {
    try {
      setIsLoading(true);
      
      // Calculate date range
      let dateFrom: string | undefined;
      const now = new Date();
      if (dateRange === "last-7") {
        dateFrom = new Date(now.setDate(now.getDate() - 7)).toISOString();
      } else if (dateRange === "last-30") {
        dateFrom = new Date(now.setDate(now.getDate() - 30)).toISOString();
      } else if (dateRange === "last-90") {
        dateFrom = new Date(now.setDate(now.getDate() - 90)).toISOString();
      }

      const response = await leadService.getAllLeads({
        search: searchQuery || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        gymId: selectedGymId !== "all-gyms" ? selectedGymId : undefined,
        dateFrom,
        limit: pagination.limit,
        offset: pagination.offset,
      });

      setLeads(response.data);
      setStats(response.stats);
      setPagination(response.pagination);
    } catch (error: any) {
      console.error("Error loading leads:", error);
      toast.error(error.response?.data?.message || "Failed to load leads");
    } finally {
      setIsLoading(false);
    }
  };

  // Load gyms on mount
  useEffect(() => {
    loadGyms();
  }, []);

  // Load leads on mount and when filters change
  useEffect(() => {
    loadLeads();
  }, [selectedStatus, searchQuery, selectedGymId, dateRange, pagination.offset]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleLeadSelection = (leadId: string) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedLeads.length === leads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(leads.map((lead) => lead.id));
    }
  };

  const handleExportCSV = async () => {
    try {
      toast.loading("Exporting leads...");
      await leadService.exportLeads({
        search: searchQuery || undefined,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
        gymId: selectedGymId !== "all-gyms" ? selectedGymId : undefined,
      });
      toast.dismiss();
      toast.success("Leads exported successfully!");
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.response?.data?.message || "Failed to export leads");
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    if (!confirm("Are you sure you want to delete this lead?")) return;

    try {
      await leadService.deleteLead(leadId);
      toast.success("Lead deleted successfully");
      loadLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete lead");
    }
  };

  const handleBulkStatusChange = async () => {
    const newStatus = prompt("Enter new status (new, contacted, qualified, negotiating, closed, lost):");
    if (!newStatus) return;

    try {
      await leadService.bulkUpdateStatus(selectedLeads, newStatus);
      toast.success(`${selectedLeads.length} leads updated successfully`);
      setSelectedLeads([]);
      loadLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to update leads");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${selectedLeads.length} leads?`)) return;

    try {
      await leadService.bulkDeleteLeads(selectedLeads);
      toast.success(`${selectedLeads.length} leads deleted successfully`);
      setSelectedLeads([]);
      loadLeads();
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to delete leads");
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes} min ago`;
    if (hours < 24) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    return `${days} day${days > 1 ? "s" : ""} ago`;
  };

  const handlePreviousPage = () => {
    if (pagination.offset > 0) {
      setPagination((prev) => ({
        ...prev,
        offset: Math.max(0, prev.offset - prev.limit),
      }));
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      setPagination((prev) => ({
        ...prev,
        offset: prev.offset + prev.limit,
      }));
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" className="gap-2" onClick={handleExportCSV}>
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
        <Button variant="gradient" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Lead
        </Button>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedStatus === "all" ? "default" : "outline"}
          className={`gap-2 ${selectedStatus === "all" ? "bg-primary text-primary-foreground" : ""}`}
          onClick={() => setSelectedStatus("all")}
        >
          All
          <Badge variant="secondary" className="ml-1">
            {stats.all}
          </Badge>
        </Button>
        {Object.entries(statusConfig).map(([status, config]) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            className={`gap-2 ${selectedStatus === status ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setSelectedStatus(status)}
          >
            {config.label}
            <Badge variant="secondary" className="ml-1">
              {stats[status as keyof LeadStats]}
            </Badge>
          </Button>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={selectedGymId} onValueChange={setSelectedGymId}>
          <SelectTrigger className="w-[180px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-gyms">All Gyms</SelectItem>
            {gyms.map((gym) => (
              <SelectItem key={gym.id} value={gym.id}>
                {gym.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={dateRange} onValueChange={setDateRange}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="last-7">Last 7 days</SelectItem>
            <SelectItem value="last-30">Last 30 days</SelectItem>
            <SelectItem value="last-90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="rounded-lg border border-border bg-card shadow-sm overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <span className="ml-2 text-muted-foreground">Loading leads...</span>
          </div>
        ) : leads.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No leads found</h3>
            <p className="text-muted-foreground">Try adjusting your filters or create a new lead</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="border-b border-border bg-muted/50">
                  <tr>
                    <th className="p-4 text-left">
                      <Checkbox
                        checked={selectedLeads.length === leads.length && leads.length > 0}
                        onCheckedChange={toggleSelectAll}
                      />
                    </th>
                    <th className="p-4 text-left font-medium">Lead</th>
                    <th className="p-4 text-left font-medium">Status</th>
                    <th className="p-4 text-left font-medium">Gym</th>
                    <th className="p-4 text-left font-medium">Created</th>
                    <th className="p-4 text-left font-medium">Source</th>
                    <th className="p-4 text-left font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-muted/30 transition-colors">
                      <td className="p-4">
                        <Checkbox
                          checked={selectedLeads.includes(lead.id)}
                          onCheckedChange={() => toggleLeadSelection(lead.id)}
                        />
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-10 w-10">
                            <AvatarFallback className="bg-gradient-primary text-white text-sm font-semibold">
                              {getInitials(lead.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{lead.name}</p>
                            <p className="text-sm text-muted-foreground">{lead.phone}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <Badge
                          variant="secondary"
                          className={`${statusConfig[lead.status.toLowerCase() as keyof typeof statusConfig]?.color || "bg-gray-500"} text-white`}
                        >
                          {statusConfig[lead.status.toLowerCase() as keyof typeof statusConfig]?.label || lead.status}
                        </Badge>
                      </td>
                      <td className="p-4 text-sm">{lead.gym.name}</td>
                      <td className="p-4 text-sm text-muted-foreground">{formatDate(lead.createdAt)}</td>
                      <td className="p-4 text-sm">{lead.source}</td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="bg-popover">
                            <DropdownMenuItem className="gap-2" onClick={() => navigate(`/leads/${lead.id}`)}>
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Pencil className="h-4 w-4" />
                              Edit Lead
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <MessageCircle className="h-4 w-4" />
                              Send Message
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              className="gap-2 text-destructive"
                              onClick={() => handleDeleteLead(lead.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="border-t border-border p-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {pagination.offset + 1}-{Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} leads
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePreviousPage}
                  disabled={pagination.offset === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleNextPage}
                  disabled={!pagination.hasMore}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
          <span className="font-medium">{selectedLeads.length} leads selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary" onClick={handleBulkStatusChange}>
              Change Status
            </Button>
            <Button size="sm" variant="secondary">
              Send Message
            </Button>
            <Button size="sm" variant="secondary" onClick={handleExportCSV}>
              Export
            </Button>
            <Button size="sm" variant="destructive" onClick={handleBulkDelete}>
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
