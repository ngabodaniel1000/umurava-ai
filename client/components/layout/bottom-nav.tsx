'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
    LayoutDashboard,
    FileText,
    Users,
    BarChart3,
    Settings,
} from 'lucide-react';

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

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            aria-label="Mobile bottom navigation"
            className={cn(
                // Only visible on small screens
                'md:hidden',
                // Layout
                'fixed bottom-0 left-0 w-full h-[60px] z-50',
                'flex justify-around items-center',
                // Styling
                'bg-transparent border-t border-border/50 backdrop-blur-md',
                'shadow-[0_-1px_8px_rgba(0,0,0,0.04)]',
            )}
        >
            {navItems.map((item) => {
                const Icon = item.icon;
                const isActive =
                    pathname === item.href || pathname.startsWith(item.href + '/');

                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-label={item.label}
                        className={cn(
                            // Large touch area
                            'flex items-center justify-center',
                            'min-w-[44px] min-h-[44px] w-full h-full',
                            // Smooth transition
                            'transition-all duration-200 ease-in-out',
                            // Colors
                            isActive
                                ? 'text-accent-foreground'
                                : 'text-muted-foreground',
                        )}
                    >
                        <span
                            className={cn(
                                'flex items-center justify-center rounded-xl p-2.5',
                                'transition-all duration-200 ease-in-out',
                                isActive
                                    ? 'bg-accent text-accent-foreground scale-110'
                                    : 'text-muted-foreground scale-100',
                            )}
                        >
                            <Icon
                                className={cn(
                                    'transition-all duration-200',
                                    isActive ? 'w-[22px] h-[22px]' : 'w-5 h-5',
                                )}
                                strokeWidth={isActive ? 2.5 : 1.8}
                            />
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
}
