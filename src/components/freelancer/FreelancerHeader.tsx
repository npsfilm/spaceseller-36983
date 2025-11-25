import { NavLink } from '@/components/NavLink';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  User, 
  LogOut, 
  Settings, 
  LayoutDashboard,
  Bell,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { NotificationBell } from '@/components/NotificationBell';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { usePhotographerAssignments, useAssignmentStats } from '@/lib/hooks/useAssignments';

export const FreelancerHeader = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { data: assignments = [] } = usePhotographerAssignments();
  const stats = useAssignmentStats(assignments);

  const handleSignOut = async () => {
    await signOut();
    navigate('/auth');
  };

  const getInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase();
  };

  const navigationItems = [
    {
      to: '/freelancer-dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: stats.pending > 0 ? stats.pending : undefined,
    },
    {
      to: '/settings',
      label: 'Einstellungen',
      icon: Settings,
    },
  ];

  const DesktopNav = () => (
    <nav className="hidden md:flex items-center gap-6">
      {navigationItems.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.to}
            to={item.to}
            className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors relative"
            activeClassName="text-foreground"
          >
            <Icon className="h-4 w-4" />
            {item.label}
            {item.badge && (
              <Badge variant="destructive" className="ml-1 h-5 min-w-5 px-1.5 flex items-center justify-center">
                {item.badge}
              </Badge>
            )}
          </NavLink>
        );
      })}
    </nav>
  );

  const MobileNav = () => (
    <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="ghost" size="icon">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-64">
        <div className="py-6">
          <div className="mb-6">
            <h2 className="text-lg font-bold mb-1">Fotograf Portal</h2>
            <p className="text-sm text-muted-foreground">Ihre Aufträge</p>
          </div>
          <nav className="space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-muted"
                  activeClassName="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                  {item.badge && (
                    <Badge variant="secondary" className="ml-auto">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        {/* Left: Logo + Mobile Menu */}
        <div className="flex items-center gap-4">
          <MobileNav />
          <NavLink to="/freelancer-dashboard" className="flex items-center gap-2">
            <img 
              src="/spaceseller-logo.png" 
              alt="spaceseller" 
              className="h-8 w-auto"
            />
            <span className="hidden sm:inline-block text-sm font-semibold text-muted-foreground">
              Fotograf
            </span>
          </NavLink>
        </div>

        {/* Center: Desktop Navigation */}
        <DesktopNav />

        {/* Right: Notifications + User Menu */}
        <div className="flex items-center gap-3">
          <NotificationBell />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    {user?.email ? getInitials(user.email) : 'U'}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">Fotograf Account</p>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/freelancer-dashboard')}>
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate('/settings')}>
                <Settings className="mr-2 h-4 w-4" />
                Einstellungen
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
                <LogOut className="mr-2 h-4 w-4" />
                Abmelden
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};
