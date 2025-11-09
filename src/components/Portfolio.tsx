import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import beforeExterior from "@/assets/before-exterior.jpg";
import afterExterior from "@/assets/after-exterior.jpg";
import beforeInterior from "@/assets/before-interior.jpg";
import afterInterior from "@/assets/after-interior.jpg";
import vsBeforeLiving from "@/assets/vs-living-before.jpg";
import vsAfterLiving from "@/assets/vs-living-after.jpg";
import floorPlanSketch from "@/assets/floor-plan-sketch.jpg";
import floorPlanProfessional from "@/assets/floor-plan-2d-professional.jpg";

export const Portfolio = () => {
  const examples = [
    {
      before: beforeExterior,
      after: afterExterior,
      title: "Außenaufnahmen",
      description: "Perfekter Himmel, lebendige Farben, optimierte Perspektive",
    },
    {
      before: beforeInterior,
      after: afterInterior,
      title: "Innenräume",
      description: "Helle, einladende Atmosphäre mit natürlichem Look",
    },
    {
      before: vsBeforeLiving,
      after: vsAfterLiving,
      title: "Virtual Staging",
      description: "Leere Räume digital möbliert und emotional präsentiert",
    },
    {
      before: floorPlanSketch,
      after: floorPlanProfessional,
      title: "Grundrisse",
      description: "Von Skizze zum professionellen 2D/3D-Grundriss",
    },
  ];

  return (
    <section id="portfolio" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-foreground">
            Aus "ganz nett" wird <span className="bg-gradient-hero bg-clip-text text-transparent">"sofort besichtigen"</span>
          </h2>
          <p className="text-xl text-muted-foreground">
            Ganz gleich, ob von uns fotografiert oder von Ihnen: Das ist die Qualität, die wir liefern. Sehen Sie den Unterschied, den professionelle Präsentation macht.
          </p>
        </div>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {examples.map((example, index) => (
            <div
              key={index}
              className="group space-y-4 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="relative rounded-2xl overflow-hidden shadow-card hover:shadow-lg transition-shadow duration-300">
                <BeforeAfterSlider
                  beforeImage={example.before}
                  afterImage={example.after}
                  className="aspect-[4/3]"
                />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-semibold text-foreground">{example.title}</h3>
                <p className="text-muted-foreground">{example.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mt-20">
          {[
            { value: "10.000+", label: "Bearbeitete Bilder" },
            { value: "500+", label: "Zufriedene Makler" },
            { value: "24h", label: "Durchschnittliche Lieferzeit" },
            { value: "4.9/5", label: "Kundenbewertung" },
          ].map((stat, index) => (
            <div key={index} className="text-center space-y-2 animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <div className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                {stat.value}
              </div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
