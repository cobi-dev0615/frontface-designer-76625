import { useState } from "react";
import { Building2, Bot, MessageSquare, Users, Plug } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GymConfigTab from "./tabs/GymConfigTab";
import AIPromptsTab from "./tabs/AIPromptsTab";
import WhatsAppTab from "./tabs/WhatsAppTab";
import UsersTab from "./tabs/UsersTab";
import IntegrationsTab from "./tabs/IntegrationsTab";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("gym");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your DuxFit CRM configuration and preferences</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
          <TabsTrigger value="gym" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Gym Config</span>
          </TabsTrigger>
          <TabsTrigger value="ai" className="gap-2">
            <Bot className="h-4 w-4" />
            <span className="hidden sm:inline">AI Prompts</span>
          </TabsTrigger>
          <TabsTrigger value="whatsapp" className="gap-2">
            <MessageSquare className="h-4 w-4" />
            <span className="hidden sm:inline">WhatsApp</span>
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-2">
            <Users className="h-4 w-4" />
            <span className="hidden sm:inline">Users</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Integrations</span>
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
      </Tabs>
    </div>
  );
};

export default SettingsPage;
