import { useMemo } from 'react';
import { useLanguageStore } from '@/store/languageStore';
import { ptBR } from '@/locales/pt-BR';
import { en } from '@/locales/en';

const translations = {
  'pt-BR': ptBR,
  'en': en,
};

// Debug: Log available keys in development - check ALL keys
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const enObj = translations['en'] as any;
  const allKeys = enObj ? Object.keys(enObj) : [];
  console.log('Translation objects loaded:', {
    hasEn: !!translations['en'],
    hasPtBR: !!translations['pt-BR'],
    totalKeys: allKeys.length,
    allKeys: allKeys, // Show ALL keys, not just first 15
    hasPlansManagement: enObj && 'plansManagement' in enObj,
    plansManagementType: enObj?.plansManagement ? typeof enObj.plansManagement : 'not found',
    plansManagementValue: enObj?.plansManagement || 'NOT FOUND',
  });
}

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  // Memoize the translation function to ensure it's recreated when language changes
  const t = useMemo(() => {
    return (key: string, params?: Record<string, string | number>): string => {
      // Get the current language from the store to ensure we always use the latest value
      const currentLanguage = useLanguageStore.getState().language;
      const keys = key.split('.');
      let value: any = translations[currentLanguage];
      
      // Debug for plansManagement keys - check if it exists
      if (key.startsWith('plansManagement') && process.env.NODE_ENV === 'development') {
        const enObj = translations['en'] as any;
        const allKeys = enObj ? Object.keys(enObj) : [];
        const hasPlansManagement = enObj && 'plansManagement' in enObj;
        if (!hasPlansManagement) {
          console.error('DEBUG: plansManagement not found in translations.en', {
            totalKeys: allKeys.length,
            allKeys: allKeys, // Show ALL keys to see where plansManagement should be
            enObjType: typeof enObj,
            language: currentLanguage,
            // Check if it's under a different name or nested
            keysContainingPlan: allKeys.filter(k => k.toLowerCase().includes('plan')),
          });
        }
      }
      
      for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
          value = value[k];
        } else {
          // Fallback to English if key not found in current language
          value = translations['en'];
          for (const fallbackKey of keys) {
            if (value && typeof value === 'object' && fallbackKey in value) {
              value = value[fallbackKey];
            } else {
              // Only log warning if it's not a plansManagement key (to avoid spam)
              if (!key.startsWith('plansManagement')) {
                console.warn(`Translation key not found: ${key} (language: ${currentLanguage})`);
              }
              return key; // Return the key if not found anywhere
            }
          }
          break;
        }
      }
      
      if (typeof value !== 'string') {
        if (!key.startsWith('plansManagement')) {
          console.warn(`Translation value is not a string for key: ${key} (got: ${typeof value})`);
        }
        return key;
      }
      
      // Replace parameters in the translation string
      if (params) {
        return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
          return params[paramKey]?.toString() || match;
        });
      }
      
      return value;
    };
  }, [language]); // Recreate the function when language changes
  
  return {
    t,
    language,
  };
};

// Utility function for direct translation access
export const translate = (key: string, params?: Record<string, string | number>): string => {
  const { language } = useLanguageStore.getState();
  const keys = key.split('.');
  let value: any = translations[language];
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      // Fallback to English if key not found in current language
      value = translations['en'];
      for (const fallbackKey of keys) {
        if (value && typeof value === 'object' && fallbackKey in value) {
          value = value[fallbackKey];
        } else {
          return key; // Return the key if not found anywhere
        }
      }
      break;
    }
  }
  
  if (typeof value !== 'string') {
    return key;
  }
  
  // Replace parameters in the translation string
  if (params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      return params[paramKey]?.toString() || match;
    });
  }
  
  return value;
};
