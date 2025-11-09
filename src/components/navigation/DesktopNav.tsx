import { useAuth } from "@/contexts/AuthContext";

export const DesktopNav = () => {
  const { user } = useAuth();

  // No public navigation needed for ordering platform
  return null;
};
