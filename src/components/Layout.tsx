import { ReactNode, useEffect } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TrustBanner } from "@/components/TrustBanner";
import { useScrollBehavior } from "@/hooks/useScrollBehavior";
import { useBannerContext } from "@/contexts/BannerContext";

interface LayoutProps {
  children: ReactNode;
  className?: string;
}

export const Layout = ({ children, className = "min-h-screen" }: LayoutProps) => {
  const { scrollY, isScrollingUp, isScrolledPastHero } = useScrollBehavior();
  const { setScrollHidden, userDismissed } = useBannerContext();

  useEffect(() => {
    if (userDismissed) return;

    // Hide banner when scrolled past hero and scrolling down
    if (isScrolledPastHero && !isScrollingUp) {
      setScrollHidden(true);
    }
    
    // Show banner when scrolled back to top
    if (scrollY < 100) {
      setScrollHidden(false);
    }
  }, [scrollY, isScrollingUp, isScrolledPastHero, setScrollHidden, userDismissed]);

  return (
    <div className={className}>
      <TrustBanner />
      <Header />
      <main>
        {children}
      </main>
      <Footer />
    </div>
  );
};
