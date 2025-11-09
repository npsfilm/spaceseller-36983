import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { MaklerHero } from "@/components/makler-bildbearbeitung/MaklerHero";
import { PainPoints } from "@/components/makler-bildbearbeitung/PainPoints";
import { SolutionFeatures } from "@/components/makler-bildbearbeitung/SolutionFeatures";
import { ResultsStats } from "@/components/makler-bildbearbeitung/ResultsStats";
import { ProcessSteps } from "@/components/makler-bildbearbeitung/ProcessSteps";
import { PricingTable } from "@/components/makler-bildbearbeitung/PricingTable";
import { BeforeAfterGallery } from "@/components/makler-bildbearbeitung/BeforeAfterGallery";
import { FinalCTA } from "@/components/makler-bildbearbeitung/FinalCTA";

const AngebotImmobilienmakler = () => {
  useEffect(() => {
    // Set page title and meta description
    document.title = "Professionelle Bildbearbeitung für Immobilienmakler | spaceseller";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professionelle Immobilien-Bildbearbeitung ab 8 € pro Bild. 48 h Lieferung, Express möglich, 100 % DSGVO-konform. Jetzt 20 % Rabatt sichern und Ihre Exposés aufwerten."
      );
    }

    // Add structured data for SEO
    const structuredData = {
      "@context": "https://schema.org",
      "@type": "Service",
      "name": "Bildbearbeitung für Immobilienmakler",
      "description": "Professionelle Bildbearbeitung für Immobilienfotos mit 48h Lieferung",
      "provider": {
        "@type": "Organization",
        "name": "spaceseller"
      },
      "offers": {
        "@type": "Offer",
        "price": "8.00",
        "priceCurrency": "EUR",
        "availability": "https://schema.org/InStock"
      }
    };

    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = JSON.stringify(structuredData);
    document.head.appendChild(script);

    // Smooth scroll behavior
    document.documentElement.style.scrollBehavior = "smooth";

    return () => {
      document.head.removeChild(script);
      document.documentElement.style.scrollBehavior = "auto";
    };
  }, []);

  return (
    <Layout className="min-h-screen bg-background">
      <MaklerHero />
      <PainPoints />
      <SolutionFeatures />
      <BeforeAfterGallery />
      <ResultsStats />
      <ProcessSteps />
      <PricingTable />
      <FinalCTA />
    </Layout>
  );
};

export default AngebotImmobilienmakler;
