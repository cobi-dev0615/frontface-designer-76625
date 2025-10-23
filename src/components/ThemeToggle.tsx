import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/store/themeStore';
import { useTranslation } from '@/hooks/useTranslation';

interface ThemeToggleProps {
  variant?: 'button' | 'icon';
  showLabel?: boolean;
  className?: string;
}

export const ThemeToggle = ({ 
  variant = 'icon', 
  showLabel = false,
  className = '' 
}: ThemeToggleProps) => {
  const { theme, toggleTheme, isDark } = useThemeStore();
  const { t } = useTranslation();

  const handleToggle = () => {
    toggleTheme();
  };

  if (variant === 'button') {
    return (
      <Button
        variant="outline"
        size="sm"
        onClick={handleToggle}
        className={`flex items-center gap-2 border-2 border-border ${className}`}
        title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
      >
        {isDark ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
        {showLabel && (
          <span className="hidden sm:inline">
            {isDark ? t('theme.light') : t('theme.dark')}
          </span>
        )}
      </Button>
    );
  }

  // Default icon variant
  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      className={`h-8 w-8 border-2 border-border ${className}`}
      title={isDark ? t('theme.switchToLight') : t('theme.switchToDark')}
    >
      {isDark ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
};
