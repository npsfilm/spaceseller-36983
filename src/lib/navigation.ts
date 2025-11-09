import { Camera, Layout, Image, MapPin, Users, LucideIcon } from "lucide-react";

export interface NavItem {
  title: string;
  href: string;
  description?: string;
  icon?: LucideIcon;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export const servicesNav: NavItem[] = [
  {
    title: "Grundrisse",
    href: "/grundrisse",
    description: "Professionelle 2D und 3D Grundrisse für Ihre Immobilien",
    icon: Layout,
  },
  {
    title: "Virtual Staging",
    href: "/virtual-staging",
    description: "Virtuelle Möblierung für leere Räume",
    icon: Image,
  },
  {
    title: "Fotografie Deutschlandweit",
    href: "/immobilienfotografie",
    description: "Professionelle Fotografie im ganzen Land",
    icon: Camera,
  },
];

export const locationsNav: NavItem[] = [
  {
    title: "Immobilienfotografie München",
    href: "/immobilienfotografie-muenchen",
    icon: MapPin,
  },
  {
    title: "Immobilienfotografie Augsburg",
    href: "/immobilienfotografie-augsburg",
    icon: MapPin,
  },
  {
    title: "Whitelabel für Fotografen",
    href: "/immobilienfotograf-whitelabel",
    icon: Users,
  },
  {
    title: "Fotografen werden",
    href: "/fotografen-werden",
    icon: Users,
  },
];

export const legalNav: NavItem[] = [
  { title: "Impressum", href: "/impressum" },
  { title: "Datenschutz", href: "/datenschutz" },
  { title: "AGB", href: "/agb" },
];
