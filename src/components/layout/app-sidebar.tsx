import { useLocation, useNavigate } from 'react-router-dom';
import { Package, LogOut } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../ui/sidebar';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';

const navItems = [{ title: 'Products', icon: Package, path: '/products' }];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <Sidebar className="border-sidebar-border min-h-full border-r">
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <div className="bg-primary text-primary-foreground flex h-9 w-9 items-center justify-center rounded-lg text-sm font-bold">
            NTT
          </div>
          <div className="flex flex-col">
            <span className="text-sm leading-tight font-semibold">
              NTT Data
            </span>
            <span className="text-muted-foreground text-xs">Mini Project</span>
          </div>
        </div>
      </SidebarHeader>

      <Separator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      isActive={isActive}
                      onClick={() => navigate(item.path)}
                      tooltip={item.title}
                      className="transition-colors"
                    >
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <Separator />

      <SidebarFooter className="p-4">
        {user && (
          <div className="mb-3 flex items-center gap-3">
            <img
              src={user.image}
              alt={user.firstName}
              className="ring-border h-8 w-8 rounded-full ring-2"
            />
            <div className="flex min-w-0 flex-col">
              <span className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </span>
              <span className="text-muted-foreground truncate text-xs">
                {user.email}
              </span>
            </div>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-destructive w-full justify-start gap-2"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          Sign out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
