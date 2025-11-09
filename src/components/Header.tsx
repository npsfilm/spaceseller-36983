import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useBannerContext } from "@/contexts/BannerContext";
import { useAuth } from "@/contexts/AuthContext";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { User, Settings as SettingsIcon, Package, LogOut, Shield } from "lucide-react";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isBannerVisible } = useBannerContext();
  const { user, signOut } = useAuth();
  const { isAdmin } = useIsAdmin();


  return (
    <header className={`fixed left-0 right-0 z-40 bg-background/80 backdrop-blur-lg border-b border-border transition-all duration-300 ${isBannerVisible ? 'top-12' : 'top-0'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold bg-gradient-hero bg-clip-text text-transparent">
              spaceseller
            </span>
          </Link>

          {/* Desktop Navigation */}
          <DesktopNav />

          {/* Right Side Actions */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <Button asChild variant="cta" className="hidden md:inline-flex">
                  <Link to="/order">Neue Bestellung</Link>
                </Button>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="icon" className="hidden md:inline-flex">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">Mein Konto</p>
                        <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/my-orders" className="cursor-pointer">
                        <Package className="mr-2 h-4 w-4" />
                        Meine Bestellungen
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer">
                        <SettingsIcon className="mr-2 h-4 w-4" />
                        Einstellungen
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link to="/admin" className="cursor-pointer">
                            <Shield className="mr-2 h-4 w-4" />
                            Admin Dashboard
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => signOut()} className="cursor-pointer text-destructive">
                      <LogOut className="mr-2 h-4 w-4" />
                      Abmelden
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="hidden md:inline-flex">
                  <Link to="/auth">Anmelden</Link>
                </Button>
                <Button asChild variant="cta" className="hidden md:inline-flex">
                  <Link to="/auth">Bilder hochladen</Link>
                </Button>
              </>
            )}
            
            {/* Mobile Menu */}
            <MobileNav 
              isOpen={isOpen}
              onOpenChange={setIsOpen}
            />
          </div>
        </div>
      </div>
    </header>
  );
};
