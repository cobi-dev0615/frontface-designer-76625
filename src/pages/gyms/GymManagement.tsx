import { useState, useEffect } from "react";
import { 
  Building2, 
  Plus, 
  Search, 
  MoreVertical, 
  Edit, 
  Trash2, 
  MapPin,
  Phone,
  Mail,
  Users,
  TrendingUp,
  Settings as SettingsIcon,
  RefreshCw
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { getAllGyms, type Gym } from "@/services/gymService";
import { useGymStore } from "@/store/gymStore";
import CreateGymModal from "@/components/gyms/CreateGymModal";

const GymManagement = () => {
  const navigate = useNavigate();
  const { setSelectedGym } = useGymStore();
  const [gyms, setGyms] = useState<Gym[]>([]);
  const [filteredGyms, setFilteredGyms] = useState<Gym[]>([]);
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    filterGyms();
  }, [gyms, searchInput, statusFilter]);

  const loadGyms = async () => {
    try {
      setIsLoading(true);
      const response = await getAllGyms();
      setGyms(response.gyms);
    } catch (error: any) {
      console.error('Error loading gyms:', error);
      toast.error(error.response?.data?.message || 'Failed to load gyms');
    } finally {
      setIsLoading(false);
    }
  };

  const filterGyms = () => {
    let filtered = gyms;

    // Search filter
    if (searchInput) {
      filtered = filtered.filter(gym =>
        gym.name.toLowerCase().includes(searchInput.toLowerCase()) ||
        gym.city?.toLowerCase().includes(searchInput.toLowerCase()) ||
        gym.slug.toLowerCase().includes(searchInput.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(gym => gym.status === statusFilter);
    }

    setFilteredGyms(filtered);
  };

  const handleConfigureGym = (gym: Gym) => {
    setSelectedGym(gym);
    navigate('/settings'); // Navigate to settings with this gym selected
    toast.success(`Configuring ${gym.name}`);
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800 border-green-200';
      case 'INACTIVE': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'TRIAL': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading gyms...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gym Management</h1>
          <p className="text-muted-foreground">Manage gym locations and configurations</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Gym
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Gyms</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{gyms.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Gyms</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gyms.filter(g => g.status === 'ACTIVE').length}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Leads</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gyms.reduce((sum, gym: any) => sum + (gym._count?.leads || 0), 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Staff</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {gyms.reduce((sum, gym: any) => sum + (gym._count?.users || 0), 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Gym List */}
      <Card>
        <CardHeader>
          <CardTitle>Registered Gyms</CardTitle>
          <CardDescription>View and manage all gym locations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search gyms..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-full md:w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="ACTIVE">Active</SelectItem>
                  <SelectItem value="INACTIVE">Inactive</SelectItem>
                  <SelectItem value="TRIAL">Trial</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button variant="outline" size="sm" onClick={loadGyms}>
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          {/* Gym Grid */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredGyms.map((gym: any) => (
              <Card key={gym.id} className="hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-gradient-primary text-white font-bold">
                          {getInitials(gym.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <CardTitle className="text-base">{gym.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">@{gym.slug}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleConfigureGym(gym)}>
                          <SettingsIcon className="h-4 w-4 mr-2" />
                          Configure
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="h-4 w-4 mr-2" />
                          Edit Details
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="h-4 w-4 mr-2" />
                          Delete Gym
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Badge className={getStatusBadgeColor(gym.status)}>
                    {gym.status}
                  </Badge>

                  {/* Location */}
                  {gym.city && gym.state && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{gym.city}, {gym.state}</span>
                    </div>
                  )}

                  {/* Phone */}
                  {gym.phone && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="h-4 w-4" />
                      <span>{gym.phone}</span>
                    </div>
                  )}

                  {/* Email */}
                  {gym.email && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4" />
                      <span className="truncate">{gym.email}</span>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <div className="text-center">
                      <div className="text-lg font-bold">{gym._count?.leads || 0}</div>
                      <div className="text-xs text-muted-foreground">Leads</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{gym._count?.users || 0}</div>
                      <div className="text-xs text-muted-foreground">Staff</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold">{gym._count?.plans || 0}</div>
                      <div className="text-xs text-muted-foreground">Plans</div>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button 
                    variant="outline" 
                    className="w-full mt-3"
                    onClick={() => handleConfigureGym(gym)}
                  >
                    <SettingsIcon className="h-4 w-4 mr-2" />
                    Configure
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Empty State */}
          {filteredGyms.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-1">No gyms found</p>
              <p className="text-sm text-muted-foreground">
                {searchInput || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filters' 
                  : 'Get started by clicking "Add Gym" above'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Gym Modal */}
      <CreateGymModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onGymCreated={loadGyms}
      />
    </div>
  );
};

export default GymManagement;
