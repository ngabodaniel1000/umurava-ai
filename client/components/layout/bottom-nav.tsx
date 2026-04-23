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
                'fixed bottom-0 left-0 w-full z-50',
                // Styling
                'bg-background/95 border-t border-border',
                'backdrop-blur-md',
                'shadow-[0_-1px_8px_rgba(0,0,0,0.04)]',
            )}
        >
            <div className="flex justify-around items-center h-[70px]">
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
                                // Layout
                                'flex flex-col items-center justify-center',
                                'flex-1 h-full',
                                // Smooth transition
                                'transition-all duration-200 ease-in-out',
                                // Colors
                                isActive
                                    ? 'text-primary'
                                    : 'text-muted-foreground hover:text-primary/80',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex flex-col items-center justify-center gap-1',
                                    'transition-all duration-200 ease-in-out',
                                )}
                            >
                                <Icon
                                    className={cn(
                                        'transition-all duration-200',
                                        isActive ? 'w-5 h-5' : 'w-5 h-5',
                                    )}
                                    strokeWidth={isActive ? 2.5 : 1.8}
                                />
                                <span
                                    className={cn(
                                        'text-xs font-medium transition-all duration-200',
                                        isActive ? 'text-primary' : 'text-muted-foreground',
                                    )}
                                >
                                    {item.label}
                                </span>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}