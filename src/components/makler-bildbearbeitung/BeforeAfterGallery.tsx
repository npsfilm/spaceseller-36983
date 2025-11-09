import { BeforeAfterSlider } from "@/components/BeforeAfterSlider";
import exteriorBefore from "@/assets/re-exterior-before.jpg";
import exteriorAfter from "@/assets/re-exterior-after.jpg";
import livingBefore from "@/assets/re-living-before.jpg";
import livingAfter from "@/assets/re-living-after.jpg";
import kitchenBefore from "@/assets/re-kitchen-before.jpg";
import kitchenAfter from "@/assets/re-kitchen-after.jpg";
import bedroomBefore from "@/assets/re-bedroom-before.jpg";
import bedroomAfter from "@/assets/re-bedroom-after.jpg";
import gardenBefore from "@/assets/re-garden-before.jpg";
import gardenAfter from "@/assets/re-garden-after.jpg";
import entranceBefore from "@/assets/re-entrance-before.jpg";
import entranceAfter from "@/assets/re-entrance-after.jpg";

export const BeforeAfterGallery = () => {
  const images = [
    {
      before: exteriorBefore,
      after: exteriorAfter,
      label: "Außenansicht",
      alt: "Exterior property transformation",
    },
    {
      before: livingBefore,
      after: livingAfter,
      label: "Wohnzimmer",
      alt: "Living room enhancement",
    },
    {
      before: kitchenBefore,
      after: kitchenAfter,
      label: "Küche",
      alt: "Kitchen image editing",
    },
    {
      before: bedroomBefore,
      after: bedroomAfter,
      label: "Schlafzimmer",
      alt: "Bedroom photo editing",
    },
    {
      before: gardenBefore,
      after: gardenAfter,
      label: "Garten",
      alt: "Garden photo enhancement",
    },
    {
      before: entranceBefore,
      after: entranceAfter,
      label: "Eingangsbereich",
      alt: "Entrance area editing",
    },
  ];

  return (
    <section id="gallery" className="py-16 md:py-24 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold">
            Sehen Sie den Unterschied
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Vorher-Nachher: So verwandeln wir durchschnittliche Fotos in Verkaufsmagneten
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div key={index} className="space-y-3">
              <BeforeAfterSlider
                beforeImage={image.before}
                afterImage={image.after}
                beforeAlt={`${image.label} vorher`}
                afterAlt={`${image.label} nachher`}
                className="h-[300px] md:h-[350px] rounded-lg shadow-card"
              />
              <p className="text-center text-sm font-medium text-muted-foreground">
                {image.label}
              </p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Bewegen Sie den Slider, um den Vorher-Nachher-Effekt zu sehen
          </p>
        </div>
      </div>
    </section>
  );
};
