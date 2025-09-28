import { useCallback, useRef } from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';
import { flushSync } from 'react-dom';

import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import type { Theme } from '@/types/theme';

const themes = [
  { label: 'System', value: 'system' as const, icon: Monitor },
  { label: 'Light', value: 'light' as const, icon: Sun },
  { label: 'Dark', value: 'dark' as const, icon: Moon },
];

const colorThemes = [
  {
    label: 'Light Green',
    value: 'light-green' as const,
    color: 'bg-green-500',
  },
  { label: 'Dark Green', value: 'dark-green' as const, color: 'bg-green-700' },
  { label: 'Light Blue', value: 'light-blue' as const, color: 'bg-blue-500' },
  { label: 'Dark Blue', value: 'dark-blue' as const, color: 'bg-blue-700' },
  {
    label: 'Light Violet',
    value: 'light-violet' as const,
    color: 'bg-violet-500',
  },
  {
    label: 'Dark Violet',
    value: 'dark-violet' as const,
    color: 'bg-violet-700',
  },
];

type Props = {
  className?: string;
};

const ModeToggle = ({ className }: Props) => {
  const { theme, setTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Simplified dark state detection using actualTheme from context

  const getSystemTheme = (): 'light' | 'dark' => {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  };

  const supportsViewTransitions = (): boolean => {
    return typeof document !== 'undefined' && 'startViewTransition' in document;
  };

  const applyThemeToDOM = useCallback((newTheme: Theme) => {
    const root = document.documentElement;
    const themeClasses = [
      'light',
      'dark',
      'light-green',
      'dark-green',
      'light-blue',
      'dark-blue',
      'light-violet',
      'dark-violet',
    ];

    root.classList.remove(...themeClasses);

    let resolvedTheme: string;
    if (newTheme === 'system') {
      resolvedTheme = getSystemTheme();
    } else {
      resolvedTheme = newTheme;
    }

    root.classList.add(resolvedTheme);
  }, []);

  const applyThemeWithAnimation = useCallback(
    async (newTheme: Theme) => {
      if (!buttonRef.current) {
        setTheme(newTheme);
        return;
      }

      // Fallback for browsers without View Transitions
      if (!supportsViewTransitions()) {
        applyThemeToDOM(newTheme);
        setTheme(newTheme);
        return;
      }

      try {
        const transition = (
          document as unknown as {
            startViewTransition: (callback: () => void) => {
              ready: Promise<void>;
            };
          }
        ).startViewTransition(() => {
          flushSync(() => {
            applyThemeToDOM(newTheme);
            setTheme(newTheme);
          });
        });

        await transition.ready;

        // Create the ripple effect
        const { top, left, width, height } =
          buttonRef.current.getBoundingClientRect();
        const x = left + width / 2;
        const y = top + height / 2;
        const maxRadius = Math.hypot(
          Math.max(left, window.innerWidth - left),
          Math.max(top, window.innerHeight - top)
        );

        document.documentElement.animate(
          {
            clipPath: [
              `circle(0px at ${x}px ${y}px)`,
              `circle(${maxRadius}px at ${x}px ${y}px)`,
            ],
          },
          {
            duration: 700,
            easing: 'ease-in-out',
            pseudoElement: '::view-transition-new(root)',
          }
        );
      } catch {
        applyThemeToDOM(newTheme);
        setTheme(newTheme);
      }
    },
    [applyThemeToDOM, setTheme]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          ref={buttonRef}
          variant='outline'
          size='sm'
          className={cn(
            'relative cursor-pointer flex items-center justify-center w-9 h-9',
            className
          )}
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='mt-2 min-w-[180px] max-h-60 overflow-y-auto py-2'
      >
        {/* Basic themes */}
        {themes.map(({ label, value, icon: Icon }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => applyThemeWithAnimation(value)}
            className={cn(
              'cursor-pointer flex items-center gap-2',
              theme === value && 'bg-accent font-semibold'
            )}
          >
            <Icon className='h-4 w-4' />
            {label}
          </DropdownMenuItem>
        ))}

        <DropdownMenuSeparator />

        {/* Color themes */}
        {colorThemes.map(({ label, value, color }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => applyThemeWithAnimation(value)}
            className={cn(
              'cursor-pointer flex items-center gap-2',
              theme === value && 'bg-accent font-semibold'
            )}
          >
            <div
              className={cn('h-4 w-4 rounded-full border border-border', color)}
            />
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ModeToggle;
