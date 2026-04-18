'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  FileText,
  Users,
  BarChart3,
  Settings,
  ChevronRight,
  Sparkles,
  LogOut,
  PanelLeftClose,
  PanelLeftOpen,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';

const navItems = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    label: 'Jobs',
    href: '/jobs',
    icon: FileText,
  },
  {
    label: 'Candidates',
    href: '/candidates',
    icon: Users,
  },
  {
    label: 'Results',
    href: '/results',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
];

interface SidebarProps {
  isCollapsed?: boolean;
  onToggle?: () => void;
  isMobile?: boolean;
}

export function Sidebar({ isCollapsed, onToggle, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setUser(JSON.parse(userJson));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <aside className={cn(
      "h-full border-r border-border bg-card flex flex-col transition-all duration-300 ease-in-out",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="flex-1 px-4 py-6">
        <div className={cn(
          "flex items-center mb-8",
          isCollapsed ? "justify-center" : "justify-between"
        )}>
          {/* Logo Section */}
          <div className={cn(
            "items-center gap-2 overflow-hidden",
            isCollapsed ? "hidden" : "flex flex-1"
          )}>
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground whitespace-nowrap overflow-hidden text-ellipsis">
              Umurava Ai
            </span>
          </div>

          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggle}
            className="shrink-0"
          >
            {isCollapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
          </Button>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(item.href + '/');

            return (
              <Link key={item.href} href={item.href}>
                <Button
                  variant="ghost"
                  className={cn(
                    'w-full h-12 hover:bg-muted transition-all duration-200 cursor-pointer',
                    isCollapsed ? "justify-center px-0" : "justify-start gap-3",
                    isActive ? 'bg-accent text-accent-foreground hover:bg-accent' : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <Icon className="w-5 h-5 shrink-0" />
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left whitespace-nowrap overflow-hidden text-ellipsis">
                        {item.label}
                      </span>
                      {isActive && <ChevronRight className="w-4 h-4 shrink-0" />}
                    </>
                  )}
                </Button>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto px-4 py-6">
        <Separator className="mb-6 bg-border/50" />
        <div className={cn(
          "flex items-center gap-3 mb-6",
          isCollapsed ? "justify-center" : ""
        )}>
          <Avatar className="h-10 w-10 border-2 border-accent/20 shrink-0">
            <AvatarImage src={user?.avatar || ''} />
            <AvatarFallback className="bg-accent text-accent-foreground font-bold">
              {user?.name?.[0] || 'U'}
            </AvatarFallback>
          </Avatar>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-semibold text-foreground truncate">{user?.name || 'User'}</span>
              <span className="text-xs text-muted-foreground truncate">{user?.email || 'user@example.com'}</span>
            </div>
          )}
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className={cn(
            "w-full text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer",
            isCollapsed ? "justify-center px-0" : "justify-start gap-3"
          )}
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!isCollapsed && <span>Log out</span>}
        </Button>
      </div>
    </aside>
  );
}
