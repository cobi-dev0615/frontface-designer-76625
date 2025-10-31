import { useState, useEffect } from "react";
import { Building2, Bot, MessageSquare, Users, Plug, Dumbbell, Settings } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import GymConfigTab from "./tabs/GymConfigTab";
import AIPromptsTab from "./tabs/AIPromptsTab";
import WhatsAppTab from "./tabs/WhatsAppTab";
import UsersTab from "./tabs/UsersTab";
import IntegrationsTab from "./tabs/IntegrationsTab";
import EvoIntegrationTab from "./tabs/EvoIntegrationTab";
import GeneralTab from "./tabs/GeneralTab";
import { useGymStore } from "@/store/gymStore";
import { getAllGyms } from "@/services/gymService";
import { useTranslation } from "@/hooks/useTranslation";

const SettingsPage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("gym");
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();

  useEffect(() => {
    loadGyms();
  }, []);

  const loadGyms = async () => {
    try {
      const response = await getAllGyms();
      setGyms(response.gyms);
      
      // Auto-select first gym if none selected
      if (!selectedGym && response.gyms.length > 0) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error) {
      console.error('Error loading gyms:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Gym Selector */}
      {gyms.length > 0 && (
        <div className="flex items-center justify-end gap-3">
          <Label htmlFor="gym-selector" className="text-sm font-medium whitespace-nowrap">
            {t("settings.configureGym")}
          </Label>
          <Select 
            value={selectedGym?.id} 
            onValueChange={(value) => {
              const gym = gyms.find(g => g.id === value);
              if (gym) setSelectedGym(gym);
            }}
          >
            <SelectTrigger id="gym-selector" className="w-[280px]">
              <div className="flex items-center gap-2">
                <Dumbbell className="h-4 w-4" />
                <SelectValue placeholder={t("settings.selectGym")} />
              </div>
            </SelectTrigger>
            <SelectContent>
              {gyms.map((gym) => (
                <SelectItem key={gym.id} value={gym.id}>
                  <div className="flex items-center gap-2">
                    <Dumbbell className="h-4 w-4" />
                    {gym.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-7 lg:w-auto">
          <TabsTrigger value="general" className="gap-2">
            <Settings className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.general")}</span>
          </TabsTrigger>
          <TabsTrigger value="gym" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.gymConfig")}</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.aiPrompts")}</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.whatsapp")}</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.users")}</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.integrations")}</span>
          </TabsTrigger>
          <TabsTrigger value="evo" className="gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">{t("settings.evo")}</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="gym">
          <GymConfigTab />
        </TabsContent>

        <TabsContent value="ai">
          <AIPromptsTab />
        </TabsContent>

        <TabsContent value="whatsapp">
          <WhatsAppTab />
        </TabsContent>

        <TabsContent value="users">
          <UsersTab />
        </TabsContent>

        <TabsContent value="integrations">
          <IntegrationsTab />
        </TabsContent>

        <TabsContent value="evo">
          <EvoIntegrationTab />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
