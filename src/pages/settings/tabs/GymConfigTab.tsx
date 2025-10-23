import { useState, useEffect } from "react";
import { Building2, Upload, Save, Plus, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useTranslation } from "@/hooks/useTranslation";
import { getAllGyms, getGymById, updateGym, updateGymSettings, getGymPlans, createPlan, updatePlan, deletePlan, type Gym, type Plan } from "@/services/gymService";
import { useGymStore } from "@/store/gymStore";

const GymConfigTab = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  const [gym, setGym] = useState<Gym | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [basicInfo, setBasicInfo] = useState({
    name: '',
    location: '',
    phone: '',
    isWhatsApp: true,
    email: '',
    website: '',
    instagram: ''
  });

  const [address, setAddress] = useState({
    street: '',
    neighborhood: '',
    city: '',
    state: '',
    zipCode: ''
  });

  const [branding, setBranding] = useState({
    logo: '',
    primaryColor: '#8b5cf6',
    secondaryColor: '#6366f1'
  });

  const [additionalInfo, setAdditionalInfo] = useState({
    size: '',
    equipmentBrand: '',
    capacity: '',
    description: ''
  });

  const [operatingHours, setOperatingHours] = useState<any>({});
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

  const features = [
    { key: "features24_7", label: t("gyms.features24_7") },
    { key: "cardioEquipment", label: t("gyms.cardioEquipment") },
    { key: "weightTraining", label: t("gyms.weightTraining") },
    { key: "groupClasses", label: t("gyms.groupClasses") },
    { key: "personalTraining", label: t("gyms.personalTraining") },
    { key: "lockerRooms", label: t("gyms.lockerRooms") },
    { key: "showers", label: t("gyms.showers") },
    { key: "parking", label: t("gyms.parking") },
    { key: "wifi", label: t("gyms.wifi") },
    { key: "kidsRoom", label: t("gyms.kidsRoom") },
    { key: "loungeArea", label: t("gyms.loungeArea") },
    { key: "juiceBar", label: t("gyms.juiceBar") },
  ];

  const daysOfWeek = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadGymData(selectedGym.id);
    }
  }, [selectedGym]);

  const loadGyms = async () => {
    try {
      const response = await getAllGyms();
      setGyms(response.gyms);
      
      // Auto-select first gym if none selected
      if (!selectedGym && response.gyms.length > 0) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error: any) {
      console.error('Error loading gyms:', error);
      toast.error(t("gyms.loadFailed"));
    }
  };

  const loadGymData = async (gymId: string) => {
    try {
      setIsLoading(true);
      
      // Load gym data
      const gymData = await getGymById(gymId);
      setGym(gymData);

      // Populate basic info
      setBasicInfo({
        name: gymData.name || '',
        location: gymData.settings?.location || '',
        phone: gymData.phone || '',
        isWhatsApp: true,
        email: gymData.email || '',
        website: gymData.settings?.website || '',
        instagram: gymData.settings?.instagram || ''
      });

      // Populate address
      setAddress({
        street: gymData.address || '',
        neighborhood: gymData.settings?.neighborhood || '',
        city: gymData.city || '',
        state: gymData.state || '',
        zipCode: gymData.zipCode || ''
      });

      // Populate branding
      setBranding({
        logo: gymData.logo || '',
        primaryColor: gymData.settings?.primaryColor || '#8b5cf6',
        secondaryColor: gymData.settings?.secondaryColor || '#6366f1'
      });

      // Populate additional info
      setAdditionalInfo({
        size: gymData.settings?.size?.toString() || '',
        equipmentBrand: gymData.settings?.equipmentBrand || '',
        capacity: gymData.settings?.capacity?.toString() || '',
        description: gymData.settings?.description || ''
      });

      // Populate operating hours
      setOperatingHours(gymData.settings?.operatingHours || {});

      // Populate features
      setSelectedFeatures(gymData.settings?.features || []);

      // Load plans
      const plansData = await getGymPlans(gymId);
      setPlans(plansData);

    } catch (error: any) {
      console.error('Error loading gym data:', error);
      toast.error(error.response?.data?.message || t("gyms.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!gym) return;

    setIsSaving(true);
    try {
      // Update basic gym info
      await updateGym(gym.id, {
        name: basicInfo.name,
        phone: basicInfo.phone,
        email: basicInfo.email,
        address: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        logo: branding.logo
      });

      // Update gym settings
      await updateGymSettings(gym.id, {
        location: basicInfo.location,
        website: basicInfo.website,
        instagram: basicInfo.instagram,
        neighborhood: address.neighborhood,
        size: parseInt(additionalInfo.size) || 0,
        equipmentBrand: additionalInfo.equipmentBrand,
        capacity: parseInt(additionalInfo.capacity) || 0,
        description: additionalInfo.description,
        primaryColor: branding.primaryColor,
        secondaryColor: branding.secondaryColor,
        operatingHours,
        features: selectedFeatures
      });

      toast.success(t("gyms.configurationSaved"));
      if (gym) {
        loadGymData(gym.id); // Reload to show updated data
      }
    } catch (error: any) {
      console.error('Error saving gym:', error);
      toast.error(error.response?.data?.message || t("gyms.saveFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleFeature = (feature: string) => {
    if (selectedFeatures.includes(feature)) {
      setSelectedFeatures(selectedFeatures.filter(f => f !== feature));
    } else {
      setSelectedFeatures([...selectedFeatures, feature]);
    }
  };

  const handleUpdatePlan = async (planId: string, updates: any) => {
    if (!gym) return;
    
    try {
      await updatePlan(gym.id, planId, updates);
      toast.success(t("gyms.planUpdated"));
      if (gym) {
        loadGymData(gym.id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("gyms.planUpdateFailed"));
    }
  };

  const handleDeletePlan = async (planId: string) => {
    if (!gym) return;
    
    try {
      await deletePlan(gym.id, planId);
      toast.success(t("gyms.planDeleted"));
      if (gym) {
        loadGymData(gym.id);
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || t("gyms.planDeleteFailed"));
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("gyms.loadingConfiguration")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Two-Column Layout for Main Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.basicInformation")}</CardTitle>
              <CardDescription>Core details about your gym</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gym-name">Gym Name <span className="text-destructive">*</span></Label>
                <Input 
                  id="gym-name" 
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location/Branch</Label>
                <Input 
                  id="location" 
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input 
                  id="phone" 
                  value={basicInfo.phone}
                  onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })}
                />
                <div className="flex items-center gap-2">
                  <Checkbox 
                    id="whatsapp" 
                    checked={basicInfo.isWhatsApp}
                    onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, isWhatsApp: checked as boolean })}
                  />
                  <Label htmlFor="whatsapp" className="text-sm font-normal">{t("gyms.whatsappNumber")}</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={basicInfo.email}
                  onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input 
                  id="website" 
                  value={basicInfo.website}
                  onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input 
                    id="instagram" 
                    className="pl-7" 
                    value={basicInfo.instagram.replace('@', '')}
                    onChange={(e) => setBasicInfo({ ...basicInfo, instagram: e.target.value.replace('@', '') })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo & Branding */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.brandingSettings")}</CardTitle>
              <CardDescription>Logo and brand colors</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Logo</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">{t("gyms.uploadLogo")}</p>
                  <p className="text-xs text-muted-foreground">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="primary-color">Primary Color</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="primary-color" 
                      type="color" 
                      value={branding.primaryColor}
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="w-16 h-10" 
                    />
                    <Input 
                      value={branding.primaryColor} 
                      onChange={(e) => setBranding({ ...branding, primaryColor: e.target.value })}
                      className="flex-1 font-mono text-sm" 
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="secondary-color">Secondary</Label>
                  <div className="flex gap-2">
                    <Input 
                      id="secondary-color" 
                      type="color" 
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="w-16 h-10" 
                    />
                    <Input 
                      value={branding.secondaryColor}
                      onChange={(e) => setBranding({ ...branding, secondaryColor: e.target.value })}
                      className="flex-1 font-mono text-sm" 
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Address & Location */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.addressInformation")}</CardTitle>
              <CardDescription>Physical location</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Street Address</Label>
                <Input 
                  id="address" 
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">Neighborhood</Label>
                <Input 
                  id="neighborhood" 
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input 
                    id="city" 
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">State</Label>
                  <Select 
                    value={address.state}
                    onValueChange={(value) => setAddress({ ...address, state: value })}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder="State" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PI">Piauí</SelectItem>
                      <SelectItem value="MA">Maranhão</SelectItem>
                      <SelectItem value="CE">Ceará</SelectItem>
                      <SelectItem value="PE">Pernambuco</SelectItem>
                      <SelectItem value="BA">Bahia</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="zip">ZIP Code</Label>
                <div className="flex gap-2">
                  <Input 
                    id="zip" 
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="flex-1" 
                  />
                  <Button variant="outline" size="sm">Search</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.additionalInformation")}</CardTitle>
              <CardDescription>Size, equipment, capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="gym-size">Size (m²)</Label>
                  <Input 
                    id="gym-size" 
                    type="number"
                    value={additionalInfo.size}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment-brand">Equipment</Label>
                  <Input 
                    id="equipment-brand" 
                    value={additionalInfo.equipmentBrand}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, equipmentBrand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">Capacity</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    value={additionalInfo.capacity}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={additionalInfo.description}
                  onChange={(e) => setAdditionalInfo({ ...additionalInfo, description: e.target.value })}
                  placeholder="Describe your gym..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Gym Features - Compact */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.features")}</CardTitle>
              <CardDescription>What your gym offers</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 grid-cols-2">
                {features.map((feature) => (
                  <div key={feature.key} className="flex items-center gap-2">
                    <Checkbox 
                      id={feature.key} 
                      checked={selectedFeatures.includes(feature.key)}
                      onCheckedChange={() => handleToggleFeature(feature.key)}
                    />
                    <Label htmlFor={feature.key} className="font-normal text-sm">
                      {feature.label}
                    </Label>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Membership Plans - Full Width - Compact Grid */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t("gyms.membershipPlans")}</CardTitle>
              <CardDescription>Configure pricing tiers</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Plan
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {plans.map((plan) => (
              <div key={plan.id} className="border border-border rounded-lg p-4 space-y-3">
                <div className="space-y-2">
                  <Label className="text-xs">{t("gyms.planName")}</Label>
                  <Input 
                    value={plan.name}
                    onChange={(e) => handleUpdatePlan(plan.id, { name: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">Price (R$)</Label>
                  <Input 
                    type="number" 
                    step="0.01"
                    value={plan.price}
                    onChange={(e) => handleUpdatePlan(plan.id, { price: parseFloat(e.target.value) })}
                    className="h-9"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs">{t("gyms.description")}</Label>
                  <Input 
                    value={plan.description || ''}
                    onChange={(e) => handleUpdatePlan(plan.id, { description: e.target.value })}
                    className="h-9"
                  />
                </div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    <Checkbox 
                      id={`plan-active-${plan.id}`} 
                      checked={plan.active}
                      onCheckedChange={(checked) => handleUpdatePlan(plan.id, { active: checked as boolean })}
                    />
                    <Label htmlFor={`plan-active-${plan.id}`} className="font-normal text-xs">{t("gyms.active")}</Label>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-destructive h-8 px-2"
                    onClick={() => handleDeletePlan(plan.id)}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline" onClick={() => gym && loadGymData(gym.id)} disabled={isSaving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reload
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              {t("gyms.saveConfiguration")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default GymConfigTab;