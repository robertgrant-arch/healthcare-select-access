// Healthcare Select Access — App Layout with Sidebar
// Design: Secure Clarity | Fixed sidebar (240px) + main content area

import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import {
  LayoutDashboard,
  FileText,
  Share2,
  Settings,
  Shield,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Bell,
  User,
  Lock,
  Activity,
  HelpCircle,
} from 'lucide-react';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles?: string[];
  badge?: string;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'My Records', href: '/records', icon: FileText },
  { label: 'Share Records', href: '/share/create', icon: Share2 },
  { label: 'Settings', href: '/settings', icon: Settings },
  { label: 'Admin Panel', href: '/admin', icon: Shield, roles: ['ADMIN'] },
];

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export default function AppLayout({ children, title, breadcrumbs }: AppLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  const visibleNavItems = NAV_ITEMS.filter(item =>
    !item.roles || (user && item.roles.includes(user.role))
  );

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-sidebar-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0E7490, #1B3A6B)' }}>
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-current">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div>
            <div className="text-white font-semibold text-sm leading-tight" style={{ fontFamily: 'Sora, sans-serif' }}>Healthcare</div>
            <div className="text-xs leading-tight" style={{ color: 'oklch(0.65 0.08 210)' }}>Select Access</div>
          </div>
        </Link>
      </div>

      {/* User info */}
      {user && (
        <div className="px-4 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white" style={{ background: 'oklch(0.52 0.12 210)' }}>
              {user.firstName[0]}{user.lastName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-white truncate">{user.firstName} {user.lastName}</div>
              <div className="text-xs truncate" style={{ color: 'oklch(0.65 0.08 210)' }}>
                {user.role === 'ADMIN' ? '⚙ Administrator' : user.role === 'PROVIDER' ? '🏥 Provider' : '👤 Beneficiary'}
              </div>
            </div>
          </div>
          {user.mfaEnabled && (
            <div className="mt-2 flex items-center gap-1.5 text-xs" style={{ color: 'oklch(0.65 0.12 180)' }}>
              <Lock className="w-3 h-3" />
              <span>MFA Active</span>
            </div>
          )}
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {visibleNavItems.map(item => {
          const isActive = location === item.href || location.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`sidebar-item ${isActive ? 'active' : ''}`}
            >
              <item.icon className="w-4 h-4 flex-shrink-0" />
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="text-xs px-1.5 py-0.5 rounded-full bg-teal-500 text-white">{item.badge}</span>
              )}
              {isActive && <ChevronRight className="w-3 h-3 opacity-50" />}
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <a
          href="/docs/oidc"
          className="sidebar-item"
          onClick={e => { e.preventDefault(); window.location.href = '/docs/oidc'; }}
        >
          <HelpCircle className="w-4 h-4" />
          <span>OIDC Documentation</span>
        </a>
        <button
          onClick={handleLogout}
          className="sidebar-item w-full text-left"
          style={{ color: 'oklch(0.65 0.15 20)' }}
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Desktop Sidebar */}
      <aside
        className="hidden lg:flex flex-col w-60 flex-shrink-0 overflow-hidden"
        style={{ background: 'oklch(0.22 0.08 250)' }}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <aside
            className="relative flex flex-col w-64 overflow-hidden animate-slide-in-left"
            style={{ background: 'oklch(0.22 0.08 250)' }}
          >
            <button
              onClick={() => setSidebarOpen(false)}
              className="absolute top-4 right-4 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="flex items-center justify-between px-4 lg:px-6 py-3 bg-white border-b border-border flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-md hover:bg-muted"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Breadcrumbs */}
            {breadcrumbs && breadcrumbs.length > 0 ? (
              <nav className="flex items-center gap-1.5 text-sm">
                {breadcrumbs.map((crumb, i) => (
                  <span key={i} className="flex items-center gap-1.5">
                    {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground" />}
                    {crumb.href ? (
                      <Link href={crumb.href} className="text-muted-foreground hover:text-foreground transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className="font-medium text-foreground">{crumb.label}</span>
                    )}
                  </span>
                ))}
              </nav>
            ) : title ? (
              <h1 className="text-base font-semibold text-foreground" style={{ fontFamily: 'Sora, sans-serif' }}>{title}</h1>
            ) : null}
          </div>

          <div className="flex items-center gap-2">
            {/* Security indicator */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full" style={{ background: '#E0F2FE', color: '#0C4A6E' }}>
              <Lock className="w-3 h-3" />
              <span>Secure Session</span>
            </div>

            {/* Notifications */}
            <button
              className="p-2 rounded-md hover:bg-muted relative"
              onClick={() => toast.info('No new notifications')}
            >
              <Bell className="w-4 h-4 text-muted-foreground" />
            </button>

            {/* User avatar */}
            {user && (
              <Link href="/settings">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold text-white cursor-pointer" style={{ background: 'linear-gradient(135deg, #1B3A6B, #0E7490)' }}>
                  {user.firstName[0]}{user.lastName[0]}
                </div>
              </Link>
            )}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="animate-fade-in-up">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
