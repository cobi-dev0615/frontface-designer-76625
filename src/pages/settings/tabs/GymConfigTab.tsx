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
import { getAllGyms, getGymById, updateGym, updateGymSettings, type Gym } from "@/services/gymService";
import { useGymStore } from "@/store/gymStore";

const GymConfigTab = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  
  const [gym, setGym] = useState<Gym | null>(null);
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
  const [advantages, setAdvantages] = useState<string[]>([]);
  const [editingAdvantageIndex, setEditingAdvantageIndex] = useState<number | null>(null);
  const [editingAdvantageValue, setEditingAdvantageValue] = useState<string>('');
  const [newAdvantage, setNewAdvantage] = useState('');

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

      // Populate advantages
      setAdvantages(gymData.settings?.advantages || []);

    } catch (error: any) {
      console.error('Error loading gym data:', error);
      toast.error(error.response?.data?.message || t("gyms.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddAdvantage = () => {
    if (newAdvantage.trim()) {
      setAdvantages([...advantages, newAdvantage.trim()]);
      setNewAdvantage('');
    }
  };

  const handleSaveAdvantage = (index: number) => {
    if (editingAdvantageValue.trim()) {
      const updated = [...advantages];
      updated[index] = editingAdvantageValue.trim();
      setAdvantages(updated);
      setEditingAdvantageIndex(null);
      setEditingAdvantageValue('');
    }
  };

  const handleRemoveAdvantage = (index: number) => {
    setAdvantages(advantages.filter((_, i) => i !== index));
    if (editingAdvantageIndex === index) {
      setEditingAdvantageIndex(null);
      setEditingAdvantageValue('');
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

      // Update gym settings (merge with existing settings to preserve other data)
      const existingSettings = gym.settings || {};
      await updateGymSettings(gym.id, {
        ...existingSettings,
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
        advantages
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
              <CardDescription>{t("gyms.coreDetailsAboutGym")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="gym-name">{t("gyms.gymName")} <span className="text-destructive">*</span></Label>
                <Input 
                  id="gym-name" 
                  value={basicInfo.name}
                  onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t("gyms.locationBranch")}</Label>
                <Input 
                  id="location" 
                  value={basicInfo.location}
                  onChange={(e) => setBasicInfo({ ...basicInfo, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">{t("gyms.phoneNumber")}</Label>
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
                <Label htmlFor="email">{t("gyms.email")}</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={basicInfo.email}
                  onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="website">{t("gyms.website")}</Label>
                <Input 
                  id="website" 
                  value={basicInfo.website}
                  onChange={(e) => setBasicInfo({ ...basicInfo, website: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagram">{t("gyms.instagram")}</Label>
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


        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Address & Location */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.addressInformation")}</CardTitle>
              <CardDescription>{t("gyms.physicalLocation")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">{t("gyms.streetAddress")}</Label>
                <Input 
                  id="address" 
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="neighborhood">{t("gyms.neighborhood")}</Label>
                <Input 
                  id="neighborhood" 
                  value={address.neighborhood}
                  onChange={(e) => setAddress({ ...address, neighborhood: e.target.value })}
                />
              </div>

              <div className="grid gap-4 grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="city">{t("gyms.city")}</Label>
                  <Input 
                    id="city" 
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">{t("gyms.state")}</Label>
                  <Select 
                    value={address.state}
                    onValueChange={(value) => setAddress({ ...address, state: value })}
                  >
                    <SelectTrigger id="state">
                      <SelectValue placeholder={t("gyms.state")} />
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
                <Label htmlFor="zip">{t("gyms.zipCode")}</Label>
                <div className="flex gap-2">
                  <Input 
                    id="zip" 
                    value={address.zipCode}
                    onChange={(e) => setAddress({ ...address, zipCode: e.target.value })}
                    className="flex-1" 
                  />
                  <Button variant="outline" size="sm">{t("gyms.search")}</Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <Card>
            <CardHeader>
              <CardTitle>{t("gyms.additionalInformation")}</CardTitle>
              <CardDescription>{t("gyms.additionalInformation")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="gym-size">{t("gyms.sizeM2")}</Label>
                  <Input 
                    id="gym-size" 
                    type="number"
                    value={additionalInfo.size}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, size: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="equipment-brand">{t("gyms.equipment")}</Label>
                  <Input 
                    id="equipment-brand" 
                    value={additionalInfo.equipmentBrand}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, equipmentBrand: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="capacity">{t("gyms.capacity")}</Label>
                  <Input 
                    id="capacity" 
                    type="number"
                    value={additionalInfo.capacity}
                    onChange={(e) => setAdditionalInfo({ ...additionalInfo, capacity: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{t("gyms.description")}</Label>
                <Textarea
                  id="description"
                  rows={4}
                  value={additionalInfo.description}
                  onChange={(e) => setAdditionalInfo({ ...additionalInfo, description: e.target.value })}
                  placeholder={t("gyms.describeYourGym")}
                />
              </div>
            </CardContent>
          </Card>

        </div>
      </div>

      {/* Advantages Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t("gyms.advantages") || "Gym Advantages"}</CardTitle>
          <CardDescription>{t("gyms.advantagesDescription") || "Manage the list of advantages and features your gym offers"}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add New Advantage */}
          <div className="flex gap-2">
            <Input
              placeholder={t("gyms.addAdvantagePlaceholder") || "Enter advantage (e.g., Spacious facility with over 3,000 m²)"}
              value={newAdvantage}
              onChange={(e) => setNewAdvantage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && newAdvantage.trim()) {
                  handleAddAdvantage();
                }
              }}
            />
            <Button onClick={handleAddAdvantage} disabled={!newAdvantage.trim()}>
              <Plus className="h-4 w-4 mr-2" />
              {t("gyms.add") || "Add"}
            </Button>
          </div>

          {/* Advantages List */}
          <div className="space-y-2">
            {advantages.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">
                {t("gyms.noAdvantages") || "No advantages added yet. Add your first advantage above."}
              </p>
            ) : (
              advantages.map((advantage, index) => (
                <div key={index} className="flex items-center gap-2 p-3 border rounded-lg bg-card">
                  {editingAdvantageIndex === index ? (
                    <>
                      <Input
                        value={editingAdvantageValue}
                        onChange={(e) => setEditingAdvantageValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            handleSaveAdvantage(index);
                          } else if (e.key === 'Escape') {
                            setEditingAdvantageIndex(null);
                            setEditingAdvantageValue('');
                          }
                        }}
                        autoFocus
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveAdvantage(index)}
                      >
                        {t("gyms.save") || "Save"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAdvantageIndex(null);
                          setEditingAdvantageValue('');
                        }}
                      >
                        {t("gyms.cancel") || "Cancel"}
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="flex-1 text-sm">✅ {advantage}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setEditingAdvantageIndex(index);
                          setEditingAdvantageValue(advantage);
                        }}
                      >
                        {t("gyms.edit") || "Edit"}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveAdvantage(index)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline" onClick={() => gym && loadGymData(gym.id)} disabled={isSaving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("gyms.reload")}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
              {t("gyms.saving")}
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