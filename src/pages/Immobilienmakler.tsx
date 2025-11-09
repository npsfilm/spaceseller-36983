import { Layout } from "@/components/Layout";
import { Hero } from "@/components/Hero";
import { Portfolio } from "@/components/Portfolio";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { FinalCTA } from "@/components/FinalCTA";

const Immobilienmakler = () => {
  return (
    <Layout>
      <div className="pt-32">
        <Hero />
        <Portfolio />
        <Process />
        <Pricing />
        <FAQ />
        <FinalCTA />
      </div>
    </Layout>
  );
};

export default Immobilienmakler;
