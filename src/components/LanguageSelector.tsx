import { useState } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useLanguageStore } from '@/store/languageStore';
import { useTranslation } from '@/hooks/useTranslation';
import { toast } from 'sonner';

interface LanguageOption {
  code: 'pt-BR' | 'en';
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  {
    code: 'pt-BR',
    name: 'Brazilian Portuguese',
    nativeName: 'Português Brasileiro',
    flag: '🇧🇷',
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
  },
];

interface LanguageSelectorProps {
  variant?: 'button' | 'card' | 'dropdown';
  showLabel?: boolean;
  className?: string;
}

export const LanguageSelector = ({ 
  variant = 'button', 
  showLabel = true,
  className = '' 
}: LanguageSelectorProps) => {
  const { language, setLanguage } = useLanguageStore();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: 'pt-BR' | 'en') => {
    setLanguage(newLanguage);
    setIsOpen(false);
    toast.success(t('success.languageChanged'));
  };

  if (variant === 'card') {
    return (
      <Card className={className}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            {t('settings.language')}
          </CardTitle>
          <CardDescription>
            {t('settings.languageSettings.selectLanguage')}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('settings.languageSettings.currentLanguage')}
            </label>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <span className="text-2xl">{currentLanguage?.flag}</span>
              <div className="flex-1">
                <p className="font-medium">{currentLanguage?.nativeName}</p>
                <p className="text-sm text-muted-foreground">{currentLanguage?.name}</p>
              </div>
              <Badge variant="secondary">{currentLanguage?.code}</Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              {t('settings.languageSettings.availableLanguages')}
            </label>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    language === lang.code ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{lang.nativeName}</p>
                    <p className="text-sm text-muted-foreground">{lang.name}</p>
                  </div>
                  {language === lang.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (variant === 'dropdown') {
    return (
      <div className={`relative ${className}`}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="w-full justify-between border-2 border-border"
        >
          <div className="flex items-center gap-2">
            <span className="text-lg">{currentLanguage?.flag}</span>
            <span>{currentLanguage?.nativeName}</span>
          </div>
          <ChevronDown className="h-4 w-4" />
        </Button>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                {t('languageSelector.title')}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              {languages.map((lang) => (
                <div
                  key={lang.code}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                    language === lang.code ? 'bg-primary/5 border-primary' : ''
                  }`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  <span className="text-2xl">{lang.flag}</span>
                  <div className="flex-1">
                    <p className="font-medium">{lang.nativeName}</p>
                    <p className="text-sm text-muted-foreground">{lang.name}</p>
                  </div>
                  {language === lang.code && (
                    <Check className="h-5 w-5 text-primary" />
                  )}
                </div>
              ))}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsOpen(false)}>
                {t('common.close')}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }

  // Default button variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {showLabel && (
        <span className="text-sm font-medium">
          {t('settings.language')}:
        </span>
      )}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className="flex items-center gap-2 border-2 border-border"
      >
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:inline">{currentLanguage?.nativeName}</span>
        <ChevronDown className="h-4 w-4" />
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              {t('languageSelector.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-2">
            {languages.map((lang) => (
              <div
                key={lang.code}
                className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                  language === lang.code ? 'bg-primary/5 border-primary' : ''
                }`}
                onClick={() => handleLanguageChange(lang.code)}
              >
                <span className="text-2xl">{lang.flag}</span>
                <div className="flex-1">
                  <p className="font-medium">{lang.nativeName}</p>
                  <p className="text-sm text-muted-foreground">{lang.name}</p>
                </div>
                {language === lang.code && (
                  <Check className="h-5 w-5 text-primary" />
                )}
              </div>
            ))}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
