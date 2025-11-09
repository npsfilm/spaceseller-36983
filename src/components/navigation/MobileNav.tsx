import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { legalNav } from "@/lib/navigation";
import { Menu, User, Package, Settings as SettingsIcon, LogOut, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileNav = ({ isOpen, onOpenChange }: MobileNavProps) => {
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();
  
  const handleNavClick = () => {
    onOpenChange(false);
  };

  const handleSignOut = () => {
    signOut();
    handleNavClick();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-left">Menü</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2">
          {user ? (
            <>
              {/* User Info */}
              <div className="px-3 py-2 bg-muted rounded-md">
                <p className="text-sm font-medium">Angemeldet als</p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>

              <Separator className="my-2" />

              {/* User Actions */}
              <Link
                to="/order"
                onClick={handleNavClick}
                className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                Neue Bestellung
              </Link>

              <Link
                to="/my-orders"
                onClick={handleNavClick}
                className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                <Package className="w-4 h-4" />
                Meine Bestellungen
              </Link>

              <Link
                to="/settings"
                onClick={handleNavClick}
                className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
              >
                <SettingsIcon className="w-4 h-4" />
                Einstellungen
              </Link>

              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={handleNavClick}
                  className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  Admin Dashboard
                </Link>
              )}

              <Separator className="my-2" />

              <button
                onClick={handleSignOut}
                className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors text-destructive text-left w-full"
              >
                <LogOut className="w-4 h-4" />
                Abmelden
              </button>
            </>
          ) : (
            <>
              <Link to="/auth" onClick={handleNavClick}>
                <Button variant="outline" className="w-full">
                  Anmelden
                </Button>
              </Link>
              <Link to="/auth" onClick={handleNavClick}>
                <Button variant="cta" className="w-full">
                  Bilder hochladen
                </Button>
              </Link>
            </>
          )}

          {/* Legal Links */}
          <Separator className="my-4" />
          <div className="flex flex-col gap-1">
            {legalNav.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                onClick={handleNavClick}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors p-2"
              >
                {item.title}
              </Link>
            ))}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
