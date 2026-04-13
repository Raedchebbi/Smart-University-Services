import { useState, type ReactNode } from 'react';
import { Menu, LogOut, X } from 'lucide-react';
import { useAuth } from '../auth/useAuth';
import { Sidebar } from './Sidebar';
import { ErrorBoundary } from './ErrorBoundary';

export function Layout({ children }: { children: ReactNode }) {
  const { username, roles, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <aside className="hidden md:flex md:flex-col w-64 bg-white border-r border-gray-200 shrink-0">
        <div className="flex items-center gap-2 px-6 py-5 border-b border-gray-100">
          <div className="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm">SU</div>
          <span className="font-bold text-lg text-gray-800">Smart Uni</span>
        </div>
        <Sidebar collapsed={false} />
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setMobileOpen(false)} />
          <aside className="relative w-64 h-full bg-white shadow-xl">
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <span className="font-bold text-lg">Smart Uni</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close sidebar"><X className="h-5 w-5" /></button>
            </div>
            <Sidebar collapsed={false} onClose={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      {/* Main content area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Topbar */}
        <header className="flex items-center justify-between bg-white border-b border-gray-200 px-4 md:px-6 py-3 shrink-0">
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={() => setMobileOpen(true)} aria-label="Open menu">
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden md:block" />
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-700">{username}</p>
              <p className="text-xs text-gray-400">{roles.filter((r) => ['ADMIN', 'TEACHER', 'STUDENT'].includes(r)).join(', ')}</p>
            </div>
            <button onClick={logout} className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-600 transition-colors" aria-label="Logout">
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <ErrorBoundary>{children}</ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
