import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/useUserRole";

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const { role, loading: roleLoading } = useUserRole();

  useEffect(() => {
    if (!authLoading && !roleLoading) {
      if (user && role) {
        // Redirect based on user role
        if (role === 'admin') {
          navigate("/admin-backend");
        } else if (role === 'photographer') {
          navigate("/freelancer-dashboard");
        } else {
          navigate("/dashboard");
        }
      } else if (!user) {
        navigate("/auth");
      }
    }
  }, [user, role, authLoading, roleLoading, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );
};

export default Home;
