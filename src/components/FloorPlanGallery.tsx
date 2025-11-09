import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import floorPlanSketch from "@/assets/floor-plan-sketch.jpg";
import floorPlan2D from "@/assets/floor-plan-2d-professional.jpg";
import floorPlan3D from "@/assets/floor-plan-3d-isometric.jpg";
import floorPlanFurnished from "@/assets/floor-plan-furnished.jpg";

export const FloorPlanGallery = () => {
  const examples = [
    {
      before: floorPlanSketch,
      after: floorPlan2D,
      title: "Von Handskizze zu professionellem 2D-Grundriss",
      caption: "3-Zimmer Wohnung, 85m²",
    },
    {
      before: floorPlan2D,
      after: floorPlan3D,
      title: "Von 2D zu 3D-Visualisierung",
      caption: "Moderne Wohnung mit isometrischer Ansicht",
    },
    {
      before: floorPlan2D,
      after: floorPlanFurnished,
      title: "Von leerem Plan zu möbliertem Grundriss",
      caption: "Zeigt Raumnutzungsmöglichkeiten",
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Von Skizze zu Perfektion
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Sehen Sie, wie wir aus einfachen Skizzen professionelle Grundrisse erstellen
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {examples.map((example, index) => (
            <div key={index} className="space-y-4">
              <BeforeAfterSlider
                beforeImage={example.before}
                afterImage={example.after}
              />
              <div className="text-center">
                <h3 className="font-semibold mb-1">{example.title}</h3>
                <p className="text-sm text-muted-foreground">{example.caption}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
