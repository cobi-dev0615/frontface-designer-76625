import { useState } from "react";
import { Users, Download, Plus, Search, Building2, Calendar, Eye, Pencil, MessageCircle, Trash2, MoreVertical } from "lucide-react";
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

const statusConfig = {
  new: { label: "New", color: "bg-blue-500" },
  interested: { label: "Interested", color: "bg-yellow-500" },
  qualified: { label: "Qualified", color: "bg-green-500" },
  closed: { label: "Closed", color: "bg-purple-500" },
  inactive: { label: "Inactive", color: "bg-gray-500" },
  lost: { label: "Lost", color: "bg-red-500" },
};

const mockLeads = [
  { id: 1, name: "Maria Souza", phone: "(86) 99123-4567", status: "qualified", gym: "Piauí 1", lastContact: "10 min ago", source: "WhatsApp" },
  { id: 2, name: "João Lima", phone: "(86) 99234-5678", status: "interested", gym: "Piauí 1", lastContact: "1 hour ago", source: "Instagram" },
  { id: 3, name: "Ana Pereira", phone: "(86) 99345-6789", status: "new", gym: "Piauí 2", lastContact: "2 days ago", source: "WhatsApp" },
  { id: 4, name: "Carlos Santos", phone: "(86) 99456-7890", status: "closed", gym: "Piauí 1", lastContact: "5 hours ago", source: "Website" },
  { id: 5, name: "Pedro Silva", phone: "(86) 99567-8901", status: "new", gym: "Piauí 2", lastContact: "30 min ago", source: "WhatsApp" },
  { id: 6, name: "Fernanda Costa", phone: "(86) 99678-9012", status: "interested", gym: "Piauí 1", lastContact: "3 hours ago", source: "Instagram" },
  { id: 7, name: "Roberto Alves", phone: "(86) 99789-0123", status: "qualified", gym: "Piauí 2", lastContact: "1 day ago", source: "WhatsApp" },
  { id: 8, name: "Juliana Pires", phone: "(86) 99890-1234", status: "inactive", gym: "Piauí 1", lastContact: "5 days ago", source: "Website" },
];

const LeadsList = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLeads, setSelectedLeads] = useState<number[]>([]);

  const statusCounts = {
    all: 247,
    new: 45,
    interested: 67,
    qualified: 89,
    closed: 45,
    inactive: 23,
    lost: 8,
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const toggleLeadSelection = (leadId: number) => {
    setSelectedLeads((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const filteredLeads = mockLeads.filter(
    (lead) =>
      (selectedStatus === "all" || lead.status === selectedStatus) &&
      (lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.phone.includes(searchQuery))
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
            <Users className="h-8 w-8 text-primary" />
            Leads
          </h1>
          <p className="text-muted-foreground mt-1">Manage and track all your gym leads</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button variant="gradient" className="gap-2">
            <Plus className="h-4 w-4" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <Button
            key={status}
            variant={selectedStatus === status ? "default" : "outline"}
            className={`gap-2 ${selectedStatus === status ? "bg-primary text-primary-foreground" : ""}`}
            onClick={() => setSelectedStatus(status)}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
            <Badge variant="secondary" className="ml-1">
              {count}
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
              placeholder="Search by name or phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select defaultValue="all-gyms">
          <SelectTrigger className="w-[180px]">
            <Building2 className="h-4 w-4 mr-2" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all-gyms">All Gyms</SelectItem>
            <SelectItem value="piaui-1">DuxFit - Piauí 1</SelectItem>
            <SelectItem value="piaui-2">DuxFit - Piauí 2</SelectItem>
          </SelectContent>
        </Select>
        <Select defaultValue="last-30">
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
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="p-4 text-left">
                  <Checkbox />
                </th>
                <th className="p-4 text-left font-medium">Lead</th>
                <th className="p-4 text-left font-medium">Status</th>
                <th className="p-4 text-left font-medium">Gym</th>
                <th className="p-4 text-left font-medium">Last Contact</th>
                <th className="p-4 text-left font-medium">Source</th>
                <th className="p-4 text-left font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredLeads.map((lead) => (
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
                      className={`${statusConfig[lead.status as keyof typeof statusConfig].color} text-white`}
                    >
                      {statusConfig[lead.status as keyof typeof statusConfig].label}
                    </Badge>
                  </td>
                  <td className="p-4 text-sm">DuxFit - {lead.gym}</td>
                  <td className="p-4 text-sm text-muted-foreground">{lead.lastContact}</td>
                  <td className="p-4 text-sm">{lead.source}</td>
                  <td className="p-4">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-popover">
                        <DropdownMenuItem className="gap-2">
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
                        <DropdownMenuItem className="gap-2 text-destructive">
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
          <p className="text-sm text-muted-foreground">Showing 1-8 of 247 leads</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>
              Previous
            </Button>
            <Button variant="outline" size="sm">
              Next
            </Button>
          </div>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {selectedLeads.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground rounded-lg shadow-lg p-4 flex items-center gap-4 z-50">
          <span className="font-medium">{selectedLeads.length} leads selected</span>
          <div className="flex gap-2">
            <Button size="sm" variant="secondary">
              Change Status
            </Button>
            <Button size="sm" variant="secondary">
              Send Message
            </Button>
            <Button size="sm" variant="secondary">
              Export
            </Button>
            <Button size="sm" variant="destructive">
              Delete
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeadsList;
