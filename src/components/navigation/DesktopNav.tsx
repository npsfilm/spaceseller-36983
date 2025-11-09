import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { servicesNav, locationsNav } from "@/lib/navigation";

export const DesktopNav = () => {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        {/* Services Mega Menu */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Dienstleistungen
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[750px] gap-3 p-6 md:grid-cols-3">
              {servicesNav.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        {item.icon && (
                          <item.icon className="w-5 h-5 text-primary" />
                        )}
                        <div className="text-sm font-semibold leading-none">
                          {item.title}
                        </div>
                      </div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        {item.description}
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Locations Dropdown */}
        <NavigationMenuItem>
          <NavigationMenuTrigger className="bg-transparent">
            Standorte
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-2 p-4">
              {locationsNav.map((item) => (
                <li key={item.href}>
                  <NavigationMenuLink asChild>
                    <Link
                      to={item.href}
                      className={cn(
                        "block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors",
                        "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        {item.icon && (
                          <item.icon className="w-4 h-4 text-primary" />
                        )}
                        <div className="text-sm font-medium">{item.title}</div>
                      </div>
                    </Link>
                  </NavigationMenuLink>
                </li>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        {/* Direct Link */}
        <NavigationMenuItem>
          <Link to="/Immobilienmakler">
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Für Makler
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
