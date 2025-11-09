import { TestimonialCarousel } from "@/components/TestimonialCarousel";

export const PartnerTestimonials = () => {
  return (
    <section className="py-24 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-4">
            Das sagen Fotografen über die Zusammenarbeit mit spaceseller.
          </h2>
          <p className="text-xl text-muted-foreground">
            Authentische Erfahrungen von Partner-Fotografen aus unserem Netzwerk.
          </p>
        </div>

        <TestimonialCarousel />

        <div className="mt-12 text-center">
          <p className="text-sm text-muted-foreground italic">
            Alle Testimonials stammen von verifizierten spaceseller Partner-Fotografen.
          </p>
        </div>
      </div>
    </section>
  );
};
