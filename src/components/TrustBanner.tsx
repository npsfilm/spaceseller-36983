import { X } from "lucide-react";
import { useBannerContext } from "@/contexts/BannerContext";

export const TrustBanner = () => {
  const { isBannerVisible, dismissBanner } = useBannerContext();

  return (
    <div 
      className={`fixed top-0 left-0 right-0 bg-gradient-accent text-accent-foreground py-3 px-4 z-50 transition-all duration-300 ${
        isBannerVisible ? 'translate-y-0 opacity-100' : '-translate-y-full opacity-0'
      }`}
    >
      <div className="container mx-auto flex items-center justify-center gap-2 text-sm md:text-base font-medium">
        <span className="animate-pulse">🔥</span>
        <span className="text-center">
          <span className="hidden sm:inline">Neue Kunden-Aktion: </span>
          Erste Bestellung 20% Rabatt | Code: <span className="font-bold">NEUKUNDE20</span>
        </span>
        <button
          onClick={dismissBanner}
          className="absolute right-4 hover:opacity-70 transition-opacity"
          aria-label="Banner schließen"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
