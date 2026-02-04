import { Package, User, Upload } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingCard } from "@/components/shared";
import type { ChecklistItemData } from "@/components/shared";

export default function OnboardingChecklist() {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ['profile', user?.id],
    queryFn: async () => {
      if (!user) return null;
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      return data;
    },
    enabled: !!user
  });

  const { data: orders } = useQuery({
    queryKey: ['user-orders-count', user?.id],
    queryFn: async () => {
      if (!user) return [];
      const { data } = await supabase
        .from('orders')
        .select('id, status')
        .eq('user_id', user.id)
        .neq('status', 'draft');
      return data || [];
    },
    enabled: !!user
  });

  const hasCompletedProfile = profile && profile.vorname && profile.nachname && profile.telefon;
  const hasCreatedOrder = orders && orders.length > 0;

  const checklist: ChecklistItemData[] = [
    {
      id: "profile",
      label: "Profil vervollständigen",
      description: "Fügen Sie Ihre persönlichen Informationen hinzu",
      completed: !!hasCompletedProfile,
      icon: User,
      actionLabel: "Profil bearbeiten",
      actionLink: "/settings"
    },
    {
      id: "order",
      label: "Erste Bestellung erstellen",
      description: "Wählen Sie einen Service und erstellen Sie Ihre erste Bestellung",
      completed: !!hasCreatedOrder,
      icon: Package,
      actionLabel: "Bestellung erstellen",
      actionLink: "/order"
    },
    {
      id: "upload",
      label: "Dateien hochladen",
      description: "Laden Sie Ihre Fotos oder Pläne für die Bearbeitung hoch",
      completed: false,
      icon: Upload,
      actionLabel: "Dateien hochladen",
      actionLink: "/order"
    }
  ];

  return (
    <OnboardingCard
      title="Willkommen! Lassen Sie uns beginnen"
      description="Vervollständigen Sie diese Schritte, um das Beste aus Ihrem Konto herauszuholen"
      items={checklist}
      variant="client"
    />
  );
}
