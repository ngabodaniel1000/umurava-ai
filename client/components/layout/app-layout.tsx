'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { BottomNav } from './bottom-nav';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">

      {/* Sidebar – hidden on mobile, visible on md+ */}
      <div className={cn(
        "hidden md:block transition-all duration-300 ease-in-out border-r border-border shrink-0",
        isCollapsed ? "w-20" : "w-20 md:w-64"
      )}>
        <div className={cn(
          "h-full transition-all duration-300",
          isCollapsed ? "w-20" : "fixed inset-y-0 left-0 z-60 w-64 bg-card md:relative shadow-xl md:shadow-none"
        )}>
          <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-2 p-4 pb-20 md:p-8 md:pb-8">
          {children}
        </main>
      </div>
      {/* Mobile bottom navigation */}
      <BottomNav />
    </div>
  );
}


