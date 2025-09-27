import * as React from 'react';
import {
  HelpCircle,
  CreditCard,
  CircleUser,
  GalleryVerticalEnd,
} from 'lucide-react';
import NavMain from '@/components/sidebar/nav-main';
import NavUser from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Link } from 'react-router-dom';

const data = {
  user: {
    name: 'John Doe',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },

  navSecondary: [
    { title: 'Billing', url: '#', icon: CreditCard },
    { title: 'Profile', url: '#', icon: CircleUser },
    { title: 'Get Help', url: '#', icon: HelpCircle },
  ],
};

const AppSidebar: React.FC<React.ComponentProps<typeof Sidebar>> = ({
  ...props
}) => {
  return (
    <Sidebar collapsible='icon' {...props} className='h-full'>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
              tooltip='Acme inc.'
            >
              <Link
                to='/dashboard'
                className='flex w-full items-center gap-2 cursor-pointer'
              >
                <div className='bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square w-8 h-8 items-center justify-center rounded-lg'>
                  <GalleryVerticalEnd className='w-4 h-4' />
                </div>
                <div className='grid flex-1 text-left text-sm leading-tight'>
                  <span className='truncate font-medium'>Acme inc.</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
