import { useState, useEffect } from "react";
import { Bot, Copy, Save, Plus, Edit, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { getAIPrompt, updateAIPrompt, type AIPrompt } from "@/services/aiPromptService";
import { useGymStore } from "@/store/gymStore";
import { useTranslation } from "@/hooks/useTranslation";

const AIPromptsTab = () => {
  const { t } = useTranslation();
  const { selectedGym } = useGymStore();
  const [aiPrompt, setAIPrompt] = useState<AIPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Form states
  const [systemPrompt, setSystemPrompt] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [objections, setObjections] = useState<any[]>([]);

  const variables = [
    "{gym_name}",
    "{gym_address}",
    "{plans_list}",
    "{operating_hours}",
    "{user_name}",
    "{current_date}",
  ];

  useEffect(() => {
    if (selectedGym) {
      loadAIPrompt(selectedGym.id);
    }
  }, [selectedGym]);

  const loadAIPrompt = async (gymId: string) => {
    try {
      setIsLoading(true);
      const data = await getAIPrompt(gymId);
      setAIPrompt(data);
      
      // Populate form
      setSystemPrompt(data.systemPrompt || '');
      setGreetingMessage(data.greetingMessage || '');
      setFaqs(data.faqs?.questions || []);
      setObjections(data.objectionHandling?.objections || []);
      
    } catch (error: any) {
      console.error('Error loading AI prompt:', error);
      toast.error(error.response?.data?.message || t("aiPrompts.loadFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedGym || !aiPrompt) return;

    setIsSaving(true);
    try {
      await updateAIPrompt(selectedGym.id, {
        systemPrompt,
        greetingMessage,
        faqs: { questions: faqs },
        objectionHandling: { objections }
      });

      toast.success(t("aiPrompts.configurationUpdated"));
      loadAIPrompt(selectedGym.id);
    } catch (error: any) {
      console.error('Error saving AI prompt:', error);
      toast.error(error.response?.data?.message || t("aiPrompts.updateFailed"));
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopyVariable = (variable: string) => {
    navigator.clipboard.writeText(variable);
    toast.success(`${t("common.copied")} ${variable}`);
  };

  const handleAddFAQ = () => {
    setFaqs([...faqs, { question: '', keywords: '', answer: '' }]);
  };

  const handleUpdateFAQ = (index: number, field: string, value: string) => {
    const updated = [...faqs];
    updated[index] = { ...updated[index], [field]: value };
    setFaqs(updated);
  };

  const handleDeleteFAQ = (index: number) => {
    setFaqs(faqs.filter((_, i) => i !== index));
    toast.success(t("common.deleted"));
  };

  const handleAddObjection = () => {
    setObjections([...objections, { trigger: '', response: '' }]);
  };

  const handleUpdateObjection = (index: number, field: string, value: string) => {
    const updated = [...objections];
    updated[index] = { ...updated[index], [field]: value };
    setObjections(updated);
  };

  const handleDeleteObjection = (index: number) => {
    setObjections(objections.filter((_, i) => i !== index));
    toast.success(t("common.deleted"));
  };

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t("aiPrompts.loadingConfiguration")}</p>
        </div>
      </div>
    );
  }

  if (!selectedGym) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <div className="text-center">
          <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-lg font-medium mb-1">{t("aiPrompts.noGymSelected")}</p>
          <p className="text-sm text-muted-foreground">{t("aiPrompts.pleaseSelectGym")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {t("aiPrompts.configurationFor")} {selectedGym.name}
              </CardTitle>
              <CardDescription>{t("aiPrompts.configureAI")}</CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => selectedGym && loadAIPrompt(selectedGym.id)}>
              <RefreshCw className="h-4 w-4 mr-2" />
              {t("aiPrompts.refresh")}
            </Button>
          </div>
        </CardHeader>
      </Card>

      {/* Two-Column Layout */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Column: System Prompt + Objections */}
        <div className="space-y-6">
          {/* System Prompt */}
          <Card>
            <CardHeader>
              <CardTitle>{t("aiPrompts.systemPrompt")}</CardTitle>
              <CardDescription>{t("aiPrompts.coreInstructions")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("aiPrompts.promptInstructions")}</Label>
                <Textarea
                  rows={12}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="font-mono text-sm"
                  placeholder="Enter your system prompt..."
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">{t("aiPrompts.availableVariables")}</Label>
                <div className="flex flex-wrap gap-2">
                  {variables.map((variable) => (
                    <Button
                      key={variable}
                      variant="outline"
                      size="sm"
                      className="gap-2 h-8 text-xs"
                      onClick={() => handleCopyVariable(variable)}
                    >
                      {variable}
                      <Copy className="h-3 w-3" />
                    </Button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground mt-2">{t("aiPrompts.clickToCopy")}</p>
              </div>
            </CardContent>
          </Card>

          {/* Objection Handling */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("aiPrompts.objectionHandling")}</CardTitle>
                  <CardDescription>{t("aiPrompts.commonObjections")}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddObjection}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("aiPrompts.add")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-[500px] overflow-y-auto pr-2 space-y-3">
                {objections.map((objection, index) => (
                  <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("aiPrompts.triggerKeywords")}</Label>
                      <Input 
                        value={objection.trigger}
                        onChange={(e) => handleUpdateObjection(index, 'trigger', e.target.value)}
                        placeholder="too expensive|can't afford"
                        className="h-9 text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("aiPrompts.response")}</Label>
                      <Textarea 
                        rows={3} 
                        value={objection.response}
                        onChange={(e) => handleUpdateObjection(index, 'response', e.target.value)}
                        placeholder="Persuasive response..."
                        className="text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive h-7 px-2"
                        onClick={() => handleDeleteObjection(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {objections.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {t("aiPrompts.noObjections")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Greeting + FAQs */}
        <div className="space-y-6">
          {/* Greeting Message */}
          <Card>
            <CardHeader>
              <CardTitle>{t("aiPrompts.greetingMessage")}</CardTitle>
              <CardDescription>{t("aiPrompts.firstMessage")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("aiPrompts.defaultGreeting")}</Label>
                <Textarea 
                  rows={4} 
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  placeholder="Enter greeting message..."
                />
                <p className="text-xs text-muted-foreground">Use emojis! This is the first impression.</p>
              </div>
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("aiPrompts.faqs")}</CardTitle>
                  <CardDescription>{t("aiPrompts.commonQuestions")}</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddFAQ}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("aiPrompts.add")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-[700px] overflow-y-auto pr-2 space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-border rounded-lg p-3 space-y-2">
                    <div className="space-y-1">
                      <Label className="text-xs">{t("aiPrompts.question")}</Label>
                      <Input 
                        value={faq.question}
                        onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                        placeholder="What are your hours?"
                        className="h-9 text-sm"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("aiPrompts.keywords")}</Label>
                      <Input 
                        value={faq.keywords}
                        onChange={(e) => handleUpdateFAQ(index, 'keywords', e.target.value)}
                        placeholder="hours|open|close"
                        className="h-9 text-sm font-mono"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-xs">{t("aiPrompts.answer")}</Label>
                      <Textarea 
                        rows={2} 
                        value={faq.answer}
                        onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                        placeholder="Answer..."
                        className="text-sm"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-destructive h-7 px-2"
                        onClick={() => handleDeleteFAQ(index)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              
              {faqs.length === 0 && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  {t("aiPrompts.noFaqs")}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline" onClick={() => selectedGym && loadAIPrompt(selectedGym.id)} disabled={isSaving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Discard Changes
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
              {t("aiPrompts.saveChanges")}
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default AIPromptsTab;
