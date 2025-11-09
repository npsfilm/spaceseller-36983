import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const RealEstatePhotographerTestimonials = () => {
  const testimonials = [
    {
      quote:
        "Seit ich spaceseller nutze, kann ich 3x mehr Shootings annehmen. Die Objektentfernung ist perfekt und meine Kunden merken nicht, dass ich die Bearbeitung outsource.",
      author: "Max Schmidt",
      role: "Immobilienfotograf München",
      rating: 5,
    },
    {
      quote:
        "White-Label ist ideal. Meine Makler-Kunden denken, ich bearbeite selbst. Die Rechnung mit MwSt. ist perfekt für meine Buchhaltung. Und die Qualität ist konstant hoch.",
      author: "Sarah Weber",
      role: "Architekturfotografie Berlin",
      rating: 5,
    },
    {
      quote:
        "200 Bilder pro Woche bei konstanter Qualität. Der Account Manager versteht Immobilienfotografie und reagiert sofort. Made in Germany macht den Unterschied.",
      author: "Thomas Müller",
      role: "Photography Studio Hamburg",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was Immobilienfotografen sagen
          </h2>
          <p className="text-lg text-muted-foreground">
            Echte Erfahrungen von echten Profis
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-accent text-accent"
                    />
                  ))}
                </div>
                <blockquote className="text-foreground mb-6 italic">
                  "{testimonial.quote}"
                </blockquote>
                <div className="border-t border-border pt-4">
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.role}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
