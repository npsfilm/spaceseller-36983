import { Layout } from "@/components/Layout";
import { NationwideHero } from "@/components/nationwide-photography/NationwideHero";
import { WhySpaceseller } from "@/components/nationwide-photography/WhySpaceseller";
import { NationwideServices } from "@/components/nationwide-photography/NationwideServices";
import { NetworkSection } from "@/components/nationwide-photography/NetworkSection";
import { EditingForOwners } from "@/components/nationwide-photography/EditingForOwners";
import { NationwideProcess } from "@/components/nationwide-photography/NationwideProcess";
import { NationwideGallery } from "@/components/nationwide-photography/NationwideGallery";
import { NationwidePricing } from "@/components/nationwide-photography/NationwidePricing";
import { QualityTrust } from "@/components/nationwide-photography/QualityTrust";
import { NationwideFinalCTA } from "@/components/nationwide-photography/NationwideFinalCTA";
import { useEffect } from "react";

const Immobilienfotografie = () => {

  useEffect(() => {
    document.title = "Immobilienfotografie deutschlandweit | spaceseller";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Professionelle Immobilienfotografie deutschlandweit. Einheitliche Qualität, klare Preise und 48h Lieferung. Jetzt regionalen Fotografen anfragen oder Bilder hochladen."
      );
    }
  }, []);

  return (
    <Layout className="min-h-screen bg-background">
      <NationwideHero />
      <WhySpaceseller />
      <NationwideServices />
      <NetworkSection />
      <EditingForOwners />
      <NationwideProcess />
      <NationwideGallery />
      <NationwidePricing />
      <QualityTrust />
      <NationwideFinalCTA />
    </Layout>
  );
};

export default Immobilienfotografie;
