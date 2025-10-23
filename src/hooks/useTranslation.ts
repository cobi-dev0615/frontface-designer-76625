import { useLanguageStore } from '@/store/languageStore';
import { ptBR } from '@/locales/pt-BR';
import { en } from '@/locales/en';

const translations = {
  'pt-BR': ptBR,
  'en': en,
};

export const useTranslation = () => {
  const { language } = useLanguageStore();
  
  const t = (key: string, params?: Record<string, string | number>): string => {
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
