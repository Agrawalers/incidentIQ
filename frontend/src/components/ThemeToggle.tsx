import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

interface ThemeToggleProps {
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(
        "rounded-full bg-card/50 backdrop-blur-sm border border-border/50 hover:bg-card",
        className
      )}
    >
      {theme === 'dark' ? (
        <Sun className="w-5 h-5 text-foreground" />
      ) : (
        <Moon className="w-5 h-5 text-foreground" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
