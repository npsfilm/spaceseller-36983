import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export const AugsburgTestimonials = () => {
  const testimonials = [
    {
      quote:
        "Arbeite seit 2 Jahren mit Immobilienfotografie Augsburg. Die Fotos sind immer top, Termine werden zuverlässig eingehalten. Meine Objekte verkaufen sich deutlich schneller!",
      author: "Julia Schmidt",
      role: "Immobilienmaklerin, Augsburg",
      rating: 5,
    },
    {
      quote:
        "Unsere Neubauprojekte werden dank der professionellen Fotos 40% schneller verkauft. Die Drohnenaufnahmen sind der Hammer und begeistern jeden Kunden!",
      author: "Thomas Weber",
      role: "Bauträger, Königsbrunn",
      rating: 5,
    },
    {
      quote:
        "Habe mein Haus selbst verkauft. Die Fotos haben den Unterschied gemacht – 15 Besichtigungsanfragen in der ersten Woche! Absolut empfehlenswert.",
      author: "Maria Hoffmann",
      role: "Privatverkäuferin, Augsburg-Göggingen",
      rating: 5,
    },
  ];

  return (
    <section className="py-20 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Was unsere Kunden aus Augsburg sagen
          </h2>
          <p className="text-lg text-muted-foreground">
            Echte Bewertungen von zufriedenen Kunden
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
