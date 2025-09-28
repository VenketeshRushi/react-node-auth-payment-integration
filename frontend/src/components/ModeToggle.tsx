import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/hooks/use-theme';
import { Moon, Sun } from 'lucide-react';

const themes = [
  { label: 'System', value: 'system' },
  { label: 'Light Green', value: 'light-green' },
  { label: 'Dark Green', value: 'dark-green' },
  { label: 'Light Blue', value: 'light-blue' },
  { label: 'Dark Blue', value: 'dark-blue' },
  { label: 'Light Violet', value: 'light-violet' },
  { label: 'Dark Violet', value: 'dark-violet' },
  { label: 'Light', value: 'light' },
  { label: 'Dark', value: 'dark' },
];

function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className='relative cursor-pointer flex items-center justify-center'
        >
          <Sun className='h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0' />
          <Moon className='absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100' />
          <span className='sr-only'>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align='end'
        className='mt-2 max-h-60 overflow-y-auto no-scrollbar py-2'
      >
        {themes.map(({ label, value }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value as typeof theme)}
            className={`cursor-pointer ${
              theme === value ? 'bg-muted font-semibold' : ''
            }`}
          >
            {label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default ModeToggle;
