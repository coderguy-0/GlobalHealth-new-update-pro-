import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ALL_100_LANGUAGES, LanguageConfig } from '../data/languages100';
import { TRANSLATIONS } from '../locales/translations';
import { UNIVERSAL_DICTIONARY, translateSentenceToLanguage } from '../locales/universalTranslator';

export interface LocalizationContextType {
  currentLanguage: string;
  languageOption: LanguageConfig;
  direction: 'ltr' | 'rtl';
  isRTL: boolean;
  setLanguage: (code: string) => void;
  t: (keyOrText: string, params?: Record<string, string | number>) => string;
  formatNumber: (value: number, options?: Intl.NumberFormatOptions) => string;
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatTime: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
  formatCurrency: (amount: number, currencyCode?: string) => string;
  getPlural: (count: number, keyBase: string, params?: Record<string, string | number>) => string;
  isLanguageModalOpen: boolean;
  setIsLanguageModalOpen: (open: boolean) => void;
}

const LocalizationContext = createContext<LocalizationContextType | null>(null);

const STORAGE_KEY = 'gh_selected_language';

export const LocalizationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize language from localStorage or browser language
  const [currentLanguage, setCurrentLanguageState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved && ALL_100_LANGUAGES.some(l => l.code === saved)) {
        return saved;
      }
      // Check browser locale
      const browserLang = navigator.language.split('-')[0].toLowerCase();
      const match = ALL_100_LANGUAGES.find(l => l.code === browserLang);
      if (match) return match.code;
    } catch {
      // ignore
    }
    return 'en';
  });

  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);

  const languageOption = useMemo<LanguageConfig>(() => {
    return ALL_100_LANGUAGES.find(l => l.code === currentLanguage) || ALL_100_LANGUAGES[0];
  }, [currentLanguage]);

  const direction = languageOption.direction;
  const isRTL = direction === 'rtl';

  // Apply Document-level HTML and Accessibility attributes
  useEffect(() => {
    document.documentElement.lang = currentLanguage;
    document.documentElement.dir = direction;
    
    // Set appropriate document title based on language
    const baseTitles: Record<string, string> = {
      en: 'GlobalHealth | Trusted Health, Medicine & Healthcare Information',
      hi: 'GlobalHealth — प्रमाण-आधारित स्वास्थ्य, चिकित्सा एवं पोषण पोर्टल',
      ar: 'GlobalHealth — بوابة الصحة العالمية والرعاية الطبية القائمة على الأدلة',
      es: 'GlobalHealth — Salud, Medicina y Nutrición Basada en Evidencia',
      fr: 'GlobalHealth — Santé, Médecine et Nutrition Fondées sur les Preuves',
      de: 'GlobalHealth — Evidenzbasierte Medizin, Ernährung und Gesundheit',
      ja: 'GlobalHealth — 確かなエビデンスに基づく健康・医療・栄養ポータル',
      zh: 'GlobalHealth — 权威循证全球医疗与健康门户',
      ru: 'GlobalHealth — Доказательная медицина, клинические исследования и здоровье',
      bn: 'GlobalHealth — প্রমাণ-ভিত্তিক চিকিৎসা, স্বাস্থ্য ও পুষ্টি পোর্টাল',
      pt: 'GlobalHealth — Saúde, Medicina e Nutrição Baseada em Evidências',
      ur: 'GlobalHealth — شواہد پر مبنی طبی، غذائی اور صحت کا عالمی پورٹل',
    };
    
    document.title = baseTitles[currentLanguage] || `GlobalHealth — ${languageOption.nativeName} (${languageOption.name})`;
  }, [currentLanguage, direction, languageOption]);

  const setLanguage = (code: string) => {
    const valid = ALL_100_LANGUAGES.find(l => l.code === code);
    if (!valid) return;
    
    setCurrentLanguageState(code);
    try {
      localStorage.setItem(STORAGE_KEY, code);
    } catch {
      // ignore
    }
  };

  // Zero-exception resilient translation lookup with nested keys or arbitrary text strings
  const t = (keyOrText: string, params?: Record<string, string | number>): string => {
    if (!keyOrText) return '';

    // If active language is English and text is not a key
    if (currentLanguage === 'en' && !keyOrText.includes('.')) {
      let res = keyOrText;
      if (params) {
        for (const [pKey, pVal] of Object.entries(params)) {
          res = res.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
        }
      }
      return res;
    }

    const keys = keyOrText.split('.');
    
    const resolveFromDict = (dict: Record<string, any> | undefined): string | null => {
      if (!dict) return null;
      let current: any = dict;
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
          current = current[k];
        } else {
          return null;
        }
      }
      return typeof current === 'string' ? current : null;
    };

    // 1. Direct Universal Dictionary lookup (e.g. 'common.save', 'nav.home')
    let result: string | null = null;
    if (UNIVERSAL_DICTIONARY[currentLanguage] && UNIVERSAL_DICTIONARY[currentLanguage][keyOrText]) {
      result = UNIVERSAL_DICTIONARY[currentLanguage][keyOrText];
    }

    // 2. Structured TRANSLATIONS dictionary lookup
    if (!result) {
      result = resolveFromDict(TRANSLATIONS[currentLanguage]);
    }

    // 3. Base language lookup (e.g. 'zh-TW' -> 'zh', 'pt-BR' -> 'pt')
    if (!result && currentLanguage.includes('-')) {
      const base = currentLanguage.split('-')[0];
      if (UNIVERSAL_DICTIONARY[base] && UNIVERSAL_DICTIONARY[base][keyOrText]) {
        result = UNIVERSAL_DICTIONARY[base][keyOrText];
      } else {
        result = resolveFromDict(TRANSLATIONS[base]);
      }
    }

    // 4. If not found in active language, get English value and translate dynamically to the active language
    if (!result) {
      let englishText = resolveFromDict(TRANSLATIONS['en']);
      if (!englishText && UNIVERSAL_DICTIONARY['en'] && UNIVERSAL_DICTIONARY['en'][keyOrText]) {
        englishText = UNIVERSAL_DICTIONARY['en'][keyOrText];
      }
      if (!englishText) {
        // keyOrText is either a raw sentence ("Search symptoms...") or a missing key
        englishText = keyOrText.includes('.') ? keys[keys.length - 1] : keyOrText;
      }
      
      // Auto-translate the English sentence to current active language
      result = translateSentenceToLanguage(englishText, currentLanguage);
    }

    // 5. Interpolate parameters: "Hello {name}" -> "Hello Sarah"
    if (params && result) {
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`\\{${pKey}\\}`, 'g'), String(pVal));
      }
    }

    return result || keyOrText;
  };

  // Locale-aware number formatter
  const formatNumber = (value: number, options?: Intl.NumberFormatOptions): string => {
    try {
      return new Intl.NumberFormat(languageOption.locale, options).format(value);
    } catch {
      return value.toLocaleString();
    }
  };

  // Locale-aware date formatter
  const formatDate = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'object' ? date : new Date(date);
      const defaultOptions: Intl.DateTimeFormatOptions = options || {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      };
      return new Intl.DateTimeFormat(languageOption.locale, defaultOptions).format(d);
    } catch {
      return String(date);
    }
  };

  // Locale-aware time formatter
  const formatTime = (date: Date | string | number, options?: Intl.DateTimeFormatOptions): string => {
    try {
      const d = typeof date === 'object' ? date : new Date(date);
      const defaultOptions: Intl.DateTimeFormatOptions = options || {
        hour: '2-digit',
        minute: '2-digit',
      };
      return new Intl.DateTimeFormat(languageOption.locale, defaultOptions).format(d);
    } catch {
      return String(date);
    }
  };

  // Locale-aware currency formatter
  const formatCurrency = (amount: number, currencyCode?: string): string => {
    try {
      const curr = currencyCode || languageOption.currency;
      return new Intl.NumberFormat(languageOption.locale, {
        style: 'currency',
        currency: curr,
        maximumFractionDigits: curr === 'JPY' || curr === 'KRW' || curr === 'VND' ? 0 : 2,
      }).format(amount);
    } catch {
      return `${languageOption.currencySymbol}${amount.toLocaleString()}`;
    }
  };

  // Language Pluralization Helper
  const getPlural = (count: number, keyBase: string, params?: Record<string, string | number>): string => {
    try {
      const pr = new Intl.PluralRules(languageOption.locale);
      const rule = pr.select(count);
      
      const specificKey = `${keyBase}.${rule}`;
      const fallbackKey = `${keyBase}.other`;
      
      const found = t(specificKey, { count, ...params });
      if (found && !found.includes(rule)) {
        return found;
      }
      return t(fallbackKey, { count, ...params });
    } catch {
      return `${count} ${t(keyBase, params)}`;
    }
  };

  return (
    <LocalizationContext.Provider
      value={{
        currentLanguage,
        languageOption,
        direction,
        isRTL,
        setLanguage,
        t,
        formatNumber,
        formatDate,
        formatTime,
        formatCurrency,
        getPlural,
        isLanguageModalOpen,
        setIsLanguageModalOpen,
      }}
    >
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocalization = (): LocalizationContextType => {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
};

