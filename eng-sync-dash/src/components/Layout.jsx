import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Users, 
  FolderOpen, 
  Calendar, 
  Settings, 
  LogOut, 
  Menu,
  X,
  Brain,
  BarChart3
} from 'lucide-react';

const Layout = ({ children, currentPage, setCurrentPage }) => {
  const { user, logout, isAdmin } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard', adminOnly: false },
    { name: 'Engineers', icon: Users, id: 'engineers', adminOnly: false },
    { name: 'Projects', icon: FolderOpen, id: 'projects', adminOnly: false },
    { name: 'Assignments', icon: Calendar, id: 'assignments', adminOnly: false },
    { name: 'Capacity', icon: BarChart3, id: 'capacity', adminOnly: false },
    { name: 'AI Tools', icon: Brain, id: 'ai-tools', adminOnly: isAdmin },
    { name: 'Settings', icon: Settings, id: 'settings', adminOnly: isAdmin },
  ];

  const filteredNavigation = navigation.filter(item => !item.adminOnly || isAdmin);

  const handleLogout = () => {
    logout();
  };

  const handleNavClick = (pageId) => {
    setCurrentPage(pageId);
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-card border-r border-border transform transition-transform duration-200 ease-in-out lg:translate-x-0
        ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-border">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-lg text-foreground">ERMS</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* User info */}
          <div className="px-6 py-4 border-b border-border bg-muted/20">
            <div className="flex items-center space-x-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-white font-medium text-sm">
                  {user?.name?.split(' ').map(n => n[0]).join('') || 'U'}
                </span>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground">{user?.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user?.role}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {filteredNavigation.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <Button
                  key={item.id}
                  variant={isActive ? "default" : "ghost"}
                  className={`
                    w-full justify-start h-11 px-4 
                    ${isActive 
                      ? "bg-primary text-primary-foreground shadow-sm" 
                      : "text-foreground hover:bg-muted hover:text-foreground"
                    }
                  `}
                  onClick={() => handleNavClick(item.id)}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Button>
              );
            })}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-border">
            <Button
              variant="ghost"
              className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
              onClick={handleLogout}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:px-6">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="font-semibold text-lg capitalize text-foreground">
              {filteredNavigation.find(item => item.id === currentPage)?.name || 'Dashboard'}
            </h1>
          </div>
          <div className="flex items-center space-x-2">
            <div className="hidden sm:block text-sm text-muted-foreground">
              Welcome, {user?.name}
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">
          <div className="animate-fade-in">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;