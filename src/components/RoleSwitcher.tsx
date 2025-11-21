import { useNavigate, useLocation } from "react-router-dom";
import { useUserRole } from "@/hooks/useUserRole";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Users, LayoutDashboard, Camera, ChevronDown } from "lucide-react";

export const RoleSwitcher = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role } = useUserRole();

  const getCurrentView = () => {
    if (location.pathname.startsWith("/admin-backend")) return "admin";
    if (location.pathname.startsWith("/freelancer-dashboard")) return "photographer";
    return "client";
  };

  const currentView = getCurrentView();

  const viewConfig = {
    admin: {
      label: "Admin-Ansicht",
      icon: Users,
      path: "/admin-backend",
    },
    photographer: {
      label: "Fotografen-Ansicht",
      icon: Camera,
      path: "/freelancer-dashboard",
    },
    client: {
      label: "Kunden-Ansicht",
      icon: LayoutDashboard,
      path: "/dashboard",
    },
  };

  const CurrentIcon = viewConfig[currentView].icon;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <CurrentIcon className="h-4 w-4" />
          {viewConfig[currentView].label}
          <ChevronDown className="h-4 w-4 opacity-50" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Ansicht wechseln</DropdownMenuLabel>
        <DropdownMenuSeparator />
        
        {currentView !== "client" && (
          <DropdownMenuItem onClick={() => navigate("/dashboard")}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            Kunden-Ansicht
          </DropdownMenuItem>
        )}
        
        {role === "admin" && currentView !== "admin" && (
          <DropdownMenuItem onClick={() => navigate("/admin-backend")}>
            <Users className="mr-2 h-4 w-4" />
            Admin-Ansicht
          </DropdownMenuItem>
        )}
        
        {(role === "photographer" || role === "admin") && currentView !== "photographer" && (
          <DropdownMenuItem onClick={() => navigate("/freelancer-dashboard")}>
            <Camera className="mr-2 h-4 w-4" />
            Fotografen-Ansicht
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
