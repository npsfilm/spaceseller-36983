import { 
  LayoutDashboard, 
  Users, 
  MapPin, 
  Shield, 
  ShieldAlert,
  Camera,
  BarChart3
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

const menuItems = [
  { 
    title: "Bestellungen", 
    url: "/admin-backend", 
    icon: LayoutDashboard 
  },
  { 
    title: "Fotografen", 
    url: "/admin-backend/photographers", 
    icon: Camera 
  },
  { 
    title: "Zuverlässigkeitsbericht", 
    url: "/admin-backend/reliability", 
    icon: BarChart3 
  },
  { 
    title: "Standorte", 
    url: "/admin-backend/locations", 
    icon: MapPin 
  },
  { 
    title: "Benutzer", 
    url: "/admin-backend/users", 
    icon: Users 
  },
  { 
    title: "Sicherheit", 
    url: "/admin-backend/security", 
    icon: ShieldAlert 
  },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/admin-backend") {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-64"}
      collapsible="icon"
    >
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold text-sm">Admin Backend</span>
          </div>
        )}
        <SidebarTrigger className={collapsed ? "mx-auto" : ""} />
      </div>

      <SidebarContent>
        <SidebarGroup>
          {!collapsed && <SidebarGroupLabel>Navigation</SidebarGroupLabel>}

          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={isActive(item.url)}>
                    <NavLink 
                      to={item.url} 
                      end={item.url === "/admin-backend"}
                      className="hover:bg-muted/50"
                      activeClassName="bg-muted text-primary font-medium"
                    >
                      <item.icon className={collapsed ? "h-4 w-4" : "mr-2 h-4 w-4"} />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
