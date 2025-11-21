import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RoleSwitcher } from "@/components/RoleSwitcher";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === "/admin-backend") return "orders";
    if (location.pathname === "/admin-backend/photographers") return "photographers";
    if (location.pathname === "/admin-backend/locations") return "locations";
    if (location.pathname === "/admin-backend/users") return "users";
    return "orders";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <RoleSwitcher />
          </div>
          
          <Tabs value={getActiveTab()} className="w-full">
            <TabsList className="grid w-full max-w-4xl grid-cols-4">
              <TabsTrigger 
                value="orders"
                onClick={() => navigate("/admin-backend")}
              >
                Bestellungen
              </TabsTrigger>
              <TabsTrigger 
                value="photographers"
                onClick={() => navigate("/admin-backend/photographers")}
              >
                Fotografen
              </TabsTrigger>
              <TabsTrigger 
                value="locations"
                onClick={() => navigate("/admin-backend/locations")}
              >
                Standorte
              </TabsTrigger>
              <TabsTrigger 
                value="users"
                onClick={() => navigate("/admin-backend/users")}
              >
                Benutzer
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {children}
      </div>
    </Layout>
  );
};
