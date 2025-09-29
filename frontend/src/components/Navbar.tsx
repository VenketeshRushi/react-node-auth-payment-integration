import {
  BadgePercent,
  DollarSign,
  HelpCircle,
  Mail,
  Menu,
  ShoppingCart,
} from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import ModeToggle from '@/components/ModeToggle';
import { Link, NavLink } from 'react-router-dom';

interface MenuItem {
  title: string;
  url: string;
  description?: string;
  icon?: React.ReactNode;
  items?: MenuItem[];
}

interface NavbarProps {
  logo?: {
    url: string;
    title: string;
  };
  menu?: MenuItem[];
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
}

const Navbar = ({
  logo = {
    url: '/',
    title: 'Acme Inc.',
  },
  menu = [
    { title: 'Home', url: '/' },
    {
      title: 'Pricing',
      url: '/',
      items: [
        {
          title: 'Basic Plan',
          description: 'Essential features for individuals',
          icon: (
            <ShoppingCart
              className='size-5 shrink-0 stroke-[#22c55e]'
              strokeWidth={2}
            />
          ),
          url: '/',
        },
        {
          title: 'Pro Plan',
          description: 'Advanced features for professionals',
          icon: (
            <DollarSign
              className='size-5 shrink-0 stroke-primary'
              strokeWidth={2}
            />
          ),
          url: '/',
        },
        {
          title: 'Discount Offers',
          description: 'Check out our current discounts',
          icon: (
            <BadgePercent
              className='size-5 shrink-0 stroke-[#f59e0b]'
              strokeWidth={2}
            />
          ),
          url: '/',
        },
      ],
    },
    {
      title: 'Resources',
      url: '/',
      items: [
        {
          title: 'Help Center',
          description: 'Get all the answers you need right here',
          icon: (
            <HelpCircle
              className='size-5 shrink-0 stroke-blue-400'
              strokeWidth={2}
            />
          ),
          url: '/contactus',
        },
        {
          title: 'Contact Us',
          description: 'We are here to help you with any questions you have',
          icon: (
            <Mail
              className='size-5 shrink-0 stroke-green-400'
              strokeWidth={2}
            />
          ),
          url: '/contactus',
        },
      ],
    },
    {
      title: 'About us',
      url: '/aboutus',
    },
    {
      title: 'Contact us',
      url: '/contactus',
    },
  ],
  auth = {
    login: { title: 'Sign In', url: '/signin' },
    signup: { title: 'Sign Up', url: '/signup' },
  },
}: NavbarProps) => {
  return (
    <nav className='w-full'>
      {/* Desktop Menu */}
      <div className='hidden justify-between lg:flex lg:flex-1 lg:items-center lg:gap-6 w-full'>
        <div className='flex items-center gap-6'>
          <Link to={logo.url} className='flex items-center gap-2'>
            <span className='text-lg font-semibold tracking-tighter'>
              {logo.title}
            </span>
          </Link>
        </div>

        <div className='flex items-center font-normal'>
          <NavigationMenu>
            <NavigationMenuList>
              {menu
                .filter((item: MenuItem) => item.title !== 'Home')
                .map((item: MenuItem) => renderMenuItem(item))}
            </NavigationMenuList>
          </NavigationMenu>
        </div>
        <div className='flex gap-2'>
          <Button asChild variant='ghost' size='sm'>
            <Link to={auth.login.url}>{auth.login.title}</Link>
          </Button>
          <Button asChild variant='default' size='sm'>
            <Link to={auth.signup.url}>{auth.signup.title}</Link>
          </Button>
          <div className='hidden lg:block pl-2'>
            <ModeToggle />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className='w-full flex-1 block lg:hidden'>
        <div className='flex items-center justify-between'>
          <Link to={logo.url} className='flex items-center gap-2'>
            <span className='text-lg font-semibold tracking-tighter'>
              {logo.title}
            </span>
          </Link>
          <Sheet>
            <div className='flex items-center gap-2'>
              <div className='lg:hidden'>
                <ModeToggle />
              </div>
              <div className='flex items-center gap-2'>
                <SheetTrigger asChild>
                  <Button variant='outline' size='icon'>
                    <Menu className='size-4' />
                  </Button>
                </SheetTrigger>
              </div>
            </div>
            <SheetContent className='overflow-y-auto'>
              <SheetHeader>
                <SheetTitle>
                  <Link to={logo.url} className='flex items-center gap-2'>
                    <span className='text-lg font-semibold tracking-tighter '>
                      {logo.title}
                    </span>
                  </Link>
                </SheetTitle>
                <SheetDescription className='border-b pb-4 text-primary'>
                  Transforming Talk into Action
                </SheetDescription>
              </SheetHeader>

              <div className='flex flex-col justify-between h-full gap-6 px-4 py-0'>
                <Accordion
                  type='single'
                  collapsible
                  className='flex w-full flex-col gap-4'
                >
                  {menu.map(item => renderMobileMenuItem(item))}
                </Accordion>
                <div className='flex flex-col gap-4 mb-6'>
                  <SheetClose asChild>
                    <Button asChild variant='ghost' size='sm'>
                      <Link to={auth.login.url}>{auth.login.title}</Link>
                    </Button>
                  </SheetClose>
                  <SheetClose asChild>
                    <Button asChild variant='default' size='sm'>
                      <Link to={auth.signup.url}>{auth.signup.title}</Link>
                    </Button>
                  </SheetClose>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
};

const renderMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <NavigationMenuItem key={item.title}>
        <NavigationMenuTrigger className='bg-transparent cursor-pointer font-bold hover:bg-accent'>
          {item.title}
        </NavigationMenuTrigger>
        <NavigationMenuContent className='bg-background/95 backdrop-blur-md !w-xl'>
          {item.items.map(subItem => (
            <NavigationMenuLink asChild key={subItem.title} className='w-50'>
              <SubMenuLink item={subItem} />
            </NavigationMenuLink>
          ))}
        </NavigationMenuContent>
      </NavigationMenuItem>
    );
  }

  return (
    <NavigationMenuItem key={item.title}>
      <NavigationMenuLink
        href={item.url}
        className='bg-transparent group inline-flex h-9 w-max items-center justify-center rounded-md px-4 py-2 transition-colors font-bold hover:bg-accent hover:text-accent-foreground'
      >
        {item.title}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
};

const renderMobileMenuItem = (item: MenuItem) => {
  if (item.items) {
    return (
      <AccordionItem key={item.title} value={item.title} className='border-b-0'>
        <AccordionTrigger className='text-md py-0 font-semibold hover:no-underline'>
          {item.title}
        </AccordionTrigger>
        <AccordionContent className='mt-2'>
          {item.items.map(subItem => (
            <SheetClose asChild key={subItem.title}>
              <SubMenuLink key={subItem.title} item={subItem} />
            </SheetClose>
          ))}
        </AccordionContent>
      </AccordionItem>
    );
  }

  return (
    <NavLink key={item.title} to={item.url} className='text-md font-semibold'>
      {item.title}
    </NavLink>
  );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
  return (
    <NavLink
      className='hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors'
      to={item.url}
    >
      <div className='text-foreground'>{item.icon}</div>
      <div>
        <div className='text-sm font-semibold'>{item.title}</div>
        {item.description && (
          <p className='text-muted-foreground text-sm leading-snug'>
            {item.description}
          </p>
        )}
      </div>
    </NavLink>
  );
};

export default Navbar;
