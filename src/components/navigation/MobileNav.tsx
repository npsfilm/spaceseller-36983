import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import { servicesNav, locationsNav, legalNav } from "@/lib/navigation";
import { Menu } from "lucide-react";
import { Link } from "react-router-dom";

interface MobileNavProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MobileNav = ({ isOpen, onOpenChange }: MobileNavProps) => {
  const handleNavClick = () => {
    onOpenChange(false);
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
          <SheetTitle className="text-left">Navigation</SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-2">
          {/* Services Section */}
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="services" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-base font-semibold">Dienstleistungen</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 ml-2">
                  {servicesNav.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleNavClick}
                      className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      {item.icon && <item.icon className="w-4 h-4 text-primary" />}
                      {item.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Locations Section */}
            <AccordionItem value="locations" className="border-none">
              <AccordionTrigger className="py-2 hover:no-underline">
                <span className="text-base font-semibold">Standorte</span>
              </AccordionTrigger>
              <AccordionContent>
                <div className="flex flex-col gap-1 ml-2">
                  {locationsNav.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      onClick={handleNavClick}
                      className="flex items-center gap-3 rounded-md p-3 text-sm font-medium hover:bg-accent transition-colors"
                    >
                      {item.icon && <item.icon className="w-4 h-4 text-primary" />}
                      {item.title}
                    </Link>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          {/* Direct Link */}
          <Link
            to="/Immobilienmakler"
            onClick={handleNavClick}
            className="rounded-md p-3 text-base font-semibold hover:bg-accent transition-colors"
          >
            Für Makler
          </Link>

          <Separator className="my-4" />

          {/* Auth/Order Actions */}
          <div className="flex flex-col gap-2">
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>
              <Button variant="outline" className="w-full">
                Anmelden
              </Button>
            </a>
            <a href="https://app.spaceseller.de" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>
              <Button variant="cta" className="w-full">
                Bilder hochladen
              </Button>
            </a>
          </div>

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
