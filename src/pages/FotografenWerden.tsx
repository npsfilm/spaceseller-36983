import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { FotografenHero } from "@/components/fotografen-werden/FotografenHero";
import { WarumSpaceseller } from "@/components/fotografen-werden/WarumSpaceseller";
import { PartnerProcess } from "@/components/fotografen-werden/PartnerProcess";
import { BenefitsGrid } from "@/components/fotografen-werden/BenefitsGrid";
import { PartnerTestimonials } from "@/components/fotografen-werden/PartnerTestimonials";
import { InteractiveMap } from "@/components/fotografen-werden/InteractiveMap";
import { Requirements } from "@/components/fotografen-werden/Requirements";
import { FotografenCTA } from "@/components/fotografen-werden/FotografenCTA";

const FotografenWerden = () => {
  useEffect(() => {
    document.title = "Werde Partner-Fotograf bei spaceseller | Immobilienfotografie Netzwerk DACH";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 
        'Werde Teil des spaceseller Netzwerks! Erhalte regelmäßige Immobilienaufträge, wir übernehmen Bearbeitung & Kundenkontakt. Jetzt Partner-Fotograf werden und durchstarten!'
      );
    }
  }, []);

  return (
    <Layout>
      <div className="pt-32">
        <FotografenHero />
        <WarumSpaceseller />
        <PartnerProcess />
        <BenefitsGrid />
        <PartnerTestimonials />
        <InteractiveMap />
        <Requirements />
        <FotografenCTA />
      </div>
    </Layout>
  );
};

export default FotografenWerden;
