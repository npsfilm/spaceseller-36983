import { ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface AdminLayoutProps {
  children: ReactNode;
}

export const AdminLayout = ({ children }: AdminLayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveTab = () => {
    if (location.pathname === "/admin-backend") return "orders";
    if (location.pathname === "/admin-backend/photographers") return "photographers";
    if (location.pathname === "/admin-backend/users") return "users";
    return "orders";
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
          
          <Tabs value={getActiveTab()} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-3">
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
