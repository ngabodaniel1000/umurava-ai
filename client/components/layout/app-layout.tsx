'use client';

import { useState } from 'react';
import { Header } from './header';
import { Sidebar } from './sidebar';
import { cn } from '@/lib/utils';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="flex h-screen bg-background overflow-hidden relative">
      {/* Sidebar Backdrop for Mobile */}
      {!isCollapsed && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setIsCollapsed(true)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "transition-all duration-300 ease-in-out border-r border-border shrink-0",
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
        <main className="flex-1 overflow-y-auto overflow-x-hidden pt-2 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}


