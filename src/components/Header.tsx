import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useBannerContext } from "@/contexts/BannerContext";
import { DesktopNav } from "@/components/navigation/DesktopNav";
import { MobileNav } from "@/components/navigation/MobileNav";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isBannerVisible } = useBannerContext();


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
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex">
              <Button variant="outline">
                Anmelden
              </Button>
            </a>
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer" className="hidden md:inline-flex">
              <Button variant="cta">
                Bilder hochladen
              </Button>
            </a>
            
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
