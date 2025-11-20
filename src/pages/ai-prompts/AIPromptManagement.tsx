import { useState, useEffect } from "react";
import { Bot, Save, Plus, Trash2, RefreshCw, MessageSquare, HelpCircle, AlertTriangle, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { getAIPrompt, updateAIPrompt, type AIPrompt } from "@/services/aiPromptService";
import { getAllGyms, type Gym } from "@/services/gymService";
import { useGymStore } from "@/store/gymStore";
import { useTranslation } from "@/hooks/useTranslation";

const AIPromptManagement = () => {
  const { t } = useTranslation();
  const { selectedGym, setSelectedGym, gyms, setGyms } = useGymStore();
  const [aiPrompt, setAIPrompt] = useState<AIPrompt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("system");

  // Form states
  const [systemPrompt, setSystemPrompt] = useState('');
  const [greetingMessage, setGreetingMessage] = useState('');
  const [faqs, setFaqs] = useState<any[]>([]);
  const [objections, setObjections] = useState<any[]>([]);
  const [expandedObjections, setExpandedObjections] = useState<Set<number>>(new Set());
  const [expandedFaqs, setExpandedFaqs] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadGyms();
  }, []);

  useEffect(() => {
    if (selectedGym) {
      loadAIPrompt(selectedGym.id);
    }
  }, [selectedGym]);

  const loadGyms = async () => {
    try {
      const response = await getAllGyms();
      setGyms(response.gyms);
      
      if (!selectedGym && response.gyms.length > 0) {
        setSelectedGym(response.gyms[0]);
      }
    } catch (error: any) {
      console.error('Error loading gyms:', error);
      toast.error(error.response?.data?.message || "Failed to load gyms");
    }
  };

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
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Adjust indices for items after the deleted one
      const adjusted = new Set<number>();
      newSet.forEach(i => {
        if (i > index) {
          adjusted.add(i - 1);
        } else {
          adjusted.add(i);
        }
      });
      return adjusted;
    });
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
    setExpandedObjections(prev => {
      const newSet = new Set(prev);
      newSet.delete(index);
      // Adjust indices for items after the deleted one
      const adjusted = new Set<number>();
      newSet.forEach(i => {
        if (i > index) {
          adjusted.add(i - 1);
        } else {
          adjusted.add(i);
        }
      });
      return adjusted;
    });
    toast.success(t("common.deleted"));
  };

  const toggleObjectionExpanded = (index: number) => {
    setExpandedObjections(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  const toggleFaqExpanded = (index: number) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t("aiPrompts.pageTitle")}</h1>
          <p className="text-muted-foreground">
            {t("aiPrompts.pageDescription")} {selectedGym.name}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {gyms.length > 0 && (
            <Select
              value={selectedGym?.id || ""}
              onValueChange={(value) => {
                const gym = gyms.find((g) => g.id === value);
                if (gym) setSelectedGym(gym);
              }}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select a gym">
                  {selectedGym && (
                    <div className="flex items-center gap-2">
                      <span>{selectedGym.name}</span>
                    </div>
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {gyms.map((gym) => (
                  <SelectItem key={gym.id} value={gym.id}>
                    {gym.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Button variant="outline" onClick={() => selectedGym && loadAIPrompt(selectedGym.id)}>
            <RefreshCw className="h-4 w-4 mr-2" />
            {t("aiPrompts.refresh")}
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            {t("aiPrompts.systemPrompts")}
          </TabsTrigger>
          <TabsTrigger value="greeting" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            {t("aiPrompts.greetingMessages")}
          </TabsTrigger>
          <TabsTrigger value="objections" className="flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            {t("aiPrompts.objectionHandling")}
          </TabsTrigger>
          <TabsTrigger value="faqs" className="flex items-center gap-2">
            <HelpCircle className="h-4 w-4" />
            {t("aiPrompts.faqs")}
          </TabsTrigger>
        </TabsList>

        {/* System Prompts Tab */}
        <TabsContent value="system" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("aiPrompts.systemPrompt")}</CardTitle>
              <CardDescription>
                {t("aiPrompts.systemPromptDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("aiPrompts.promptInstructions")}</Label>
                <Textarea
                  rows={16}
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  className="font-mono text-sm"
                  placeholder={t("aiPrompts.promptInstructions")}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Greeting Messages Tab */}
        <TabsContent value="greeting" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("aiPrompts.greetingMessage")}</CardTitle>
              <CardDescription>
                {t("aiPrompts.greetingMessageDescription")}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>{t("aiPrompts.defaultGreeting")}</Label>
                <Textarea 
                  rows={8} 
                  value={greetingMessage}
                  onChange={(e) => setGreetingMessage(e.target.value)}
                  placeholder={t("aiPrompts.defaultGreeting")}
                />
                <p className="text-xs text-muted-foreground">
                  {t("aiPrompts.greetingTip")}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Objection Handling Tab */}
        <TabsContent value="objections" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("aiPrompts.objectionHandling")}</CardTitle>
                  <CardDescription>
                    {t("aiPrompts.objectionHandlingDescription")}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddObjection}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("aiPrompts.addObjection")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2">
                {objections.map((objection, index) => {
                  const isExpanded = expandedObjections.has(index);
                  return (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      {/* Collapsed Header - Always Visible */}
                      <div 
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => toggleObjectionExpanded(index)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <Badge variant="secondary" className="flex-shrink-0">
                            {t("aiPrompts.objectionNumber").replace("{number}", String(index + 1))}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {objection.trigger || t("aiPrompts.triggerKeywords")}
                            </p>
                            {!isExpanded && objection.trigger && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5">
                                {objection.trigger}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive h-7 px-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteObjection(index);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="p-4 pt-0 space-y-3 border-t border-border">
                          <div className="space-y-2">
                            <Label className="text-xs">{t("aiPrompts.triggerKeywords")}</Label>
                            <Input 
                              value={objection.trigger}
                              onChange={(e) => handleUpdateObjection(index, 'trigger', e.target.value)}
                              placeholder={t("aiPrompts.triggerKeywordsPlaceholder")}
                              className="h-9 text-sm font-mono"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <p className="text-xs text-muted-foreground">
                              {t("aiPrompts.triggerKeywordsHint")}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">{t("aiPrompts.response")}</Label>
                            <Textarea 
                              rows={4} 
                              value={objection.response}
                              onChange={(e) => handleUpdateObjection(index, 'response', e.target.value)}
                              placeholder={t("aiPrompts.responsePlaceholder")}
                              className="text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {objections.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium mb-1">{t("aiPrompts.noObjections")}</p>
                  <p className="text-xs">{t("aiPrompts.noObjectionsDescription")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* FAQs Tab */}
        <TabsContent value="faqs" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t("aiPrompts.faqs")}</CardTitle>
                  <CardDescription>
                    {t("aiPrompts.faqsDescription")}
                  </CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddFAQ}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t("aiPrompts.addFAQ")}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="max-h-[600px] overflow-y-auto pr-2 space-y-2">
                {faqs.map((faq, index) => {
                  const isExpanded = expandedFaqs.has(index);
                  return (
                    <div key={index} className="border border-border rounded-lg overflow-hidden">
                      {/* Collapsed Header - Always Visible */}
                      <div 
                        className="flex items-center justify-between p-3 cursor-pointer hover:bg-accent/50 transition-colors"
                        onClick={() => toggleFaqExpanded(index)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          ) : (
                            <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          )}
                          <Badge variant="secondary" className="flex-shrink-0">
                            {t("aiPrompts.faqNumber").replace("{number}", String(index + 1))}
                          </Badge>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {faq.question || t("aiPrompts.question")}
                            </p>
                            {!isExpanded && faq.keywords && (
                              <p className="text-xs text-muted-foreground truncate mt-0.5 font-mono">
                                {faq.keywords}
                              </p>
                            )}
                          </div>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive h-7 px-2 flex-shrink-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFAQ(index);
                          }}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      {/* Expanded Content */}
                      {isExpanded && (
                        <div className="p-4 pt-0 space-y-3 border-t border-border">
                          <div className="space-y-2">
                            <Label className="text-xs">{t("aiPrompts.question")}</Label>
                            <Input 
                              value={faq.question}
                              onChange={(e) => handleUpdateFAQ(index, 'question', e.target.value)}
                              placeholder={t("aiPrompts.questionPlaceholder")}
                              className="h-9 text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">{t("aiPrompts.keywords")}</Label>
                            <Input 
                              value={faq.keywords}
                              onChange={(e) => handleUpdateFAQ(index, 'keywords', e.target.value)}
                              placeholder={t("aiPrompts.keywordsPlaceholder")}
                              className="h-9 text-sm font-mono"
                              onClick={(e) => e.stopPropagation()}
                            />
                            <p className="text-xs text-muted-foreground">
                              {t("aiPrompts.keywordsHint")}
                            </p>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-xs">{t("aiPrompts.answer")}</Label>
                            <Textarea 
                              rows={3} 
                              value={faq.answer}
                              onChange={(e) => handleUpdateFAQ(index, 'answer', e.target.value)}
                              placeholder={t("aiPrompts.answerPlaceholder")}
                              className="text-sm"
                              onClick={(e) => e.stopPropagation()}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              
              {faqs.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">
                  <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm font-medium mb-1">{t("aiPrompts.noFaqs")}</p>
                  <p className="text-xs">{t("aiPrompts.noFaqsDescription")}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer Actions */}
      <div className="flex items-center justify-end gap-3 sticky bottom-0 bg-background/95 backdrop-blur-sm border-t border-border p-4 -mx-6 -mb-6">
        <Button variant="outline" onClick={() => selectedGym && loadAIPrompt(selectedGym.id)} disabled={isSaving}>
          <RefreshCw className="h-4 w-4 mr-2" />
          {t("aiPrompts.discardChanges")}
        </Button>
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-background border-t-transparent mr-2" />
              {t("aiPrompts.saving")}
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

export default AIPromptManagement;

